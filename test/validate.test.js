const validate = require('../lib/validate');
const { identity } = require('../lib/utils');

test('required', () => {
  const required = validate.required();
  const next = jest.fn(identity);

  expect(required(undefined, next)).toMatchValidationError({
    type: 'required',
    params: { value: undefined }
  });
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

  expect(string(undefined, next)).toMatchValidationError({
    type: 'string',
    params: { value: undefined }
  });
  expect(next).not.toHaveBeenCalled();

  expect(string(100, next)).toMatchValidationError({
    type: 'string',
    params: { value: 100 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(string('string', next)).toBe('string');
  expect(next).toHaveBeenCalledWith('string');

  expect(string('', next)).toBe('');
  expect(next).toHaveBeenCalledWith('');
});

test('number', () => {
  const number = validate.number();
  const next = jest.fn(identity);

  expect(number(undefined, next)).toMatchValidationError({
    type: 'number',
    params: { value: undefined }
  });
  expect(next).not.toHaveBeenCalled();

  expect(number(NaN, next)).toMatchValidationError({
    type: 'number',
    params: { value: NaN }
  });
  expect(next).not.toHaveBeenCalled();

  expect(number(Infinity, next)).toMatchValidationError({
    type: 'number',
    params: { value: Infinity }
  });
  expect(next).not.toHaveBeenCalled();

  expect(number('200', next)).toMatchValidationError({
    type: 'number',
    params: { value: '200' }
  });
  expect(next).not.toHaveBeenCalled();

  expect(number(200, next)).toBe(200);
  expect(next).toHaveBeenCalledWith(200);

  expect(number(9.99, next)).toBe(9.99);
  expect(next).toHaveBeenCalledWith(9.99);
});

test('integer', () => {
  const integer = validate.integer();
  const next = jest.fn(identity);

  expect(integer(NaN, next)).toMatchValidationError({
    type: 'integer',
    params: { value: NaN }
  });
  expect(next).not.toHaveBeenCalled();

  expect(integer(Infinity, next)).toMatchValidationError({
    type: 'integer',
    params: { value: Infinity }
  });
  expect(next).not.toHaveBeenCalled();

  expect(integer(20.3, next)).toMatchValidationError({
    type: 'integer',
    params: { value: 20.3 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(integer(100, next)).toBe(100);
  expect(next).toHaveBeenCalledWith(100);
});

test('boolean', () => {
  const boolean = validate.boolean();
  const next = jest.fn(identity);

  expect(boolean('string', next)).toMatchValidationError({
    type: 'boolean',
    params: { value: 'string' }
  });
  expect(next).not.toHaveBeenCalled();

  expect(boolean('true', next)).toMatchValidationError({
    type: 'boolean',
    params: { value: 'true' }
  });
  expect(next).not.toHaveBeenCalled();

  expect(boolean(undefined, next)).toMatchValidationError({
    type: 'boolean',
    params: { value: undefined }
  });
  expect(next).not.toHaveBeenCalled();

  expect(boolean(true, next)).toBe(true);
  expect(next).toHaveBeenCalledWith(true);

  expect(boolean(false, next)).toBe(false);
  expect(next).toHaveBeenCalledWith(false);
});

describe('date', () => {
  const middleware = validate.date();

  it('returns value if input is a valid date', () => {
    const next = jest.fn(identity);
    const date = new Date();

    expect(middleware(date, next)).toBe(date);
    expect(next).toHaveBeenCalledWith(date);
  });

  it('returns validation error if input is an invalid date', () => {
    const next = jest.fn(identity);
    const date = new Date('abcdefgh');

    expect(middleware(date, next)).toMatchValidationError({
      type: 'date',
      params: { value: date }
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns validation error if value is a non-date value', () => {
    const next = jest.fn(identity);

    expect(middleware(null, next)).toMatchValidationError({
      type: 'date',
      params: { value: null }
    });
    expect(next).not.toHaveBeenCalled();

    expect(middleware('2020', next)).toMatchValidationError({
      type: 'date',
      params: { value: '2020' }
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('oneOf', () => {
  it('throws if `values` argument is not an array', () => {
    const errorMessage = 'Expected `values` argument to be an array';

    expect(() => validate.oneOf()).toThrow(errorMessage);
    expect(() => validate.oneOf(1234)).toThrow(errorMessage);
    expect(() => validate.oneOf('string')).toThrow(errorMessage);
    expect(() => validate.oneOf({})).toThrow(errorMessage);
  });

  it('checks whether or not the given value is in the `values` array', () => {
    const values = ['string', 100, true, null];
    const next = jest.fn(identity);
    const oneOf = validate.oneOf(values);

    expect(oneOf(false, next)).toMatchValidationError({
      type: 'oneOf',
      params: { values, value: false }
    });
    expect(next).not.toHaveBeenCalled();

    expect(oneOf(undefined, next)).toMatchValidationError({
      type: 'oneOf',
      params: { values, value: undefined }
    });
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
});

describe('unique', () => {
  it('returns validation error if array contains duplicate values', () => {
    const array = [1, 2, 3, 1, 4, 5, 2];
    const unique = validate.unique();
    const next = jest.fn(identity);

    expect(unique(array, next)).toMatchValidationError({
      type: 'unique',
      params: { value: array, duplicates: [1, 2] }
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('returns value if array contains unique values', () => {
    const array = [1, 2, 3, 4, 5];
    const unique = validate.unique();
    const next = jest.fn(identity);

    expect(unique(array, next)).toBe(array);
    expect(next).toHaveBeenCalledWith(array);
  });
});

test('pattern', () => {
  const regexp = /^\d+$/;
  const pattern = validate.pattern(regexp);
  const patternWithType = validate.pattern(regexp, 'digits');
  const next = jest.fn(identity);

  expect(pattern('abc', next)).toMatchValidationError({
    type: 'pattern',
    params: { pattern: regexp, value: 'abc' }
  });
  expect(next).not.toHaveBeenCalled();

  expect(patternWithType('abc', next)).toMatchValidationError({
    type: 'digits',
    params: { pattern: regexp, value: 'abc' }
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
    params: { min: 2, length: 1, value: 'a' }
  });
  expect(next).not.toHaveBeenCalled();

  expect(minLength([1], next)).toMatchValidationError({
    type: 'minLength',
    params: { min: 2, length: 1, value: [1] }
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
    params: { max: 2, length: 3, value: 'abc' }
  });
  expect(next).not.toHaveBeenCalled();

  expect(maxLength([1, 2, 3], next)).toMatchValidationError({
    type: 'maxLength',
    params: { max: 2, length: 3, value: [1, 2, 3] }
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
    params: { min: 2, max: 3, length: 1, value: 'a' }
  });

  expect(lengthBetween('abcd', next)).toMatchValidationError({
    type: 'lengthBetween',
    params: { min: 2, max: 3, length: 4, value: 'abcd' }
  });

  expect(lengthBetween(['a'], next)).toMatchValidationError({
    type: 'lengthBetween',
    params: { min: 2, max: 3, length: 1, value: ['a'] }
  });

  expect(lengthBetween(['a', 'c', 'd', 'e'], next)).toMatchValidationError({
    type: 'lengthBetween',
    params: { min: 2, max: 3, length: 4, value: ['a', 'c', 'd', 'e'] }
  });

  expect(lengthBetween('ab', next)).toBe('ab');
  expect(next).toHaveBeenCalledWith('ab');

  expect(lengthBetween(['a', 'b'], next)).toEqual(['a', 'b']);
  expect(next).toHaveBeenCalledWith(['a', 'b']);
});

test('length', () => {
  const length = validate.length(3);
  const next = jest.fn(identity);

  expect(length('a', next)).toMatchValidationError({
    type: 'length',
    params: { expectedLength: 3, length: 1, value: 'a' }
  });

  expect(length('abcd', next)).toMatchValidationError({
    type: 'length',
    params: { expectedLength: 3, length: 4, value: 'abcd' }
  });

  expect(length(['a'], next)).toMatchValidationError({
    type: 'length',
    params: { expectedLength: 3, length: 1, value: ['a'] }
  });

  expect(length(['a', 'b', 'c', 'd'], next)).toMatchValidationError({
    type: 'length',
    params: { expectedLength: 3, length: 4, value: ['a', 'b', 'c', 'd'] }
  });

  expect(length('abc', next)).toBe('abc');
  expect(next).toHaveBeenCalledWith('abc');

  expect(length(['a', 'b', 'c'], next )).toEqual(['a', 'b', 'c']);
  expect(next).toHaveBeenCalledWith(['a', 'b', 'c']);
});

test('between', () => {
  const between = validate.between(2, 4);
  const next = jest.fn(identity);

  expect(between(1, next)).toMatchValidationError({
    type: 'between',
    params: { min: 2, max: 4, value: 1 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(between(5, next)).toMatchValidationError({
    type: 'between',
    params: { min: 2, max: 4, value: 5 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(between(2, next)).toBe(2);
  expect(next).toHaveBeenCalledWith(2);

  expect(between(4, next)).toBe(4);
  expect(next).toHaveBeenCalledWith(4);
});

test('min', () => {
  const min = validate.min(2);
  const next = jest.fn(identity);

  expect(min(1, next)).toMatchValidationError({
    type: 'min',
    params: { min: 2, value: 1 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(min(2, next)).toBe(2);
  expect(next).toHaveBeenCalledWith(2);

  expect(min(10, next)).toBe(10);
  expect(next).toHaveBeenCalledWith(10);
});

test('max', () => {
  const max = validate.max(2);
  const next = jest.fn(identity);

  expect(max(10, next)).toMatchValidationError({
    type: 'max',
    params: { max: 2, value: 10 }
  });
  expect(next).not.toHaveBeenCalled();

  expect(max(-10, next)).toBe(-10);
  expect(next).toHaveBeenCalledWith(-10);

  expect(max(2, next)).toBe(2);
  expect(next).toHaveBeenCalledWith(2);
});

test('filled', () => {
  const filled = validate.filled();
  const next = jest.fn(identity);

  expect(filled(null, next)).toMatchValidationError({
    type: 'filled',
    params: { value: null }
  });
  expect(next).not.toHaveBeenCalled();

  expect(filled('', next)).toMatchValidationError({
    type: 'filled',
    params: { value: '' }
  });
  expect(next).not.toHaveBeenCalled();

  expect(filled('   ', next)).toMatchValidationError({
    type: 'filled',
    params: { value: '   ' }
  });
  expect(next).not.toHaveBeenCalled();

  expect(filled([], next)).toMatchValidationError({
    type: 'filled',
    params: { value: [] }
  });
  expect(next).not.toHaveBeenCalled();

  expect(filled('string', next)).toBe('string');
  expect(next).toHaveBeenCalledWith('string');

  expect(filled(100, next)).toBe(100);
  expect(next).toHaveBeenCalledWith(100);
});

describe('object', () => {
  it('returns validation error if input is not an object', () => {
    const object = validate.object();
    const next = jest.fn(identity);

    expect(object(null, next)).toMatchValidationError({
      type: 'object',
      params: { value: null }
    });
    expect(next).not.toHaveBeenCalled();

    expect(object(undefined, next)).toMatchValidationError({
      type: 'object',
      params: { value: undefined }
    });
    expect(next).not.toHaveBeenCalled();

    expect(object('string', next)).toMatchValidationError({
      type: 'object',
      params: { value: 'string' }
    });
    expect(next).not.toHaveBeenCalled();

    expect(object(true, next)).toMatchValidationError({
      type: 'object',
      params: { value: true }
    });
    expect(next).not.toHaveBeenCalled();

    expect(object([], next)).toMatchValidationError({
      type: 'object',
      value: null
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('assigns undefined values based on input property presence', () => {
    const object = validate.object({
      username: () => undefined
    });

    expect(object({}, identity)).not.toHaveProperty('username');
    expect(object({ username: undefined }, identity)).toHaveProperty('username');
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
      type: 'string',
      path: 'property'
    });
    expect(error.errors[1]).toMatchValidationError({
      type: 'number',
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

describe('params', () => {
  it('throws if given an invalid `schema` argument', () => {
    const errorMessage = 'Expected the `schema` argument to be an object';

    expect(() => validate.params()).toThrow(errorMessage);
    expect(() => validate.params(null)).toThrow(errorMessage);
    expect(() => validate.params('string')).toThrow(errorMessage);
  });

  describe('validation', () => {
    let params;
    let next;

    beforeEach(() => {
      params = validate.params({
        number: validate.number(),
        string: validate.string(),
        array: validate.array(validate.string()),
        trim: (value, next) => next(value.trim()),
        anything: (value, next) => next(value),
        nested: validate.params({
          string: validate.filled()
        })
      });
      next = jest.fn(identity);
    });

    it('returns validation error if given a non-valid object', () => {
      expect(params(null, next)).toMatchValidationError({
        type: 'object',
        params: { value: null }
      });
      expect(next).not.toHaveBeenCalled();

      expect(params(undefined, next)).toMatchValidationError({
        type: 'object',
        params: { value: undefined }
      });
      expect(next).not.toHaveBeenCalled();

      expect(params('string', next)).toMatchValidationError({
        type: 'object',
        params: { value: 'string' }
      });
      expect(next).not.toHaveBeenCalled();

      expect(params(12345, next)).toMatchValidationError({
        type: 'object',
        params: { value: 12345 }
      });
      expect(next).not.toHaveBeenCalled();

      expect(params(['a', 'b', 'c'], next)).toMatchValidationError({
        type: 'object',
        params: { value: ['a', 'b', 'c'] }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('validates each field and strips unknown properties', () => {
      const result = params({
        number: 1234,
        string: 'string',
        array: ['string'],
        trim: '  trimmed ',
        nested: { string: 'nested.string' },
        anything: [],
        unknown: true,
      }, next);

      const expected = {
        number: 1234,
        string: 'string',
        array: ['string'],
        trim: 'trimmed',
        nested: { string: 'nested.string' },
        anything: []
      };

      expect(result).not.toHaveProperty('unknown');
      expect(result).toEqual(expected);
      expect(next).toHaveBeenCalledWith(result);
    });

    it('handles validation errors', () => {
      const error = params({
        number: 1234,
        string: 1234,
        array: [1234],
        trim: 'trim',
        nested: {},
        anything: [],
      });

      expect(error).toBeValidationError();
      expect(error.errors).toHaveLength(3);
      expect(error.errors[0]).toMatchValidationError({
        type: 'string',
        path: 'string'
      });
      expect(error.errors[1]).toMatchValidationError({
        type: 'string',
        path: 'array[0]'
      });
      expect(error.errors[2]).toMatchValidationError({
        type: 'filled',
        path: 'nested.string'
      });
    });

    it('does not assign undefined properties', () => {
      const result = params({
        number: 1234,
        string: 'string',
        array: ['string'],
        trim: '  trimmed ',
        nested: { string: 'nested.string' },
        anything: undefined,
        unknown: true,
      }, next);

      expect(result).not.toHaveProperty('anything');
    });
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
      type: 'array',
      params: { value: null }
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
      type: 'string',
      path: '[0]'
    });
    expect(error.errors[1]).toMatchValidationError({
      type: 'string',
      path: '[2]'
    });
  });

  it('handles nested validation errors', () => {
    const array = validate.array(validate.array(validate.string()));

    const error = array([[100], ['string'], ['string', false]], identity);
    expect(error).toBeValidationError();
    expect(error.errors).toHaveLength(2);
    expect(error.errors[0]).toMatchValidationError({
      type: 'string',
      path: '[0][0]'
    });
    expect(error.errors[1]).toMatchValidationError({
      type: 'string',
      path: '[2][1]'
    });
  });
});
