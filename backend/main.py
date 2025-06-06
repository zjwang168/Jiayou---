from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
import motor.motor_asyncio
import cloudinary
import stripe
import boto3
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Jiayou API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.jiayou

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: str
    language: str = "zh"

class Caregiver(BaseModel):
    user_id: str
    profile: Dict
    status: str = "pending_verification"
    background_check: Optional[Dict] = None
    documents: List[Dict] = []
    ratings: List[Dict] = []
    average_rating: float = 0.0
    total_reviews: int = 0

class Family(BaseModel):
    user_id: str
    profile: Dict
    children: List[Dict]
    preferences: Dict
    active_jobs: List[Dict]
    matches: List[Dict]
    messages: List[Dict]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(email: str):
    user = await db.users.find_one({"email": email})
    if user:
        return User(**user)

async def authenticate_user(email: str, password: str):
    user = await get_user(email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await get_user(token_data.email)
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=User)
async def create_user(user: User):
    user.password = get_password_hash(user.password)
    result = await db.users.insert_one(user.dict())
    user.id = str(result.inserted_id)
    return user

@app.post("/caregivers/", response_model=Caregiver)
async def create_caregiver(caregiver: Caregiver, current_user: User = Depends(get_current_user)):
    if current_user.role != "caregiver":
        raise HTTPException(status_code=403, detail="Access denied")
    
    result = await db.caregivers.insert_one(caregiver.dict())
    caregiver.id = str(result.inserted_id)
    return caregiver

@app.post("/documents/upload/")
async def upload_document(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # Upload to Cloudinary
    result = cloudinary.uploader.upload(
        file.file,
        folder="jiayou/documents",
        resource_type="auto"
    )
    
    # Save document reference
    document = {
        "url": result["secure_url"],
        "type": file.filename.split(".")[-1],
        "uploaded_at": datetime.utcnow(),
        "status": "pending"
    }
    
    await db.documents.insert_one(document)
    return {"url": result["secure_url"]}

@app.get("/caregivers/search/")
async def search_caregivers(
    location: Optional[str] = None,
    language: Optional[str] = None,
    experience: Optional[int] = None,
    rate_max: Optional[float] = None,
    rate_min: Optional[float] = None,
    skip: int = 0,
    limit: int = 10
):
    query = {"status": "active"}
    
    if location:
        query["profile.location"] = {"$regex": location, "$options": "i"}
    if language:
        query["profile.languages.language"] = {"$regex": language, "$options": "i"}
    if experience:
        query["profile.experience"] = {"$gte": experience}
    if rate_max is not None or rate_min is not None:
        rate_query = {}
        if rate_max is not None:
            rate_query["$lte"] = rate_max
        if rate_min is not None:
            rate_query["$gte"] = rate_min
        query["profile.rates.hourly"] = rate_query
    
    caregivers = await db.caregivers.find(query).skip(skip).limit(limit).to_list(length=limit)
    return caregivers

@app.post("/background-check/start/")
async def start_background_check(current_user: User = Depends(get_current_user)):
    if current_user.role != "caregiver":
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Start verification process
    # This would typically trigger an AWS Lambda function
    # or use a background check service provider
    
    return {"status": "processing"}

@app.post("/payments/process/")
async def process_payment(
    amount: float,
    token: str,
    current_user: User = Depends(get_current_user)
):
    try:
        charge = stripe.Charge.create(
            amount=int(amount * 100),  # Convert to cents
            currency="usd",
            source=token,
            description="Jiayou Payment"
        )
        return {"status": "success", "charge_id": charge.id}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
