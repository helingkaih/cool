const { name } = require('./package');
const path = require('path');
const port = 8083; //这里的端口是必须和父应用配置的子应用端口一致
function resolve(dir) {
  return path.join(__dirname, dir);
};

module.exports = {
  devServer: {
    port,
    headers: {
      //因为qiankun内部请求都是fetch来请求资源，所以子应用必须允许跨域
      "Access-Control-Allow-Origin": "*"
    }
  },
  configureWebpack: {
    output: {
      //资源打包路径
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    }
  },
  assetsDir: 'vueapp' // 必须，将资源打到指定包中，与服务器部署路径相同
}