import winston from 'winston';
import { WinstonLogger } from 'infrastructure/adapters';

describe('WinstonLogger', () => {
  const appName = 'customers';
  const appVersion = '1.0.0';
  const logLevel = 'info';

  it('should create a winston logger with the provided parameters', () => {
    const createLoggerSpy = jest.spyOn(winston, 'createLogger');

    const logger = new WinstonLogger(appName, appVersion, logLevel);

    expect(createLoggerSpy).toHaveBeenCalled();
    expect(createLoggerSpy).toHaveBeenCalledTimes(1);
    expect(logger).toBeInstanceOf(WinstonLogger);

    createLoggerSpy.mockRestore();
  });

  it('should log message with INFO level and correct format when info method is called', () => {
    const context = 'Context';
    const message = 'Log message';
    const meta = { meta: 'meta-value' };

    const logger = new WinstonLogger(appName, appVersion, logLevel);
    const infoSpy = jest.spyOn(logger['logger'], 'info');

    logger.info(context, message, meta);

    expect(infoSpy).toHaveBeenCalledWith(`[${context}] - ${message}`, meta);

    infoSpy.mockRestore();
  });

  it('should log error messages with ERROR level and correct format', () => {
    const context = 'Context';
    const message = 'Log message';
    const meta = { meta: 'meta-value' };

    const logger = new WinstonLogger(appName, appVersion, logLevel);
    const errorSpy = jest.spyOn(logger['logger'], 'error');

    logger.error(context, message, meta);

    expect(errorSpy).toHaveBeenCalledWith(`[${context}] - ${message}`, meta);

    errorSpy.mockRestore();
  });
});
