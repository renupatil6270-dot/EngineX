require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const roadmapRoutes = require('./routes/roadmap');

function validateConfig() {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'AI_SERVICE_URL'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json({ limit: '1mb' }));
  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'enginex-backend' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/quiz', quizRoutes);
  app.use('/api/roadmap', roadmapRoutes);
  app.use((error, req, res, next) => {
    console.error('Unhandled server error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  });
  return app;
}

async function startServer() {
  validateConfig();
  await mongoose.connect(process.env.MONGODB_URI);
  const app = createApp();
  const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server running on port ${process.env.PORT || 5000}`);
  });
  const shutdown = async () => {
    await mongoose.disconnect();
    server.close(() => process.exit(0));
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Backend startup failed:', error.message);
    process.exit(1);
  });
}

module.exports = { createApp, startServer, validateConfig };
