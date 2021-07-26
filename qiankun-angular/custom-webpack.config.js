const appName = require('./package.json').name;
module.exports = {
  devServer: {
    port: 8082, //这里的端口是必须和父应用配置的子应用端口一致
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    library: `angularApp`,
    libraryTarget: 'umd',
  },
};