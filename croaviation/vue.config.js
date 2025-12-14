const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
});