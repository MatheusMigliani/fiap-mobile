const User = require('../models/User');
const logger = require('../utils/logger');

class UserService {
  async getUsersByRole(role, { page = 1, limit = 10, search = '' } = {}) {
    try {
      const query = { role };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(query),
      ]);

      return {
        users,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`Erro ao buscar usuários (${role}):`, error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id);

      if (!user) {
        const error = new Error('Usuário não encontrado');
        error.statusCode = 404;
        throw error;
      }

      return user;
    } catch (error) {
      logger.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  }

  async createUser(data) {
    try {
      const user = new User(data);
      await user.save();
      logger.success(`Usuário criado: ${user.name} (${user.role})`);
      return user;
    } catch (error) {
      logger.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async updateUser(id, data) {
    try {
      if (data.password) {
        const user = await User.findById(id).select('+password');
        if (!user) {
          const error = new Error('Usuário não encontrado');
          error.statusCode = 404;
          throw error;
        }
        Object.assign(user, data);
        await user.save();
        logger.success(`Usuário atualizado: ${user.name}`);
        return user;
      }

      const user = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        const error = new Error('Usuário não encontrado');
        error.statusCode = 404;
        throw error;
      }

      logger.success(`Usuário atualizado: ${user.name}`);
      return user;
    } catch (error) {
      logger.error(`Erro ao atualizar usuário ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        const error = new Error('Usuário não encontrado');
        error.statusCode = 404;
        throw error;
      }

      logger.success(`Usuário deletado: ${user.name}`);
      return user;
    } catch (error) {
      logger.error(`Erro ao deletar usuário ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new UserService();
