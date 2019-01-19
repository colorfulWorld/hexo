---
title: webpack(一)
date: 2019-01-19 15:17:10
tags: webpack
---
没有仔细研究过webpack 如今开始研究一下

<!--more-->

# 生产环境 

生产环境的依赖

## 一、文件的引用 (dev-server)

```javascript
const path = require('path'); //文件路径的引用方法
const exprass = require('exprass');//node 启动服务
const webpack = require('webpack');//核心运行文件
const config = require('../config');//运行时和开发时的一些配置
const proxyMiddleware = require('http-proxy-middleware');//http代理，代理和转发api
const webpackConfig = process.env.NOOD_ENV === 'testing' //webpack 的相关配置
?require('./webpack.prod.conf'
:require('./webpack.dev.conf')
)

```
## webpack.dev.conf.js
```javascript
const webpack = require('webpack-mergr'); //用来合并配置文件
const baseWebpackConfig = require('./webpack.base.conf');//
const htmlWebpackPlugin = require('./html-webpack-plugin') //html 插件
```

##  webpack.base.conf
```javascript
var projectRoot = path.resolve(_dirname,'../');//定义项目的根目录
module.exports = {
entery:{
    app:'./src/main.js'   //编译的入口配置
};
output:{
    path:config.build.assetsRoot  ;//输出的文件路径
    pablicPath:process.env.NODE_ENV==='production'?config.build.assetsPublicPath:config.dev.assestPublicPath,//请求静态资源的绝对路径
     filename:'[name].js'//输出文件的一个名称 name对应的是entry 所以静态文件会被输出到app.js中
};
resolve:{
extensions:['','.js','.vue'] //自动补全引用文件后缀
fallback:[path.join{_dirname,'../node_modules'}], 
alias:{
    'src':path.resolve(_dirname,'../src'),//提供一些别名 主要是减少引用路径的长度

}
module:{
     preLoaders:[ //preLoaders与loaders 作用类似，利用各种loader对各种文件做编译，输出新的文件处理
        {
            test:/\.vue/,
            loader:'eslint',
            inclued:projectRoot,
            exclude:/node_modules/
        }
    ]，
    loader:[
        {
            rest:/\.value$/,
            loader:'vue'
        },
        {
            test:/\.js$/,
            loaderL:'babel',
            include:projectRoot,
            exclude:/node_modules/ // 排除这些目录
        },
        {
            test:/\.(png|jpe?g|gif\svg)(\?.*)?$/,
            loader:'url',
            query:{
                limit:10000,//文件大小小于10Kb时，将生成base64串，被打包编译到JS里面，否者超过10kb 的话，就会单独生成一个文件
                name:utils.assetsPath('img/[name].[hash:7].[ext]') //文件生成规则
            }
        }
    ]
}
}，
vue:{
    loaders:utils.cssLoaders()
}
}

```