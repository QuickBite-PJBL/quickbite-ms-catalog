import { v4 as uuidv4 } from 'uuid';

export type TaskStatus = 'TODO' | 'DOING' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface StudyTaskProps {
  id?: string;
  groupId: string;
  title: string;
  description: string;
  assignee: string;
  status?: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StatusChangeResult {
  oldStatus: TaskStatus;
  newStatus: TaskStatus;
}

export class StudyTask {
  public readonly id: string;
  public readonly groupId: string;
  public title: string;
  public description: string;
  public assignee: string;
  public status: TaskStatus;
  public priority: TaskPriority;
  public estimatedHours: number;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: StudyTaskProps) {
    this.id = props.id ?? uuidv4();
    this.groupId = props.groupId;
    this.title = props.title;
    this.description = props.description;
    this.assignee = props.assignee;
    this.status = props.status ?? 'TODO';
    this.priority = props.priority;
    this.estimatedHours = props.estimatedHours;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.groupId || this.groupId.trim().length === 0) {
      throw new Error('O identificador do grupo de estudo é obrigatório.');
    }

    if (!this.title || this.title.trim().length < 3) {
      throw new Error('O título da tarefa de estudo deve ter pelo menos 3 caracteres.');
    }

    if (!this.assignee || this.assignee.trim().length === 0) {
      throw new Error('O responsável pela tarefa de estudo é obrigatório.');
    }

    if (typeof this.estimatedHours !== 'number' || Number.isNaN(this.estimatedHours) || this.estimatedHours <= 0) {
      throw new Error('A carga horária estimada deve ser maior que zero.');
    }

    const validStatuses: TaskStatus[] = ['TODO', 'DOING', 'DONE'];
    if (!validStatuses.includes(this.status)) {
      throw new Error('O status informado para a tarefa de estudo é inválido.');
    }

    const validPriorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
    if (!validPriorities.includes(this.priority)) {
      throw new Error('A prioridade informada para a tarefa de estudo é inválida.');
    }
  }

  public changeStatus(newStatus: TaskStatus): StatusChangeResult {
    const validStatuses: TaskStatus[] = ['TODO', 'DOING', 'DONE'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('O novo status informado para a tarefa de estudo é inválido.');
    }

    const oldStatus = this.status;
    this.status = newStatus;
    this.updatedAt = new Date();

    return {
      oldStatus,
      newStatus: this.status
    };
  }
}

