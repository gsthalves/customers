export type CustomerDynamoDBStreamUseCaseInput = {
  eventName?: string;
  keys: any;
  oldData: any;
  newData: any;
};

export abstract class ICustomerDynamoDBStreamUseCase {
  abstract execute(input: CustomerDynamoDBStreamUseCaseInput): Promise<void>;
}
