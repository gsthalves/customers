import { ILogger, IOpenSearch } from 'domain/contracts';
import { OpenSearch } from 'infrastructure/adapters';

export const makeOpenSearch = (logger: ILogger): IOpenSearch => {
  const { REGION, OPENSEARCH_DOMAIN_ENDPOINT } = process.env;

  if (!REGION) throw new Error('REGION is not defined in env vars.');
  if (!OPENSEARCH_DOMAIN_ENDPOINT)
    throw new Error('OPENSEARCH_DOMAIN_ENDPOINT is not defined in env vars.');

  return new OpenSearch(logger, REGION, OPENSEARCH_DOMAIN_ENDPOINT);
};
