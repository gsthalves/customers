export class BusinessValidationError extends Error {
  private readonly statusCode: number;
  private readonly internalError: string;

  constructor(message: string, stack?: string) {
    super(message);

    this.name = 'BusinessValidationError';
    this.stack = stack;
    this.statusCode = 400;
    this.internalError = 'BUSINESSVALIDATIONERROR400';
  }
}
