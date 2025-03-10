import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { mock } from 'jest-mock-extended';
import { ILogger } from 'domain/contracts';
import { DynamoDB } from 'infrastructure/adapters';
import { DatabaseUnexpectedError } from 'infrastructure/errors';

jest.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
    })),
    PutItemCommand: jest.fn(),
    UpdateItemCommand: jest.fn(),
    QueryCommand: jest.fn(),
    DeleteItemCommand: jest.fn(),
  };
});

describe('DynamoDB', () => {
  const logger = mock<ILogger>();
  let mockedSend: jest.Mock;

  beforeEach(() => {
    mockedSend = jest.fn();

    (DynamoDBClient as jest.Mock).mockImplementation(() => ({
      send: mockedSend,
    }));
  });

  it('should successfully put an item into DynamoDB', async () => {
    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      item: { id: '123', name: 'Test Item' },
    };

    await dynamoDB.put(input);

    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.put',
      'Executing put in DynamoDB.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.put',
      'Finished put in DynamoDB.',
    );
  });

  it('should successfully update an item in DynamoDB', async () => {
    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      key: { id: '123' },
      updateExpression: 'set #name = :name',
      expressionAttributeNames: { '#name': 'name' },
      expressionAttributeValues: { ':name': 'Updated Name' },
    };

    await dynamoDB.update(input);

    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.put',
      'Executing put in DynamoDB.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.put',
      'Finished put in DynamoDB.',
    );
  });

  it('should successfully delete an item from DynamoDB when valid input is provided', async () => {
    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      key: { id: '123' },
    };

    await dynamoDB.delete(input);

    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.delete',
      'Executing delete in DynamoDB.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.delete',
      'Finished delete in DynamoDB.',
    );
  });

  it('should successfully query items from DynamoDB and return unmarshalled results', async () => {
    mockedSend = jest.fn().mockResolvedValue({
      Items: [
        { id: { S: '123' }, name: { S: 'Test Item' } },
        { id: { S: '456' }, name: { S: 'Another Item' } },
      ],
    });

    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      query: {
        conditionExpression: 'id = :id',
        expressionAttributeValues: { ':id': { S: '123' } },
      },
    };

    const result = await dynamoDB.query(input);

    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      { id: '123', name: 'Test Item' },
      { id: '456', name: 'Another Item' },
    ]);
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.query',
      'Executing query in DynamoDB.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.query',
      'Finished query in DynamoDB.',
      result,
    );
  });

  it('should throw DatabaseUnexpectedError when put operation fails', async () => {
    mockedSend = jest.fn().mockRejectedValue(new Error('DynamoDB error'));

    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      item: { id: '123', name: 'Test Item' },
    };

    await expect(dynamoDB.put(input)).rejects.toThrow(DatabaseUnexpectedError);
    expect(logger.error).toHaveBeenCalledWith(
      'DynamoDB.put',
      'Error put in DynamoDB.',
      {
        error: 'DynamoDB error',
        stack: expect.any(String),
      },
    );
  });

  it('should throw DatabaseUnexpectedError when update operation fails', async () => {
    mockedSend = jest.fn().mockRejectedValue(new Error('DynamoDB error'));

    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      key: { id: '123' },
      updateExpression: 'set #name = :name',
      expressionAttributeNames: { '#name': 'name' },
      expressionAttributeValues: { ':name': 'Updated Name' },
    };

    await expect(dynamoDB.update(input)).rejects.toThrow(
      DatabaseUnexpectedError,
    );
    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      'DynamoDB.update',
      'Error update in DynamoDB.',
      expect.any(Object),
    );
  });

  it('should throw DatabaseUnexpectedError when query operation fails', async () => {
    mockedSend = jest.fn().mockRejectedValue(new Error('DynamoDB error'));

    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      query: {
        expressionAttributeValues: { ':id': { S: '123' } },
      },
    };

    await expect(dynamoDB.query(input)).rejects.toThrow(
      DatabaseUnexpectedError,
    );
    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      'DynamoDB.query',
      'Error query in DynamoDB.',
      expect.any(Object),
    );
  });

  it('should throw DatabaseUnexpectedError when delete operation fails', async () => {
    mockedSend = jest.fn().mockRejectedValue(new Error('DynamoDB error'));

    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      key: { id: '123' },
    };

    await expect(dynamoDB.delete(input)).rejects.toThrow(
      DatabaseUnexpectedError,
    );
    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      'DynamoDB.delete',
      'Error put in DynamoDB.',
      expect.any(Object),
    );
  });

  it('should return null when query response is empty', async () => {
    mockedSend = jest.fn().mockResolvedValue({ Items: [] });

    const dynamoDB = new DynamoDB(logger, 'sa-east-1');

    const input = {
      tableName: 'TableName',
      query: {
        expressionAttributeValues: { ':id': { S: '123' } },
      },
    };

    const result = await dynamoDB.query(input);

    expect(mockedSend).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.query',
      'Executing query in DynamoDB.',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'DynamoDB.query',
      'Finished query in DynamoDB.',
    );
  });
});
