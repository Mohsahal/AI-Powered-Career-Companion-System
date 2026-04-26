const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    techStack: { type: String, required: true },
    questions: { type: [interviewQuestionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);


