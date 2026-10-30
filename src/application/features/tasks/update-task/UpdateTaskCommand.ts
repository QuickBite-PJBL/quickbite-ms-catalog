import { z } from 'zod';

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'O título da tarefa de estudo deve ter pelo menos 3 caracteres.')
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'A descrição da tarefa não pode ser vazia.')
    .optional(),
  assignee: z
    .string()
    .trim()
    .min(1, 'O responsável pela tarefa de estudo é obrigatório.')
    .optional(),
  status: z
    .enum(['TODO', 'DOING', 'DONE'], {
      errorMap: () => ({ message: 'O status deve ser TODO, DOING ou DONE.' })
    })
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'A prioridade deve ser LOW, MEDIUM ou HIGH.' })
    })
    .optional(),
  estimatedHours: z
    .number({ invalid_type_error: 'A carga horária estimada deve ser um número.' })
    .positive('A carga horária estimada deve ser maior que zero.')
    .optional()
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'DOING', 'DONE'], {
    errorMap: () => ({ message: 'O status deve ser TODO, DOING ou DONE.' })
  })
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
