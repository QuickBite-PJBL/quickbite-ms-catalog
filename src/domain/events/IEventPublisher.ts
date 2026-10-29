export interface DomainEvent<T = unknown> {
  eventName: string;
  occurredOn: Date;
  payload: T;
}

export interface IEventPublisher {
  publish<T>(eventName: string, payload: T): Promise<void>;
}

