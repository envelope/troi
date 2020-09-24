# Troi

Troi is a middleware-based data validation and sanitization library.

[![Build Status](https://travis-ci.org/envelope/troi.svg?branch=master)](https://travis-ci.org/envelope/troi)
[![npm version](https://img.shields.io/npm/v/troi.svg?style=flat-square)](https://www.npmjs.com/package/troi)

## Installation

```
npm install troi
```

## Example

```JavaScript
const troi = require('troi/chain');

const schema = troi.object({
  username: troi.filled()
    .string()
    .trim()
    .lengthBetween(2, 10),
  email: troi.filled()
    .lowercase()
    .email(),
  password: troi.filled()
    .string()
    .lengthBetween(3, 30)
    .pattern(/^[a-zA-Z0-9]+$/)
});

schema.validate({
  username: 'karate-kid',
  email: 'larusso@example.org',
  password: 'n0C0br4k4i'
});
// -> { username: 'karate-kid', email: 'larusso@example.org', password: 'N0C0br4k4i' }

schema.validate({
  username: 'karate-kid'
});
// Throws validation error
```

### API
Work in progress

#### `filled()`
#### `required()`
#### `optional()`
#### `nullable()`
#### `string()`
#### `number()`
#### `integer()`
#### `boolean()`
#### `array(itemValidator?: function)`
#### `object(properties?: object)`
#### `params(schema: object)`
#### `oneOf(values: Array<any>)`
#### `between(min: number, max: number)`
#### `min(min: number)`
#### `max(max: number)`
#### `lengthBetween(min: number, max: number)`
#### `minLength(min: number)`
#### `maxLength(min: number)`
#### `pattern(regexp: RegExp, type?: string)`
#### `email()`
#### `lowercase()`
#### `uppercase()`

### Chain API

Work in progress

## Concepts and Terminology

### Middleware Function

Middleware functions can perform the following tasks:

- return validation errors and stop further execution
- transform values (examples: `trim`, `nullify`)
- intercept execution (examples: `optional`, `nullable`)

### Transform function

A middleware function that *may* transform its `input` argument and return another value.

```JavaScript
const trim = (input, next) => next(typeof input === 'string' ? input.trim() : input);
```

### Interceptor function

A middleware function that *may* stop the execution of remaining middleware functions.

```JavaScript
const optional = (input, next) => input === undefined ? input : next(input)
```

### Identity Function

A function that always returns the same value that was used as its argument.

```JavaScript
identity('string') // returns 'string'
```

## Todos
- [ ] Allow middleware to pass `ValidationError` to `next()` and stop execution
- [ ] Make chain builder immutable
- [ ] Add `coerce` transform function
- [ ] Rename all `value` arguments to `input` for consistency
- [ ] Use rollup.js
