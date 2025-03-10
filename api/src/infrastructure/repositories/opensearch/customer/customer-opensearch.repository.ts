import {
  ICustomerOpenSearchRepository,
  ILogger,
  IOpenSearch,
} from 'domain/contracts';
import { CustomerEntity } from 'domain/entities';
import { DatabaseUnexpectedError } from 'infrastructure/errors';

export class CustomerOpenSearchRepository
  implements ICustomerOpenSearchRepository
{
  private indexName = 'customers';

  constructor(
    private readonly logger: ILogger,
    private readonly openSearch: IOpenSearch,
  ) {}

  async index(entity: CustomerEntity): Promise<void> {
    this.logger.info(
      'CustomerOpenSearchRepository.index',
      'Starting index customer.',
    );

    try {
      await this.openSearch.index({
        index: this.indexName,
        id: entity.id,
        document: {
          id: entity.id,
          name: entity.name,
          taxId: entity.taxId,
          birthDate: entity.birthDate.toISOString(),
          email: entity.email,
          phone: entity.phone,
          status: entity.status,
          notes: entity.notes,
          createdAt: entity.createdAt.toISOString(),
          updatedAt: entity.updatedAt.toISOString(),
        },
      });

      this.logger.info(
        'CustomerOpenSearchRepository.index',
        'Finished index customer.',
      );
    } catch (error) {
      this.logger.error(
        'CustomerOpenSearchRepository.index',
        'Error index customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw new DatabaseUnexpectedError('Error index customer.', error);
    }
  }

  async search(query: string): Promise<CustomerEntity[] | null> {
    this.logger.info(
      'CustomerOpenSearchRepository.search',
      'Starting search customer.',
    );

    try {
      const response = await this.openSearch.search<any>({
        index: this.indexName,
        body: {
          query: {
            query_string: {
              query: `*${query}*`,
              fields: ['name', 'taxId', 'email', 'phone', 'notes', 'status'],
              allow_leading_wildcard: true,
              analyze_wildcard: true,
              default_operator: 'OR',
            },
          },
        },
      });

      if (!response || response?.length === 0) {
        this.logger.info(
          'CustomerOpenSearchRepository.search',
          'Customer not found.',
        );

        return null;
      }

      const customers = response.map((item) => {
        return new CustomerEntity({
          id: item.id,
          name: item.name,
          taxId: item.taxId,
          birthDate: new Date(item.birthDate),
          email: item.email,
          phone: item.phone,
          status: item.status,
          notes: item.notes,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        });
      });

      this.logger.info(
        'CustomerOpenSearchRepository.search',
        'Finished search customer.',
      );

      return customers;
    } catch (error) {
      this.logger.error(
        'CustomerOpenSearchRepository.search',
        'Error search customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw new DatabaseUnexpectedError('Error search customer.', error);
    }
  }

  async delete(id: string): Promise<void> {
    this.logger.info(
      'CustomerOpenSearchRepository.delete',
      'Starting delete customer.',
    );

    try {
      await this.openSearch.delete({
        index: this.indexName,
        id,
      });
    } catch (error) {
      this.logger.error(
        'CustomerOpenSearchRepository.delete',
        'Error delete customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw new DatabaseUnexpectedError('Error delete customer.', error);
    }

    this.logger.info(
      'CustomerOpenSearchRepository.delete',
      'Finished delete customer.',
    );
  }
}
