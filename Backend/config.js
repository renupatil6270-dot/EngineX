const dotenv = require('dotenv');

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

module.exports = {
  port: Number(process.env.PORT || 5000),
  mongoUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1/roadmap/generate',
  aiServiceTimeoutMs: Number(process.env.AI_SERVICE_TIMEOUT_MS || 10000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
};
