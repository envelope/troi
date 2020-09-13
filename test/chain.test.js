const troi = require('../chain');
const run = require('../lib/run');
const validate = require('../lib/validate');
const transform = require('../lib/transform');
const { ValidationError, isValidationError } = require('../lib/errors');

test('example', () => {
  const schema = troi.object({
    username: troi.filled()
      .string()
      .trim()
      .lengthBetween(2, 10),
    email: troi.filled()
      .lowercase()
      .email(),
    password: troi.filled()
      .string()
      .lengthBetween(3, 30)
      .pattern(/^[a-zA-Z0-9]+$/)
  });

  const params = schema({
    username: ' envelope ',
    email: 'JOHN@DOE.COM',
    password: 'Secure1337'
  });

  expect(params).toEqual({
    username: 'envelope',
    email: 'john@doe.com',
    password: 'Secure1337'
  });
});

it('returns a chainable function', () => {
  const required = troi.required();

  expect(typeof required).toBe('function');
});

it('exports all available validate and transform functions', () => {
  const keys = Object.keys(troi);
  const expected = Object.keys({ ...validate, ...transform });

  expect(keys).toEqual(expect.arrayContaining(expected));
});

it('exports ValidationError', () => {
  expect(troi).toHaveProperty('ValidationError', ValidationError);
  expect(troi).toHaveProperty('isValidationError', isValidationError);
});

describe('builder', () => {
  it('returns a valid middleware function', () => {
    const trimString = troi.trim().string();
    const lowerCase = troi.lowercase();

    expect(run([trimString, lowerCase], '  INPUT  ')).toBe('input');
    expect(run([trimString, lowerCase], null)).toBeValidationError();
  });
});
