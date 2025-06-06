const BackgroundCheck = require('../models/BackgroundCheck');
const Caregiver = require('../models/Caregiver');
const backgroundCheckService = require('../services/backgroundCheckService');
const multer = require('multer');

// Configure multer for document uploads
const upload = multer({
  limits: {
    fileSize: 5000000, // 5MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload a valid document file'));
    }
    cb(undefined, true);
  },
});

// Get caregiver's background check status
exports.getStatus = async (req, res) => {
  try {
    const { user } = req;
    const caregiver = await Caregiver.findOne({ user: user._id });
    if (!caregiver) {
      return res.status(404).send({ error: 'Caregiver not found' });
    }

    const backgroundCheck = await BackgroundCheck.findOne({
      caregiver: caregiver._id,
    }).populate('caregiver', 'profile.firstName profile.lastName');

    if (!backgroundCheck) {
      return res.status(404).send({ error: 'Background check not found' });
    }

    res.send(backgroundCheck);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Start background check process
exports.startCheck = async (req, res) => {
  try {
    const { user } = req;
    const caregiver = await Caregiver.findOne({ user: user._id });
    if (!caregiver) {
      return res.status(404).send({ error: 'Caregiver not found' });
    }

    const backgroundCheck = await backgroundCheckService.processBackgroundCheck(caregiver._id);
    res.send(backgroundCheck);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Upload verification document
exports.uploadDocument = async (req, res) => {
  try {
    const { user } = req;
    const { documentType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    const caregiver = await Caregiver.findOne({ user: user._id });
    if (!caregiver) {
      return res.status(404).send({ error: 'Caregiver not found' });
    }

    const backgroundCheck = await backgroundCheckService.verifyDocument(
      caregiver._id,
      documentType,
      file
    );

    res.send(backgroundCheck);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all caregivers with pending background checks
exports.getPendingChecks = async (req, res) => {
  try {
    const backgroundChecks = await BackgroundCheck.find({
      status: 'pending',
    })
      .populate('caregiver', 'profile.firstName profile.lastName')
      .sort({ createdAt: -1 });

    res.send(backgroundChecks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get background check statistics
exports.getStatistics = async (req, res) => {
  try {
    const [total, completed, failed] = await Promise.all([
      BackgroundCheck.countDocuments(),
      BackgroundCheck.countDocuments({ status: 'completed' }),
      BackgroundCheck.countDocuments({ status: 'failed' }),
    ]);

    res.send({
      total,
      completed,
      failed,
      pending: total - completed - failed,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
