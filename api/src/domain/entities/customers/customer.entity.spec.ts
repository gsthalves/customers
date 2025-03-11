import { BusinessValidationError } from 'domain/errors';
import { CustomerEntity } from './customer.entity';
import { CustomerStatus } from 'domain/enums';

describe('CustomerEntity', () => {
  it('should create a valid customer entity when all required fields are provided', () => {
    const customerProps = {
      name: 'John Doe',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Some notes',
    };

    const customer = new CustomerEntity(customerProps);

    expect(customer).toBeDefined();
    expect(customer.id).toBeDefined();
    expect(customer.pk).toBe('CUSTOMER#' + customer.id);
    expect(customer.sk).toBe('CUSTOMER#TAXID#42245682840');
    expect(customer.name).toBe('John Doe');
    expect(customer.taxId).toBe('42245682840');
    expect(customer.birthDate).toEqual(new Date('1990-01-01'));
    expect(customer.email).toBe('john.doe@example.com');
    expect(customer.phone).toBe('14997065872');
    expect(customer.status).toBe(CustomerStatus.ACTIVE);
    expect(customer.notes).toBe('Some notes');
    expect(customer.createdAt).toBeDefined();
    expect(customer.updatedAt).toBeDefined();
  });

  it('should format pk as "CUSTOMER#" followed by the id', () => {
    const customerProps = {
      name: 'Jane Doe',
      taxId: '42245682840',
      birthDate: new Date('1985-05-15'),
      email: 'jane.doe@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Test notes',
    };

    const customer = new CustomerEntity(customerProps);

    expect(customer.pk).toBe('CUSTOMER#' + customer.id);
  });

  it('should format sk correctly when taxId is provided', () => {
    const customerProps = {
      name: 'Jane Doe',
      taxId: '42245682840',
      birthDate: new Date('1985-05-15'),
      email: 'jane.doe@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Test notes',
    };

    const customer = new CustomerEntity(customerProps);

    expect(customer.sk).toBe('CUSTOMER#TAXID#42245682840');
  });

  it('should update mutable properties when valid values are provided', () => {
    const customerProps = {
      name: 'John Doe',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Initial notes',
    };
    const customer = new CustomerEntity(customerProps);

    customer.name = 'Jane Doe';
    customer.birthDate = new Date('1992-02-02');
    customer.phone = '0987654321';
    customer.notes = 'Updated notes';

    expect(customer.name).toBe('Jane Doe');
    expect(customer.birthDate).toEqual(new Date('1992-02-02'));
    expect(customer.phone).toBe('0987654321');
    expect(customer.notes).toBe('Updated notes');
  });

  it('should throw BusinessValidationError when required fields are missing or invalid', () => {
    const invalidCustomerProps = [
      {
        name: '',
        taxId: '42245682840',
        birthDate: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: '14997065872',
      },
      {
        name: 'John Doe',
        taxId: '',
        birthDate: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: '14997065872',
      },
      {
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: undefined as any,
        email: 'john.doe@example.com',
        phone: '14997065872',
      },
      {
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: new Date('1990-01-01'),
        email: '',
        phone: '14997065872',
      },
      {
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: '',
      },
      {
        name: 'John Doe',
        taxId: 'invalidTaxId',
        birthDate: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: '14997065872',
      },
      {
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: new Date('1990-01-01'),
        email: 'invalidEmail',
        phone: '14997065872',
      },
      {
        name: 'John Doe',
        taxId: '42245682840',
        birthDate: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: 'invalidPhone',
      },
    ];

    invalidCustomerProps.forEach((props) => {
      expect(() => new CustomerEntity(props)).toThrow(BusinessValidationError);
    });
  });

  it('should throw BusinessValidationError when setting an empty name', () => {
    const customerProps = {
      name: 'Valid Name',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'valid.email@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Some notes',
    };

    const customer = new CustomerEntity(customerProps);

    expect(() => {
      customer.name = '';
    }).toThrow(BusinessValidationError);

    expect(() => {
      customer.name = '   ';
    }).toThrow(BusinessValidationError);
  });

  it('should throw BusinessValidationError when setting an invalid birthDate', () => {
    const customerProps = {
      name: 'John Doe',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Some notes',
    };
    const customer = new CustomerEntity(customerProps);

    expect(() => {
      customer.birthDate = undefined as any;
    }).toThrow(BusinessValidationError);
  });

  it('should throw BusinessValidationError when setting an empty or invalid phone', () => {
    const customerProps = {
      name: 'John Doe',
      taxId: '42245682840',
      birthDate: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      phone: '14997065872',
      status: CustomerStatus.ACTIVE,
      notes: 'Some notes',
    };

    const customer = new CustomerEntity(customerProps);

    expect(() => {
      customer.phone = '';
    }).toThrow(BusinessValidationError);

    expect(() => {
      customer.phone = '   ';
    }).toThrow(BusinessValidationError);

    expect(() => {
      customer.phone = '0000';
    }).toThrow(BusinessValidationError);
  });

  it('should set default status to ACTIVE when status is not provided', () => {
    const customerProps = {
      name: 'Jane Doe',
      taxId: '42245682840',
      birthDate: new Date('1985-05-15'),
      email: 'jane.doe@example.com',
      phone: '14997065872',
    };

    const customer = new CustomerEntity(customerProps);

    expect(customer.status).toBe(CustomerStatus.ACTIVE);
  });
});
