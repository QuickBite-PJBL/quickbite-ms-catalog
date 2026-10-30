import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    const details = error.errors.map((issue) => issue.message);
    res.status(400).json({
      erro: 'Erro de validação nos dados enviados.',
      detalhes: details
    });
    return;
  }

  if (error instanceof Error) {
    const isNotFound = error.message.toLowerCase().includes('não encontrada');
    const statusCode = isNotFound ? 404 : 400;

    res.status(statusCode).json({
      erro: error.message
    });
    return;
  }

  res.status(500).json({
    erro: 'Ocorreu um erro interno inesperado no servidor de tarefas de estudo.'
  });
}
