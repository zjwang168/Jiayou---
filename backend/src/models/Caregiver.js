const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profile: {
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    languages: [{
      language: {
        type: String,
        required: true,
      },
      proficiency: {
        type: String,
        enum: ['native', 'fluent', 'conversational', 'basic'],
        required: true,
      },
    }],
    education: [{
      institution: String,
      degree: String,
      fieldOfStudy: String,
      graduationYear: Number,
    }],
    certifications: [{
      name: String,
      issuingOrganization: String,
      dateIssued: Date,
      expirationDate: Date,
    }],
    experience: [{
      position: String,
      employer: String,
      startDate: Date,
      endDate: Date,
      description: String,
    }],
    skills: [{
      name: String,
      proficiency: String,
    }],
    availability: {
      days: [String],
      hours: {
        start: String,
        end: String,
      },
    },
    rates: {
      hourly: Number,
      daily: Number,
      weekly: Number,
    },
    backgroundCheck: {
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      dateCompleted: Date,
      reportUrl: String,
    },
    references: [{
      name: String,
      relationship: String,
      contactNumber: String,
      email: String,
    }],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'pending_verification',
  },
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  reviews: [{
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
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

const Caregiver = mongoose.model('Caregiver', caregiverSchema);
module.exports = Caregiver;
