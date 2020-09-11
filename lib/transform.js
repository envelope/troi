const trim = () => (value, next) => {
  if (typeof value === 'string') {
    value = value.trim();
  }

  return next(value);
};

const nullify = () => (value, next) => {
  if (typeof value === 'string' && value.trim() === '') {
    value = null;
  }

  return next(value);
};

const lowercase = () => (value, next) => {
  if (typeof value === 'string') {
    value = value.toLowerCase();
  }

  return next(value);
};

const uppercase = () => (value, next) => {
  if (typeof value === 'string') {
    value = value.toUpperCase();
  }

  return next(value);
};

module.exports = { trim, nullify, lowercase, uppercase };
