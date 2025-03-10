import { CustomerUnexpectedError } from 'application/errors';

describe('CustomerUnexpectedError', () => {
  // Instance of CustomerUnexpectedError can be created.
  it('should create an instance of CustomerUnexpectedError', () => {
    const error = new CustomerUnexpectedError('Test Error');
    expect(error).toBeInstanceOf(CustomerUnexpectedError);
    expect(error.message).toBe('Test Error');
  });
});
