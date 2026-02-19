const userService = require('../services/userService');

class UserController {
  listByRole(role) {
    return async (req, res, next) => {
      try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const result = await userService.getUsersByRole(role, {
          page: Number(page),
          limit: Number(limit),
          search,
        });

        res.status(200).json({
          success: true,
          data: result.users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          })),
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        });
      } catch (error) {
        next(error);
      }
    };
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  create(role) {
    return async (req, res, next) => {
      try {
        const { name, email, password } = req.body;
        const user = await userService.createUser({ name, email, password, role });

        res.status(201).json({
          success: true,
          message: 'Usuário criado com sucesso',
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        });
      } catch (error) {
        next(error);
      }
    };
  }

  async update(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      const user = await userService.updateUser(req.params.id, updateData);

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Usuário excluído com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
