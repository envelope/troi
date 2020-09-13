const validate = require('../lib/validate');
const { identity } = require('../lib/utils');

test('required', () => {
  const required = validate.required();
  const next = jest.fn(identity);

  expect(required(undefined, next)).toMatchValidationError({ type: 'required' });
  expect(next).not.toHaveBeenCalled();

  expect(required(null, next)).toBe(null);
  expect(next).toHaveBeenCalledWith(null);

  expect(required('string', next)).toBe('string');
  expect(next).toHaveBeenCalledWith('string');
});

test('optional', () => {
  const optional = validate.optional();
  const next = jest.fn(identity);

  expect(optional(undefined, next)).toBe(undefined);
  expect(next).not.toHaveBeenCalled();

  expect(optional(null, next)).toBe(null);
  expect(next).toHaveBeenCalledWith(null);

  expect(optional('string', next)).toBe('string');
  expect(next).toHaveBeenCalledWith('string');
});

test('nullable', () => {
  const nullable = validate.nullable();
  const next = jest.fn(identity);

  expect(nullable(null, next)).toBe(null);
  expect(next).not.toHaveBeenCalled();

  expect(nullable(undefined, next)).toBe(undefined);
  expect(next).toHaveBeenCalledWith(undefined);

  expect(nullable('string', next)).toBe('string');
  expect(next).toHaveBeenCalledWith('string');

  expect(nullable('', next)).toBe('');
  expect(next).toHaveBeenCalledWith('');
});

test('string', () => {
  const string = validate.string();
  const next = jest.fn(identity);
  const errorShape = { type: 'type', params: { type: 'string' } };

  expect(string(undefined, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(string(100, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(string('string', next)).toBe('string');
  expect(next).toHaveBeenCalledWith('string');

  expect(string('', next)).toBe('');
  expect(next).toHaveBeenCalledWith('');
});

test('number', () => {
  const number = validate.number();
  const next = jest.fn(identity);
  const errorShape = { type: 'type', params: { type: 'number' } };

  expect(number(undefined, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(number(NaN, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(number(Infinity, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(number('200', next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(number(200, next)).toBe(200);
  expect(next).toHaveBeenCalledWith(200);

  expect(number(9.99, next)).toBe(9.99);
  expect(next).toHaveBeenCalledWith(9.99);
});

test('integer', () => {
  const integer = validate.integer();
  const next = jest.fn(identity);
  const errorShape = { type: 'type', params: { type: 'integer' } };

  expect(integer(NaN, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(integer(Infinity, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(integer(20.3, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(integer(100, next)).toBe(100);
  expect(next).toHaveBeenCalledWith(100);
});

test('boolean', () => {
  const boolean = validate.boolean();
  const next = jest.fn(identity);
  const errorShape = { type: 'type', params: { type: 'boolean' } };

  expect(boolean('string', next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(boolean('true', next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(boolean(undefined, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(boolean(true, next)).toBe(true);
  expect(next).toHaveBeenCalledWith(true);

  expect(boolean(false, next)).toBe(false);
  expect(next).toHaveBeenCalledWith(false);
});

test('oneOf', () => {
  const values = ['string', 100, true, null];
  const next = jest.fn(identity);
  const oneOf = validate.oneOf(values);
  const errorShape = { type: 'oneOf', params: { values } };

  expect(oneOf(false, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(oneOf(undefined, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(oneOf('string', next)).toBe('string');
  expect(next).toHaveBeenCalledWith('string');

  expect(oneOf(100, next)).toBe(100);
  expect(next).toHaveBeenCalledWith(100);

  expect(oneOf(true, next)).toBe(true);
  expect(next).toHaveBeenCalledWith(true);

  expect(oneOf(null, next)).toBe(null);
  expect(next).toHaveBeenCalledWith(null);
});

test('pattern', () => {
  const regexp = /^\d+$/;
  const pattern = validate.pattern(regexp);
  const patternWithType = validate.pattern(regexp, 'digits');
  const next = jest.fn(identity);
  const errorShape = { type: 'pattern', params: { pattern: regexp } };

  expect(pattern('abc', next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(patternWithType('abc', next)).toMatchValidationError({
    type: 'digits',
    params: { pattern: regexp }
  });
  expect(next).not.toHaveBeenCalled();

  expect(pattern('100', next)).toBe('100');
  expect(next).toHaveBeenCalledWith('100');
});

test('minLength', () => {
  const minLength = validate.minLength(2);
  const next = jest.fn(identity);

  expect(minLength('a', next)).toMatchValidationError({
    type: 'minLength',
    params: { min: 2, length: 1 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(minLength([1], next)).toMatchValidationError({
    type: 'minLength',
    params: { min: 2, length: 1 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(minLength('ab', next)).toBe('ab');
  expect(next).toHaveBeenCalledWith('ab');

  expect(minLength(['a', 'b'], next)).toEqual(['a', 'b']);
  expect(next).toHaveBeenCalledWith(['a', 'b']);
});

test('maxLength', () => {
  const maxLength = validate.maxLength(2);
  const next = jest.fn(identity);

  expect(maxLength('abc', next)).toMatchValidationError({
    type: 'maxLength',
    params: { max: 2, length: 3 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(maxLength([1, 2, 3], next)).toMatchValidationError({
    type: 'maxLength',
    params: { max: 2, length: 3 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(maxLength('ab', next)).toBe('ab');
  expect(next).toHaveBeenCalledWith('ab');

  expect(maxLength(['a', 'b'], next)).toEqual(['a', 'b']);
  expect(next).toHaveBeenCalledWith(['a', 'b']);
});

test('lengthBetween', () => {
  const lengthBetween = validate.lengthBetween(2, 3);
  const next = jest.fn(identity);

  expect(lengthBetween('a', next)).toMatchValidationError({
    type: 'lengthBetween',
    params: { min: 2, max: 3, length: 1 }
  });

  expect(lengthBetween('abcd', next)).toMatchValidationError({
    type: 'lengthBetween',
    params: { min: 2, max: 3, length: 4 }
  });

  expect(lengthBetween(['a'], next)).toMatchValidationError({
    type: 'lengthBetween',
    params: { min: 2, max: 3, length: 1 }
  });

  expect(lengthBetween(['a', 'c', 'd', 'e'], next)).toMatchValidationError({
    type: 'lengthBetween',
    params: { min: 2, max: 3, length: 4 }
  });

  expect(lengthBetween('ab', next)).toBe('ab');
  expect(next).toHaveBeenCalledWith('ab');

  expect(lengthBetween(['a', 'b'], next)).toEqual(['a', 'b']);
  expect(next).toHaveBeenCalledWith(['a', 'b']);
});

test('between', () => {
  const between = validate.between(2, 4);
  const next = jest.fn(identity);
  const errorShape = { type: 'between', params: { min: 2, max: 4 } };

  expect(between(1, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(between(5, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(between(2, next)).toBe(2);
  expect(next).toHaveBeenCalledWith(2);

  expect(between(4, next)).toBe(4);
  expect(next).toHaveBeenCalledWith(4);
});

test('filled', () => {
  const filled = validate.filled();
  const next = jest.fn(identity);
  const errorShape = { type: 'filled' };

  expect(filled(null, next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(filled('', next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(filled('   ', next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(filled([], next)).toMatchValidationError(errorShape);
  expect(next).not.toHaveBeenCalled();

  expect(filled('string', next)).toBe('string');
  expect(next).toHaveBeenCalledWith('string');

  expect(filled(100, next)).toBe(100);
  expect(next).toHaveBeenCalledWith(100);
});

describe('object', () => {
  it('returns validation if input is not an object', () => {
    const object = validate.object();
    const next = jest.fn(identity);
    const errorShape = { type: 'type', params: { type: 'object' } };

    expect(object(null, next)).toMatchValidationError(errorShape);
    expect(next).not.toHaveBeenCalled();

    expect(object(undefined, next)).toMatchValidationError(errorShape);
    expect(next).not.toHaveBeenCalled();

    expect(object('string', next)).toMatchValidationError(errorShape);
    expect(next).not.toHaveBeenCalled();

    expect(object(true, next)).toMatchValidationError(errorShape);
    expect(next).not.toHaveBeenCalled();
  });

  it('does not assign undefined values if input property is absent', () => {
    const object = validate.object({
      username: () => undefined
    });

    const result = object({}, identity);
    expect(result).not.toHaveProperty('username');
  });

  it('assigns undefined values if input property is present', () => {
    const object = validate.object({
      username: () => undefined
    });

    const result = object({ username: undefined }, identity);
    expect(result).toHaveProperty('username');
  });

  it('can validate nested objects', () => {
    const object = validate.object({
      property: validate.string(),
      nested: validate.object({
        property: validate.number()
      })
    });

    const error = object({
      nested: {}
    });

    expect(error).toBeValidationError();
    expect(error.errors).toHaveLength(2);
    expect(error.errors[0]).toMatchValidationError({
      type: 'type',
      params: { type: 'string' },
      path: 'property'
    });
    expect(error.errors[1]).toMatchValidationError({
      type: 'type',
      params: { type: 'number' },
      path: 'nested.property'
    });
  });

  it('allows unknown properties', () => {
    const object = validate.object({
      fullName: validate.string()
    });

    expect(object({ fullName: 'John Doe', age: 52 }, identity))
      .toEqual({ fullName: 'John Doe', age: 52 });
  });
});

describe('array', () => {
  it('throws if itemValidator argument is defined and not a function', () => {
    const errorMessage = 'Expected `itemValidator` argument to be a function';

    expect(() => validate.array('string'))
      .toThrow(errorMessage);
  });

  it('can validate array without itemValidator', () => {
    const array = validate.array();
    const next = jest.fn(identity);
    const value = ['100', true];

    expect(array(null, next)).toMatchValidationError({
      type: 'type',
      params: { type: 'array' }
    });
    expect(next).not.toHaveBeenCalled();

    expect(array(value, next)).toEqual(value);
    expect(next).toHaveBeenCalledWith(value);
  });

  it('mutates array item if transformed', () => {
    const array = validate.array((value) => value.trim());
    const value = ['  string 1 ', '  string 2  '];

    expect(array(value, identity)).toBe(value);
    expect(value).toEqual(['string 1', 'string 2']);
  });

  it('validates each item', () => {
    const array = validate.array(validate.string());
    const next = jest.fn(identity);
    const value = ['string1', 'string2', 'string3'];

    expect(array(value, next)).toBe(value);
    expect(next).toHaveBeenCalledWith(value);
  });

  it('handles validation errors for each item', () => {
    const array = validate.array(validate.string());
    const next = jest.fn(identity);

    const error = array([20, 'string', false], next);
    expect(next).not.toHaveBeenCalled();
    expect(error).toBeValidationError();
    expect(error.errors).toHaveLength(2);
    expect(error.errors[0]).toMatchValidationError({
      type: 'type',
      params: { type: 'string' },
      path: '[0]'
    });
    expect(error.errors[1]).toMatchValidationError({
      type: 'type',
      params: { type: 'string' },
      path: '[2]'
    });
  });

  it('handles nested validation errors', () => {
    const array = validate.array(validate.array(validate.string()));

    const error = array([[100], ['string'], ['string', false]], identity);
    expect(error).toBeValidationError();
    expect(error.errors).toHaveLength(2);
    expect(error.errors[0]).toMatchValidationError({
      type: 'type',
      params: { type: 'string' },
      path: '[0][0]'
    });
    expect(error.errors[1]).toMatchValidationError({
      type: 'type',
      params: { type: 'string' },
      path: '[2][1]'
    });
  });
});
