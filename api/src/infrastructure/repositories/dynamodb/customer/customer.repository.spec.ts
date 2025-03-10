import { mock } from 'jest-mock-extended';
import { IDynamoDB, ILogger } from 'domain/contracts';
import { CustomerEntity } from 'domain/entities';
import { CustomerStatus } from 'domain/enums';
import { CustomerRepositoryDynamoDB } from 'infrastructure/repositories';

describe('CustomerRepository', () => {
  const logger = mock<ILogger>();
  const dynamoDB = mock<IDynamoDB>();
  const env = 'dev';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a customer in DynamoDB successfully', async () => {
    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const customer = new CustomerEntity({
      id: '123',
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phone: '1234567890',
      status: CustomerStatus.ACTIVE,
      notes: 'Some notes',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repository.create(customer);

    expect(dynamoDB.put).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      item: {
        PK: customer.pk,
        SK: customer.sk,
        name: customer.name,
        taxId: customer.taxId,
        birthDate: customer.birthDate.toISOString(),
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        notes: customer.notes,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString(),
      },
    });

    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should update a customer in DynamoDB successfully', async () => {
    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const customer = new CustomerEntity({
      id: '123',
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phone: '1234567890',
      status: CustomerStatus.ACTIVE,
      notes: 'Some notes',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repository.update(customer);

    expect(dynamoDB.update).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      key: {
        PK: customer.pk,
        SK: customer.sk,
      },
      updateExpression:
        'SET #name = :name, birthDate = :birthDate, phone = :phone, notes = :notes, updatedAt = :updatedAt',
      expressionAttributeNames: {
        '#name': 'name',
      },
      expressionAttributeValues: {
        ':name': customer.name,
        ':birthDate': customer.birthDate.toISOString(),
        ':phone': customer.phone,
        ':notes': customer.notes,
        ':updatedAt': customer.updatedAt.toISOString(),
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.update',
      'Starting update customer.',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.update',
      'Finished update customer.',
    );
  });

  it('should return CustomerEntity when customer is found by ID', async () => {
    const existingCustomers = [
      new CustomerEntity({
        id: '123',
        name: 'John Doe',
        taxId: '12345678901',
        birthDate: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '1234567890',
        status: CustomerStatus.ACTIVE,
        notes: 'Some notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    dynamoDB.query.mockResolvedValue(existingCustomers);

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const result = await repository.findById('123');

    expect(dynamoDB.query).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      query: {
        conditionExpression: 'PK = :id',
        expressionAttributeValues: {
          ':id': 'CUSTOMER#123',
        },
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findById',
      'Starting find customer by id.',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findById',
      'Finished find customer by id.',
    );

    expect(result).toBeInstanceOf(CustomerEntity);
    expect(result?.name).toBe('John Doe');
  });

  it('should return a CustomerEntity when a customer is found by taxId', async () => {
    const existingCustomers = [
      new CustomerEntity({
        id: '123',
        name: 'John Doe',
        taxId: '12345678901',
        birthDate: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '1234567890',
        status: CustomerStatus.ACTIVE,
        notes: 'Some notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    dynamoDB.query.mockResolvedValue(existingCustomers);

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const taxId = '12345678901';

    const result = await repository.findByTaxId(taxId);

    expect(dynamoDB.query).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      query: {
        indexName: 'taxId-index',
        conditionExpression: 'taxId = :taxId',
        expressionAttributeValues: {
          ':taxId': taxId,
        },
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByTaxId',
      'Starting find customer by taxId.',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByTaxId',
      'Finished find customer by taxId.',
    );
    expect(result).toBeInstanceOf(CustomerEntity);
    expect(result?.taxId).toBe(taxId);
  });

  it('should return CustomerEntity when customer is found by email', async () => {
    const existingCustomers = [
      new CustomerEntity({
        id: '123',
        name: 'John Doe',
        taxId: '12345678901',
        birthDate: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '1234567890',
        status: CustomerStatus.ACTIVE,
        notes: 'Some notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    dynamoDB.query.mockResolvedValue(existingCustomers);

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const email = 'john@example.com';

    const result = await repository.findByEmail(email);

    expect(dynamoDB.query).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      query: {
        indexName: 'email-index',
        conditionExpression: 'email = :email',
        expressionAttributeValues: {
          ':email': email,
        },
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByEmail',
      'Starting find customer by email.',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByEmail',
      'Finished find customer by email.',
    );

    expect(result).toBeInstanceOf(CustomerEntity);
    expect(result?.email).toBe(email);
  });

  it('should delete a customer from DynamoDB successfully', async () => {
    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const pk = 'CUSTOMER#123';
    const sk = 'CUSTOMER#TAXID#12345678901';

    await repository.delete(pk, sk);

    expect(dynamoDB.delete).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      key: {
        PK: pk,
        SK: sk,
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.delete',
      'Starting delete customer.',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.delete',
      'Finished delete customer.',
    );
  });

  it('should throw error when DynamoDB put operation fails', async () => {
    dynamoDB.put.mockRejectedValue(new Error('Unexpected error'));

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const customer = new CustomerEntity({
      id: '123',
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phone: '1234567890',
      status: CustomerStatus.ACTIVE,
      notes: 'Some notes',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(repository.create(customer)).rejects.toThrow(
      'Unexpected error',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.create',
      'Starting create customer.',
    );

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.create',
      'Error creating customer.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });

  it('should throw error when DynamoDB update operation fails', async () => {
    dynamoDB.update.mockRejectedValue(new Error('Unexpected error'));

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const customer = new CustomerEntity({
      id: '123',
      name: 'John Doe',
      taxId: '12345678901',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phone: '1234567890',
      status: CustomerStatus.ACTIVE,
      notes: 'Some notes',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(repository.update(customer)).rejects.toThrow(
      'Unexpected error',
    );

    expect(dynamoDB.update).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      key: {
        PK: customer.pk,
        SK: customer.sk,
      },
      updateExpression:
        'SET #name = :name, birthDate = :birthDate, phone = :phone, notes = :notes, updatedAt = :updatedAt',
      expressionAttributeNames: {
        '#name': 'name',
      },
      expressionAttributeValues: {
        ':name': customer.name,
        ':birthDate': customer.birthDate.toISOString(),
        ':phone': customer.phone,
        ':notes': customer.notes,
        ':updatedAt': customer.updatedAt.toISOString(),
      },
    });

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.update',
      'Error creating customer.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });

  it('should throw error when DynamoDB findById operation fails', async () => {
    dynamoDB.query.mockRejectedValue(new Error('Unexpected error'));

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const id = '123';

    await expect(repository.findById(id)).rejects.toThrow('Unexpected error');

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findById',
      'Starting find customer by id.',
    );

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findById',
      'Error find customer by id.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });

  it('should throw error when DynamoDB findByTaxId operation fails', async () => {
    dynamoDB.query.mockRejectedValue(new Error('Unexpected error'));

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const taxId = '12345678901';

    await expect(repository.findByTaxId(taxId)).rejects.toThrow(
      'Unexpected error',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByTaxId',
      'Starting find customer by taxId.',
    );

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByTaxId',
      'Error find customer by taxId.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });

  it('should throw error when DynamoDB findByEmail operation fails', async () => {
    dynamoDB.query.mockRejectedValue(new Error('Unexpected error'));

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const email = 'john@example.com';

    await expect(repository.findByEmail(email)).rejects.toThrow(
      'Unexpected error',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByEmail',
      'Starting find customer by email.',
    );

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByEmail',
      'Error find customer by email.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });

  it('should throw error when DynamoDB delete operation fails', async () => {
    dynamoDB.delete.mockRejectedValue(new Error('Unexpected error'));

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const pk = 'CUSTOMER#123';
    const sk = 'CUSTOMER#TAXID#12345678901';

    await expect(repository.delete(pk, sk)).rejects.toThrow('Unexpected error');

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.delete',
      'Starting delete customer.',
    );

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.delete',
      'Error delete customer.',
      expect.objectContaining({
        error: 'Unexpected error',
      }),
    );
  });

  it("should return null when findById doesn't find a matching customer", async () => {
    dynamoDB.query.mockResolvedValue(null);

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const customerId = '123';

    const result = await repository.findById(customerId);

    expect(result).toBeNull();

    expect(dynamoDB.query).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      query: {
        conditionExpression: 'PK = :id',
        expressionAttributeValues: {
          ':id': `CUSTOMER#${customerId}`,
        },
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findById',
      'Starting find customer by id.',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findById',
      'Finished find customer by id.',
    );
  });

  it('should return null when no customer is found by taxId', async () => {
    dynamoDB.query.mockResolvedValue(null);

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const taxId = 'nonexistent-tax-id';

    const result = await repository.findByTaxId(taxId);

    expect(result).toBeNull();
    expect(dynamoDB.query).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      query: {
        indexName: 'taxId-index',
        conditionExpression: 'taxId = :taxId',
        expressionAttributeValues: {
          ':taxId': taxId,
        },
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByTaxId',
      'Starting find customer by taxId.',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByTaxId',
      'Finished find customer by taxId.',
    );
  });

  it('should return null when no customer is found by email', async () => {
    dynamoDB.query.mockResolvedValue(null);

    const repository = new CustomerRepositoryDynamoDB(logger, dynamoDB, env);

    const email = 'nonexistent@example.com';

    const result = await repository.findByEmail(email);

    expect(result).toBeNull();

    expect(dynamoDB.query).toHaveBeenCalledWith({
      tableName: 'customers-dev',
      query: {
        indexName: 'email-index',
        conditionExpression: 'email = :email',
        expressionAttributeValues: {
          ':email': email,
        },
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByEmail',
      'Starting find customer by email.',
    );

    expect(logger.info).toHaveBeenCalledWith(
      'CustomerRepositoryDynamoDB.findByEmail',
      'Finished find customer by email.',
    );
  });
});
