import { CustomerEmailAlreadExistsError } from 'application/errors';

describe('CustomerEmailAlreadExistsError', () => {
  // Instance of CustomerEmailAlreadExistsError can be created.
  it('should create an instance of CustomerEmailAlreadExistsError', () => {
    const error = new CustomerEmailAlreadExistsError('Test Error');
    expect(error).toBeInstanceOf(CustomerEmailAlreadExistsError);
    expect(error.message).toBe('Test Error');
  });
});
