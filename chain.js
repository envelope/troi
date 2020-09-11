const run = require('./lib/run');
const { ValidationError, isValidationError } = require('./lib/errors');
const validate = require('./lib/validate');
const transform = require('./lib/transform');

const handlers = { ...validate, ...transform };
const keys = Object.keys(handlers);

const chainable = (factory) => (...args) => {
  const validators = [factory(...args)];
  const builder = (value, next) => run(validators, value, next);

  keys
    .forEach((key) => {
      builder[key] = (...a) => {
        validators.push(handlers[key](...a));
        return builder;
      };
    });

  return builder;
};

keys.forEach((key) => {
  exports[key] = chainable(handlers[key]);
});

exports.ValidationError = ValidationError;
exports.isValidationError = isValidationError;
