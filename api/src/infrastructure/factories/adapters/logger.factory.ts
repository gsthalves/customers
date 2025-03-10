import { ILogger } from 'domain/contracts';
import { WinstonLogger } from 'infrastructure/adapters';

let loggerInstance: ILogger;

export const makeLogger = (): ILogger => {
  if (loggerInstance) return loggerInstance;

  const { APP_NAME, APP_VERSION, LOG_LEVEL } = process.env;

  if (!APP_NAME) throw new Error('APP_NAME is not defined in env vars.');
  if (!APP_VERSION) throw new Error('APP_VERSION is not defined in env vars.');
  if (!LOG_LEVEL) throw new Error('LOG_LEVEL is not defined in env vars.');

  loggerInstance = new WinstonLogger(APP_NAME, APP_VERSION, LOG_LEVEL);

  return loggerInstance;
};
