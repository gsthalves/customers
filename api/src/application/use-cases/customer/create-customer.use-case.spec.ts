import { mock } from 'jest-mock-extended';
import { ICustomerRepository, ILogger } from 'domain/contracts';
import { CreateCustomerUseCase } from 'application/use-cases';
import {
  CustomerEmailAlreadExistsError,
  CustomerTaxIdAlreadExistsError,
  CustomerUnexpectedError,
} from 'application/errors';
import { CustomerEntity } from 'domain/entities';

describe('CreateCustomerUseCase', () => {
  const logger = mock<ILogger>();
  const customerRepository = mock<ICustomerRepository>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a customer successfully when all input data is valid', async () => {
    const createCustomerUseCase = new CreateCustomerUseCase(
      logger,
      customerRepository,
    );

    const input = {
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      phone: '1234567890',
      notes: 'Some notes',
    };

    const result = await createCustomerUseCase.execute(input);

    expect(customerRepository.findByTaxId).toHaveBeenCalledWith(input.taxId);
    expect(customerRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(customerRepository.create).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        name: input.name,
        taxId: input.taxId,
        birthDate: input.birthDate,
        email: input.email,
        phone: input.phone,
        notes: input.notes,
      }),
    );
    expect(result.id).toBeDefined();
    expect(logger.info).toHaveBeenCalledTimes(2);
  });

  it('should throw CustomerTaxIdAlreadExistsError when tax ID already exists', async () => {
    const existingCustomer = new CustomerEntity({
      name: 'Existing User',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'existing@example.com',
      phone: '1234567890',
    });

    customerRepository.findByTaxId.mockResolvedValue(existingCustomer);

    const createCustomerUseCase = new CreateCustomerUseCase(
      logger,
      customerRepository,
    );

    const input = {
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      phone: '1234567890',
    };

    await expect(createCustomerUseCase.execute(input)).rejects.toThrow(
      CustomerTaxIdAlreadExistsError,
    );
    expect(customerRepository.findByTaxId).toHaveBeenCalledWith(input.taxId);
    expect(customerRepository.findByEmail).not.toHaveBeenCalled();
    expect(customerRepository.create).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });

  it('should throw CustomerEmailAlreadExistsError when email already exists', async () => {
    const existingCustomer = new CustomerEntity({
      name: 'Existing User',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'existing@example.com',
      phone: '1234567890',
    });

    customerRepository.findByEmail.mockResolvedValue(existingCustomer);

    const createCustomerUseCase = new CreateCustomerUseCase(
      logger,
      customerRepository,
    );

    const input = {
      name: 'Jane Doe',
      taxId: '09876543210',
      birthDate: new Date('1992-02-02'),
      email: 'existing@example.com',
      phone: '0987654321',
      notes: 'Some other notes',
    };

    await expect(createCustomerUseCase.execute(input)).rejects.toThrow(
      CustomerEmailAlreadExistsError,
    );
    expect(customerRepository.findByTaxId).toHaveBeenCalledWith(input.taxId);
    expect(customerRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(logger.error).toHaveBeenCalled();
  });

  it('should throw CustomerUnexpectedError when an unexpected error occurs during creation', async () => {
    customerRepository.create.mockRejectedValue(new Error('Unexpected error'));

    const createCustomerUseCase = new CreateCustomerUseCase(
      logger,
      customerRepository,
    );

    const input = {
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      phone: '1234567890',
      notes: 'Some notes',
    };

    await expect(createCustomerUseCase.execute(input)).rejects.toThrow(
      CustomerUnexpectedError,
    );
    expect(logger.error).toHaveBeenCalledWith(
      'CreateCustomerUseCase.execute',
      'Error to create customer.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });
});
