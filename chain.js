const run = require('./lib/run');
const { ValidationError, isValidationError } = require('./lib/errors');
const validate = require('./lib/validate');
const transform = require('./lib/transform');

const factories = { ...validate, ...transform };
const factoryNames = Object.keys(factories);

const createBuilder = (middlewares) => {
  const builder = (value, next) => {
    const result = run(middlewares, value);

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

  factoryNames.forEach((name) => {
    builder[name] = (...args) => {
      const middleware = factories[name](...args);
      const nextMiddlewares = [...middlewares, middleware];

      return createBuilder(nextMiddlewares);
    };
  });

  return builder;
};

const createFactoryBuilder = (middlewareFactory) => (...args) => {
  const middlewares = [middlewareFactory(...args)];
  return createBuilder(middlewares);
};

factoryNames.forEach((name) => {
  exports[name] = createFactoryBuilder(factories[name]);
});

exports.ValidationError = ValidationError;
exports.isValidationError = isValidationError;
