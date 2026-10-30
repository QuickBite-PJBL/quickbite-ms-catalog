import { describe, expect, it, vi } from 'vitest';
import { UpdateTaskHandler } from '../../../src/application/features/tasks/update-task/UpdateTaskHandler';
import { StudyTask } from '../../../src/domain/entities/StudyTask';
import { IEventPublisher } from '../../../src/domain/events/IEventPublisher';
import { IStudyTaskRepository } from '../../../src/domain/repositories/IStudyTaskRepository';

describe('Caso de Uso UpdateTaskHandler', () => {
  it('deve atualizar o status da tarefa e disparar o evento TaskStatusChangedEvent via IEventPublisher', async () => {
    const existingTask = new StudyTask({
      id: 'tarefa-sql-101',
      groupId: 'grupo-banco-dados-02',
      title: 'Configurar banco de dados no Azure SQL',
      description: 'Criar schema Prisma e validar conexão segura',
      assignee: 'Lara Bredow',
      status: 'TODO',
      priority: 'HIGH',
      estimatedHours: 3
    });

    const mockRepository: IStudyTaskRepository = {
      create: vi.fn(),
      findById: vi.fn(async () => existingTask),
      findByGroupId: vi.fn(),
      findByStatus: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(async (task: StudyTask) => task),
      delete: vi.fn()
    };

    const mockEventPublisher: IEventPublisher = {
      publish: vi.fn(async () => undefined)
    };

    const handler = new UpdateTaskHandler(mockRepository, mockEventPublisher);

    const updatedTask = await handler.execute('tarefa-sql-101', {
      status: 'DOING',
      estimatedHours: 5
    });

    expect(updatedTask.status).toBe('DOING');
    expect(updatedTask.estimatedHours).toBe(5);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(1);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      'task.status.changed',
      expect.objectContaining({
        taskId: 'tarefa-sql-101',
        groupId: 'grupo-banco-dados-02',
        oldStatus: 'TODO',
        newStatus: 'DOING',
        estimatedHours: 5
      })
    );
  });

  it('deve atualizar apenas os dados da tarefa sem publicar evento quando o status não mudar', async () => {
    const existingTask = new StudyTask({
      id: 'tarefa-sql-102',
      groupId: 'grupo-engenharia-03',
      title: 'Escrever testes de integração da API',
      description: 'Validar rotas Express e contratos de resposta',
      assignee: 'João Gabriel',
      status: 'DOING',
      priority: 'MEDIUM',
      estimatedHours: 4
    });

    const mockRepository: IStudyTaskRepository = {
      create: vi.fn(),
      findById: vi.fn(async () => existingTask),
      findByGroupId: vi.fn(),
      findByStatus: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(async (task: StudyTask) => task),
      delete: vi.fn()
    };

    const mockEventPublisher: IEventPublisher = {
      publish: vi.fn(async () => undefined)
    };

    const handler = new UpdateTaskHandler(mockRepository, mockEventPublisher);

    const updatedTask = await handler.execute('tarefa-sql-102', {
      title: 'Escrever testes unitários e de arquitetura da API',
      priority: 'HIGH'
    });

    expect(updatedTask.title).toBe('Escrever testes unitários e de arquitetura da API');
    expect(updatedTask.priority).toBe('HIGH');
    expect(updatedTask.status).toBe('DOING');
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it('deve lançar erro em português quando a tarefa não for encontrada para atualização', async () => {
    const mockRepository: IStudyTaskRepository = {
      create: vi.fn(),
      findById: vi.fn(async () => null),
      findByGroupId: vi.fn(),
      findByStatus: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };

    const mockEventPublisher: IEventPublisher = {
      publish: vi.fn()
    };

    const handler = new UpdateTaskHandler(mockRepository, mockEventPublisher);

    await expect(
      handler.execute('id-inexistente', {
        status: 'DONE'
      })
    ).rejects.toThrow('Tarefa de estudo não encontrada para atualização.');

    expect(mockRepository.update).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });
});
