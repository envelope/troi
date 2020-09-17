class ValidationError extends Error {
  constructor(type, params, path) {
    super();

    this.name = 'ValidationError';

    if (Array.isArray(type)) {
      const errors = type;

      this.type = 'aggregate';
      this.errors = [].concat(errors);
    } else {
      this.type = type;
      this.params = params;
      this.path = path;
    }
  }

  each(callback) {
    if (this.errors) {
      this.errors.forEach((error) => callback(error));
      return;
    }

    callback(this);
  }
}

function isValidationError(error) {
  return error instanceof ValidationError;
}

function joinPaths(...paths) {
  return paths.reduce((path, segment) => {
    if (!segment) {
      return path;
    }

    if (segment.charAt(0) === '[') {
      return `${path}${segment}`;
    } else if (path) {
      return `${path}.${segment}`;
    }

    return segment;
  }, '');
}

module.exports = {
  ValidationError,
  isValidationError,
  joinPaths
};
