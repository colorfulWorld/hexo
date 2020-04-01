---
title: webpack项目配置
date: 2018-01-31 17:15:07
categories: webpack
---
webpack 做的就是分析代码，转换代码，编译代码，输出代码。webpack本身是一个node的模块，所以webpack.config.js是一一commonjs形式书写的


webpack 是模块化管理工具，使用 webpack 可以对模块进行压缩，预处理，按需打包，按需加载等。
Browsersify、webpack 一开始的目的就是打包commonJS模块。

webpack 是一个现代Javascript 应用程序的模块打包器，当webpack处理应用程序时，它会递归的构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成少量的bundle- 通常只有一个，有浏览器加载。

<!--more-->

## webpack 的特征

* 插件化：webpack 本身非常灵活，提供了丰富插件接口。基于这些接口，webpack 开发了很多插件作为内置功能。
* 速度快：webpack 使用异步 IO 以及多级缓存机制。所以 webpack 的速度是很快的，尤其是增量更新。
* 丰富的 loaders：loaders 用来做预处理。这样 webpack 就可以打包任何静态文件。
* 高适配性：webpack 同时支持 AMD/CommonJS/ES6 模块方案。webpack 会静态解析你的代码，自动帮你管理他们的依赖关系。且对第 - 方库的兼容贼好。
* 代码拆分：webpack 提供了很多优化机制来减少打包输出的文件大小，不仅如此它还提供了 hash 机制，来解决浏览器缓存。
* 开发模式友好：webpack 为开发模式也是提供了很多辅助功能。比如 sourceMap、热更新等。
* 适用于很多场景。

## webapck 最佳配置

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

## webpack与gulp的区别
gulp是基于流的构建工具：all in one 的打包模式，输出一个js和一个css文件，优点是减少http请求，万金油方案。
webpack 是模块化管理工具，使用webpack可以对模块进行压缩、预处理、打包、按需加载。

## 一个webpack的命令行选项
- webpack 用于构建一个开发目录
- webpack -p 用于构建一个生产目录（压缩过的）
- webpack --watch 用于连续地构建
- webapck -d 展示映射关系
- webpack --colors 用于美化展示关系
- webpack-dev-server 启动服务器
- webpack --display-error-details//带上参数可以找出详细的错误信息

webpack 会根据webpack.config.js来构建bundle.js
依赖  babel-loader(编译器可以将es6语法转成低版本【如es5语法】提高兼容性)