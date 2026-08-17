const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  portalType: {
    type: String,
    enum: ['dreamer', 'pursuer'],
    required: true
  },
  answers: {
    interestedDomain: { type: String, required: true },
    specialization: { type: String },
    targetRoles: [{ type: String }],
    desiredSkills: [{ type: String }],
    acquiredSkills: [{ type: String }],
    primaryGoal: { type: String },
    timelineMonths: { type: Number }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);