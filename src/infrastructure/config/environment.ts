import dotenv from 'dotenv';

dotenv.config();

export interface EnvironmentConfig {
  port: number;
  databaseUrl: string;
  rabbitMqUrl: string;
}

export const environment: EnvironmentConfig = {
  port: Number(process.env.PORT ?? 3002),
  databaseUrl: process.env.DATABASE_URL ?? '',
  rabbitMqUrl: process.env.RABBITMQ_URL ?? ''
};

