import { ILogger } from 'domain/contracts/adapters';
import winston from 'winston';

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor(appName: string, appVersion: string, logLevel: string) {
    console.log('Creating new instance of winston logger');

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.json(),
      defaultMeta: { app: appName, version: appVersion },
      transports: [new winston.transports.Console()],
    });
  }

  info(context: string, message: string, meta?: any): void {
    this.logger.info(`[${context}] - ${message}`, meta);
  }

  error(context: string, message: string, meta: any): void {
    this.logger.error(`[${context}] - ${message}`, meta);
  }
}
