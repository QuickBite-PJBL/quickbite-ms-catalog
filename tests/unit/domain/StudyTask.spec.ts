import { describe, it, expect } from 'vitest';
import { StudyTask } from '../../../src/domain/entities/StudyTask';

describe('Entidade de Domínio StudyTask', () => {
  it('deve criar uma tarefa de estudo válida com status padrão TODO', () => {
    const task = new StudyTask({
      groupId: 'grupo-arquitetura-01',
      title: 'Resolver lista de arquitetura cloud',
      description: 'Revisar conceitos de microsserviços, mensageria com RabbitMQ e banco SQL no Azure',
      assignee: 'Giuseppe Filippin',
      priority: 'HIGH',
      estimatedHours: 4
    });

    expect(task.id).toBeDefined();
    expect(task.groupId).toBe('grupo-arquitetura-01');
    expect(task.title).toBe('Resolver lista de arquitetura cloud');
    expect(task.description).toBe('Revisar conceitos de microsserviços, mensageria com RabbitMQ e banco SQL no Azure');
    expect(task.assignee).toBe('Giuseppe Filippin');
    expect(task.status).toBe('TODO');
    expect(task.priority).toBe('HIGH');
    expect(task.estimatedHours).toBe(4);
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('deve lançar erro quando o título tiver menos de 3 caracteres', () => {
    expect(() => {
      new StudyTask({
        groupId: 'grupo-banco-dados-02',
        title: 'AB',
        description: 'Modelar tabelas relacionais para o quadro Kanban de estudos',
        assignee: 'Lara Bredow',
        priority: 'MEDIUM',
        estimatedHours: 2
      });
    }).toThrowError('O título da tarefa de estudo deve ter pelo menos 3 caracteres.');
  });

  it('deve lançar erro quando a carga horária estimada for menor ou igual a zero', () => {
    expect(() => {
      new StudyTask({
        groupId: 'grupo-engenharia-03',
        title: 'Implementar testes automatizados com Vitest',
        description: 'Garantir cobertura das regras de negócio do domínio',
        assignee: 'João Gabriel',
        priority: 'HIGH',
        estimatedHours: 0
      });
    }).toThrowError('A carga horária estimada deve ser maior que zero.');

    expect(() => {
      new StudyTask({
        groupId: 'grupo-engenharia-03',
        title: 'Implementar testes automatizados com Vitest',
        description: 'Garantir cobertura das regras de negócio do domínio',
        assignee: 'João Gabriel',
        priority: 'LOW',
        estimatedHours: -3
      });
    }).toThrowError('A carga horária estimada deve ser maior que zero.');
  });

  it('deve lançar erro quando o identificador do grupo ou responsável estiverem vazios', () => {
    expect(() => {
      new StudyTask({
        groupId: '   ',
        title: 'Configurar pipeline de integração contínua',
        description: 'Preparar workflow de validação e build',
        assignee: 'Viktor Trawinski',
        priority: 'MEDIUM',
        estimatedHours: 3
      });
    }).toThrowError('O identificador do grupo de estudo é obrigatório.');

    expect(() => {
      new StudyTask({
        groupId: 'grupo-devops-04',
        title: 'Configurar pipeline de integração contínua',
        description: 'Preparar workflow de validação e build',
        assignee: '',
        priority: 'MEDIUM',
        estimatedHours: 3
      });
    }).toThrowError('O responsável pela tarefa de estudo é obrigatório.');
  });

  it('deve alterar o status da tarefa no quadro Kanban e retornar o status anterior e o novo', () => {
    const task = new StudyTask({
      groupId: 'grupo-arquitetura-01',
      title: 'Resolver lista de arquitetura cloud',
      description: 'Estudo dirigido sobre padrões de resiliência e escalabilidade',
      assignee: 'Giuseppe Filippin',
      priority: 'HIGH',
      estimatedHours: 5
    });

    const firstTransition = task.changeStatus('DOING');

    expect(firstTransition).toEqual({
      oldStatus: 'TODO',
      newStatus: 'DOING'
    });
    expect(task.status).toBe('DOING');

    const secondTransition = task.changeStatus('DONE');

    expect(secondTransition).toEqual({
      oldStatus: 'DOING',
      newStatus: 'DONE'
    });
    expect(task.status).toBe('DONE');
  });
});

