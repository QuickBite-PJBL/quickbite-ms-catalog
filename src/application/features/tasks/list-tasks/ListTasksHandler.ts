import { StudyTask } from '../../../../domain/entities/StudyTask';
import { IStudyTaskRepository } from '../../../../domain/repositories/IStudyTaskRepository';
import { ListTasksInput, listTasksSchema } from './ListTasksQuery';

export class ListTasksHandler {
  constructor(private readonly taskRepository: IStudyTaskRepository) {}

  public async execute(input: ListTasksInput = {}): Promise<StudyTask[]> {
    const validatedFilters = listTasksSchema.parse(input);

    if (validatedFilters.groupId && validatedFilters.status) {
      return this.taskRepository.findByStatus(validatedFilters.groupId, validatedFilters.status);
    }

    if (validatedFilters.groupId && !validatedFilters.status) {
      return this.taskRepository.findByGroupId(validatedFilters.groupId);
    }

    return this.taskRepository.findAll(validatedFilters);
  }
}
