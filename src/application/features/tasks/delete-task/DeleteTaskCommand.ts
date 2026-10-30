import { z } from 'zod';

export const deleteTaskSchema = z.object({
  id: z
    .string({ required_error: 'O identificador da tarefa é obrigatório.' })
    .trim()
    .min(1, 'O identificador da tarefa não pode ser vazio.')
});

export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
