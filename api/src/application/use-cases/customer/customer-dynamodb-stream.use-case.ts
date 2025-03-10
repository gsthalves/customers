import { unmarshall } from '@aws-sdk/util-dynamodb';
import { ICustomerOpenSearchRepository } from 'domain/contracts/repositories';
import { ILogger } from 'domain/contracts/adapters';
import {
  CustomerDynamoDBStreamUseCaseInput,
  ICustomerDynamoDBStreamUseCase,
} from 'domain/contracts/use-cases';
import { CustomerEntity } from 'domain/entities';

export class CustomerDynamoDBStreamUseCase
  implements ICustomerDynamoDBStreamUseCase
{
  constructor(
    private readonly logger: ILogger,
    private readonly customerOpenSearchRepository: ICustomerOpenSearchRepository,
  ) {}

  async execute(input: CustomerDynamoDBStreamUseCaseInput): Promise<void> {
    this.logger.info(
      'CustomerDynamoDBStreamUseCase.execute',
      'Executing customer DynamoDB stream.',
      input,
    );

    try {
      const data =
        input.eventName !== 'REMOVE'
          ? { ...unmarshall(input.keys), ...unmarshall(input.newData) }
          : { ...unmarshall(input.keys), ...unmarshall(input.oldData) };

      const customer = new CustomerEntity({
        id: data.PK.split('#')[1],
        name: data.name,
        taxId: data.taxId,
        birthDate: new Date(data.birthDate),
        email: data.email,
        phone: data.phone,
        status: data.status,
        notes: data.notes,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });

      switch (input.eventName) {
        case 'INSERT':
          this.logger.info(
            'CustomerDynamoDBStreamUseCase.execute',
            'Executing insert customer on OpenSearch.',
          );

          await this.customerOpenSearchRepository.index(customer);
          break;

        case 'MODIFY':
          this.logger.info(
            'CustomerDynamoDBStreamUseCase.execute',
            'Executing update customer on OpenSearch',
          );

          await this.customerOpenSearchRepository.index(customer);
          break;

        case 'REMOVE':
          this.logger.info(
            'CustomerDynamoDBStreamUseCase.execute',
            'Executing delete customer on OpenSearch',
          );

          await this.customerOpenSearchRepository.delete(customer.id);
          break;

        default:
          this.logger.info(
            'CustomerDynamoDBStreamUseCase.execute',
            `Unknown event: ${input.eventName}`,
          );
      }

      this.logger.info(
        'CustomerDynamoDBStreamUseCase.execute',
        'Finished customer DynamoDB stream.',
      );
    } catch (error) {
      this.logger.error(
        'CustomerDynamoDBStreamUseCase.execute',
        'Error to customer DynamoDB stream.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      // throw new CustomerUnexpectedError('Error to customer DynamoDB stream.');

      return;
    }
  }
}
