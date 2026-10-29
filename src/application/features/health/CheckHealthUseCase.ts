export interface HealthStatusOutput {
  service: string;
  status: string;
  message: string;
  timestamp: string;
}

export class CheckHealthUseCase {
  public execute(): HealthStatusOutput {
    return {
      service: 'study-groups-ms-sql',
      status: 'ATIVO',
      message: 'Microsserviço de Quadro Kanban e Tarefas de Estudo operando normalmente.',
      timestamp: new Date().toISOString()
    };
  }
}

