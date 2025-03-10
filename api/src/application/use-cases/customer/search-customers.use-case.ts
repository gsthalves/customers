import { ICustomerOpenSearchRepository } from 'domain/contracts/repositories';
import { ILogger } from 'domain/contracts/adapters';
import {
  SearchCustomersUseCaseInput,
  SearchCustomersUseCaseOutput,
  ISearchCustomersUseCase,
} from 'domain/contracts/use-cases';
import { CustomerUnexpectedError } from 'application/errors';

export class SearchCustomersUseCase implements ISearchCustomersUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly customerRepository: ICustomerOpenSearchRepository,
  ) {}

  async execute(
    input: SearchCustomersUseCaseInput,
  ): Promise<SearchCustomersUseCaseOutput[]> {
    this.logger.info(
      'SearchCustomersUseCase.execute',
      'Executing search customers.',
    );

    try {
      const customer = await this.customerRepository.search(input.query);

      if (!customer) {
        this.logger.info(
          'SearchCustomersUseCase.execute',
          'Customers not found.',
        );

        return [];
      }

      const result = customer.map((customer) => ({
        id: customer.id,
        name: customer.name,
        taxId: customer.taxId,
        birthDate: customer.birthDate,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes,
      }));

      this.logger.info(
        'SearchCustomersUseCase.execute',
        'Finished search customers.',
        result,
      );

      return result;
    } catch (error) {
      this.logger.error(
        'SearchCustomersUseCase.execute',
        'Error to search customers.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw new CustomerUnexpectedError('Error to search customers.');
    }
  }
}
