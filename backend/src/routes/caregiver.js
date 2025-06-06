const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const caregiverController = require('../controllers/caregiverController');

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 5000000, // 5MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file'));
    }
    cb(undefined, true);
  },
});

// Caregiver profile routes
router.post('/profile', auth, caregiverController.createProfile);
router.get('/profile', auth, caregiverController.getProfile);
router.patch('/profile', auth, upload.single('profilePicture'), caregiverController.updateProfile);

// Public caregiver routes
router.get('/:id', caregiverController.getCaregiverById);
router.get('/search', caregiverController.searchCaregivers);
router.get('/:id/reviews', caregiverController.getCaregiverReviews);

// Review routes
router.post('/:id/reviews', auth, caregiverController.addReview);

module.exports = router;
