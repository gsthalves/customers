import { mock } from 'jest-mock-extended';
import { Client } from '@opensearch-project/opensearch';
import { Config } from 'aws-sdk';
import createAwsOpensearchConnector from 'aws-opensearch-connector';
import { ILogger } from 'domain/contracts';
import { OpenSearch } from 'infrastructure/adapters';
import { DatabaseUnexpectedError } from 'infrastructure/errors';

const mockClient = {
  index: jest.fn().mockResolvedValue({}),
  search: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
};

jest.mock('@opensearch-project/opensearch', () => ({
  Client: jest.fn().mockImplementation(() => mockClient),
}));

jest.mock('aws-sdk', () => ({
  Config: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('aws-opensearch-connector', () => jest.fn().mockReturnValue({}));

describe('OpenSearch', () => {
  const logger = mock<ILogger>();

  it('should initialize client with valid region and domain', () => {
    new OpenSearch(logger, 'sa-east-1', 'https://domain.com');

    expect(Config).toHaveBeenCalledWith({ region: 'sa-east-1' });
    expect(createAwsOpensearchConnector).toHaveBeenCalled();
    expect(Client).toHaveBeenCalledWith({
      node: 'https://domain.com',
    });
  });

  it('should successfully index a document when valid input is provided', async () => {
    const openSearch = new OpenSearch(
      logger,
      'sa-east-1',
      'https://domain.com',
    );

    const input = {
      index: 'index',
      id: '1',
      document: { key: 'value' },
    };

    await openSearch.index(input);

    expect(mockClient.index).toHaveBeenCalledWith({
      index: 'index',
      id: '1',
      body: { key: 'value' },
    });
    expect(logger.info).toHaveBeenCalledWith(
      'OpenSearch.index',
      'Executing index in OpenSearch.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'OpenSearch.index',
      'Finished index in OpenSearch.',
    );
  });

  it('should return documents as array when search is successful', async () => {
    mockClient.search = jest.fn().mockResolvedValue({
      body: {
        hits: {
          hits: [
            { _source: { id: '1', name: 'Document 1' } },
            { _source: { id: '2', name: 'Document 2' } },
          ],
        },
      },
    });

    const openSearch = new OpenSearch(
      logger,
      'sa-east-1',
      'https://domain.com',
    );

    const searchInput = {
      index: 'index',
      body: {},
    };

    const result = await openSearch.search(searchInput);

    expect(mockClient.search).toHaveBeenCalledWith({
      index: 'index',
      body: {},
    });
    expect(result).toEqual([
      { id: '1', name: 'Document 1' },
      { id: '2', name: 'Document 2' },
    ]);
    expect(logger.info).toHaveBeenCalledWith(
      'OpenSearch.search',
      'Finished search in OpenSearch.',
      [
        { id: '1', name: 'Document 1' },
        { id: '2', name: 'Document 2' },
      ],
    );
  });

  it('should successfully delete a document when valid index and id are provided', async () => {
    const openSearch = new OpenSearch(
      logger,
      'sa-east-1',
      'https://domain.com',
    );

    const input = {
      index: 'index',
      id: 'id',
    };

    await openSearch.delete(input);

    expect(mockClient.delete).toHaveBeenCalledWith({
      index: 'index',
      id: 'id',
    });
    expect(logger.info).toHaveBeenCalledWith(
      'OpenSearch.delete',
      'Executing delete in OpenSearch.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'OpenSearch.delete',
      'Finished delete in OpenSearch.',
    );
  });

  it('should throw DatabaseUnexpectedError when index operation fails', async () => {
    mockClient.index = jest.fn().mockRejectedValue(new Error('Index error'));

    const openSearch = new OpenSearch(
      logger,
      'sa-east-1',
      'https://domain.com',
    );

    const input = {
      index: 'index',
      id: '1',
      document: { key: 'value' },
    };

    await expect(openSearch.index(input)).rejects.toThrow(
      DatabaseUnexpectedError,
    );
    expect(logger.error).toHaveBeenCalledWith(
      'OpenSearch.index',
      'Error index in OpenSearch.',
      expect.objectContaining({
        error: 'Index error',
      }),
    );
  });

  it('should throw DatabaseUnexpectedError when search operation fails', async () => {
    mockClient.search = jest.fn().mockRejectedValue(new Error('Search failed'));

    const openSearch = new OpenSearch(
      logger,
      'sa-east-1',
      'https://domain.com',
    );

    const input = {
      index: 'index',
      body: {},
    };

    await expect(openSearch.search(input)).rejects.toThrow(
      DatabaseUnexpectedError,
    );
    expect(logger.error).toHaveBeenCalledWith(
      'OpenSearch.search',
      'Error search in OpenSearch.',
      expect.objectContaining({
        error: 'Search failed',
      }),
    );
  });

  it('should throw DatabaseUnexpectedError when delete operation fails', async () => {
    mockClient.delete = jest.fn().mockRejectedValue(new Error('Delete failed'));

    const openSearch = new OpenSearch(
      logger,
      'sa-east-1',
      'https://domain.com',
    );

    const input = { index: 'test-index', id: 'test-id' };

    await expect(openSearch.delete(input)).rejects.toThrow(
      DatabaseUnexpectedError,
    );
    expect(logger.error).toHaveBeenCalledWith(
      'OpenSearch.delete',
      'Error delete in OpenSearch.',
      expect.objectContaining({
        error: 'Delete failed',
      }),
    );
  });
});
