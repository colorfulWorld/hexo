---
title: webpack简介
date: 2018-01-31 17:15:07
categories: webpack
---


 webpack 做的就是分析代码，转换代码，编译代码，输出代码。webpack 本身是一个 node 的模块，所以 webpack.config.js 是一一 commonjs 形式书写的

<!--more-->

## webpack 的特征

- 插件化：webpack 本身非常灵活，提供了丰富插件接口。基于这些接口，webpack 开发了很多插件作为内置功能。
- 速度快：webpack 使用异步 IO 以及多级缓存机制。所以 webpack 的速度是很快的，尤其是增量更新。
- 丰富的 loaders：loaders 用来做预处理。这样 webpack 就可以打包任何静态文件。
- 高适配性：webpack 同时支持 AMD/CommonJS/ES6 模块方案。webpack 会静态解析你的代码，自动帮你管理他们的依赖关系。且对第 - 方库的兼容贼好。
- 代码拆分：webpack 提供了很多优化机制来减少打包输出的文件大小，不仅如此它还提供了 hash 机制，来解决浏览器缓存。
- 开发模式友好：webpack 为开发模式也是提供了很多辅助功能。比如 sourceMap、热更新等。
- 适用于很多场景。

## webpack 简单介绍

它会递归地构建一个依赖关系图，其中包含程序需要的每一个模块，然后将所有模块打包成一个或多个 bundle.

### 包含四个核心概念

- 入口(entey):指示 webpack 应该使用哪个模块，来作为构建内部依赖图开始。进入入口起点后，webpack 会造出哪些模块和库是入口起点（直接或是间接）依赖的。
- 出口(output):告诉 webpack 在哪里输出他所创建的 bundles，以及如何命名这些文件。默认值为./dist
- loader:让 webpack 能够去处理那些非 javascript 文件(webpack 只能理解 javascript 和 json)
- 插件(plugins):插件则可以用于执行范围更广的任务。插件范围包括，从打包优化和压缩，一直到重新定义环境中的变量。[插件接口](https://www.webpackjs.com/api/plugins/) 功能及其强大，可以用来处理各种各样的任务
- Chunk：coding split 的产物，我们可以对一些代码打包成一个单独的 chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。在 webpack3 及以前我们都利用 CommonsChunkPlugin 将一些公共代码分割成一个 chunk，实现单独加载。在 webpack4 中 CommonsChunkPlugin 被废弃，使用 SplitChunksPlugin

### 配置分离：webpack 配置文件说明

位于根目录的 config 文件夹下：

- webpack.base.conf.js:主要配置打包所需 entry 入口、module 的 rules、external 配置 jquery 等常用开发库、公用的 plugins（静态资源输出、消除冗余 css/js 代码、自动生成 HTML 模板等）
- webpack.dev.conf.js:主要配置 mode 环境变量、DevServer 快速开发、HMR 模块热替换等等
- webpack.prod.conf.js:主要配置 mode 环境变量、正式环境打包配置优化（html/js/css 压缩合并等）。
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

### publicPath

webpack 提供一个非常有用的配置，该配置能帮助你为项目中的所有资源指定一个基础路径，它被称为公共路径(publicPath)。
其实这里说的所有资源的基础路径是指项目中引用 css，js，img 等资源时候的一个基础路径，这个基础路径要配合具体资源中指定的路径使用，所以其实打包后资源的访问路径可以用如下公式表示

### output.publicPath

`静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径`

忽然想起微前端中要配置 publicPath ,就是用到了这个原理吧，在没有生成该静态文件夹的情况去去访问路径，一般本地时，访问路径=文件夹绝对地址路径，但在特殊情况下，例如 nginx 转发情况下，访问路径 ≠ 绝对文件路径。

### module.rules 中的 publicPath

对于 url-loader 中的 outputPath，单独配置或者写在 name 里面，对于真实的目录结构来说，效果是一样的。但是在生成这个 cdn 路径上来说，效果是有区别的。最终的访问路径都是：publicPath+name。跟 outputPath 没有关系，所以，请注意路径配置。

### mainFields

有一些第三方模块会针对不同环境提供几分代码。 例如分别提供采用 ES5 和 ES6 的 2 份代码，这 2 份代码的位置写在 package.json 文件里，Webpack 会根据 mainFields 的配置去决定优先采用那份代码，mainFields 默认如下：

```javascript
mainFields: ['browser', 'main']
```

Webpack 会按照数组里的顺序去 package.json 文件里寻找，只会使用找到的第一个。

假如你想优先采用 ES6 的那份代码，可以这样配置：

```
mainFields: ['jsnext:main', 'browser', 'main']
```

思考：这个可以用来配 vue 的 cdn 路径吗？dev 开发时 min.js 是无法调试的

### babel 与 polyfill 的关系和区别

### babel

是一个广发使用的 ES6 的转码器，可以将 ES6 代码转为 ES5 代码。注意：babel 默认只转换新的 javascript 语法，而不转换新的 api
@babel-preset-env 就整合了这些语法转义插件
```javascript
//Using plugins:
transform-template-literals {}
transform-literals {}
transform-function-name {}
transform-arrow-functions {}
transform-block-scoped-functions {}
transform-classes {}
transform-object-super {}
```

### polyfill

Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API ，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。用于实现浏览器并不支持的原生 API 的代码
这样就导致了一些新的 API 老版浏览器不兼容。如上述所说，对于新的 API，你可能需要引入 @babel-polyfill 来进行兼容

```javascript
module.exports = {
  entry: ['@babel-polyfill', './src/index.js']
}
```
yarn build 时发现文件体积大了很多，因为上面的代码表示将@babel-polyfill的代码也打包进去，如何进行按需编译呢？在JS中import @babel-polyfill

修改.babelrc
```javascript
{
  "presets": [["@babel/preset-env", { "useBuiltIns": "usage" }]]
}
```

### 使用自动刷新

DecServer 刷新原理：
往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。使用webSocket链接，双工通信

webapck要完全启用HMR需要使用webpack.HotModuleReplacementPlugin。如果webpack或webpack-dev-server 通过命令添加--hot选项启动，这个插件会自动添加，所以不需要添加HotModuleReplacementPlugin到webpack.config.js中。

但是，经实际使用 webpack-dev-server 时发现，在webpack.config.js中仅仅配置了devServer.hot:true，而未添加这个插件的状态下，仍然实现了HMR。

项目启动之后，会进行首次构建打包，控制台中会输出征哥的构建过程，可以观察到一个hash值，每一次代码修改后，保存时都会在控制台上看到hash值更新。

### webpack watch

在项目启动之后，Webpack 会通过 Compiler 类的 Run 方法开启编译构建过程，编译完成后，调用 Watch 方法监听文件变更，当文件发生变化，重新编译，编译完成之后继续监听。

可以看出所谓模块热替换指的是页面在尽量不经过刷新的情况下将页面所引用的js或css等模块进行热替换。这里之所以说是尽量不经过刷新页面是因为webpack在热替换检查失败的情况会刷新整个页面。

**问题：**
webpack-dev-server好像是只监听webpack.config.js中entry入口下文件（如js、css等等）的变动，只有这些文件的变动才会触发实时编译打包与页面刷新，而对于不在entry入口下的html文件，却不进行监听与页面自动刷新。

**解决方法：**

 添加参数 watchContentBase: true，目录contentBase目录下的html文件变化也可监听并刷新

```javascript
  devServer: {
    port: 9000,
    hot: true,
    contentBase: path.join(__dirname, '/example'), //本地服务器所加载文件的目录
    watchContentBase: true,
  }
```

### devServer.watchContentBase

告诉 dev-server 监听 [devServer.contentBase]（＃devservercontentbase）选项提供的文件。 默认情况下禁用。 启用后，文件更改将触发整个页面重新加载。

## webpack 的整个打包流程

1、读取webpack的配置参数
2、启动webpack，创建compiler对象并开始解析项目
3、从入口文件（entry）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树
4、对不同的文件类型的依赖模块文件使用对应的loader进行编译，最终转为javascript文件
5、整个过程中webpack会通过发布订阅模式，向外抛出一些hooks，而webpack的插件即可通过监听这些关键的节点，执行插件任务进而达到敢于输出结果的目的





## 站外资料链接
[深入浅出webpack](http://webpack.wuhaolin.cn/)

