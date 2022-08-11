const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  },
  filenameHashing: false
})