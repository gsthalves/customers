export class CustomerUnexpectedError extends Error {
  private readonly statusCode: number;
  private readonly internalError: string;

  constructor(message: string, stack?: string) {
    super(message);

    this.name = 'CustomerUnexpectedError';
    this.stack = stack;
    this.statusCode = 500;
    this.internalError = 'CUSTOMERUNEXPECTEDERROR500';
  }
}
