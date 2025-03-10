import { Module } from '@nestjs/common';
import {
  CreateCustomerController,
  DeleteCustomerController,
  GetCustomerController,
  SearchCustomersController,
  UpdateCustomerController,
} from 'presentation/nestjs/controllers';
import {
  ICreateCustomerUseCase,
  ICustomerOpenSearchRepository,
  ICustomerRepository,
  IDeleteCustomerUseCase,
  IDynamoDB,
  IGetCustomerUseCase,
  ILogger,
  IOpenSearch,
  ISearchCustomersUseCase,
  IUpdateCustomerUseCase,
} from 'domain/contracts';
import {
  CreateCustomerUseCase,
  DeleteCustomerUseCase,
  GetCustomerUseCase,
  SearchCustomersUseCase,
  UpdateCustomerUseCase,
} from 'application/use-cases';
import { DynamoDBModule } from './adapters/dynamodb.module';
import {
  makeCustomerOpenSearchRepository,
  makeCustomerRepository,
} from 'infrastructure/factories';
import { OpenSearchModule } from './adapters/opensearch.module';

@Module({
  imports: [DynamoDBModule, OpenSearchModule],
  controllers: [
    CreateCustomerController,
    UpdateCustomerController,
    GetCustomerController,
    DeleteCustomerController,
    SearchCustomersController,
  ],
  providers: [
    {
      provide: ICreateCustomerUseCase,
      useFactory: (
        logger: ILogger,
        customerRepository: ICustomerRepository,
      ) => {
        return new CreateCustomerUseCase(logger, customerRepository);
      },
      inject: [ILogger, ICustomerRepository],
    },
    {
      provide: IUpdateCustomerUseCase,
      useFactory: (
        logger: ILogger,
        customerRepository: ICustomerRepository,
      ) => {
        return new UpdateCustomerUseCase(logger, customerRepository);
      },
      inject: [ILogger, ICustomerRepository],
    },
    {
      provide: IGetCustomerUseCase,
      useFactory: (
        logger: ILogger,
        customerRepository: ICustomerRepository,
      ) => {
        return new GetCustomerUseCase(logger, customerRepository);
      },
      inject: [ILogger, ICustomerRepository],
    },
    {
      provide: IDeleteCustomerUseCase,
      useFactory: (
        logger: ILogger,
        customerRepository: ICustomerRepository,
      ) => {
        return new DeleteCustomerUseCase(logger, customerRepository);
      },
      inject: [ILogger, ICustomerRepository],
    },
    {
      provide: ISearchCustomersUseCase,
      useFactory: (
        logger: ILogger,
        customerOpenSearchRepository: ICustomerOpenSearchRepository,
      ) => {
        return new SearchCustomersUseCase(logger, customerOpenSearchRepository);
      },
      inject: [ILogger, ICustomerOpenSearchRepository],
    },
    {
      provide: ICustomerRepository,
      useFactory: (logger: ILogger, dynamodb: IDynamoDB) =>
        makeCustomerRepository(logger, dynamodb),
      inject: [ILogger, IDynamoDB],
    },
    {
      provide: ICustomerOpenSearchRepository,
      useFactory: (logger: ILogger, openSearch: IOpenSearch) =>
        makeCustomerOpenSearchRepository(logger, openSearch),
      inject: [ILogger, IOpenSearch],
    },
  ],
})
export class CustomerModule {}
