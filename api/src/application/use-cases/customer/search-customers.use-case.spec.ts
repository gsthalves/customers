import { mock } from 'jest-mock-extended';
import { ICustomerOpenSearchRepository, ILogger } from 'domain/contracts';
import { CustomerEntity } from 'domain/entities';
import { SearchCustomersUseCase } from 'application/use-cases';
import { CustomerUnexpectedError } from 'application/errors';

describe('SearchCustomerUseCase', () => {
  const logger = mock<ILogger>();
  const customerOpenSearchRepository = mock<ICustomerOpenSearchRepository>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return mapped customer data when customers are found', async () => {
    const searchResponse = [
      new CustomerEntity({
        id: '1',
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '14997065872',
        notes: 'Some notes',
      }),
    ];

    customerOpenSearchRepository.search.mockResolvedValue(searchResponse);

    const useCase = new SearchCustomersUseCase(
      logger,
      customerOpenSearchRepository,
    );

    const result = await useCase.execute({ query: 'John' });

    expect(customerOpenSearchRepository.search).toHaveBeenCalledWith('John');
    expect(result).toEqual([
      {
        id: '1',
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '14997065872',
        notes: 'Some notes',
      },
    ]);
    expect(logger.info).toHaveBeenCalledTimes(2);
  });

  it('should return mapped customer data when customers are not found', async () => {
    customerOpenSearchRepository.search.mockResolvedValue(null);

    const useCase = new SearchCustomersUseCase(
      logger,
      customerOpenSearchRepository,
    );

    const result = await useCase.execute({ query: 'John' });

    expect(customerOpenSearchRepository.search).toHaveBeenCalledWith('John');
    expect(result).toEqual([]);
    expect(logger.info).toHaveBeenCalledTimes(2);
  });

  it('should throw CustomerUnexpectedError when repository throws an error', async () => {
    customerOpenSearchRepository.search.mockRejectedValue(
      new Error('Unexpected error'),
    );

    const useCase = new SearchCustomersUseCase(
      logger,
      customerOpenSearchRepository,
    );

    await expect(useCase.execute({ query: 'John' })).rejects.toThrow(
      CustomerUnexpectedError,
    );
    expect(customerOpenSearchRepository.search).toHaveBeenCalledWith('John');
    expect(logger.error).toHaveBeenCalledWith(
      'SearchCustomersUseCase.execute',
      'Error to search customers.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });
});
