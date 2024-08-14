module.exports = {
  plugins: [
    require("postcss-pxtorem")({
      rootValue: 16, // 根字体大小, 1rem = 16px
      propList: ["*"], // 需要转换的属性，['*']表示所有
      selectorBlackList: ["html"], // 忽略转换的选择器
      rootValue: 16, // 适合于普通屏幕的基准像素值，根据设计稿调整
      unitPrecision: 5,
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
    }),
  ],
};
