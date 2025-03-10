import { Client } from '@opensearch-project/opensearch';
import { Config } from 'aws-sdk';
import createAwsOpensearchConnector from 'aws-opensearch-connector';
import {
  DeleteOpenSearchInput,
  ILogger,
  IOpenSearch,
  IndexOpenSearchInput,
  SearchOpenSearchInput,
} from 'domain/contracts';
import { DatabaseUnexpectedError } from 'infrastructure/errors';

export class OpenSearch implements IOpenSearch {
  private client: Client;

  constructor(
    private readonly logger: ILogger,
    region: string,
    domain: string,
  ) {
    const config = new Config({ region });
    const connector = createAwsOpensearchConnector(config);

    this.client = new Client({
      ...connector,
      node: domain,
    });
  }

  async index(input: IndexOpenSearchInput): Promise<void> {
    this.logger.info('OpenSearch.index', 'Executing index in OpenSearch.');

    try {
      await this.client.index({
        index: input.index,
        id: input.id,
        body: input.document,
      });

      this.logger.info('OpenSearch.index', 'Finished index in OpenSearch.');
    } catch (error) {
      this.logger.error('OpenSearch.index', 'Error index in OpenSearch.', {
        error: error.message,
        stack: error.stack,
      });

      throw new DatabaseUnexpectedError('Error index in OpenSearch.', error);
    }
  }

  async search<T>(input: SearchOpenSearchInput): Promise<T[] | null> {
    this.logger.info('OpenSearch.search', 'Executing search in OpenSearch.');

    try {
      const response = await this.client.search({
        index: input.index,
        body: input.body,
      });

      const result = response.body.hits.hits.map((hit) => hit._source as T);

      this.logger.info(
        'OpenSearch.search',
        'Finished search in OpenSearch.',
        result,
      );

      return result;
    } catch (error) {
      this.logger.error('OpenSearch.search', 'Error search in OpenSearch.', {
        error: error.message,
        stack: error.stack,
      });

      throw new DatabaseUnexpectedError('Error search in OpenSearch.', error);
    }
  }

  async delete(input: DeleteOpenSearchInput): Promise<void> {
    this.logger.info('OpenSearch.delete', 'Executing delete in OpenSearch.');

    try {
      await this.client.delete({
        index: input.index,
        id: input.id,
      });

      this.logger.info('OpenSearch.delete', 'Finished delete in OpenSearch.');
    } catch (error) {
      this.logger.error('OpenSearch.delete', 'Error delete in OpenSearch.', {
        error: error.message,
        stack: error.stack,
      });

      throw new DatabaseUnexpectedError('Error delete in OpenSearch.', error);
    }
  }
}
