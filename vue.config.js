const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const resolve = (dir) => path.resolve(__dirname,dir)
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false ,


})
