import { Controller, Param, Get } from '@nestjs/common';
import { IGetCustomerUseCase, ILogger } from 'domain/contracts';

@Controller('/customer')
export class GetCustomerController {
  constructor(
    private readonly logger: ILogger,
    private readonly useCase: IGetCustomerUseCase,
  ) {}

  @Get(':id')
  async execute(@Param('id') id: string): Promise<any> {
    this.logger.info(
      'GetCustomerController.execute',
      'Executing GetCustomerController.',
    );

    const response = await this.useCase.execute({
      id: id,
    });

    this.logger.info(
      'GetCustomerController.execute',
      'Finished GetCustomerController.',
    );

    return response;
  }
}
