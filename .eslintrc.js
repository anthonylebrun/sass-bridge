module.exports = {
  'env': {
    'es6': true,
    'node': true,
    'mocha': true
  },
  'plugins': [
    'mocha'
  ],
  'extends': [
    'eslint:recommended',
    'plugin:mocha/recommended'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  }
}
