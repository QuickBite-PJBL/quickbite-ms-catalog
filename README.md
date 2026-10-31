# study-groups-ms-sql — Microsserviço de Quadro Kanban e Tarefas de Estudo

Microsserviço responsável pelo domínio de **Quadro Kanban e Tarefas de Estudo** da plataforma **StudyGroups**, com persistência relacional no **Azure SQL Database** via **Prisma ORM** e publicação assíncrona de eventos de domínio no **RabbitMQ**.

---

## 1. Arquitetura

O projeto adota **Clean Architecture** combinada com **Vertical Slice Architecture**, garantindo desacoplamento total entre regras de negócio, casos de uso, banco de dados relacional e transporte HTTP/AMQP:

- **`src/domain`**: Entidade rica `StudyTask` com validações invariantes de negócio e contratos puros (`IStudyTaskRepository` e `IEventPublisher`). Não possui dependências externas das demais camadas.
- **`src/application/features`**: Organizada em *Vertical Slices* independentes (`create-task`, `list-tasks`, `get-task-by-id`, `update-task`, `delete-task` e `health`), cada uma contendo seus comandos/queries validados com `Zod` e seus respectivos `Handlers`.
- **`src/infrastructure`**: Implementações concretas de persistência (`PrismaStudyTaskRepository` e `prismaClient`), mensageria (`RabbitMqPublisher` com exchange `study_groups.events` do tipo `topic` e fallback resiliente) e variáveis de ambiente.
- **`src/api`**: Servidor HTTP em Express, rotas REST do Kanban (`/api/tasks`), tratamento global de erros, documentação interativa OpenAPI 3.0 (`/api-docs`) e catálogo de eventos assíncronos (`/events-docs`).
- **`tests/`**: Suíte automatizada de testes unitários de domínio, aplicação e infraestrutura, além de testes de arquitetura com `tsarch` validando o isolamento estrito entre camadas.

---

## 2. Tecnologias Utilizadas

- **Runtime**: Node.js 20 (TypeScript 5)
- **Framework Web**: Express 4 + CORS
- **ORM e Banco de Dados**: Prisma ORM 5 + Azure SQL Database (`sqlserver`)
- **Mensageria**: RabbitMQ (`amqplib`)
- **Validação de Dados**: Zod
- **Documentação**: Swagger UI (`swagger-ui-express`, OpenAPI 3.0) + Catálogo AsyncAPI (`/events-docs`)
- **Testes Automatizados**: Vitest + TsArch
- **Containerização**: Docker Multi-Stage (`node:20-slim` com OpenSSL para Prisma Engine)

---

## 3. Configuração do Azure SQL Database + Prisma

O microsserviço utiliza o provider `sqlserver` no arquivo `prisma/schema.prisma`, mapeando o modelo `StudyTask` para o Azure SQL Database com criptografia TLS ativada (`encrypt=true`).

Comandos principais do Prisma:

```bash
npx prisma generate
npm run db:push
```

- `npx prisma generate`: Gera os artefatos tipados do Prisma Client a partir do schema.
- `npm run db:push`: Sincroniza a tabela `StudyTask` diretamente no banco Azure SQL Database configurado em `DATABASE_URL`.

---

## 4. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseando-se no arquivo `.env.example`:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `NODE_ENV` | Ambiente de execução da aplicação | `development` |
| `PORT` | Porta HTTP onde o servidor Express será iniciado | `3002` |
| `DATABASE_URL` | String de conexão JDBC/SQL Server do Azure SQL Database | `sqlserver://servidor.database.windows.net:1433;database=studygroups_kanban_db;user=sqladmin;password=SuaSenha123;encrypt=true;trustServerCertificate=false;loginTimeout=30` |
| `RABBITMQ_URL` | URL de conexão AMQP/AMQPS com o broker RabbitMQ / CloudAMQP | `amqps://usuario:senha@host.rmq.cloudamqp.com/vhost` |
| `RABBITMQ_EXCHANGE` | Nome do exchange utilizado para eventos de domínio | `study_groups.events` |

---

## 5. Endpoints Principais e Documentação

- `GET /health` — Verificação de disponibilidade do microsserviço
- `POST /api/tasks` — Cria uma nova tarefa de estudo e publica `TaskStatusChangedEvent`
- `GET /api/tasks` — Lista tarefas de estudo (filtros opcionais: `?groupId=...&status=TODO|DOING|DONE`)
- `GET /api/tasks/:id` — Consulta os detalhes de uma tarefa pelo ID
- `PUT /api/tasks/:id` — Atualiza dados e/ou status da tarefa
- `PATCH /api/tasks/:id/status` — Move a tarefa no quadro Kanban (`TODO`, `DOING`, `DONE`) e dispara `TaskStatusChangedEvent`
- `DELETE /api/tasks/:id` — Remove uma tarefa de estudo
- `GET /api-docs` e `GET /api-docs.json` — Documentação Swagger OpenAPI 3.0 em português
- `GET /events-docs` e `GET /events-docs.json` — Catálogo de Eventos Assíncronos RabbitMQ (`TaskStatusChangedEvent`)

---

## 6. Como Executar Localmente e via Docker

### Execução Local

```bash
npm install
npx prisma generate
npm run test
npm run build
npm run dev
```

### Execução com Docker

```bash
docker build -t study-groups-ms-sql .
docker run -p 3002:3002 --env-file .env study-groups-ms-sql
```

---

## 7. Autores

- **Giuseppe Nunes**
- **João Gabriel Cintra**
- **Lara Bredow**
- **Viktor Trawinski**
