import { ICustomerRepository } from 'domain/contracts/repositories';
import { ILogger } from 'domain/contracts/adapters';
import {
  GetCustomerUseCaseInput,
  GetCustomerUseCaseOutput,
  IGetCustomerUseCase,
} from 'domain/contracts/use-cases';
import {
  CustomerNotExistsError,
  CustomerUnexpectedError,
} from 'application/errors';

export class GetCustomerUseCase implements IGetCustomerUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(
    input: GetCustomerUseCaseInput,
  ): Promise<GetCustomerUseCaseOutput> {
    this.logger.info('GetCustomerUseCase.execute', 'Executing get customer.');

    try {
      const customer = await this.customerRepository.findById(input.id);

      if (!customer) throw new CustomerNotExistsError('Customer not exists.');

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
        'GetCustomerUseCase.execute',
        'Finished get customer.',
        result,
      );

      return result;
    } catch (error) {
      this.logger.error(
        'GetCustomerUseCase.execute',
        'Error to get customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      if (error instanceof CustomerNotExistsError) throw error;

      throw new CustomerUnexpectedError('Error to get customer.');
    }
  }
}
