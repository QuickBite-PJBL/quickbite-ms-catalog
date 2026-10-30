export const openapiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'API de Quadro Kanban e Tarefas de Estudo (study-groups-ms-sql)',
    version: '1.0.0',
    description:
      'Microsserviço responsável pelo gerenciamento de tarefas de estudo no modelo Kanban com persistência no Azure SQL Server e publicação de eventos de domínio.'
  },
  servers: [
    {
      url: '/',
      description: 'Servidor da API do Microsserviço Kanban'
    }
  ],
  tags: [
    {
      name: 'Saúde',
      description: 'Monitoramento de disponibilidade do microsserviço'
    },
    {
      name: 'Tarefas de Estudo',
      description: 'Operações de gerenciamento de tarefas no quadro Kanban'
    }
  ],
  components: {
    schemas: {
      StudyTask: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'c4b09f34-8d2a-4f10-9a1b-1e5a7f8c9d01'
          },
          groupId: {
            type: 'string',
            example: 'grupo-arquitetura-01'
          },
          title: {
            type: 'string',
            example: 'Resolver lista de arquitetura cloud'
          },
          description: {
            type: 'string',
            example: 'Revisar conceitos de microsserviços, mensageria com RabbitMQ e banco SQL no Azure'
          },
          assignee: {
            type: 'string',
            example: 'Giuseppe Filippin'
          },
          status: {
            type: 'string',
            enum: ['TODO', 'DOING', 'DONE'],
            example: 'TODO'
          },
          priority: {
            type: 'string',
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            example: 'HIGH'
          },
          estimatedHours: {
            type: 'number',
            example: 4
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-10-29T18:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-10-29T18:00:00.000Z'
          }
        }
      },
      CreateTaskRequest: {
        type: 'object',
        required: ['groupId', 'title', 'description', 'assignee', 'priority', 'estimatedHours'],
        properties: {
          groupId: {
            type: 'string',
            description: 'Identificador do grupo de estudo',
            example: 'grupo-arquitetura-01'
          },
          title: {
            type: 'string',
            description: 'Título da tarefa de estudo (mínimo de 3 caracteres)',
            example: 'Resolver lista de arquitetura cloud'
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada da atividade de estudo',
            example: 'Revisar conceitos de microsserviços e mensageria assíncrona'
          },
          assignee: {
            type: 'string',
            description: 'Nome do estudante responsável pela tarefa',
            example: 'Giuseppe Filippin'
          },
          status: {
            type: 'string',
            enum: ['TODO', 'DOING', 'DONE'],
            description: 'Status inicial da tarefa no quadro Kanban',
            example: 'TODO'
          },
          priority: {
            type: 'string',
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            description: 'Nível de prioridade da tarefa',
            example: 'HIGH'
          },
          estimatedHours: {
            type: 'number',
            description: 'Carga horária estimada em horas (maior que zero)',
            example: 4
          }
        }
      },
      UpdateTaskRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'Resolver lista avançada de arquitetura cloud'
          },
          description: {
            type: 'string',
            example: 'Incluir exercícios práticos de Azure SQL e RabbitMQ'
          },
          assignee: {
            type: 'string',
            example: 'Lara Bredow'
          },
          status: {
            type: 'string',
            enum: ['TODO', 'DOING', 'DONE'],
            example: 'DOING'
          },
          priority: {
            type: 'string',
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            example: 'HIGH'
          },
          estimatedHours: {
            type: 'number',
            example: 6
          }
        }
      },
      UpdateTaskStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['TODO', 'DOING', 'DONE'],
            description: 'Novo status da tarefa no quadro Kanban',
            example: 'DONE'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          erro: {
            type: 'string',
            example: 'Erro de validação nos dados enviados.'
          },
          detalhes: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['O título da tarefa de estudo deve ter pelo menos 3 caracteres.']
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Saúde'],
        summary: 'Verifica o status de saúde do microsserviço',
        description: 'Retorna informações sobre a disponibilidade operacional do serviço Kanban.',
        responses: {
          '200': {
            description: 'Serviço em operação normal'
          }
        }
      }
    },
    '/api/tasks': {
      post: {
        tags: ['Tarefas de Estudo'],
        summary: 'Cria uma nova tarefa de estudo no quadro Kanban',
        description: 'Cadastra uma nova tarefa no Azure SQL Database e publica o evento de mudança de status.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateTaskRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Tarefa de estudo criada com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyTask'
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos na requisição',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Tarefas de Estudo'],
        summary: 'Lista tarefas de estudo com filtros opcionais',
        description: 'Retorna a listagem de tarefas de estudo podendo filtrar por grupo e por status do Kanban.',
        parameters: [
          {
            name: 'groupId',
            in: 'query',
            required: false,
            description: 'Filtra tarefas pelo identificador do grupo de estudo',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'status',
            in: 'query',
            required: false,
            description: 'Filtra tarefas pelo status (TODO, DOING, DONE)',
            schema: {
              type: 'string',
              enum: ['TODO', 'DOING', 'DONE']
            }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de tarefas retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/StudyTask'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/tasks/{id}': {
      get: {
        tags: ['Tarefas de Estudo'],
        summary: 'Busca uma tarefa de estudo pelo identificador',
        description: 'Retorna os detalhes completos de uma tarefa específica.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador único da tarefa de estudo',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Tarefa encontrada com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyTask'
                }
              }
            }
          },
          '404': {
            description: 'Tarefa de estudo não encontrada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Tarefas de Estudo'],
        summary: 'Atualiza os dados de uma tarefa de estudo',
        description:
          'Atualiza campos da tarefa e dispara evento de mudança de status caso o status tenha sido alterado.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador único da tarefa de estudo',
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTaskRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Tarefa atualizada com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyTask'
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos para atualização',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Tarefa de estudo não encontrada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Tarefas de Estudo'],
        summary: 'Remove uma tarefa de estudo',
        description: 'Exclui permanentemente uma tarefa de estudo do quadro Kanban.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador único da tarefa de estudo',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '204': {
            description: 'Tarefa removida com sucesso'
          },
          '404': {
            description: 'Tarefa de estudo não encontrada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/tasks/{id}/status': {
      patch: {
        tags: ['Tarefas de Estudo'],
        summary: 'Altera exclusivamente o status de uma tarefa no Kanban',
        description:
          'Move a tarefa entre as colunas TODO, DOING e DONE e publica o evento TaskStatusChangedEvent.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador único da tarefa de estudo',
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTaskStatusRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Status da tarefa atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyTask'
                }
              }
            }
          },
          '400': {
            description: 'Status inválido fornecido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Tarefa de estudo não encontrada',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  }
};
