import { Controller, Param, Delete, HttpCode } from '@nestjs/common';
import { IDeleteCustomerUseCase, ILogger } from 'domain/contracts';

@Controller('/customer')
export class DeleteCustomerController {
  constructor(
    private readonly logger: ILogger,
    private readonly useCase: IDeleteCustomerUseCase,
  ) {}

  @Delete(':id')
  @HttpCode(204)
  async execute(@Param('id') id: string): Promise<void> {
    this.logger.info(
      'DeleteCustomerController.execute',
      'Executing DeleteCustomerController.',
    );

    await this.useCase.execute({
      id: id,
    });

    this.logger.info(
      'DeleteCustomerController.execute',
      'Finished DeleteCustomerController.',
    );
  }
}
