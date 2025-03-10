import { mock } from 'jest-mock-extended';
import { ICustomerRepository, ILogger } from 'domain/contracts';
import { CustomerEntity } from 'domain/entities';
import { GetCustomerUseCase } from 'application/use-cases';
import {
  CustomerNotExistsError,
  CustomerUnexpectedError,
} from 'application/errors';

describe('GetCustomerUseCase', () => {
  const logger = mock<ILogger>();
  const customerRepository = mock<ICustomerRepository>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return customer data when valid ID is provided', async () => {
    const existingCustomer = new CustomerEntity({
      id: 'valid-id',
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phone: '1234567890',
      notes: 'Some notes',
    });

    customerRepository.findById.mockResolvedValue(existingCustomer);

    const useCase = new GetCustomerUseCase(logger, customerRepository);

    const result = await useCase.execute({ id: 'valid-id' });

    expect(customerRepository.findById).toHaveBeenCalledWith('valid-id');
    expect(result).toEqual({
      id: 'valid-id',
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: existingCustomer.birthDate,
      email: 'john@example.com',
      phone: '1234567890',
      notes: 'Some notes',
    });
  });

  it('should throw CustomerNotExistsError when customer ID is not found', async () => {
    const useCase = new GetCustomerUseCase(logger, customerRepository);

    await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(
      CustomerNotExistsError,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('should throw CustomerUnexpectedError when repository throws unexpected error', async () => {
    customerRepository.findById.mockRejectedValue(
      new Error('Unexpected error'),
    );

    const useCase = new GetCustomerUseCase(logger, customerRepository);

    await expect(useCase.execute({ id: 'id' })).rejects.toThrow(
      CustomerUnexpectedError,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith('id');
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
