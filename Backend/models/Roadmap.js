const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  portalType: {
    type: String,
    enum: ['dreamer', 'achiever', 'innovator'],
    required: true,
  },
  aiResponse: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  progress: {
    completedTopics: {
      type: [{
        topicId: {
          type: String,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      }],
      default: [],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Roadmap', roadmapSchema);