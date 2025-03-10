import { Global, Module } from '@nestjs/common';
import { IDynamoDB, ILogger } from 'domain/contracts';
import { makeDynamoDB } from 'infrastructure/factories';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: IDynamoDB,
      useFactory: (logger: ILogger) => makeDynamoDB(logger),
      inject: [ILogger],
    },
  ],
  exports: [
    {
      provide: IDynamoDB,
      useFactory: (logger: ILogger) => makeDynamoDB(logger),
      inject: [ILogger],
    },
  ],
})
export class DynamoDBModule {}
