import { BusinessValidationError } from 'domain/errors';

describe('BusinessValidationError', () => {
  // Instance of BusinessValidationError can be created.
  it('should create an instance of BusinessValidationError', () => {
    const error = new BusinessValidationError('Test Error');
    expect(error).toBeInstanceOf(BusinessValidationError);
    expect(error.message).toBe('Test Error');
  });
});
