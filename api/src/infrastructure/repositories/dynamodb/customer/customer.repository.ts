import { ICustomerRepository, IDynamoDB, ILogger } from 'domain/contracts';
import { CustomerEntity } from 'domain/entities';

export class CustomerRepositoryDynamoDB implements ICustomerRepository {
  private tableName = 'customers';

  constructor(
    private readonly logger: ILogger,
    private readonly dynamodb: IDynamoDB,
    readonly env: string,
  ) {
    this.tableName = `${this.tableName}-${env}`;
  }

  async create(entity: CustomerEntity): Promise<void> {
    this.logger.info(
      'CustomerRepositoryDynamoDB.create',
      'Starting create customer.',
    );

    try {
      await this.dynamodb.put({
        tableName: this.tableName,
        item: {
          PK: entity.pk,
          SK: entity.sk,
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
        'CustomerRepositoryDynamoDB.create',
        'Finished create customer.',
      );
    } catch (error) {
      this.logger.error(
        'CustomerRepositoryDynamoDB.create',
        'Error creating customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw error;
    }
  }

  async update(entity: CustomerEntity): Promise<void> {
    this.logger.info(
      'CustomerRepositoryDynamoDB.update',
      'Starting update customer.',
    );

    try {
      await this.dynamodb.update({
        tableName: this.tableName,
        key: {
          PK: entity.pk,
          SK: entity.sk,
        },
        updateExpression:
          'SET #name = :name, birthDate = :birthDate, phone = :phone, notes = :notes, updatedAt = :updatedAt',
        expressionAttributeNames: {
          '#name': 'name',
        },
        expressionAttributeValues: {
          ':name': entity.name,
          ':birthDate': entity.birthDate.toISOString(),
          ':phone': entity.phone,
          ':notes': entity.notes,
          ':updatedAt': entity.updatedAt.toISOString(),
        },
      });

      this.logger.info(
        'CustomerRepositoryDynamoDB.update',
        'Finished update customer.',
      );
    } catch (error) {
      this.logger.error(
        'CustomerRepositoryDynamoDB.update',
        'Error creating customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw error;
    }
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    this.logger.info(
      'CustomerRepositoryDynamoDB.findById',
      'Starting find customer by id.',
    );

    try {
      const response = await this.dynamodb.query<any>({
        tableName: this.tableName,
        query: {
          conditionExpression: 'PK = :id',
          expressionAttributeValues: {
            ':id': `CUSTOMER#${id}`,
          },
        },
      });

      this.logger.info(
        'CustomerRepositoryDynamoDB.findById',
        'Finished find customer by id.',
      );

      if (!response || response.length < 1) return null;

      return new CustomerEntity({
        id: response[0].PK?.split('#')[1],
        name: response[0].name,
        taxId: response[0].taxId,
        birthDate: new Date(response[0].birthDate),
        email: response[0].email,
        phone: response[0].phone,
        status: response[0].status,
        notes: response[0].notes,
        createdAt: new Date(response[0].createdAt),
        updatedAt: new Date(response[0].updatedAt),
      });
    } catch (error) {
      this.logger.error(
        'CustomerRepositoryDynamoDB.findById',
        'Error find customer by id.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw error;
    }
  }

  async findByTaxId(taxId: string): Promise<CustomerEntity | null> {
    this.logger.info(
      'CustomerRepositoryDynamoDB.findByTaxId',
      'Starting find customer by taxId.',
    );

    try {
      const response = await this.dynamodb.query<any>({
        tableName: this.tableName,
        query: {
          indexName: 'taxId-index',
          conditionExpression: 'taxId = :taxId',
          expressionAttributeValues: {
            ':taxId': taxId,
          },
        },
      });

      this.logger.info(
        'CustomerRepositoryDynamoDB.findByTaxId',
        'Finished find customer by taxId.',
      );

      if (!response || response.length < 1) return null;

      return new CustomerEntity({
        id: response[0].PK?.split('#')[1],
        name: response[0].name,
        taxId: response[0].taxId,
        birthDate: new Date(response[0].birthDate),
        email: response[0].email,
        phone: response[0].phone,
        status: response[0].status,
        notes: response[0].notes,
        createdAt: new Date(response[0].createdAt),
        updatedAt: new Date(response[0].updatedAt),
      });
    } catch (error) {
      this.logger.error(
        'CustomerRepositoryDynamoDB.findByTaxId',
        'Error find customer by taxId.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw error;
    }
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    this.logger.info(
      'CustomerRepositoryDynamoDB.findByEmail',
      'Starting find customer by email.',
    );

    try {
      const response = await this.dynamodb.query<any>({
        tableName: this.tableName,
        query: {
          indexName: 'email-index',
          conditionExpression: 'email = :email',
          expressionAttributeValues: {
            ':email': email,
          },
        },
      });

      this.logger.info(
        'CustomerRepositoryDynamoDB.findByEmail',
        'Finished find customer by email.',
      );

      if (!response || response.length < 1) return null;

      return new CustomerEntity({
        id: response[0].PK?.split('#')[1],
        name: response[0].name,
        taxId: response[0].taxId,
        birthDate: new Date(response[0].birthDate),
        email: response[0].email,
        phone: response[0].phone,
        status: response[0].status,
        notes: response[0].notes,
        createdAt: new Date(response[0].createdAt),
        updatedAt: new Date(response[0].updatedAt),
      });
    } catch (error) {
      this.logger.error(
        'CustomerRepositoryDynamoDB.findByEmail',
        'Error find customer by email.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw error;
    }
  }

  async delete(pk: string, sk: string): Promise<void> {
    this.logger.info(
      'CustomerRepositoryDynamoDB.delete',
      'Starting delete customer.',
    );

    try {
      await this.dynamodb.delete({
        tableName: this.tableName,
        key: {
          PK: pk,
          SK: sk,
        },
      });

      this.logger.info(
        'CustomerRepositoryDynamoDB.delete',
        'Finished delete customer.',
      );
    } catch (error) {
      this.logger.error(
        'CustomerRepositoryDynamoDB.delete',
        'Error delete customer.',
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw error;
    }
  }
}
