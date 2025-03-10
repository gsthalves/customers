import { Global, Module } from '@nestjs/common';
import { IOpenSearch, ILogger } from 'domain/contracts';
import { makeOpenSearch } from 'infrastructure/factories';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: IOpenSearch,
      useFactory: (logger: ILogger) => makeOpenSearch(logger),
      inject: [ILogger],
    },
  ],
  exports: [
    {
      provide: IOpenSearch,
      useFactory: (logger: ILogger) => makeOpenSearch(logger),
      inject: [ILogger],
    },
  ],
})
export class OpenSearchModule {}
