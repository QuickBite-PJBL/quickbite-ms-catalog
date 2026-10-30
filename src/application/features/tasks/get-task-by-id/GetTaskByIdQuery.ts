import { z } from 'zod';

export const getTaskByIdSchema = z.object({
  id: z
    .string({ required_error: 'O identificador da tarefa é obrigatório.' })
    .trim()
    .min(1, 'O identificador da tarefa não pode ser vazio.')
});

export type GetTaskByIdInput = z.infer<typeof getTaskByIdSchema>;
