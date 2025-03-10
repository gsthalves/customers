import { CustomerEntity } from 'domain/entities';

export abstract class ICustomerRepository {
  abstract create(entity: CustomerEntity): Promise<void>;
  abstract update(entity: CustomerEntity): Promise<void>;
  abstract findById(id: string): Promise<CustomerEntity | null>;
  abstract findByTaxId(taxId: string): Promise<CustomerEntity | null>;
  abstract findByEmail(email: string): Promise<CustomerEntity | null>;
  abstract delete(pk: string, sk: string): Promise<void>;
}
