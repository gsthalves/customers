import { mock } from 'jest-mock-extended';
import { ILogger, IOpenSearch } from 'domain/contracts';
import { CustomerEntity } from 'domain/entities';
import { CustomerStatus } from 'domain/enums';
import { CustomerOpenSearchRepository } from 'infrastructure/repositories';
import { DatabaseUnexpectedError } from 'infrastructure/errors';

describe('CustomerRepository', () => {
  const logger = mock<ILogger>();
  const openSearch = mock<IOpenSearch>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully index a customer entity in OpenSearch', async () => {
    const repository = new CustomerOpenSearchRepository(logger, openSearch);

    const customerEntity = new CustomerEntity({
      id: 'test-id',
      name: 'John Doe',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Test notes',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repository.index(customerEntity);

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.index',
      'Starting index customer.',
    );

    expect(openSearch.index).toHaveBeenCalledWith({
      index: 'customers',
      id: customerEntity.id,
      document: {
        id: customerEntity.id,
        name: customerEntity.name,
        taxId: customerEntity.taxId,
        birthDate: customerEntity.birthDate.toISOString(),
        email: customerEntity.email,
        phone: customerEntity.phone,
        status: customerEntity.status,
        notes: customerEntity.notes,
        createdAt: customerEntity.createdAt.toISOString(),
        updatedAt: customerEntity.updatedAt.toISOString(),
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.index',
      'Finished index customer.',
    );
  });

  it('should return a list of customer entities when a valid query string is provided', async () => {
    openSearch.search.mockResolvedValue([
      {
        id: 'test-id',
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: '1990-01-01T00:00:00.000Z',
        email: 'john@example.com',
        phone: '14997065872',
        status: 'ACTIVE',
        notes: 'Test notes',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      },
    ]);

    const repository = new CustomerOpenSearchRepository(logger, openSearch);

    const result = await repository.search('John');

    expect(openSearch.search).toHaveBeenCalledWith({
      index: 'customers',
      body: {
        query: {
          query_string: {
            query: '*John*',
            fields: ['name', 'taxId', 'email', 'phone', 'notes', 'status'],
            allow_leading_wildcard: true,
            analyze_wildcard: true,
            default_operator: 'OR',
          },
        },
      },
    });
    expect(result).toEqual([
      new CustomerEntity({
        id: 'test-id',
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '14997065872',
        status: CustomerStatus.ACTIVE,
        notes: 'Test notes',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-02T00:00:00.000Z'),
      }),
    ]);
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.search',
      'Starting search customer.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.search',
      'Finished search customer.',
    );
  });

  it('should successfully delete a customer by ID in OpenSearch', async () => {
    const repository = new CustomerOpenSearchRepository(logger, openSearch);

    const customerId = 'test-id';

    await repository.delete(customerId);

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.delete',
      'Starting delete customer.',
    );

    expect(openSearch.delete).toHaveBeenCalledWith({
      index: 'customers',
      id: customerId,
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.delete',
      'Finished delete customer.',
    );
  });

  it('should return null when no customers match the search query', async () => {
    const repository = new CustomerOpenSearchRepository(logger, openSearch);

    const query = 'nonexistent-customer';

    const result = await repository.search(query);

    expect(openSearch.search).toHaveBeenCalledWith({
      index: 'customers',
      body: {
        query: {
          query_string: {
            query: `*${query}*`,
            fields: ['name', 'taxId', 'email', 'phone', 'notes', 'status'],
            allow_leading_wildcard: true,
            analyze_wildcard: true,
            default_operator: 'OR',
          },
        },
      },
    });
    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.search',
      'Starting search customer.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.search',
      'Customer not found.',
    );
  });

  it('should log error and throw DatabaseUnexpectedError when indexing fails', async () => {
    openSearch.index.mockRejectedValue(new Error('Indexing failed'));

    const repository = new CustomerOpenSearchRepository(logger, openSearch);

    const customerEntity = new CustomerEntity({
      id: 'test-id',
      name: 'John Doe',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Test notes',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(repository.index(customerEntity)).rejects.toThrow(
      DatabaseUnexpectedError,
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.index',
      'Starting index customer.',
    );

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.index',
      'Error index customer.',
      {
        error: 'Indexing failed',
        stack: expect.any(String),
      },
    );
  });

  it('should throw DatabaseUnexpectedError when search operation fails', async () => {
    openSearch.search.mockRejectedValue(new Error('Search failed'));

    const repository = new CustomerOpenSearchRepository(logger, openSearch);

    await expect(repository.search('query')).rejects.toThrow(
      DatabaseUnexpectedError,
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.search',
      'Starting search customer.',
    );

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.search',
      'Error search customer.',
      expect.objectContaining({
        error: 'Search failed',
      }),
    );
  });

  it('should log error and throw DatabaseUnexpectedError when delete operation fails', async () => {
    openSearch.delete.mockRejectedValue(new Error('Delete failed'));

    const repository = new CustomerOpenSearchRepository(logger, openSearch);

    const customerId = 'test-id';

    await expect(repository.delete(customerId)).rejects.toThrow(
      DatabaseUnexpectedError,
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.delete',
      'Starting delete customer.',
    );

    expect(openSearch.delete).toHaveBeenCalledWith({
      index: 'customers',
      id: customerId,
    });

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerOpenSearchRepository.delete',
      'Error delete customer.',
      {
        error: 'Delete failed',
        stack: expect.any(String),
      },
    );
  });
});
