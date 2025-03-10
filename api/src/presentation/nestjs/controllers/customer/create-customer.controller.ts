import { Body, Controller, Post } from '@nestjs/common';
import { ICreateCustomerUseCase, ILogger } from 'domain/contracts';
import { CreateCustomerInput } from './create-customer.input';
import { ApiBody } from '@nestjs/swagger';

@Controller('/customer')
export class CreateCustomerController {
  constructor(
    private readonly logger: ILogger,
    private readonly useCase: ICreateCustomerUseCase,
  ) {}

  @Post()
  @ApiBody({ type: CreateCustomerInput })
  async execute(@Body() body: CreateCustomerInput): Promise<any> {
    this.logger.info(
      'CreateCustomerController.execute',
      'Executing CreateCustomerController.',
    );

    const response = await this.useCase.execute({
      name: body.name,
      taxId: body.taxId,
      birthDate: new Date(body.birthDate),
      email: body.email,
      phone: body.phone,
      notes: body.notes,
    });

    this.logger.info(
      'CreateCustomerController.execute',
      'Finished CreateCustomerController.',
      response,
    );

    return response;
  }
}
