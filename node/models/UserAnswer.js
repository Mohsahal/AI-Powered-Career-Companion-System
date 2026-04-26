const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  mockIdRef: {
    type: String,
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  correct_ans: {
    type: String,
    required: true,
    trim: true
  },
  user_ans: {
    type: String,
    required: true,
    trim: true
  },
  feedback: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  confidence: {
    type: Number,
    required: false,
    min: 0,
    max: 100,
    default: 0
  },
  areas: [{
    type: String,
    trim: true
  }],
  answerLength: {
    type: Number,
    required: false,
    min: 0
  },
  relevanceScore: {
    type: Number,
    required: false,
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
userAnswerSchema.index({ userId: 1, mockIdRef: 1 });

// Pre-save middleware to ensure data consistency
userAnswerSchema.pre('save', function(next) {
  // Ensure all string fields are trimmed
  if (this.question) this.question = this.question.trim();
  if (this.correct_ans) this.correct_ans = this.correct_ans.trim();
  if (this.user_ans) this.user_ans = this.user_ans.trim();
  if (this.feedback) this.feedback = this.feedback.trim();
  
  // Ensure rating is an integer
  if (this.rating) this.rating = Math.round(this.rating);
  
  // Set default values
  if (!this.answerLength) this.answerLength = this.user_ans ? this.user_ans.length : 0;
  if (!this.timestamp) this.timestamp = new Date();
  
  next();
});

module.exports = mongoose.model('UserAnswer', userAnswerSchema);
