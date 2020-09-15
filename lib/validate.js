const { ValidationError, isValidationError, joinPaths } = require('./errors');
const { identity } = require('./utils');
const predicates = require('./predicates');

const { hasOwnProperty } = Object.prototype;

const required = () => (value, next) => {
  if (value !== undefined) {
    return next(value);
  }

  return new ValidationError('required');
};

const string = () => (value, next) => {
  if (typeof value === 'string') {
    return next(value);
  }

  return new ValidationError('type', { type: 'string' });
};

const number = () => (value, next) => {
  if (typeof value === 'number' && isFinite(value)) {
    return next(value);
  }

  return new ValidationError('type', { type: 'number' });
};

const integer = () => (value, next) => {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return next(value);
  }

  return new ValidationError('type', { type: 'integer' });
};

const boolean = () => (value, next) => {
  if (typeof value === 'boolean') {
    return next(value);
  }

  return new ValidationError('type', { type: 'boolean' });
};

const oneOf = (values) => {
  if (Array.isArray(values) === false) {
    throw new Error('Expected `values` argument to be an array');
  }

  return (value, next) => {
    if (values.includes(value)) {
      return next(value);
    }

    return new ValidationError('oneOf', { values });
  };
};

const optional = () => (value, next) => {
  if (value === undefined) {
    return value;
  }

  return next(value);
};

const filled = () => (value, next) => {
  if (predicates.filled(value)) {
    return next(value);
  }

  return new ValidationError('filled');
};

const nullable = () => (value, next) => {
  if (value === null) {
    return value;
  }

  return next(value);
};

const object = (properties) => {
  const keys = properties ? Object.keys(properties) : [];

  return (object, next) => {
    if (object == null || typeof object !== 'object' || Array.isArray(object)) {
      return new ValidationError('type', { type: 'object' });
    }

    const errors = [];

    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      const hasProperty = hasOwnProperty.call(object, key);
      const value = hasProperty ? object[key] : undefined;
      const result = properties[key](value, identity);

      if (isValidationError(result)) {
        const error = result;

        error.each((inner) => {
          inner.path = joinPaths(key, inner.path);
        });

        errors.push(...(error.errors ? error.errors : [error]));
        continue;
      }

      if (value !== undefined || hasProperty) {
        object[key] = result;
      }
    }

    if (errors.length > 0) {
      return new ValidationError(errors);
    }

    return next(object);
  };
};

const array = (itemValidator) => {
  if (itemValidator && typeof itemValidator !== 'function') {
    throw new Error('Expected `itemValidator` argument to be a function');
  }

  return (array, next) => {
    if (Array.isArray(array) === false) {
      return new ValidationError('type', { type: 'array' });
    }

    if (!itemValidator) {
      return next(array);
    }

    const errors = [];

    for (let index = 0; index < array.length; index += 1) {
      const value = array[index];
      const result = itemValidator(value, identity);

      if (isValidationError(result)) {
        const error = result;
        const key = `[${index}]`;

        error.each((inner) => {
          inner.path = joinPaths(key, inner.path);
        });

        errors.push(...(error.errors ? error.errors : [error]));
        continue;
      }

      if (result !== value) {
        array[index] = result;
      }
    }

    if (errors.length > 0) {
      return new ValidationError(errors);
    }

    return next(array);
  };
};

const between = (min, max) => (value, next) => {
  if (value >= min && value <= max) {
    return next(value);
  }

  return new ValidationError('between', { min, max });
};

const pattern = (regexp, errorType = 'pattern') => (value, next) => {
  if (regexp.test(value)) {
    return next(value);
  }

  return new ValidationError(errorType, { pattern: regexp });
};

const email = pattern.bind(null,
  // eslint-disable-next-line
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
  'email'
);

const minLength = (min) => (value, next) => {
  const valueLength = value.length;

  if (valueLength >= min) {
    return next(value);
  }

  return new ValidationError('minLength', { min, length: valueLength });
};

const maxLength = (max) => (value, next) => {
  const valueLength = value.length;

  if (valueLength <= max) {
    return next(value);
  }

  return new ValidationError('maxLength', { max, length: valueLength });
};

const lengthBetween = (min, max) => (value, next) => {
  const valueLength = value.length;

  if (valueLength >= min && valueLength <= max) {
    return next(value);
  }

  return new ValidationError('lengthBetween', { min, max, length: valueLength });
};

module.exports = {
  required,
  string,
  number,
  integer,
  boolean,
  oneOf,
  filled,
  pattern,
  email,
  between,
  minLength,
  maxLength,
  lengthBetween,
  nullable,
  optional,
  object,
  array
};
