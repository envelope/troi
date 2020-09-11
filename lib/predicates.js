const unfilled = (input) => (
  input == null ||
  (typeof input === 'string' && input.trim() === '') ||
  (Array.isArray(input) && input.length === 0)
);

const filled = (input) => unfilled(input) === false;

module.exports = { filled };
