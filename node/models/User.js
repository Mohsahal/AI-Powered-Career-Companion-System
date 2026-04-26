const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not a Google user
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  profileImage: {
    type: String,
    default: null
  },
  // Profile fields
  title: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  },
  socials: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" }
  },
  bio: {
    type: String,
    default: ""
  },
  education: {
    type: String,
    default: ""
  },
  skills: {
    type: [String],
    default: []
  },
  experience: {
    type: String,
    default: ""
  },
  languages: {
    type: [String],
    default: []
  },
  certifications: {
    type: [String],
    default: []
  },
  careerGoals: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 