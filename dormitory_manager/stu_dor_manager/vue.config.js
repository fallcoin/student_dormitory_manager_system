module.exports = {
  lintOnSave: false,
  devServer: {
    // 设置代理，处理跨域请求
    proxy: {
      '/api': {
        target: 'http://localhost:8888/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
