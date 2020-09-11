function run(validators, initialValue) {
  function call(index, value) {
    const validator = validators[index];
    const result = validator
      ? validator(value, call.bind(null, index + 1))
      : value;

    return result;
  }

  return call(0, initialValue);
}

module.exports = run;
