import { CustomerTaxIdAlreadExistsError } from 'application/errors';

describe('CustomerTaxIdAlreadExistsError', () => {
  // Instance of CustomerTaxIdAlreadExistsError can be created.
  it('should create an instance of CustomerTaxIdAlreadExistsError', () => {
    const error = new CustomerTaxIdAlreadExistsError('Test Error');
    expect(error).toBeInstanceOf(CustomerTaxIdAlreadExistsError);
    expect(error.message).toBe('Test Error');
  });
});
