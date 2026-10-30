import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { CheckHealthUseCase } from '../application/features/health/CheckHealthUseCase';
import { IEventPublisher } from '../domain/events/IEventPublisher';
import { IStudyTaskRepository } from '../domain/repositories/IStudyTaskRepository';
import { ConsoleEventPublisher } from '../infrastructure/messaging/ConsoleEventPublisher';
import { PrismaStudyTaskRepository } from '../infrastructure/persistence/PrismaStudyTaskRepository';
import { openapiSpec } from './docs/openapiSpec';
import { errorHandler } from './middlewares/errorHandler';
import { createTaskRoutes } from './routes/taskRoutes';

export interface AppDependencies {
  taskRepository?: IStudyTaskRepository;
  eventPublisher?: IEventPublisher;
}

export function createApp(dependencies: AppDependencies = {}): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const checkHealthUseCase = new CheckHealthUseCase();
  const taskRepository = dependencies.taskRepository ?? new PrismaStudyTaskRepository();
  const eventPublisher = dependencies.eventPublisher ?? new ConsoleEventPublisher();

  app.get('/health', (_req: Request, res: Response) => {
    const result = checkHealthUseCase.execute();
    res.status(200).json(result);
  });

  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.status(200).json(openapiSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

  app.use('/api/tasks', createTaskRoutes(taskRepository, eventPublisher));

  app.use(errorHandler);

  return app;
}
