import { z } from 'zod';

export const listTasksSchema = z.object({
  groupId: z.string().trim().min(1, 'O identificador do grupo não pode ser vazio.').optional(),
  status: z
    .enum(['TODO', 'DOING', 'DONE'], {
      errorMap: () => ({ message: 'O filtro de status deve ser TODO, DOING ou DONE.' })
    })
    .optional()
});

export type ListTasksInput = z.infer<typeof listTasksSchema>;
