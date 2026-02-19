const express = require('express');
const cors = require('cors');
const config = require('./config/environment');
const connectDatabase = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const createUserRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { runSeeds } = require('./config/seed');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando!',
    timestamp: new Date().toISOString(),
  });
});

// Rota raiz
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bem-vindo à API de Blogging Educacional - FIAP',
    version: config.apiVersion,
    endpoints: {
      posts: '/api/posts',
      auth: '/api/auth',
      professors: '/api/professors',
      students: '/api/students',
      health: '/health',
    },
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/professors', createUserRoutes('professor'));
app.use('/api/students', createUserRoutes('student'));

// Rota 404
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

// Inicializar servidor
const startServer = async () => {
  try {
    await connectDatabase();
    await runSeeds();

    app.listen(config.port, () => {
      logger.success(`Servidor rodando na porta ${config.port}`);
      logger.info(`Ambiente: ${config.nodeEnv}`);
      logger.info(`Acesse: http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
