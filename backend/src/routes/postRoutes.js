const express = require('express');
const { body, query } = require('express-validator');
const postController = require('../controllers/postController');
const validateRequest = require('../middleware/validator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validações para criação de post
const createPostValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('O título é obrigatório')
    .isLength({ max: 200 })
    .withMessage('O título não pode ter mais de 200 caracteres'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('O conteúdo é obrigatório'),
];

// Validações para atualização de post (campos opcionais)
const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('O título não pode estar vazio')
    .isLength({ max: 200 })
    .withMessage('O título não pode ter mais de 200 caracteres'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('O conteúdo não pode estar vazio'),
];

// Validação para busca
const searchValidation = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('O parâmetro de busca (q) é obrigatório')
    .isLength({ min: 2 })
    .withMessage('O termo de busca deve ter pelo menos 2 caracteres'),
];

// Rotas
// IMPORTANTE: A rota /search deve vir ANTES de /:id para evitar conflito

// GET /posts/search
router.get('/search', searchValidation, validateRequest, (req, res, next) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.description = 'Busca posts por palavra-chave no título, conteúdo ou autor'
    #swagger.parameters['q'] = {
      in: 'query',
      description: 'Termo de busca (mínimo 2 caracteres)',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Posts encontrados',
      schema: { $ref: '#/definitions/PostList' }
    }
    #swagger.responses[400] = {
      description: 'Parâmetro de busca inválido',
      schema: { $ref: '#/definitions/ValidationError' }
    }
  */
  postController.searchPosts(req, res, next);
});

// GET /posts
router.get('/', (req, res, next) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.description = 'Lista todos os posts educacionais ordenados por data de criação (mais recentes primeiro)'
    #swagger.responses[200] = {
      description: 'Lista de posts',
      schema: { $ref: '#/definitions/PostList' }
    }
  */
  postController.getAllPosts(req, res, next);
});

// GET /posts/:id
router.get('/:id', (req, res, next) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.description = 'Obtém um post específico pelo ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do post',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Post encontrado',
      schema: { $ref: '#/definitions/PostResponse' }
    }
    #swagger.responses[404] = {
      description: 'Post não encontrado',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  postController.getPostById(req, res, next);
});

// POST /posts
router.post('/', protect, createPostValidation, validateRequest, (req, res, next) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.description = 'Cria um novo post educacional (requer autenticação)'
    #swagger.security = [{
      bearerAuth: []
    }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do post',
      required: true,
      schema: { $ref: '#/definitions/Post' }
    }
    #swagger.responses[201] = {
      description: 'Post criado com sucesso',
      schema: { $ref: '#/definitions/PostResponse' }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos',
      schema: { $ref: '#/definitions/ValidationError' }
    }
    #swagger.responses[401] = {
      description: 'Não autenticado',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  postController.createPost(req, res, next);
});

// PUT /posts/:id
router.put('/:id', protect, updatePostValidation, validateRequest, (req, res, next) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.description = 'Atualiza um post existente (requer autenticação)'
    #swagger.security = [{
      bearerAuth: []
    }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do post',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados para atualização (todos os campos são opcionais)',
      required: true,
      schema: { $ref: '#/definitions/Post' }
    }
    #swagger.responses[200] = {
      description: 'Post atualizado com sucesso',
      schema: { $ref: '#/definitions/PostResponse' }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos',
      schema: { $ref: '#/definitions/ValidationError' }
    }
    #swagger.responses[401] = {
      description: 'Não autenticado',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: 'Post não encontrado',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  postController.updatePost(req, res, next);
});

// DELETE /posts/:id
router.delete('/:id', protect, (req, res, next) => {
  /*
    #swagger.tags = ['Posts']
    #swagger.description = 'Remove um post pelo ID (requer autenticação)'
    #swagger.security = [{
      bearerAuth: []
    }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do post a ser removido',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Post removido com sucesso',
      schema: {
        success: true,
        message: 'Post removido com sucesso'
      }
    }
    #swagger.responses[401] = {
      description: 'Não autenticado',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: 'Post não encontrado',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  postController.deletePost(req, res, next);
});

module.exports = router;
