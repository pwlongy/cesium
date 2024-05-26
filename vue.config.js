const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin");

let cesiumSource = './node_modules/cesium/Source/' 
const cesiumWorkers = '../Build/Cesium/Workers'


module.exports = defineConfig({
  outputDir: "dist", 
  lintOnSave: false,
  transpileDependencies: true,

  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        '@': path.resolve('src'),
        //'cesium': path.resolve(__dirname, cesiumSource),//如果有依赖cesium的库就需要下面这种。
        'cesium': path.resolve(__dirname, './node_modules/cesium/')
      },
      // 参考官方github的，我不太懂webpack，所以都不知道咋解决https zlib问题  必写-2
      fallback: { "https": false, "zlib": false, "http": false, "url": false },
    },
    plugins: [
      // 对于webpack版本此处有不同配置，webpack低版本5.x执行下面4行注释的代码，对于webpack高版本9.x及以上，patterns是可以的。
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
          { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
          { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
          { from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty' },//需要整个ThirdParty
        ],
      }),
      // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Workers'), to: 'Workers'}]),
      // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
      // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
      // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty'}]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
        // CopyWebpackPlugin from的绝对路径
      })
    ],

    // 不使用这个loader，也就不用安装
    
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "@open-wc/webpack-import-meta-loader",
          },
        },
        {
          test: /\.(glb|gltf)?$/,
          use: {
            loader: "url-loader",
          },
        },
      ],
    },
  }
})
