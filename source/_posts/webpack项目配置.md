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


## webpack简单介绍
它会递归地构建一个依赖关系图，其中包含程序需要的每一个模块，然后将所有模块打包成一个或多个bundle.

### 包含四个核心概念
- 入口(entey):指示webpack应该使用哪个模块，来作为构建内部依赖图开始。进入入口起点后，webpack会造出哪些模块和库是入口起点（直接或是间接）依赖的。
- 出口(output):告诉webpack在哪里输出他所创建的bundles，以及如何命名这些文件。默认值为./dist
- loader:让webpack能够去处理那些非javascript文件(webpack只能理解javascript和json)
- 插件(plugins):插件则可以用于执行范围更广的任务。插件范围包括，从打包优化和压缩，一直到重新定义环境中的变量。[插件接口](https://www.webpackjs.com/api/plugins/)  功能及其强大，可以用来处理各种各样的任务
- Chunk：coding split的产物，我们可以对一些代码打包成一个单独的chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。在webpack3及以前我们都利用CommonsChunkPlugin将一些公共代码分割成一个chunk，实现单独加载。在webpack4 中CommonsChunkPlugin被废弃，使用SplitChunksPlugin


### 配置分离：webpack 配置文件说明

位于根目录的config文件夹下：

- webpack.base.conf.js:主要配置打包所需entry 入口、module的rules、external配置jquery等常用开发库、公用的plugins（静态资源输出、消除冗余css/js代码、自动生成HTML模板等）
- webpack.dev.conf.js:主要配置mode环境变量、DevServer快速开发、HMR模块热替换等等
- webpack.prod.conf.js:主要配置mode环境变量、正式环境打包配置优化（html/js/css压缩合并等）。
- webpack.rules.conf.js:配置常规 loader

## webpack 配置

```javascript
const path = require('path');
module.exports = {
  entry: "./app/entry", // string | object | array
  // Webpack打包的入口
  output: {  // 定义webpack如何输出的选项
    path: path.resolve(__dirname, "dist"), // string
    // 所有输出文件的目标路径
    filename: "[chunkhash].js", // string
    // 「入口(entry chunk)」文件命名模版
    publicPath: "/assets/", // string
    // 构建文件的输出目录
    /* 其它高级配置 */
  },
  module: {  // 模块相关配置
    rules: [ // 配置模块loaders，解析规则
      {
        test: /\.jsx?$/,  // RegExp | string
        include: [ // 和test一样，必须匹配选项
          path.resolve(__dirname, "app")
        ],
        exclude: [ // 必不匹配选项（优先级高于test和include）
          path.resolve(__dirname, "app/demo-files")
        ],
        loader: "babel-loader", // 模块上下文解析
        options: { // loader的可选项
          presets: ["es2015"]
        },
      },
  },
  resolve: { //  解析模块的可选项
    modules: [ // 模块的查找目录
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    extensions: [".js", ".json", ".jsx", ".css"], // 用到的文件的扩展
    alias: { // 模块别名列表
      "module": "new-module"
	  },
  },
  devtool: "source-map", // enum
  // 为浏览器开发者工具添加元数据增强调试
  plugins: [ // 附加插件列表
    // ...
  ],
}

```

## publicPath

webpack 提供一个非常有用的配置，该配置能帮助你为项目中的所有资源指定一个基础路径，它被称为公共路径(publicPath)。
其实这里说的所有资源的基础路径是指项目中引用css，js，img等资源时候的一个基础路径，这个基础路径要配合具体资源中指定的路径使用，所以其实打包后资源的访问路径可以用如下公式表示

## output.publicPath
`静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径`

忽然想起微前端中要配置publicPath ,就是用到了这个原理吧，在没有生成该静态文件夹的情况去去访问路径，一般本地时，访问路径=文件夹绝对地址路径，但在特殊情况下，例如nginx 转发情况下，访问路径≠绝对文件路径。

## module.rules 中的 publicPath

对于url-loader中的outputPath，单独配置或者写在name里面，对于真实的目录结构来说，效果是一样的。但是在生成这个cdn路径上来说，效果是有区别的。最终的访问路径都是：publicPath+name。跟outputPath没有关系，所以，请注意路径配置。

### publicPath配置cdn
