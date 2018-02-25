const config = {
  env: {
    browser: true,
    node: true,
  },

  extends: ['eslint:recommended', 'plugin:react/recommended', 'airbnb-base'],

  plugins: ['react'],

  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': 'off',
    'import/no-unresolved': 'off',
  },

  // Defines other global variables
  // 'false' means disallow overwriting of variable in code
  globals: {
    $: false,
  },
};

module.exports = config;
