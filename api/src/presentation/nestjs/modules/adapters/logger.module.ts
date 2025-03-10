import { Global, Module } from '@nestjs/common';
import { ILogger } from 'domain/contracts';
import { makeLogger } from 'infrastructure/factories';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: ILogger,
      useFactory: () => {
        return makeLogger();
      },
    },
  ],
  exports: [
    {
      provide: ILogger,
      useFactory: () => {
        return makeLogger();
      },
    },
  ],
})
export class LoggerModule {}
