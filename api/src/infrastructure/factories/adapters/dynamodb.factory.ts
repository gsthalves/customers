import { IDynamoDB, ILogger } from 'domain/contracts';
import { DynamoDB } from 'infrastructure/adapters';

export const makeDynamoDB = (logger: ILogger): IDynamoDB => {
  const { REGION } = process.env;

  if (!REGION) throw new Error('REGION is not defined in env vars.');

  return new DynamoDB(logger, REGION);
};
