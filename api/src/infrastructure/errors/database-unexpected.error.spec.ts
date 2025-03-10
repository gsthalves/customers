import { DatabaseUnexpectedError } from 'infrastructure/errors';

describe('DatabaseUnexpectedError', () => {
  // Instance of DatabaseUnexpectedError can be created.
  it('should create an instance of DatabaseUnexpectedError', () => {
    const error = new DatabaseUnexpectedError('Test Error');
    expect(error).toBeInstanceOf(DatabaseUnexpectedError);
    expect(error.message).toBe('Test Error');
  });
});
