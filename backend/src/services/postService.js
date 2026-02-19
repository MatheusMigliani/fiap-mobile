const Post = require('../models/Post');
const logger = require('../utils/logger');

class PostService {
  // Listar todos os posts com paginação
  async getAllPosts({ page = 1, limit = 10 } = {}) {
    try {
      const skip = (page - 1) * limit;
      const [posts, total] = await Promise.all([
        Post.find().notDeleted().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Post.countDocuments({ deletedAt: null }),
      ]);

      return {
        posts,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Erro ao buscar posts:', error);
      throw error;
    }
  }

  // Buscar post por ID
  async getPostById(id) {
    try {
      const post = await Post.findOne({ _id: id, deletedAt: null });

      if (!post) {
        const error = new Error('Post não encontrado');
        error.statusCode = 404;
        throw error;
      }

      return post;
    } catch (error) {
      logger.error(`Erro ao buscar post ${id}:`, error);
      throw error;
    }
  }

  // Criar novo post
  async createPost(postData) {
    try {
      const post = new Post(postData);
      await post.save();
      logger.success(`Post criado: ${post.title}`);
      return post;
    } catch (error) {
      logger.error('Erro ao criar post:', error);
      throw error;
    }
  }

  // Atualizar post
  async updatePost(id, postData) {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: id, deletedAt: null },
        postData,
        { new: true, runValidators: true }
      );

      if (!post) {
        const error = new Error('Post não encontrado');
        error.statusCode = 404;
        throw error;
      }

      logger.success(`Post atualizado: ${post.title}`);
      return post;
    } catch (error) {
      logger.error(`Erro ao atualizar post ${id}:`, error);
      throw error;
    }
  }

  // Deletar post (soft delete)
  async deletePost(id) {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true }
      );

      if (!post) {
        const error = new Error('Post não encontrado');
        error.statusCode = 404;
        throw error;
      }

      logger.success(`Post deletado: ${post.title}`);
      return post;
    } catch (error) {
      logger.error(`Erro ao deletar post ${id}:`, error);
      throw error;
    }
  }

  // Buscar posts por palavra-chave
  async searchPosts(keyword) {
    try {
      if (!keyword || keyword.trim() === '') {
        const error = new Error('Palavra-chave não fornecida');
        error.statusCode = 400;
        throw error;
      }

      const posts = await Post.searchByKeyword(keyword);
      return posts;
    } catch (error) {
      logger.error('Erro ao buscar posts:', error);
      throw error;
    }
  }
}

module.exports = new PostService();
