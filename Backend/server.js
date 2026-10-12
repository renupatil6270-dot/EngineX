const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const roadmapRoutes = require('./routes/roadmap');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  await mongoose.connect(config.mongoUri);
  app.listen(config.port, () => console.log(`Backend server running on port ${config.port}`));
};

if (require.main === module) {
  start().catch((err) => {
    console.error('Backend startup failed:', err.message);
    process.exit(1);
  });
}

module.exports = { app, start };
