const { isValidationError } = require('../../lib/errors');

const property = (equals, received, expected, properties) => {
  for (const property of properties) {
    if (expected[property] === undefined) {
      continue;
    }

    if (equals(received[property], expected[property]) === false) {
      return {
        property,
        expected: expected[property],
        received: received[property]
      };
    }
  }
};

expect.extend({
  toBeValidationError(received) {
    const { matcherHint, printReceived } = this.utils;
    const matcherHintOptions = { isNot: this.isNot };

    return {
      pass: isValidationError(received),
      message: () => (
        matcherHint('toBeValidationError', undefined, undefined, matcherHintOptions) +
        '\n\n' +
        `Expected ${printReceived(received)} ${this.isNot ? 'NOT ' : ''}to be a validation error`
      )
    };
  },

  toMatchValidationError(received, expected) {
    if (typeof received === 'function') {
      try {
        received = received();
      } catch (error) {
        received = error;
      }
    }

    if (isValidationError(received) === false) {
      return {
        pass: false,
        message: () => `Expected ${received} to be a validation error`
      };
    }

    const error = property(this.equals, received, expected, ['type', 'path', 'params']);

    if (error) {
      const { diff } = this.utils;

      return {
        pass: false,
        message: () => (
          `Expected "${error.property}" did not match received:\n` +
          diff(error.received, error.expected)
        )
      };
    }

    return { pass: true };
  }
});
