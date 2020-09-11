const run = require('../lib/run');

it('executes provided validators correctly', () => {
  const func1 = jest.fn((value, next) => next(`${value}.fn1`));
  const func2 = jest.fn((value, next) => next(`${value}.fn2`));
  const func3 = jest.fn((value) => `${value}.fn3`);
  const func4 = jest.fn((value, next) => next(`${value}.fn4`));

  expect(run([func1, func2, func3, func4], 'value')).toBe('value.fn1.fn2.fn3');
  expect(func1).toHaveBeenCalledWith('value', expect.any(Function));
  expect(func2).toHaveBeenCalledWith('value.fn1', expect.any(Function));
  expect(func3).toHaveBeenCalledWith('value.fn1.fn2', expect.any(Function));
  expect(func4).not.toHaveBeenCalled();
});

test.todo('stops execution if next() is called with ValidationError');
