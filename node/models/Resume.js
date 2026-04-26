const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  template: {
    type: String,
    required: true
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    jobTitle: String,
    email: String,
    phone: String,
    location: String
  },
  summary: String,
  skills: [String],
  experience: [{
    position: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    date: String,
    description: String
  }],
  projects: [{
    name: String,
    description: String,
    date: String,
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema); 