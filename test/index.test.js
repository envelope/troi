const troi = require('..');
const { ValidationError, isValidationError } = require('../lib/errors');
const run = require('../lib/run');
const validate = require('../lib/validate');
const transform = require('../lib/transform');

it('exports correct functions', () => {
  expect(troi).toHaveProperty('run', run);
  expect(troi).toHaveProperty('ValidationError', ValidationError);
  expect(troi).toHaveProperty('isValidationError', isValidationError);
  expect(troi).toMatchObject(validate);
  expect(troi).toMatchObject(transform);
});
