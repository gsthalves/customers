import { CustomerEntity } from 'domain/entities';

export abstract class ICustomerOpenSearchRepository {
  abstract index(entity: CustomerEntity): Promise<void>;
  abstract search(query: string): Promise<CustomerEntity[] | null>;
  abstract delete(id: string): Promise<void>;
}
