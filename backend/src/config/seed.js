const User = require('../models/User');
const logger = require('../utils/logger');

const defaultUsers = [
  {
    name: 'Professor FIAP',
    email: 'professor@fiap.com.br',
    password: 'fiap2024',
    role: 'professor',
  },
  {
    name: 'Admin FIAP',
    email: 'admin@fiap.com.br',
    password: 'fiap2024',
    role: 'admin',
  },
  {
    name: 'Aluno FIAP',
    email: 'aluno@fiap.com.br',
    password: 'fiap2024',
    role: 'student',
  },
];

const runSeeds = async () => {
  try {
    for (const userData of defaultUsers) {
      const userExists = await User.findOne({ email: userData.email });
      if (!userExists) {
        await User.create(userData);
        logger.info(`Usuário seed criado: ${userData.email} (${userData.role})`);
      } else {
        logger.info(`Usuário seed já existe: ${userData.email}`);
      }
    }
  } catch (error) {
    logger.error('Erro ao executar seeds:', error);
    process.exit(1);
  }
};

module.exports = { runSeeds };
