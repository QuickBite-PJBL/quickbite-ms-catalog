import express, { Application, Request, Response } from 'express';
import { CheckHealthUseCase } from '../application/features/health/CheckHealthUseCase';

export function createApp(): Application {
  const app = express();
  app.use(express.json());

  const checkHealthUseCase = new CheckHealthUseCase();

  app.get('/health', (_req: Request, res: Response) => {
    const result = checkHealthUseCase.execute();
    res.status(200).json(result);
  });

  return app;
}

