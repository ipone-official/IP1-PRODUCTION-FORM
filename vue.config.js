const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  chainWebpack: config => {
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        return {
          ...options,
          name: 'assets/[name].[hash:8].[ext]',
        };
      });

    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
  },

  transpileDependencies: true,
});
