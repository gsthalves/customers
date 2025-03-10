import { Controller, Get, Param } from '@nestjs/common';
import { ISearchCustomersUseCase, ILogger } from 'domain/contracts';

@Controller('/customer')
export class SearchCustomersController {
  constructor(
    private readonly logger: ILogger,
    private readonly useCase: ISearchCustomersUseCase,
  ) {}

  @Get('search/:query')
  async execute(@Param('query') query: string): Promise<any> {
    this.logger.info(
      'SearchCustomersController.execute',
      'Executing SearchCustomersController.',
    );

    const response = await this.useCase.execute({
      query: query,
    });

    this.logger.info(
      'SearchCustomersController.execute',
      'Finished SearchCustomersController.',
    );

    return response;
  }
}
