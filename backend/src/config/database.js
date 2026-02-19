const mongoose = require('mongoose');
const config = require('./environment');
const logger = require('../utils/logger');

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('MongoDB conectado com sucesso!');
    logger.info(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    logger.error('Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  }
};

// Event listeners para conexão
mongoose.connection.on('connected', () => {
  logger.info('Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Erro na conexão do Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose desconectado do MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Conexão do Mongoose fechada devido ao término da aplicação');
  process.exit(0);
});

module.exports = connectDatabase;
