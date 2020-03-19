module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-alert': 'off',
    'func-names': 'off',
    'space-before-function-paren': 'off',
    'import/prefer-default-export': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
