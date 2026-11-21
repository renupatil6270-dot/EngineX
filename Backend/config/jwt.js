require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'development_secret_change_me',
};
