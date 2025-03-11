import { mock } from 'jest-mock-extended';
import { ICustomerOpenSearchRepository, ILogger } from 'domain/contracts';
import { CustomerDynamoDBStreamUseCase } from 'application/use-cases';

describe('CustomerDynamoDBStreamUseCase', () => {
  const logger = mock<ILogger>();
  const customerOpenSearchRepository = mock<ICustomerOpenSearchRepository>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should index customer in OpenSearch when processing INSERT event', async () => {
    const useCase = new CustomerDynamoDBStreamUseCase(
      logger,
      customerOpenSearchRepository,
    );

    const input = {
      eventName: 'INSERT',
      keys: { PK: { S: 'CUSTOMER#123' } },
      newData: {
        name: { S: 'John Doe' },
        taxId: { S: '42245682840' },
        birthDate: { S: '2000-01-01' },
        email: { S: 'john@example.com' },
        phone: { S: '1234567890' },
        status: { S: 'ACTIVE' },
        notes: { S: 'Some notes' },
        createdAt: { S: '2023-01-01T00:00:00Z' },
        updatedAt: { S: '2023-01-01T00:00:00Z' },
      },
      oldData: {},
    };

    await useCase.execute(input);

    expect(customerOpenSearchRepository.index).toHaveBeenCalledTimes(1);
    expect(customerOpenSearchRepository.index).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '123',
        props: expect.objectContaining({
          name: 'John Doe',
          taxId: '42245682840',
          email: 'john@example.com',
          phone: '1234567890',
        }),
      }),
    );
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerDynamoDBStreamUseCase.execute',
      'Executing insert customer on OpenSearch.',
    );
  });

  it('should index customer in OpenSearch when processing MODIFY event', async () => {
    const useCase = new CustomerDynamoDBStreamUseCase(
      logger,
      customerOpenSearchRepository,
    );

    const input = {
      eventName: 'MODIFY',
      keys: { PK: { S: 'CUSTOMER#123' } },
      newData: {
        name: { S: 'Jane Doe' },
        taxId: { S: '42245682840' },
        birthDate: { S: '1990-01-01' },
        email: { S: 'jane@example.com' },
        phone: { S: '0987654321' },
        status: { S: 'ACTIVE' },
        notes: { S: 'Updated notes' },
        createdAt: { S: '2023-01-01T00:00:00Z' },
        updatedAt: { S: '2023-01-02T00:00:00Z' },
      },
      oldData: {},
    };

    await useCase.execute(input);

    expect(customerOpenSearchRepository.index).toHaveBeenCalledTimes(1);
    expect(customerOpenSearchRepository.index).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '123',
        props: expect.objectContaining({
          name: 'Jane Doe',
          taxId: '42245682840',
          email: 'jane@example.com',
          phone: '0987654321',
        }),
      }),
    );
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerDynamoDBStreamUseCase.execute',
      'Executing update customer on OpenSearch',
    );
  });

  it('should delete customer from OpenSearch when processing REMOVE event', async () => {
    const useCase = new CustomerDynamoDBStreamUseCase(
      logger,
      customerOpenSearchRepository,
    );

    const input = {
      eventName: 'REMOVE',
      keys: { PK: { S: 'CUSTOMER#123' } },
      newData: {},
      oldData: {
        name: { S: 'John Doe' },
        taxId: { S: '42245682840' },
        birthDate: { S: '2000-01-01' },
        email: { S: 'john@example.com' },
        phone: { S: '1234567890' },
        status: { S: 'ACTIVE' },
        notes: { S: 'Some notes' },
        createdAt: { S: '2023-01-01T00:00:00Z' },
        updatedAt: { S: '2023-01-01T00:00:00Z' },
      },
    };

    await useCase.execute(input);

    expect(customerOpenSearchRepository.delete).toHaveBeenCalledTimes(1);
    expect(customerOpenSearchRepository.delete).toHaveBeenCalledWith('123');
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerDynamoDBStreamUseCase.execute',
      'Executing delete customer on OpenSearch',
    );
  });

  it('should log info message when receiving unknown event type', async () => {
    const useCase = new CustomerDynamoDBStreamUseCase(
      logger,
      customerOpenSearchRepository,
    );

    const input = {
      eventName: 'UNKNOWN_EVENT',
      keys: { PK: { S: 'CUSTOMER#123' } },
      newData: {
        name: { S: 'John Doe' },
        taxId: { S: '42245682840' },
        birthDate: { S: '2000-01-01' },
        email: { S: 'john@example.com' },
        phone: { S: '1234567890' },
        status: { S: 'ACTIVE' },
        createdAt: { S: '2023-01-01T00:00:00Z' },
        updatedAt: { S: '2023-01-01T00:00:00Z' },
      },
      oldData: {},
    };

    await useCase.execute(input);

    expect(customerOpenSearchRepository.index).not.toHaveBeenCalled();
    expect(customerOpenSearchRepository.delete).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerDynamoDBStreamUseCase.execute',
      'Unknown event: UNKNOWN_EVENT',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'CustomerDynamoDBStreamUseCase.execute',
      'Finished customer DynamoDB stream.',
    );
  });

  it('should log error without rethrowing when an error occurs', async () => {
    customerOpenSearchRepository.index.mockRejectedValueOnce(
      new Error('Indexing error'),
    );

    const useCase = new CustomerDynamoDBStreamUseCase(
      logger,
      customerOpenSearchRepository,
    );

    const input = {
      eventName: 'INSERT',
      keys: { PK: { S: 'CUSTOMER#123' } },
      newData: {
        name: { S: 'John Doe' },
        taxId: { S: '42245682840' },
        birthDate: { S: '2000-01-01' },
        email: { S: 'john@example.com' },
        phone: { S: '1234567890' },
        status: { S: 'ACTIVE' },
        notes: { S: 'Some notes' },
        createdAt: { S: '2023-01-01T00:00:00Z' },
        updatedAt: { S: '2023-01-01T00:00:00Z' },
      },
      oldData: {},
    };

    await useCase.execute(input);

    expect(logger.error).toHaveBeenCalledWith(
      'CustomerDynamoDBStreamUseCase.execute',
      'Error to customer DynamoDB stream.',
      expect.objectContaining({
        error: 'Indexing error',
      }),
    );
  });
});
