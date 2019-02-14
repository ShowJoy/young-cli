module.exports = {
  extends: ['@lianjia/community'],
  rules: {
    'no-console': 'off', // 允许在代码中保留 console 命令
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'camelcase': 'off',
    'no-bitwise': 'off',
    'no-unused-vars': 'off'
  },
  globals: {
    swan: true,
    wx: true,
    App: true,
    Page: true,
    getApp: true,
    Component: true,
    Behavior: true,
    getCurrentPages: true
  }
};