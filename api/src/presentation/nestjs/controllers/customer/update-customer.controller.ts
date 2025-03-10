import { Body, Controller, Param, Put } from '@nestjs/common';
import { IUpdateCustomerUseCase, ILogger } from 'domain/contracts';
import { UpdateCustomerInput } from './update-customer.input';
import { ApiBody } from '@nestjs/swagger';

@Controller('/customer')
export class UpdateCustomerController {
  constructor(
    private readonly logger: ILogger,
    private readonly useCase: IUpdateCustomerUseCase,
  ) {}

  @Put(':id')
  @ApiBody({ type: UpdateCustomerInput })
  async execute(
    @Param('id') id: string,
    @Body() body: UpdateCustomerInput,
  ): Promise<any> {
    this.logger.info(
      'UpdateCustomerController.execute',
      'Executing UpdateCustomerController.',
    );

    const response = await this.useCase.execute({
      id: id,
      name: body.name,
      birthDate: new Date(body.birthDate),
      phone: body.phone,
      notes: body.notes,
    });

    this.logger.info(
      'UpdateCustomerController.execute',
      'Finished UpdateCustomerController.',
    );

    return response;
  }
}
