import { IEventPublisher } from '../../domain/events/IEventPublisher';

export class ConsoleEventPublisher implements IEventPublisher {
  public async publish<T>(eventName: string, payload: T): Promise<void> {
    console.log(`Evento publicado [${eventName}]:`, JSON.stringify(payload));
  }
}
