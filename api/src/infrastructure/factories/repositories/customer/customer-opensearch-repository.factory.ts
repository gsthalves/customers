import {
  ICustomerOpenSearchRepository,
  ILogger,
  IOpenSearch,
} from 'domain/contracts';
import { CustomerOpenSearchRepository } from 'infrastructure/repositories';

export const makeCustomerOpenSearchRepository = (
  logger: ILogger,
  openSearch: IOpenSearch,
): ICustomerOpenSearchRepository => {
  const { APP_NAME } = process.env;

  if (!APP_NAME) throw new Error('APP_NAME is not defined in env vars.');

  return new CustomerOpenSearchRepository(logger, openSearch);
};
