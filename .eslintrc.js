module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "no-inferrable-types": 0,
    '@typescript-eslint/no-inferrable-types': 'off', // 关闭检查是否有明确指定类型的变量声明，就是可以定义了不需要直接赋值
    "@typescript-eslint/no-var-requires": "off" // 关闭ts对require的数据校验
  }
}