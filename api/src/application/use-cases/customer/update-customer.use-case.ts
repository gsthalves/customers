import { ICustomerRepository } from 'domain/contracts/repositories';
import { ILogger } from 'domain/contracts/adapters';
import {
  UpdateCustomerUseCaseInput,
  IUpdateCustomerUseCase,
  UpdateCustomerUseCaseOutput,
} from 'domain/contracts/use-cases';
import {
  CustomerNotExistsError,
  CustomerUnexpectedError,
} from 'application/errors';
import { BusinessValidationError } from 'domain/errors';

export class UpdateCustomerUseCase implements IUpdateCustomerUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(
    input: UpdateCustomerUseCaseInput,
  ): Promise<UpdateCustomerUseCaseOutput> {
    this.logger.info(
      'UpdateCustomerUseCase.execute',
      'Executing update customer.',
    );

    try {
      const customer = await this.customerRepository.findById(input.id);

      if (!customer) throw new CustomerNotExistsError('Customer not exists.');

      customer.name = input.name;
      customer.birthDate = input.birthDate;
      customer.phone = input.phone;
      customer.notes = input.notes;

      await this.customerRepository.update(customer);

      const result = {
        id: customer.id,
        name: customer.name,
        taxId: customer.taxId,
        birthDate: customer.birthDate,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes,
      };

      this.logger.info(
        'UpdateCustomerUseCase.execute',
        'Finished update customer.',
        result,
      );

      return result;
    } catch (error) {
      this.logger.error(
        'UpdateCustomerUseCase.execute',
        'Error to update customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      if (error instanceof BusinessValidationError) throw error;
      if (error instanceof CustomerNotExistsError) throw error;

      throw new CustomerUnexpectedError('Error to update customer.');
    }
  }
}
