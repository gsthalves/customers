import { CustomerNotExistsError } from 'application/errors';

describe('CustomerNotExistsError', () => {
  // Instance of CustomerNotExistsError can be created.
  it('should create an instance of CustomerNotExistsError', () => {
    const error = new CustomerNotExistsError('Test Error');
    expect(error).toBeInstanceOf(CustomerNotExistsError);
    expect(error.message).toBe('Test Error');
  });
});
