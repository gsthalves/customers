import { ICustomerRepository, IDynamoDB, ILogger } from 'domain/contracts';
import { CustomerRepositoryDynamoDB } from 'infrastructure/repositories';

export const makeCustomerRepository = (
  logger: ILogger,
  dynamoDb: IDynamoDB,
): ICustomerRepository => {
  const { ENV } = process.env;

  if (!ENV) throw new Error('ENV is not defined in env vars.');

  return new CustomerRepositoryDynamoDB(logger, dynamoDb, ENV);
};
