import { describe, expect, it, vi } from 'vitest';
import { CreateTaskHandler } from '../../../src/application/features/tasks/create-task/CreateTaskHandler';
import { StudyTask } from '../../../src/domain/entities/StudyTask';
import { IEventPublisher } from '../../../src/domain/events/IEventPublisher';
import { IStudyTaskRepository } from '../../../src/domain/repositories/IStudyTaskRepository';

describe('Caso de Uso CreateTaskHandler', () => {
  it('deve criar uma nova tarefa de estudo no repositório e publicar o evento TaskStatusChangedEvent', async () => {
    const mockRepository: IStudyTaskRepository = {
      create: vi.fn(async (task: StudyTask) => task),
      findById: vi.fn(),
      findByGroupId: vi.fn(),
      findByStatus: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };

    const mockEventPublisher: IEventPublisher = {
      publish: vi.fn(async () => undefined)
    };

    const handler = new CreateTaskHandler(mockRepository, mockEventPublisher);

    const createdTask = await handler.execute({
      groupId: 'grupo-arquitetura-01',
      title: 'Resolver lista de arquitetura cloud',
      description: 'Modelar microsserviços com mensageria RabbitMQ e Azure SQL',
      assignee: 'Giuseppe Filippin',
      priority: 'HIGH',
      estimatedHours: 4
    });

    expect(createdTask.id).toBeDefined();
    expect(createdTask.title).toBe('Resolver lista de arquitetura cloud');
    expect(createdTask.status).toBe('TODO');
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(1);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      'task.status.changed',
      expect.objectContaining({
        taskId: createdTask.id,
        groupId: 'grupo-arquitetura-01',
        title: 'Resolver lista de arquitetura cloud',
        assignee: 'Giuseppe Filippin',
        oldStatus: null,
        newStatus: 'TODO',
        priority: 'HIGH',
        estimatedHours: 4
      })
    );
  });

  it('deve rejeitar a criação quando os dados de entrada forem inválidos pelo schema Zod', async () => {
    const mockRepository: IStudyTaskRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByGroupId: vi.fn(),
      findByStatus: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };

    const mockEventPublisher: IEventPublisher = {
      publish: vi.fn()
    };

    const handler = new CreateTaskHandler(mockRepository, mockEventPublisher);

    await expect(
      handler.execute({
        groupId: 'grupo-arquitetura-01',
        title: 'AB',
        description: 'Descrição válida da tarefa',
        assignee: 'Viktor Trawinski',
        priority: 'MEDIUM',
        estimatedHours: 2
      })
    ).rejects.toThrow('O título da tarefa de estudo deve ter pelo menos 3 caracteres.');

    expect(mockRepository.create).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });
});
