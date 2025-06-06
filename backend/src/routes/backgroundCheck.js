const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const backgroundCheckController = require('../controllers/backgroundCheckController');

// Caregiver routes
router.get('/status', auth, backgroundCheckController.getStatus);
router.post('/start', auth, backgroundCheckController.startCheck);
router.post('/upload', auth, upload.single('document'), backgroundCheckController.uploadDocument);

// Admin routes
router.get('/pending', auth, backgroundCheckController.getPendingChecks);
router.get('/stats', auth, backgroundCheckController.getStatistics);

module.exports = router;
