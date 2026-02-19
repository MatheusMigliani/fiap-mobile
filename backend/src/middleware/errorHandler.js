const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  logger.error('Error:', err.message);
  logger.error('Stack:', err.stack);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors,
    });
  }

  // Mongoose cast error (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
    });
  }

  // Erro de duplicidade (chave única)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Registro duplicado',
    });
  }

  // Erro genérico
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
  });
};

module.exports = errorHandler;
