import { StudyTask, TaskStatus } from '../entities/StudyTask';

export interface StudyTaskFilter {
  groupId?: string;
  status?: TaskStatus;
}

export interface IStudyTaskRepository {
  create(task: StudyTask): Promise<StudyTask>;
  findById(id: string): Promise<StudyTask | null>;
  findByGroupId(groupId: string): Promise<StudyTask[]>;
  findByStatus(groupId: string, status: TaskStatus): Promise<StudyTask[]>;
  findAll(filters?: StudyTaskFilter): Promise<StudyTask[]>;
  update(task: StudyTask): Promise<StudyTask>;
  delete(id: string): Promise<void>;
}
