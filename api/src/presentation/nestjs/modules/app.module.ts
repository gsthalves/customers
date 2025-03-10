import { Module } from '@nestjs/common';
import { LoggerModule } from './adapters/logger.module';
import { CustomerModule } from './customer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), LoggerModule, CustomerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
