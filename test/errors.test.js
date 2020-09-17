const {
  ValidationError,
  isValidationError,
  joinPaths
} = require('../lib/errors');

describe('ValidationError', () => {
  it('has correct name', () => {
    const error = new ValidationError('error1');

    expect(error).toHaveProperty('name', 'ValidationError');
  });

  describe('when given an array of errors', () => {
    const error1 = new ValidationError('error1');
    const error2 = new ValidationError('error2');
    const error3 = new ValidationError('error3');
    const error = new ValidationError([
      error1,
      new ValidationError([error2]),
      new ValidationError([
        new ValidationError([error3])
      ])
    ]);

    it('sets type to aggregate', () => {
      expect(error.type).toBe('aggregate');
    });

    it('flattens errors', () => {
      expect(error.errors).toHaveLength(3);
    });
  });

  describe('each(callback) with aggregate error', () => {
    it('invokes callback for each error', () => {
      const error1 = new ValidationError('error1');
      const error2 = new ValidationError('error2');
      const aggregate = new ValidationError([error1, error2]);
      const callback = jest.fn();

      aggregate.each(callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, error1);
      expect(callback).toHaveBeenNthCalledWith(2, error2);
    });
  });

  describe('each(callback) with single error', () => {
    const error = new ValidationError('error');
    const callback = jest.fn();

    error.each(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(error);
  });
});

test('isValidationError', () => {
  expect(isValidationError(new Error())).toBe(false);
  expect(isValidationError(new ValidationError())).toBe(true);
});

test('joinPaths', () => {
  expect(joinPaths('user')).toBe('user');
  expect(joinPaths('', 'user')).toBe('user');
  expect(joinPaths('user', 'firstName')).toBe('user.firstName');
  expect(joinPaths('users', '[1]')).toBe('users[1]');
  expect(joinPaths('users', '[1]', '[2]', 'username')).toBe('users[1][2].username');
});
