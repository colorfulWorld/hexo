---
title: webpack(一)
date: 2019-01-19 15:17:10
categories: webpack
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
    loaders:utils.cssLoaders() //对于单独的一些css 编译
}
}

```
# webpack 的特征

* 插件化：webpack 本身非常灵活，提供了丰富插件接口。基于这些接口，webpack 开发了很多插件作为内置功能。
* 速度快：webpack 使用异步 IO 以及多级缓存机制。所以 webpack 的速度是很快的，尤其是增量更新。
* 丰富的 loaders：loaders 用来做预处理。这样 webpack 就可以打包任何静态文件。
* 高适配性：webpack 同时支持 AMD/CommonJS/ES6 模块方案。webpack 会静态解析你的代码，自动帮你管理他们的依赖关系。且对第 - 方库的兼容贼好。
* 代码拆分：webpack 提供了很多优化机制来减少打包输出的文件大小，不仅如此它还提供了 hash 机制，来解决浏览器缓存。
* 开发模式友好：webpack 为开发模式也是提供了很多辅助功能。比如 sourceMap、热更新等。
* 适用于很多场景。

# webapck 最佳配置

webpack 官方提供的配置方法是通过 module.exports 返回一个 json, 但是这种场景不灵活，不能适配多种场景。

```javascript
module.exports = function(env) {
  return {
    context: config.context,
    entry: config.src,
    output: {
      path: path.join(config.jsDest, project),
      filename: '[name].js',
      chunkFilename: '[name].[chunkhash:8].js',
      publicPath: '/assets/' + project + '/'
    },
    devtool: 'eval',
    watch: false,
    profile: true,
    cache: true,
    module: {
      loaders: [{test:/\.jsx?$/,
      exclude:/(node_modulesbowser_companents)/,
      loader:'babel',
      query:{presets:['react','ea2015']}}]
    },
    resolve: {
      alias: getAlias(env)
    },
    plugins: getPlugins(env)
  }
}
```

* context: 上下文。
* entry: 入口文件，是所有依赖关系的入口，webpack 从这个入口开始静态解析，分析模块之间的依赖关系。假设是一个多页面文件，然后需要通过一个对象告诉webpack为每个html生成一个bundle文件。
* output: 打包输出的配置。output的两个配置项“path"和”publicPath"
  - path: 仅仅告诉webpack结果存储在哪里。
  - publicPath: 则被许多webpack的插件同于在生产模式下更新到css、html文件的url值。
* devtools:SourceMap 选项，便于开发模式下调试。
* .babelrc 文件： babal-loader使用"presets"配置项来标识如何将ES6语法转成ES5以及如何转换React的JSX成js文件。我们可以使用"query"参数传入配置。然而在很多项目里面babal的配置可能比较大，因此可以把babal-loader的配置项单独保存在一个名为".babelrc"的文件中，在执行时babal-loader将会自动加载.babelrc文件。
* watch: 监听模式，增量更新，开发必备
* profile: 优化。
* cache: webpack 构建的过程中会生成很多的临时文件，打开 cache 可以让这些临时文件缓存起来，从而更快的构建。
* module.loaders: 如前文介绍，loader 用来对文件做预处理。这样 webpack 就可以打包任何静态文件。
* resolve.alias: 模块别名，这样就可以更方便的引用模块。
* plugins: 如前文介绍，webpack 的一些内置功能均是以插件的形式提供。

# webpack与gulp的区别
gulp是基于流的构建工具：all in one 的打包模式，输出一个js和一个css文件，优点是减少http请求，万金油方案。
webpack 是模块化管理工具，使用webpack可以对模块进行压缩、预处理、打包、按需加载。

# 一个webpack的命令行选项
- webpack 用于构建一个开发目录
- webpack -p 用于构建一个生产目录（压缩过的）
- webpack --watch 用于连续地构建
- webapck -d 展示映射关系
- webpack --colors 用于美化展示关系
- webpack-dev-server 启动服务器
- webpack --display-error-details//带上参数可以找出详细的错误信息

webpack 会根据webpack.config.js来构建bundle.js
依赖  babel-loader(编译器可以将es6语法转成低版本【如es5语法】提高兼容性)