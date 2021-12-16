const appName = require('./package.json').name;
module.exports = (config) => {
    config.devServer = Object.assign(config.devServer || {}, {
        port: 8082, //这里的端口是必须和父应用配置的子应用端口一致
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });
    config.output = Object.assign(config.output, {
        library: `${appName}-[name]`,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${appName}`,
    });
    return config;
};