const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profile: {
    familyName: {
      type: String,
      required: true,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    children: [{
      name: String,
      dateOfBirth: Date,
      specialNeeds: Boolean,
      allergies: [String],
      preferences: String,
    }],
    preferences: {
      language: [{
        language: String,
        proficiency: String,
      }],
      experience: {
        minYears: Number,
        specificSkills: [String],
      },
      schedule: {
        days: [String],
        hours: {
          start: String,
          end: String,
        },
      },
      budget: {
        hourly: Number,
        daily: Number,
        weekly: Number,
      },
    },
  },
  activeJobs: [{
    title: String,
    description: String,
    requirements: [String],
    schedule: {
      days: [String],
      hours: {
        start: String,
        end: String,
      },
    },
    budget: {
      type: String,
      amount: Number,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  matches: [{
    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caregiver',
    },
    score: Number,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'matched'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  messages: [{
    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caregiver',
    },
    messages: [{
      sender: {
        type: String,
        enum: ['family', 'caregiver'],
        required: true,
      },
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    lastMessage: {
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

const Family = mongoose.model('Family', familySchema);
module.exports = Family;
