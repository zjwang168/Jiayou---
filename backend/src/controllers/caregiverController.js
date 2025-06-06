const Caregiver = require('../models/Caregiver');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create caregiver profile
exports.createProfile = async (req, res) => {
  try {
    const { user } = req;
    const { profile } = req.body;

    // Check if user already has a profile
    const existingProfile = await Caregiver.findOne({ user: user._id });
    if (existingProfile) {
      return res.status(400).send({ error: 'Profile already exists' });
    }

    // Create new profile
    const caregiver = new Caregiver({
      user: user._id,
      profile,
      status: 'pending_verification',
    });

    await caregiver.save();
    res.status(201).send(caregiver);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update caregiver profile
exports.updateProfile = async (req, res) => {
  try {
    const { user } = req;
    const updates = req.body;

    const caregiver = await Caregiver.findOne({ user: user._id });
    if (!caregiver) {
      return res.status(404).send({ error: 'Profile not found' });
    }

    // Handle profile picture upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'jiayou/profiles',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      });
      caregiver.profile.profilePicture = result.secure_url;
    }

    // Update other profile fields
    Object.assign(caregiver.profile, updates);

    await caregiver.save();
    res.send(caregiver);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get caregiver profile
exports.getProfile = async (req, res) => {
  try {
    const { user } = req;
    const caregiver = await Caregiver.findOne({ user: user._id });
    if (!caregiver) {
      return res.status(404).send({ error: 'Profile not found' });
    }
    res.send(caregiver);
  } catch (error) {
    res.status(500).send();
  }
};

// Get caregiver by ID
exports.getCaregiverById = async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('reviews.family', 'firstName lastName');
    
    if (!caregiver) {
      return res.status(404).send();
    }
    
    res.send(caregiver);
  } catch (error) {
    res.status(500).send();
  }
};

// Search caregivers
exports.searchCaregivers = async (req, res) => {
  try {
    const {
      location,
      language,
      experience,
      certification,
      rateMax,
      rateMin,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: 'active',
    };

    // Add filters
    if (location) {
      query['profile.location'] = new RegExp(location, 'i');
    }
    if (language) {
      query['profile.languages.language'] = new RegExp(language, 'i');
    }
    if (experience) {
      query['profile.experience.length'] = { $gte: parseInt(experience) };
    }
    if (certification) {
      query['profile.certifications.name'] = new RegExp(certification, 'i');
    }
    if (rateMax || rateMin) {
      const rateQuery = {};
      if (rateMax) rateQuery.$lte = parseFloat(rateMax);
      if (rateMin) rateQuery.$gte = parseFloat(rateMin);
      query['profile.rates.hourly'] = rateQuery;
    }

    const caregivers = await Caregiver.find(query)
      .populate('user', 'firstName lastName email')
      .populate('reviews.family', 'firstName lastName')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Caregiver.countDocuments(query);
    
    res.send({
      caregivers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send();
  }
};

// Get caregiver reviews
exports.getCaregiverReviews = async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id)
      .populate('reviews.family', 'firstName lastName');
    
    if (!caregiver) {
      return res.status(404).send();
    }
    
    res.send(caregiver.reviews);
  } catch (error) {
    res.status(500).send();
  }
};

// Add review for caregiver
exports.addReview = async (req, res) => {
  try {
    const { user } = req;
    const { rating, comment } = req.body;

    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).send();
    }

    // Check if user has already reviewed
    const existingReview = caregiver.reviews.find(
      review => review.family.toString() === user._id.toString()
    );
    if (existingReview) {
      return res.status(400).send({ error: 'Already reviewed' });
    }

    // Add new review
    caregiver.reviews.push({
      family: user._id,
      rating,
      comment,
    });

    // Update average rating
    const total = caregiver.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    caregiver.rating.average = total / caregiver.reviews.length;
    caregiver.rating.totalReviews = caregiver.reviews.length;

    await caregiver.save();
    res.send(caregiver.reviews);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
