const mongoose = require('mongoose');

const backgroundCheckSchema = new mongoose.Schema({
  caregiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  results: {
    criminalHistory: {
      hasRecord: Boolean,
      details: String,
    },
    employmentVerification: {
      verified: Boolean,
      details: String,
    },
    educationVerification: {
      verified: Boolean,
      details: String,
    },
    referenceCheck: {
      verified: Boolean,
      details: String,
    },
    identityVerification: {
      verified: Boolean,
      details: String,
    },
    healthClearance: {
      verified: Boolean,
      details: String,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  documents: [{
    type: String,
    documentType: {
      type: String,
      enum: ['id', 'degree', 'certification', 'reference', 'health'],
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationDate: Date,
  }],
  lastChecked: {
    type: Date,
    default: Date.now,
  },
  nextCheckDue: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Middleware to update next check due date
backgroundCheckSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    // Set next check due date to 1 year from completion
    this.nextCheckDue = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  }
  next();
});

const BackgroundCheck = mongoose.model('BackgroundCheck', backgroundCheckSchema);
module.exports = BackgroundCheck;
