require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fiap-blog',
  },
  apiVersion: process.env.API_VERSION || 'v1',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  },
};
