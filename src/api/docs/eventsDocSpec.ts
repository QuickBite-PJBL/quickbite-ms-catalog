export const eventsCatalogSpec = {
  asyncapi: '2.6.0',
  info: {
    title: 'Catálogo de Eventos de Domínio - Quadro Kanban (study-groups-ms-sql)',
    version: '1.0.0',
    description:
      'Documentação oficial dos eventos assíncronos publicados pelo microsserviço study-groups-ms-sql no broker RabbitMQ.'
  },
  defaultContentType: 'application/json',
  channels: {
    'task.status.changed': {
      description:
        'Canal de roteamento acionado quando uma tarefa de estudo é criada ou tem seu status alterado entre TODO, DOING e DONE.',
      bindings: {
        amqp: {
          is: 'routingKey',
          exchange: {
            name: 'study_groups.events',
            type: 'topic',
            durable: true
          }
        }
      },
      publish: {
        summary: 'Publica o evento TaskStatusChangedEvent no exchange study_groups.events',
        operationId: 'publishTaskStatusChangedEvent',
        message: {
          name: 'TaskStatusChangedEvent',
          title: 'Evento de Mudança de Status de Tarefa de Estudo',
          payload: {
            type: 'object',
            required: [
              'taskId',
              'groupId',
              'title',
              'assignee',
              'newStatus',
              'priority',
              'estimatedHours',
              'occurredAt'
            ],
            properties: {
              taskId: {
                type: 'string',
                format: 'uuid',
                description: 'Identificador único da tarefa de estudo',
                example: 'c4b09f34-8d2a-4f10-9a1b-1e5a7f8c9d01'
              },
              groupId: {
                type: 'string',
                description: 'Identificador do grupo de estudo',
                example: 'grupo-arquitetura-01'
              },
              title: {
                type: 'string',
                description: 'Título da tarefa de estudo',
                example: 'Resolver lista de arquitetura cloud'
              },
              assignee: {
                type: 'string',
                description: 'Estudante responsável pela tarefa',
                example: 'Giuseppe Filippin'
              },
              oldStatus: {
                type: ['string', 'null'],
                enum: ['TODO', 'DOING', 'DONE', null],
                description: 'Status anterior da tarefa (nulo quando recém-criada)',
                example: 'TODO'
              },
              newStatus: {
                type: 'string',
                enum: ['TODO', 'DOING', 'DONE'],
                description: 'Novo status da tarefa no quadro Kanban',
                example: 'DOING'
              },
              priority: {
                type: 'string',
                enum: ['LOW', 'MEDIUM', 'HIGH'],
                description: 'Prioridade atribuída à tarefa',
                example: 'HIGH'
              },
              estimatedHours: {
                type: 'number',
                description: 'Carga horária estimada em horas',
                example: 4
              },
              occurredAt: {
                type: 'string',
                format: 'date-time',
                description: 'Data e hora em que a mudança de status ocorreu',
                example: '2026-10-30T18:30:00.000Z'
              }
            }
          }
        }
      }
    }
  }
};

export function renderEventsDocsHtml(): string {
  const examplePayload = JSON.stringify(
    {
      event: 'task.status.changed',
      exchange: 'study_groups.events',
      timestamp: '2026-10-30T18:30:00.000Z',
      data: {
        taskId: 'c4b09f34-8d2a-4f10-9a1b-1e5a7f8c9d01',
        groupId: 'grupo-arquitetura-01',
        title: 'Resolver lista de arquitetura cloud',
        assignee: 'Giuseppe Filippin',
        oldStatus: 'TODO',
        newStatus: 'DOING',
        priority: 'HIGH',
        estimatedHours: 4,
        occurredAt: '2026-10-30T18:30:00.000Z'
      }
    },
    null,
    2
  );

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catálogo de Eventos - study-groups-ms-sql</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: rgb(15, 23, 42);
      color: rgb(241, 245, 249);
      margin: 0;
      padding: 32px;
      line-height: 1.6;
    }
    .container {
      max-width: 920px;
      margin: 0 auto;
      background-color: rgb(30, 41, 59);
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
    }
    h1, h2, h3 {
      color: rgb(56, 189, 248);
      margin-top: 0;
    }
    .badge {
      display: inline-block;
      background-color: rgb(14, 165, 233);
      color: rgb(255, 255, 255);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-right: 8px;
    }
    .meta-box {
      background-color: rgb(15, 23, 42);
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    pre {
      background-color: rgb(2, 6, 23);
      color: rgb(167, 243, 208);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.9rem;
    }
    a {
      color: rgb(56, 189, 248);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Catálogo de Eventos Assíncronos (RabbitMQ)</h1>
    <p>Microsserviço <strong>study-groups-ms-sql</strong> — Domínio de Quadro Kanban e Tarefas de Estudo no Azure SQL Database.</p>
    <div class="meta-box">
      <p><span class="badge">EXCHANGE</span> <strong>study_groups.events</strong> (tipo: <code>topic</code>, durável: <code>true</code>)</p>
      <p><span class="badge">ROUTING KEY</span> <strong>task.status.changed</strong></p>
      <p><span class="badge">EVENTO</span> <strong>TaskStatusChangedEvent</strong></p>
      <p><span class="badge">ESPECIFICAÇÃO JSON</span> <a href="/events-docs.json">/events-docs.json</a></p>
    </div>
    <h2>Descrição do Evento</h2>
    <p>Disparado automaticamente sempre que uma tarefa de estudo é criada no quadro Kanban ou quando seu status transita entre as colunas <code>TODO</code>, <code>DOING</code> e <code>DONE</code>.</p>
    <h3>Exemplo de Payload Publicado</h3>
    <pre>${examplePayload}</pre>
  </div>
</body>
</html>`;
}
