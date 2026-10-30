import { StudyTask } from '../../../../domain/entities/StudyTask';
import { IEventPublisher, TaskStatusChangedEvent } from '../../../../domain/events/IEventPublisher';
import { IStudyTaskRepository } from '../../../../domain/repositories/IStudyTaskRepository';
import { UpdateTaskInput, updateTaskSchema } from './UpdateTaskCommand';

export class UpdateTaskHandler {
  constructor(
    private readonly taskRepository: IStudyTaskRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  public async execute(id: string, input: UpdateTaskInput): Promise<StudyTask> {
    if (!id || id.trim().length === 0) {
      throw new Error('O identificador da tarefa é obrigatório.');
    }

    const validatedData = updateTaskSchema.parse(input);

    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error('Tarefa de estudo não encontrada para atualização.');
    }

    const updatedTaskEntity = new StudyTask({
      id: existingTask.id,
      groupId: existingTask.groupId,
      title: validatedData.title ?? existingTask.title,
      description: validatedData.description ?? existingTask.description,
      assignee: validatedData.assignee ?? existingTask.assignee,
      status: existingTask.status,
      priority: validatedData.priority ?? existingTask.priority,
      estimatedHours: validatedData.estimatedHours ?? existingTask.estimatedHours,
      createdAt: existingTask.createdAt,
      updatedAt: new Date()
    });

    let statusTransition: { oldStatus: StudyTask['status']; newStatus: StudyTask['status'] } | null = null;

    if (validatedData.status && validatedData.status !== existingTask.status) {
      statusTransition = updatedTaskEntity.changeStatus(validatedData.status);
    }

    const savedTask = await this.taskRepository.update(updatedTaskEntity);

    if (statusTransition) {
      const eventPayload: TaskStatusChangedEvent = {
        taskId: savedTask.id,
        groupId: savedTask.groupId,
        title: savedTask.title,
        assignee: savedTask.assignee,
        oldStatus: statusTransition.oldStatus,
        newStatus: statusTransition.newStatus,
        priority: savedTask.priority,
        estimatedHours: savedTask.estimatedHours,
        occurredAt: savedTask.updatedAt.toISOString()
      };

      await this.eventPublisher.publish<TaskStatusChangedEvent>('task.status.changed', eventPayload);
    }

    return savedTask;
  }
}
