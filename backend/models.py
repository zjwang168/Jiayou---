from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String)  # 'caregiver' or 'family'
    language = Column(String, default="zh")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    caregiver = relationship("Caregiver", back_populates="user", uselist=False)
    family = relationship("Family", back_populates="user", uselist=False)

class Caregiver(Base):
    __tablename__ = "caregivers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    profile = Column(JSON)  # Store profile data as JSON
    status = Column(String, default="pending_verification")
    background_check = Column(JSON, nullable=True)
    documents = Column(JSON, default=[])  # List of document references
    ratings = Column(JSON, default=[])  # List of ratings
    average_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="caregiver")
    reviews = relationship("Review", back_populates="caregiver")

class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    profile = Column(JSON)  # Store profile data as JSON
    children = Column(JSON, default=[])  # List of children info
    preferences = Column(JSON)  # Family preferences
    active_jobs = Column(JSON, default=[])  # List of active jobs
    matches = Column(JSON, default=[])  # List of matches
    messages = Column(JSON, default=[])  # List of message threads
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="family")
    jobs = relationship("Job", back_populates="family")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, ForeignKey("families.id"))
    title = Column(String)
    description = Column(String)
    requirements = Column(JSON)
    schedule = Column(JSON)
    budget = Column(JSON)
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    family = relationship("Family", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    caregiver_id = Column(Integer, ForeignKey("caregivers.id"))
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="applications")
    caregiver = relationship("Caregiver", back_populates="applications")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("caregivers.id"))
    family_id = Column(Integer, ForeignKey("families.id"))
    rating = Column(Integer)
    comment = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    caregiver = relationship("Caregiver", back_populates="reviews")
    family = relationship("Family", back_populates="reviews")
