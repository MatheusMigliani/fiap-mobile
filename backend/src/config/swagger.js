const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FIAP Blog API',
      version: '1.0.0',
      description: 'API REST de Blogging Educacional - FIAP Tech Challenge',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Post: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string', maxLength: 200, example: 'Introdução ao Node.js' },
            content: { type: 'string', example: 'Node.js é um runtime JavaScript...' },
          },
        },
        PostResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                post: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string', example: '64abc123def456' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    author: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Prof. João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@fiap.com' },
            password: { type: 'string', minLength: 6, example: '123456' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@fiap.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['admin', 'professor', 'student'] },
                  },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mensagem de erro' },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Verifica status da API',
          responses: {
            200: { description: 'API funcionando', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, timestamp: { type: 'string' } } } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Autenticar usuário',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
          responses: {
            200: { description: 'Login realizado com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registrar novo usuário (uso em testes)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/User' },
                    { type: 'object', properties: { role: { type: 'string', enum: ['admin', 'professor', 'student'], example: 'professor' } } },
                  ],
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/posts': {
        get: {
          tags: ['Posts'],
          summary: 'Listar todos os posts',
          responses: {
            200: { description: 'Lista de posts retornada com sucesso' },
          },
        },
        post: {
          tags: ['Posts'],
          summary: 'Criar novo post (requer autenticação)',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
          responses: {
            201: { description: 'Post criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/PostResponse' } } } },
            400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Não autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/posts/search': {
        get: {
          tags: ['Posts'],
          summary: 'Buscar posts por palavra-chave',
          parameters: [{ in: 'query', name: 'q', required: true, schema: { type: 'string', minLength: 2 }, description: 'Termo de busca (mínimo 2 caracteres)' }],
          responses: {
            200: { description: 'Posts encontrados' },
            400: { description: 'Parâmetro inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/posts/{id}': {
        get: {
          tags: ['Posts'],
          summary: 'Obter post por ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID do post' }],
          responses: {
            200: { description: 'Post encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/PostResponse' } } } },
            404: { description: 'Post não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        put: {
          tags: ['Posts'],
          summary: 'Atualizar post (requer autenticação)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
          responses: {
            200: { description: 'Post atualizado' },
            401: { description: 'Não autenticado' },
            404: { description: 'Post não encontrado' },
          },
        },
        delete: {
          tags: ['Posts'],
          summary: 'Remover post (requer autenticação)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Post removido' },
            401: { description: 'Não autenticado' },
            404: { description: 'Post não encontrado' },
          },
        },
      },
      '/api/professors': {
        get: {
          tags: ['Professores'],
          summary: 'Listar professores (requer autenticação)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de professores' }, 401: { description: 'Não autenticado' } },
        },
        post: {
          tags: ['Professores'],
          summary: 'Criar professor (admin/professor)',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          responses: { 201: { description: 'Professor criado' }, 401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' } },
        },
      },
      '/api/professors/{id}': {
        get: {
          tags: ['Professores'],
          summary: 'Obter professor por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Professor encontrado' }, 404: { description: 'Não encontrado' } },
        },
        put: {
          tags: ['Professores'],
          summary: 'Atualizar professor (admin/professor)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          responses: { 200: { description: 'Atualizado' }, 401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' } },
        },
        delete: {
          tags: ['Professores'],
          summary: 'Remover professor (admin/professor)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Removido' }, 401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' } },
        },
      },
      '/api/students': {
        get: {
          tags: ['Alunos'],
          summary: 'Listar alunos (requer autenticação)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de alunos' }, 401: { description: 'Não autenticado' } },
        },
        post: {
          tags: ['Alunos'],
          summary: 'Criar aluno (admin/professor)',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          responses: { 201: { description: 'Aluno criado' }, 401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' } },
        },
      },
      '/api/students/{id}': {
        get: {
          tags: ['Alunos'],
          summary: 'Obter aluno por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Aluno encontrado' }, 404: { description: 'Não encontrado' } },
        },
        put: {
          tags: ['Alunos'],
          summary: 'Atualizar aluno (admin/professor)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          responses: { 200: { description: 'Atualizado' }, 401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' } },
        },
        delete: {
          tags: ['Alunos'],
          summary: 'Remover aluno (admin/professor)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Removido' }, 401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
