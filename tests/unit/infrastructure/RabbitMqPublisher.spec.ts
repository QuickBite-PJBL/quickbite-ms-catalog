import { describe, expect, it, vi } from 'vitest';
import { RabbitMqPublisher } from '../../../src/infrastructure/messaging/RabbitMqPublisher';

describe('Publicador de Eventos RabbitMqPublisher', () => {
  it('deve operar em modo de fallback seguro com log em português quando a URL do RabbitMQ estiver vazia', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const publisher = new RabbitMqPublisher('');

    await expect(
      publisher.publish('task.status.changed', {
        taskId: 'tarefa-01',
        groupId: 'grupo-arquitetura-01',
        title: 'Resolver lista de arquitetura cloud',
        assignee: 'Giuseppe Filippin',
        oldStatus: 'TODO',
        newStatus: 'DOING',
        priority: 'HIGH',
        estimatedHours: 4,
        occurredAt: new Date().toISOString()
      })
    ).resolves.toBeUndefined();

    expect(warnSpy).toHaveBeenCalledWith(
      'URL do RabbitMQ não configurada. Operando em modo de fallback local para publicação de eventos.'
    );
    expect(logSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('deve acionar fallback seguro sem quebrar a aplicação quando o broker estiver indisponível', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const publisher = new RabbitMqPublisher('amqp:broker-indisponivel');

    await expect(
      publisher.publish('task.status.changed', {
        taskId: 'tarefa-02',
        groupId: 'grupo-banco-dados-02',
        title: 'Modelar banco no Azure SQL',
        assignee: 'Lara Bredow',
        oldStatus: 'DOING',
        newStatus: 'DONE',
        priority: 'MEDIUM',
        estimatedHours: 3,
        occurredAt: new Date().toISOString()
      })
    ).resolves.toBeUndefined();

    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
