import { mock } from 'jest-mock-extended';
import { ICustomerRepository, ILogger } from 'domain/contracts';
import { CustomerEntity } from 'domain/entities';
import { DeleteCustomerUseCase } from './delete-customer.use-case';
import {
  CustomerNotExistsError,
  CustomerUnexpectedError,
} from 'application/errors';

describe('DeleteCustomerUseCase', () => {
  const logger = mock<ILogger>();
  const customerRepository = mock<ICustomerRepository>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should delete a customer when the customer exists', async () => {
    const existingCustomer = new CustomerEntity({
      id: '123',
      name: 'Existing User',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'existing@example.com',
      phone: '1234567890',
    });

    customerRepository.findById.mockResolvedValue(existingCustomer);

    const useCase = new DeleteCustomerUseCase(logger, customerRepository);

    await useCase.execute({ id: '123' });

    expect(customerRepository.findById).toHaveBeenCalledWith('123');
    expect(customerRepository.delete).toHaveBeenCalledWith(
      'CUSTOMER#123',
      'CUSTOMER#TAXID#42245682840',
    );
    expect(logger.info).toHaveBeenCalledTimes(2);
  });

  it('should throw CustomerNotExistsError when customer is not found', async () => {
    const useCase = new DeleteCustomerUseCase(logger, customerRepository);

    await expect(useCase.execute({ id: '123' })).rejects.toThrow(
      CustomerNotExistsError,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith('123');
    expect(logger.error).toHaveBeenCalledWith(
      'DeleteCustomerUseCase.execute',
      'Error to delete customer.',
      expect.objectContaining({
        error: 'Customer not exists.',
      }),
    );
  });

  it('should throw CustomerUnexpectedError when an unexpected error occurs', async () => {
    const existingCustomer = new CustomerEntity({
      id: '123',
      name: 'Existing User',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'existing@example.com',
      phone: '1234567890',
    });

    customerRepository.findById.mockResolvedValue(existingCustomer);
    customerRepository.delete.mockRejectedValue(new Error('Unexpected error'));

    const useCase = new DeleteCustomerUseCase(logger, customerRepository);

    await expect(useCase.execute({ id: '123' })).rejects.toThrow(
      CustomerUnexpectedError,
    );
    expect(logger.error).toHaveBeenCalledWith(
      'DeleteCustomerUseCase.execute',
      'Error to delete customer.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });
});
