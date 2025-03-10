import { ICustomerRepository } from 'domain/contracts/repositories';
import { ILogger } from 'domain/contracts/adapters';
import {
  DeleteCustomerUseCaseInput,
  IDeleteCustomerUseCase,
} from 'domain/contracts/use-cases';
import {
  CustomerNotExistsError,
  CustomerUnexpectedError,
} from 'application/errors';

export class DeleteCustomerUseCase implements IDeleteCustomerUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(input: DeleteCustomerUseCaseInput): Promise<void> {
    this.logger.info(
      'DeleteCustomerUseCase.execute',
      'Executing delete customer.',
    );

    try {
      const customer = await this.customerRepository.findById(input.id);

      if (!customer) throw new CustomerNotExistsError('Customer not exists.');

      await this.customerRepository.delete(customer.pk, customer.sk);

      this.logger.info(
        'DeleteCustomerUseCase.execute',
        'Finished delete customer.',
      );
    } catch (error) {
      this.logger.error(
        'DeleteCustomerUseCase.execute',
        'Error to delete customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      if (error instanceof CustomerNotExistsError) throw error;

      throw new CustomerUnexpectedError('Error to delete customer.');
    }
  }
}
