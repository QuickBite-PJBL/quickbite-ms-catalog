import { z } from 'zod';

export const createTaskSchema = z.object({
  groupId: z
    .string({ required_error: 'O identificador do grupo de estudo é obrigatório.' })
    .trim()
    .min(1, 'O identificador do grupo de estudo não pode ser vazio.'),
  title: z
    .string({ required_error: 'O título da tarefa é obrigatório.' })
    .trim()
    .min(3, 'O título da tarefa de estudo deve ter pelo menos 3 caracteres.'),
  description: z
    .string({ required_error: 'A descrição da tarefa é obrigatória.' })
    .trim()
    .min(1, 'A descrição da tarefa não pode ser vazia.'),
  assignee: z
    .string({ required_error: 'O responsável pela tarefa é obrigatório.' })
    .trim()
    .min(1, 'O responsável pela tarefa de estudo é obrigatório.'),
  status: z
    .enum(['TODO', 'DOING', 'DONE'], {
      errorMap: () => ({ message: 'O status deve ser TODO, DOING ou DONE.' })
    })
    .optional()
    .default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'A prioridade deve ser LOW, MEDIUM ou HIGH.' })
  }),
  estimatedHours: z
    .number({
      required_error: 'A carga horária estimada é obrigatória.',
      invalid_type_error: 'A carga horária estimada deve ser um número.'
    })
    .positive('A carga horária estimada deve ser maior que zero.')
});

export type CreateTaskInput = z.input<typeof createTaskSchema>;
