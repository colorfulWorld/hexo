---
title: webpack项目配置
date: 2018-01-31 17:15:07
categories: 项目构建工具
---

webpack 是模块化管理工具，使用 webpack 可以对模块进行压缩，预处理，按需打包，按需加载等。

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
      loaders: getLoaders(env)
    },
    resolve: {
      alias: getAlias(env)
    },
    plugins: getPlugins(env)
  }
}
```

* context: 上下文。
* entry: 入口文件，是所有依赖关系的入口，webpack 从这个入口开始静态解析，分析模块之间的依赖关系。
* output: 打包输出的配置。
* devtools:SourceMap 选项，便于开发模式下调试。
* watch: 监听模式，增量更新，开发必备
* profile: 优化。
* cache: webpack 构建的过程中会生成很多的临时文件，打开 cache 可以让这些临时文件缓存起来，从而更快的构建。
* module.loaders: 如前文介绍，loader 用来对文件做预处理。这样 webpack 就可以打包任何静态文件。
* resolve.alias: 模块别名，这样就可以更方便的引用模块。
* plugins: 如前文介绍，webpack 的一些内置功能均是以插件的形式提供。

