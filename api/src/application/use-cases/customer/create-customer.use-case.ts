import { ICustomerRepository } from 'domain/contracts/repositories';
import { ILogger } from 'domain/contracts/adapters';
import {
  CreateCustomerUseCaseInput,
  CreateCustomerUseCaseOutput,
  ICreateCustomerUseCase,
} from 'domain/contracts/use-cases';
import { CustomerEntity } from 'domain/entities';
import {
  CustomerEmailAlreadExistsError,
  CustomerTaxIdAlreadExistsError,
  CustomerUnexpectedError,
} from 'application/errors';
import { BusinessValidationError } from 'domain/errors';

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(
    input: CreateCustomerUseCaseInput,
  ): Promise<CreateCustomerUseCaseOutput> {
    this.logger.info(
      'CreateCustomerUseCase.execute',
      'Executing create customer.',
    );

    try {
      const taxIdResponse = await this.customerRepository.findByTaxId(
        input.taxId,
      );

      if (taxIdResponse)
        throw new CustomerTaxIdAlreadExistsError('TaxId already exists.');

      const emailResponse = await this.customerRepository.findByEmail(
        input.email,
      );

      if (emailResponse)
        throw new CustomerEmailAlreadExistsError('Email already exists.');

      const customer = new CustomerEntity({
        name: input.name,
        taxId: input.taxId,
        birthDate: input.birthDate,
        email: input.email,
        phone: input.phone,
        notes: input.notes,
      });

      await this.customerRepository.create(customer);

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
        'CreateCustomerUseCase.execute',
        'Finished create customer.',
        result,
      );

      return result;
    } catch (error) {
      this.logger.error(
        'CreateCustomerUseCase.execute',
        'Error to create customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      if (error instanceof BusinessValidationError) throw error;
      if (error instanceof CustomerTaxIdAlreadExistsError) throw error;
      if (error instanceof CustomerEmailAlreadExistsError) throw error;

      throw new CustomerUnexpectedError('Error to create customer.');
    }
  }
}
