import { PrismaClient, StudyTask as PrismaStudyTaskModel } from '@prisma/client';
import { StudyTask, TaskPriority, TaskStatus } from '../../domain/entities/StudyTask';
import { IStudyTaskRepository, StudyTaskFilter } from '../../domain/repositories/IStudyTaskRepository';
import { prismaClient } from './prismaClient';

export class PrismaStudyTaskRepository implements IStudyTaskRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = prismaClient) {
    this.prisma = prisma;
  }

  private mapToDomain(record: PrismaStudyTaskModel): StudyTask {
    return new StudyTask({
      id: record.id,
      groupId: record.groupId,
      title: record.title,
      description: record.description,
      assignee: record.assignee,
      status: record.status as TaskStatus,
      priority: record.priority as TaskPriority,
      estimatedHours: record.estimatedHours,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }

  public async create(task: StudyTask): Promise<StudyTask> {
    const created = await this.prisma.studyTask.create({
      data: {
        id: task.id,
        groupId: task.groupId,
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        status: task.status,
        priority: task.priority,
        estimatedHours: task.estimatedHours,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });

    return this.mapToDomain(created);
  }

  public async findById(id: string): Promise<StudyTask | null> {
    const found = await this.prisma.studyTask.findUnique({
      where: { id }
    });

    if (!found) {
      return null;
    }

    return this.mapToDomain(found);
  }

  public async findByGroupId(groupId: string): Promise<StudyTask[]> {
    const records = await this.prisma.studyTask.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' }
    });

    return records.map((record) => this.mapToDomain(record));
  }

  public async findByStatus(groupId: string, status: TaskStatus): Promise<StudyTask[]> {
    const records = await this.prisma.studyTask.findMany({
      where: { groupId, status },
      orderBy: { createdAt: 'desc' }
    });

    return records.map((record) => this.mapToDomain(record));
  }

  public async findAll(filters?: StudyTaskFilter): Promise<StudyTask[]> {
    const whereClause: { groupId?: string; status?: string } = {};

    if (filters?.groupId) {
      whereClause.groupId = filters.groupId;
    }

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const records = await this.prisma.studyTask.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return records.map((record) => this.mapToDomain(record));
  }

  public async update(task: StudyTask): Promise<StudyTask> {
    const updated = await this.prisma.studyTask.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        status: task.status,
        priority: task.priority,
        estimatedHours: task.estimatedHours,
        updatedAt: task.updatedAt
      }
    });

    return this.mapToDomain(updated);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.studyTask.delete({
      where: { id }
    });
  }
}
