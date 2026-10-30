import { StudyTask } from '../../../../domain/entities/StudyTask';
import { IStudyTaskRepository } from '../../../../domain/repositories/IStudyTaskRepository';
import { getTaskByIdSchema } from './GetTaskByIdQuery';

export class GetTaskByIdHandler {
  constructor(private readonly taskRepository: IStudyTaskRepository) {}

  public async execute(id: string): Promise<StudyTask> {
    const validated = getTaskByIdSchema.parse({ id });

    const task = await this.taskRepository.findById(validated.id);
    if (!task) {
      throw new Error('Tarefa de estudo não encontrada.');
    }

    return task;
  }
}
