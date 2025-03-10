export class CustomerNotExistsError extends Error {
  private readonly statusCode: number;
  private readonly internalError: string;

  constructor(message: string, stack?: string) {
    super(message);

    this.name = 'CustomerNotExistsError';
    this.stack = stack;
    this.statusCode = 404;
    this.internalError = 'CUSTOMERNOTEXISTSERROR404';
  }
}
