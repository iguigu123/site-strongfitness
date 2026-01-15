import swaggerJsDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'StrongFitness API',
      version: '1.0.0',
      description: 'API do e-commerce StrongFitness',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'USER'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            image_url: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string' },
            refresh_token: { type: 'string' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'null' },
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth' },
      { name: 'Users' },
      { name: 'Products' },
      { name: 'Orders' },
    ],
    paths: {
      '/orders': {
        post: {
          tags: ['Orders'],
          summary: 'Criar pedido',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'string' },
                          quantity: { type: 'integer', minimum: 1 },
                        },
                        required: ['productId', 'quantity'],
                      },
                      minItems: 1,
                    },
                  },
                  required: ['items'],
                },
              },
            },
          },
          responses: {
            '202': {
              description: 'Pedido enfileirado para processamento',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      orderId: { type: 'string' },
                      status: { type: 'string', enum: ['QUEUED'] },
                      itemsCount: { type: 'integer' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Não autenticado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiError' },
                },
              },
            },
          },
        },
      },
      '/auth/sessions': {
        post: {
          tags: ['Auth'],
          summary: 'Autenticar usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Autenticado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/AuthResponse' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Erro de autenticação',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiError' },
                },
              },
            },
          },
        },
      },
      '/users': {
        post: {
          tags: ['Users'],
          summary: 'Criar usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                  required: ['name', 'email', 'password'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Usuário criado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            '400': {
              description: 'Erro de validação',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiError' },
                },
              },
            },
          },
        },
      },
      '/products': {
        get: {
          tags: ['Products'],
          summary: 'Listar produtos',
          responses: {
            '200': {
              description: 'Lista de produtos',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
});
