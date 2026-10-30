import { NextFunction, Request, Response, Router } from 'express';
import { CreateTaskHandler } from '../../application/features/tasks/create-task/CreateTaskHandler';
import { DeleteTaskHandler } from '../../application/features/tasks/delete-task/DeleteTaskHandler';
import { GetTaskByIdHandler } from '../../application/features/tasks/get-task-by-id/GetTaskByIdHandler';
import { ListTasksHandler } from '../../application/features/tasks/list-tasks/ListTasksHandler';
import { updateTaskStatusSchema } from '../../application/features/tasks/update-task/UpdateTaskCommand';
import { UpdateTaskHandler } from '../../application/features/tasks/update-task/UpdateTaskHandler';
import { IEventPublisher } from '../../domain/events/IEventPublisher';
import { IStudyTaskRepository } from '../../domain/repositories/IStudyTaskRepository';

export function createTaskRoutes(
  taskRepository: IStudyTaskRepository,
  eventPublisher: IEventPublisher
): Router {
  const router = Router();

  const createTaskHandler = new CreateTaskHandler(taskRepository, eventPublisher);
  const listTasksHandler = new ListTasksHandler(taskRepository);
  const getTaskByIdHandler = new GetTaskByIdHandler(taskRepository);
  const updateTaskHandler = new UpdateTaskHandler(taskRepository, eventPublisher);
  const deleteTaskHandler = new DeleteTaskHandler(taskRepository);

  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdTask = await createTaskHandler.execute(req.body);
      res.status(201).json(createdTask);
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupId = typeof req.query.groupId === 'string' ? req.query.groupId : undefined;
      const status = typeof req.query.status === 'string' ? (req.query.status as 'TODO' | 'DOING' | 'DONE') : undefined;
      const tasks = await listTasksHandler.execute({ groupId, status });
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await getTaskByIdHandler.execute(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedTask = await updateTaskHandler.execute(req.params.id, req.body);
      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedStatus = updateTaskStatusSchema.parse(req.body);
      const updatedTask = await updateTaskHandler.execute(req.params.id, {
        status: validatedStatus.status
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteTaskHandler.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
