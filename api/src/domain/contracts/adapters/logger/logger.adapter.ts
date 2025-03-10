export abstract class ILogger {
  abstract info(context: string, message: string, meta?: any): void;
  abstract error(context: string, message: string, meta?: any): void;
}
