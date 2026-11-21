// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const aiRoutes = require('./routes/ai');
const roadmapRoutes = require('./routes/roadmap');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const configuredOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
    const allowedOrigins = new Set([
      configuredOrigin,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ]);
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
  },
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/roadmaps', roadmapRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/enginex';

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is undefined. Roadmap generation will be unavailable.');
}

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exitCode = 1;
  }
}

startServer();
