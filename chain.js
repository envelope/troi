const run = require('./lib/run');
const { ValidationError, isValidationError } = require('./lib/errors');
const validate = require('./lib/validate');
const transform = require('./lib/transform');

const handlers = { ...validate, ...transform };
const keys = Object.keys(handlers);

const createBuilder = (middleware) => {
  const builder = (value, next) => {
    const result = run(middleware, value);

    if (isValidationError(result)) {
      return result;
    }

    if (next) {
      return next(result);
    }

    return result;
  };

  builder.validate = (value) => {
    const result = builder(value);

    if (isValidationError(result)) {
      throw result;
    }

    return result;
  };

  keys
    .forEach((key) => {
      builder[key] = (...a) => {
        const func = handlers[key](...a);
        const nextMiddleware = [...middleware, func];

        return createBuilder(nextMiddleware);
      };
    });

  return builder;
};

const chainable = (factory) => (...args) => {
  const validators = [factory(...args)];
  return createBuilder(validators);
};

keys.forEach((key) => {
  exports[key] = chainable(handlers[key]);
});

exports.ValidationError = ValidationError;
exports.isValidationError = isValidationError;
