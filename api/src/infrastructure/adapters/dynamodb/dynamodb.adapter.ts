import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  DeleteDynamoDBInput,
  IDynamoDB,
  ILogger,
  PutDynamoDBInput,
  QueryDynamoDBInput,
  UpdateDynamoDBInput,
} from 'domain/contracts';
import { DatabaseUnexpectedError } from 'infrastructure/errors';

export class DynamoDB implements IDynamoDB {
  private readonly client: DynamoDBClient;

  constructor(
    private readonly logger: ILogger,
    region: string,
  ) {
    this.client = new DynamoDBClient({ region });
  }

  async put(input: PutDynamoDBInput): Promise<void> {
    this.logger.info('DynamoDB.put', 'Executing put in DynamoDB.');

    try {
      const command = new PutItemCommand({
        TableName: input.tableName,
        Item: marshall(input.item),
      });

      await this.client.send(command);

      this.logger.info('DynamoDB.put', 'Finished put in DynamoDB.');
    } catch (error) {
      this.logger.error('DynamoDB.put', 'Error put in DynamoDB.', {
        error: error.message,
        stack: error.stack,
      });

      throw new DatabaseUnexpectedError('Error put in DynamoDB.', error);
    }
  }

  async update(input: UpdateDynamoDBInput): Promise<void> {
    this.logger.info('DynamoDB.update', 'Executing update in DynamoDB.');

    try {
      const command = new UpdateItemCommand({
        TableName: input.tableName,
        Key: marshall(input.key),
        UpdateExpression: input.updateExpression,
        ExpressionAttributeNames: input.expressionAttributeNames,
        ExpressionAttributeValues: marshall(input.expressionAttributeValues),
      });

      await this.client.send(command);

      this.logger.info('DynamoDB.update', 'Finished update in DynamoDB.');
    } catch (error) {
      this.logger.error('DynamoDB.update', 'Error update in DynamoDB.', {
        error: error.message,
        stack: error.stack,
      });

      throw new DatabaseUnexpectedError('Error update in DynamoDB.', error);
    }
  }

  async query<T>(input: QueryDynamoDBInput): Promise<T[] | null> {
    this.logger.info('DynamoDB.query', 'Executing query in DynamoDB.');

    try {
      const command = new QueryCommand({
        TableName: input.tableName,
        IndexName: input.query.indexName,
        KeyConditionExpression: input.query.conditionExpression,
        ExpressionAttributeNames: input.query.expressionAttributeNames,
        ExpressionAttributeValues: marshall(
          input.query.expressionAttributeValues,
        ),
      });

      const response = await this.client.send(command);

      if (!response?.Items || response.Items.length === 0) {
        this.logger.info('DynamoDB.query', 'Finished query in DynamoDB.');

        return null;
      }

      const result = response.Items.map((item) => unmarshall(item) as T) || [];

      this.logger.info('DynamoDB.query', 'Finished query in DynamoDB.', result);

      return result;
    } catch (error) {
      this.logger.error('DynamoDB.query', 'Error query in DynamoDB.', {
        error: error.message,
        stack: error.stack,
      });

      throw new DatabaseUnexpectedError('Error query in DynamoDB.', error);
    }
  }

  async delete(input: DeleteDynamoDBInput): Promise<void> {
    this.logger.info('DynamoDB.delete', 'Executing delete in DynamoDB.');

    try {
      const command = new DeleteItemCommand({
        TableName: input.tableName,
        Key: marshall(input.key),
      });

      await this.client.send(command);

      this.logger.info('DynamoDB.delete', 'Finished delete in DynamoDB.');
    } catch (error) {
      this.logger.error('DynamoDB.delete', 'Error put in DynamoDB.', {
        error: error.message,
        stack: error.stack,
      });

      throw new DatabaseUnexpectedError('Error delete in DynamoDB.', error);
    }
  }
}
