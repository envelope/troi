module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      env: {
        jest: true
      }
    }
  ],
  rules: {
    indent: [
      'error',
      2
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1 }]
  }
}
