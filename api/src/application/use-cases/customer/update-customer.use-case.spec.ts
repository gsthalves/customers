import { mock } from 'jest-mock-extended';
import { ICustomerRepository, ILogger } from 'domain/contracts';
import { CustomerEntity } from 'domain/entities';
import { UpdateCustomerUseCase } from 'application/use-cases';
import {
  CustomerNotExistsError,
  CustomerUnexpectedError,
} from 'application/errors';

describe('UpdateCustomerUseCase', () => {
  const logger = mock<ILogger>();
  const customerRepository = mock<ICustomerRepository>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update customer and return updated data when valid input is provided', async () => {
    const existingCustomer = new CustomerEntity({
      id: 'customer-id',
      name: 'Old Name',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'customer@example.com',
      phone: '14997065872',
      notes: 'Old notes',
    });

    customerRepository.findById.mockResolvedValue(existingCustomer);

    const input = {
      id: 'customer-id',
      name: 'New Name',
      birthDate: new Date('1990-01-01'),
      phone: '14997065872',
      notes: 'Updated notes',
    };

    const useCase = new UpdateCustomerUseCase(logger, customerRepository);

    const result = await useCase.execute(input);

    expect(customerRepository.findById).toHaveBeenCalledWith(input.id);
    expect(result.name).toBe(input.name);
    expect(result.birthDate).toBe(input.birthDate);
    expect(result.phone).toBe(input.phone);
    expect(result.notes).toBe(input.notes);
    expect(customerRepository.update).toHaveBeenCalledWith(existingCustomer);
    expect(logger.info).toHaveBeenCalledTimes(2);
  });

  it('should throw CustomerNotExistsError when customer with given id is not found', async () => {
    const input = {
      id: 'non-existent-id',
      name: 'New Name',
      birthDate: new Date('1990-01-01'),
      phone: '14997065872',
      notes: 'Updated notes',
    };

    const useCase = new UpdateCustomerUseCase(logger, customerRepository);

    await expect(useCase.execute(input)).rejects.toThrow(
      CustomerNotExistsError,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith(input.id);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalled();
  });

  it('should throw CustomerUnexpectedError when an unexpected error occurs during update', async () => {
    const existingCustomer = new CustomerEntity({
      id: 'customer-id',
      name: 'Old Name',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'customer@example.com',
      phone: '14997065872',
      notes: 'Old notes',
    });

    customerRepository.findById.mockResolvedValue(existingCustomer);
    customerRepository.update.mockRejectedValue(new Error('Unexpected error'));

    const input = {
      id: 'customer-id',
      name: 'New Name',
      birthDate: new Date('1990-01-01'),
      phone: '14997065872',
      notes: 'Updated notes',
    };

    const useCase = new UpdateCustomerUseCase(logger, customerRepository);

    await expect(useCase.execute(input)).rejects.toThrow(
      CustomerUnexpectedError,
    );
    expect(logger.error).toHaveBeenCalled();
  });
});
