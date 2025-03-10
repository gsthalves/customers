export class CustomerTaxIdAlreadExistsError extends Error {
  private readonly statusCode: number;
  private readonly internalError: string;

  constructor(message: string, stack?: string) {
    super(message);

    this.name = 'CustomerTaxIdAlreadExistsError';
    this.stack = stack;
    this.statusCode = 409;
    this.internalError = 'CUSTOMERTAXIDALREADEXISTSERROR409';
  }
}
