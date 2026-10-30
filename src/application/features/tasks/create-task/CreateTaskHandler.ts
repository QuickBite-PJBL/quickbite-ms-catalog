import { StudyTask } from '../../../../domain/entities/StudyTask';
import { IEventPublisher, TaskStatusChangedEvent } from '../../../../domain/events/IEventPublisher';
import { IStudyTaskRepository } from '../../../../domain/repositories/IStudyTaskRepository';
import { CreateTaskInput, createTaskSchema } from './CreateTaskCommand';

export class CreateTaskHandler {
  constructor(
    private readonly taskRepository: IStudyTaskRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  public async execute(input: CreateTaskInput): Promise<StudyTask> {
    const validatedData = createTaskSchema.parse(input);

    const task = new StudyTask({
      groupId: validatedData.groupId,
      title: validatedData.title,
      description: validatedData.description,
      assignee: validatedData.assignee,
      status: validatedData.status,
      priority: validatedData.priority,
      estimatedHours: validatedData.estimatedHours
    });

    const createdTask = await this.taskRepository.create(task);

    const eventPayload: TaskStatusChangedEvent = {
      taskId: createdTask.id,
      groupId: createdTask.groupId,
      title: createdTask.title,
      assignee: createdTask.assignee,
      oldStatus: null,
      newStatus: createdTask.status,
      priority: createdTask.priority,
      estimatedHours: createdTask.estimatedHours,
      occurredAt: createdTask.createdAt.toISOString()
    };

    await this.eventPublisher.publish<TaskStatusChangedEvent>('task.status.changed', eventPayload);

    return createdTask;
  }
}
