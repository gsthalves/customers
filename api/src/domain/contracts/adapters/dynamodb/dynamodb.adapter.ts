export type PutDynamoDBInput = {
  tableName: string;
  item: Record<string, any>;
};

export type UpdateDynamoDBInput = {
  tableName: string;
  key: Record<string, any>;
  updateExpression?: string;
  expressionAttributeNames?: Record<string, any>;
  expressionAttributeValues: Record<string, any>;
};

export type QueryDynamoDBInput = {
  tableName: string;
  query: {
    indexName?: string;
    conditionExpression?: string;
    expressionAttributeNames?: Record<string, any>;
    expressionAttributeValues: Record<string, any>;
  };
};

export type DeleteDynamoDBInput = {
  tableName: string;
  key: Record<string, any>;
};

export abstract class IDynamoDB {
  abstract put(input: PutDynamoDBInput): Promise<void>;
  abstract update(input: UpdateDynamoDBInput): Promise<void>;
  abstract query<T>(input: QueryDynamoDBInput): Promise<T[] | null>;
  abstract delete(input: DeleteDynamoDBInput): Promise<void>;
}
