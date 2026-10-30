import { TaskPriority, TaskStatus } from '../entities/StudyTask';

export interface DomainEvent<T = unknown> {
  eventName: string;
  occurredOn: Date;
  payload: T;
}

export interface TaskStatusChangedEvent {
  taskId: string;
  groupId: string;
  title: string;
  assignee: string;
  oldStatus: TaskStatus | null;
  newStatus: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  occurredAt: string;
}

export interface IEventPublisher {
  publish<T>(eventName: string, payload: T): Promise<void>;
}
