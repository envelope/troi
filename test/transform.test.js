const transform = require('../lib/transform');

test('trim()', () => {
  const trim = transform.trim();
  const next = jest.fn((value) => value);

  expect(trim('', next)).toBe('');
  expect(trim(' ', next)).toBe('');
  expect(trim('\n  \n', next)).toBe('');
  expect(trim('  string  ', next)).toBe('string');
  expect(trim(100, next)).toBe(100);
});

test('nullify()', () => {
  const nullify = transform.nullify();
  const next = jest.fn((value) => value);

  expect(nullify('', next)).toBe(null);
  expect(nullify(' ', next)).toBe(null);
  expect(nullify('\n  \n', next)).toBe(null);
  expect(nullify('string', next)).toBe('string');
  expect(nullify(100, next)).toBe(100);
  expect(nullify(null, next)).toBe(null);
});

test('lowercase()', () => {
  const lowercase = transform.lowercase();
  const next = jest.fn((value) => value);

  expect(lowercase('STRING', next)).toBe('string');
  expect(lowercase('String', next)).toBe('string');
  expect(lowercase(null, next)).toBe(null);
});

test('uppercase()', () => {
  const uppercase = transform.uppercase();
  const next = jest.fn((value) => value);

  expect(uppercase('string', next)).toBe('STRING');
  expect(uppercase('String', next)).toBe('STRING');
  expect(uppercase(null, next)).toBe(null);
});
