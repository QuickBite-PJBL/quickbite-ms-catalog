import { IStudyTaskRepository } from '../../../../domain/repositories/IStudyTaskRepository';
import { deleteTaskSchema } from './DeleteTaskCommand';

export class DeleteTaskHandler {
  constructor(private readonly taskRepository: IStudyTaskRepository) {}

  public async execute(id: string): Promise<void> {
    const validated = deleteTaskSchema.parse({ id });

    const existingTask = await this.taskRepository.findById(validated.id);
    if (!existingTask) {
      throw new Error('Tarefa de estudo não encontrada para exclusão.');
    }

    await this.taskRepository.delete(validated.id);
  }
}
