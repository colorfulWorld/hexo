---
title: webpack打包优化
date: 2019-07-22 15:37:14
categories: webpack
tags:
---

webpack 的使用及优化

我们的目的

- 减小打包后的文件大小
- 首页按需引入文件
- 优化 webpack 打包时间

<!--more-->

## 新建项目

新建一个空文件夹，用于创建项目，使用 npm init 命令创建一个 package.json 文件。  
输入这个命令后，终端会问你一系列诸如项目名称，项目描述，作者等信息，也可以使用 npm init -y 这个命令来一次生成 package.json 文件，这样终端不会询问你问题。

## 安装 webpack

安装 webapck 时把 webpack-cli 也装上是因为在 webpack4.x 版本后 webpack 模块把一些功能分到了 webpack-cli 模块，所以两者都需要安装，安装方法如下：

```javascript
npm install webpack webpack-cli --global    //这是安装全局webpack及webpack-cli模块
npm install webpack webpack-cli --save-dev  //这是安装本地项目模块
```

## 新建文件

在根目录件夹中新建两个文件夹，分别为 src 文件夹和 dist 文件夹，接下来再创建三个文件:此时，项目结构如下

- index.html --放在 dist 文件夹中；
- hello.js --放在 src 文件夹中；
- index.js --放在 src 文件夹中；

###  index.html 中写下 html 代码，它的作用是为了引入我们打包后的 js 文件：

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Webpack Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
    <!--这是打包之后的js文件，我们暂时命名为bundle.js-->
  </body>
</html>
```

### 在 hello.js 中导出一个模块：

```js
// hello.js
module.exports = function () {
  let hello = document.createElement('div')
  hello.innerHTML = 'welcome to China!'
  return hello
}
```

### 在 index.js 中引入这个模块（hello.js）:

```js
//index.js
const hello = require('./hello.js')
document.querySelector('#root').appendChild(hello())
```

上述操作就相当于我们把 hello.js 模块合并到了 index.js 模块，之后我们打包时就只需把 index.js 模块打包成 bundle.js 即可。

### 进行最简单的 webpack 打包

```javascript
// 在终端中使用如下命令进行打包：
webpack src/index.js --output dist/bundle.js
```

上述就相当于把 src 文件夹下的 index.js 文件打包到 dist 文件下的 bundle.js，这时就生成了 bundle.js 供 index.html 文件引用。现在打开 index.html 就可以看到我们的页面了。

## 配置 webpack.config.js

上述打包方式太 low 了，我们可以在当前项目的根目录下新建一个配置文件 webpack.config.js 用来配置打包方式。
webpack.config.js 配置如下

```js
const path = require('path') // 处理绝对路径
module.exports = {
  entry: path.join(__dirname, '/src/index.js'), // 入口文件
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    filename: 'bundle.js', //打包后输出文件的文件名
  },
}
```

有了这个配置文件，我们只需在终端中运行 webpack 命令就可进行打包，这条命令会自动引用 webpack.config.js 文件中的配置选项。

## 构建本地服务器

现在我们是通过打开本地文件来查看页面的，感觉还是有点 low。例如 vue, react 等脚手架都是在本地服务器运行的。所以我们再做进一步优化。

### webpack-dev-server 配置本地服务器

Webpack 提供了一个可选的本地开发服务器，这个本地服务器基于 node.js 构建，它是一个单独的组件，在 webpack 中进行配置之前需要单独安装它作为项目依赖：npm i webpack-dev-server -D

以下是 devServer 的一些配置选项:

- contentBase ：设置服务器所读取文件的目录，当前我们设置为"./dist"
- port ：设置端口号，如果省略，默认为 8080
- inline ：设置为 true，当源文件改变时会自动刷新页面
- historyApiFallback ：设置为 true，所有的跳转将指向 index.html

现在我们把这些配置加到 webpack.config.js 文件上，如下：

```js
// webpack.config.js
const path = require('path')
module.exports = {
  entry: path.join(__dirname, '/src/index.js'), // 入口文件
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    filename: 'bundle.js', //打包后输出文件的文件名
  },
  devServer: {
    contentBase: './dist', // 本地服务器所加载文件的目录
    port: '8088', // 设置端口号为8088
    inline: true, // 文件修改后实时刷新
    historyApiFallback: true, //不跳转
  },
}
```

### package.json 文件中添加启动和打包命令

package.json 文件修改如下

```javascript
{
  "name": "webpack-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server --open"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.23.1",
    "webpack-cli": "^3.1.2",
    "webpack-dev-server": "^3.1.10"
  }
}
```

这样我们就可以用以下命令进行本地运行或者打包文件了

- npm run dev 启动本地服务器，webpack-dev-server 就是启动服务器的命令，--open 是用于启动完服务器后自动打开浏览器。
- npm run build 执行打包命令

此时，我们只要输入 npm run dev 就可以在 http://localhost:8088/中查看页面了。

## 配置常用 loader

loader 可以让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

Loaders 的配置包括以下几方面：

- test：一个用以匹配 loaders 所处理文件的拓展名的正则表达式（必须）
- loader：loader 的名称（必须）
- include/exclude：手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
- options：为 loaders 提供额外的设置选项（可选）

### 配置 css-loader 和 sass-loader

如果我们要加载一个 css 文件，需要安装配置 style-loader 和 css-loader。  
如果我们要使用 sass，就要配置 sass-loader 和 node-sass。

- css-loader：加载.css 文件
- style-loader：使用 style 标签将 css-loader 内部样式注入到我们的 HTML 页面

```javascript
const path = require('path')
module.exports = {
  entry: path.join(__dirname, '/src/index.js'), // 入口文件
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    filename: 'bundle.js' //打包后输出文件的文件名
  },
  devServer: {
    contentBase: './dist', // 本地服务器所加载文件的目录
    port: '8088', // 设置端口号为8088
    inline: true, // 文件修改后实时刷新
    historyApiFallback: true //不跳转
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配以.css结尾的文件
        use: ['style-loader', 'css-loader']
      {
        test: /\.(scss|sass)$/, // 正则匹配以.scss和.sass结尾的文件
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}
```

#### css压缩
css 代码也可以像Javascript 那样被压缩，以达到提升加速度和代码混淆的作用。目前比较成熟可靠的CSS压缩工具是cssnano，基于postcss。

cssnano能理解CSS代码的含义，而不仅仅是删除空格，例如：
- margin:10px 20px 10px 20px 被压缩成margin：10px 20px
- color：#ff0000 被压缩成color:red

通常压缩率能达到60%，cssnano介入到webpack 中很简单，因为css-loader 已经内置了，只需要开启css-loader的minimize选项，相关配置如下：
```javascript
const path = require('path');
const {WebPlugin} = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,// 增加对 CSS 文件的支持
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 通过 minimize 选项压缩 CSS 代码
          use: ['css-loader?minimize']
        }),
      },
    ]
  },
  plugins: [
    // 用 WebPlugin 生成对应的 HTML 文件
    new WebPlugin({
      template: './template.html', // HTML 模版文件所在的文件路径
      filename: 'index.html' // 输出的 HTML 的文件名称
    }),
    new ExtractTextPlugin({
      filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 Hash 值
    }),
  ],
};
```
### 配置 Babel-loader

Babel 其实是一个编译 JavaScript 的平台，它可以编译代码帮你达到以下目的：

- 让你能使用最新的 JavaScript 代码（ES6，ES7...）；
- 让你能使用基于 JavaScript 进行了拓展的语言，比如 React 的 JSX；

```javascript
module: {
  ...
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src')]
    }
  ]
}
```

由于 loader 对文件的转换操作很耗时，需要让尽可能少的文件被 loader 处理，可以通过 test、include、exclude 三个配置来命中 loader 要应用规则的文件。为了尽可能少的让文件被 loader 处理，可以通过 include 去命中只有哪些文件被处理


### 处理图片

处理图片资源时，我们常用的两种 loader 是 file-loader 或者 url-loader。
当使用 url-loader 加载图片，图片小于上限值，则将图片转 base64 字符串，否则使用 file-loader 加载图片。

```javascript
module: {
  ...
  rules: [
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    }
  ]
}
```

### cache-loader

一些性能开销较大的 loader 之前添加 cache-loader，将结果缓存在磁盘中，默认保存在 node_modueles/.cache/cache-loader 目录下。
首先安装依赖

```javascript
npm install cache-loader -D
```

`cache-loader `的配置要放在其他的 loader 之前，webpack 的配置如下：

```javascript
module.exports = {
  //...

  module: {
    //我的项目中,babel-loader耗时比较长，所以我给它配置了`cache-loader`
    rules: [
      {
        test: /\.jsx?$/,
        use: ['cache-loader', 'babel-loader'],
      },
    ],
  },
}
```
若是只想给babel-loader配置cache的话，也可以不使用cache-loader，给babel-loader增加选项CacheDirectory。
cacheDirectory：默认值为 false。当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 Webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程。设置空值或者 true 的话，使用默认缓存目录：node_modules/.cache/babel-loader。开启 babel-loader的缓存和配置 cache-loader，我比对了下，构建时间很接近。

## 7、配置常用插件

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

### 7.1、自动生成 html 文件(HtmlWebpackPlugin)

现在我们都是使用一开始建好的 index.html 文件，然后手动引入 bundle.js，如果以后我们引入不止一个 js 文件，那就得更改 index.html 中的 js 文件名，所以能不能自动生成 index.html 且自动引用打包后的 js 呢？  
HtmlWebpackPlugin 插件就是用来解决这个问题的：

1. 安装插件 npm i html-webpack-plugin -D
2. 把 dist 文件夹清空
3. 在根目录新建 index.html,内容和原来的 html 一致，只是不引入 js 文件。
4. webpack.config.js 中我们引入了 HtmlWebpackPlugin 插件

```javascript
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    },
  }),
]
```

此时我们使用 npm run build 进行打包，你会发现，dist 文件夹和 html 文件都会自动生成。

### 7.2、清理/dist 文件夹(CleanWebpackPlugin)

在每次构建前清理/dist 文件夹，生产最新的打包文件，这时候就用到 CleanWebpackPlugin 插件了。

1. 安装 npm i clean-webpack-plugin -D
2. 配置 webpack.config.js

```javascript
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    },
  }),
  new CleanWebpackPlugin(['dist']),
]
```

### 7.3、热更新(HotModuleReplacementPlugin)

我们要在修改代码后自动更新页面，这就需要 HotModuleReplacementPlugin（HMR）插件

1. devServer 配置项中添加 hot: true 参数。
2. 因为 HotModuleReplacementPlugin 是 webpack 模块自带的，所以引入 webpack 后，在 plugins 配置项中直接使用即可。

```javascript
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  }),
  new CleanWebpackPlugin(['dist'])
  new webpack.HotModuleReplacementPlugin()
]
```

### 7.4、增加 css 前缀

平时我们写 css 时，一些属性需要手动加上前缀，比如-webkit-border-radius: 10px;，在 webpack 中我们可以让他自动加上

1. 安装 npm i postcss-loader autoprefixer -D
2. 在项目根目录下新建 postcss.config.js 文件

```javascript
module.exports = {
  plugins: [
    require('autoprefixer'), // 引用autoprefixer模块
  ],
}
```

3. 修改 webpack.config.js 文件中的 css-loader 配置

```javascript
module.exports = {
   ...
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配以.css结尾的文件
        use: [
          { loader: 'style-loader' }, // 这里采用的是对象配置loader的写法
          { loader: 'css-loader' },
          { loader: 'postcss-loader' } // 使用postcss-loader
        ]
      }
       ...
    ]
  }
   ...
}
```

### 7.5、css 分离 ExtractTextPlugin

将 css 成生文件，而非内联。该插件的主要是为了抽离 css 样式,防止将样式打包在 js 中引起页面样式加载错乱的现象。

1. 安装 npm i extract-text-webpack-plugin@next -D
2. 在 webpack.config.js 文件中引入并使用该插件：

```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin') //引入分离插件
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配以.css结尾的文件
        use: ExtractTextPlugin.extract({
          // 相当于回滚，经postcss-loader和css-loader处理过的css最终再经过style-loader处理
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader'],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('css/index.css'), // 将css分离到/dist文件夹下的css文件夹中的index.css
  ],
}
```

此时运行 npm run build 后会发现/dist 文件夹内多出了/css 文件夹及 index.css 文件。

### 7.6、消除冗余 css

有时候我们 css 写得多了，可能会不自觉的写重复了一些样式，这就造成了多余的代码，以下方法可以优化

1. 安装 npm i purifycss-webpack purify-css glob -D
2. 引入 clean-webpack-plugin 及 glob 插件并使用

```javascript
const PurifyCssWebpack = require('purifycss-webpack') // 引入PurifyCssWebpack插件
const glob = require('glob') // 引入glob模块,用于扫描全部html文件中所引用的css

plugins: [
  new PurifyCssWebpack({
    paths: glob.sync(path.join(__dirname, 'src/*.html')), // 同步扫描所有html文件中所引用的css
  }),
]
```

### 至此，一些常用的配置以及弄好了，现在就开始愉快地写代码了。

#### 下面将讲述 webpack 的优化方法。以下的例子是由 vue-cli 脚手架搭建的项目，跟上述例子无关。

————————————————————————————————————————————

## webpack 打包优化

### 为什么要优化打包？

- 项目越做越大，依赖包越来越多，打包文件太大
- 单页面应用首页白屏时间长，用户体验差

### 我们的目的

- 减小打包后的文件大小
- 首页按需引入文件
- 优化 webpack 打包时间


### 按需加载

1.1 路由组件按需加载

```javascript
const router = [
  {
    path: '/index',
    component: (resolve) =>
      require.ensure([], () => resolve(require('@/components/index'))),
  },
  {
    path: '/about',
    component: (resolve) =>
      require.ensure([], () => resolve(require('@/components/about'))),
  },
]
```

1.2 第三方组件和插件。按需加载需引入第三方组件

```javascript
// 引入全部组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 按需引入组件
import { Button } from 'element-ui'
Vue.component(Button.name, Button)
```

1.3 对于一些插件，如果只是在个别组件中用的到，也可以不要在 main.js 里面引入，而是在组件中按需引入

```javascript
// 在main.js引入
import Vue from vue
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

// 按组件按需引入
import { Vuelidate } from 'vuelidate'
```

### 优化 loader 配置

- 优化正则匹配
- 通过 cacheDirectory 选项开启缓存
- 通过 include、exclude 来减少被处理的文件。

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      include: [resolve('src')],
    },
  ]
}
```

### 优化文件路径——省下搜索文件的时间

- extension 配置之后可以不用在 require 或是 import 的时候加文件扩展名,会依次尝试添加扩展名进行匹配。
- alias 通过配置别名可以加快 webpack 查找模块的速度。

```javascript
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
```

### 生产环境关闭 sourceMap

- sourceMap 本质上是一种映射关系，打包出来的 js 文件中的代码可以映射到代码文件的具体位置,这种映射关系会帮助我们直接找到在源代码中的错误。
- 打包速度减慢，生产文件变大，所以开发环境使用 sourceMap，生产环境则关闭。

### 代码压缩

- UglifyJS: vue-cli 默认使用的压缩代码方式，它使用的是单线程压缩代码，打包时间较慢
- ParallelUglifyPlugin: 开启多个子进程，把对多个文件压缩的工作分别给多个子进程去完成

两种方法使用如下：

```javascript
plugins: [
  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false,
      },
    },
    sourceMap: true,
    parallel: true,
  }),

  new ParallelUglifyPlugin({
    //缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回，
    //cacheDir 用于配置缓存存放的目录路径。
    cacheDir: '.cache/',
    sourceMap: true,
    uglifyJS: {
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
      },
    },
  }),
]
```

打包速度和打包后的文件大小啊对比
| 方法 | 文件大小 | 打包速度 |
|---------------------|:---------|:---------|
| 不用插件 | 14.6M | 32s |
| UglifyJsPlugin | 12.9M | 33s |
| ParallelUglifyPlugi | 7.98M | 17s |

### 提取公共代码

- 相同资源重复被加载，浪费用户流量，增加服务器成本。
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。

webpack3 使用 CommonsChunkPlugin 的实现：

```javascript
plugins: [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module, count) {
      console.log(module.resource, `引用次数${count}`)
      //"有正在处理文件" + "这个文件是 .js 后缀" + "这个文件是在 node_modules 中"
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
      )
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    chunks: 'initial',
    minChunks: 2,
  }),
]
```

webpack4 使用 splitChunks 的实现：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          priority: 1, //添加权重
          test: /node_modules/, //把这个目录下符合下面几个条件的库抽离出来
          chunks: 'initial', //刚开始就要抽离
          minChunks: 2, //重复2次使用的时候需要抽离出来
        },
        common: {
          //公共的模块
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
}
```

### CDN 优化

CDN 又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度。

- 随着项目越做越大，依赖的第三方 npm 包越来越多，构建之后的文件也会越来越大。
- 再加上又是单页应用，这就会导致在网速较慢或者服务器带宽有限的情况出现长时间的白屏。

1、将 vue、vue-router、vuex、element-ui 和 axios 这五个库，全部改为通过 CDN 链接获取，在 index.html 里插入 相应链接。

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.bootcss.com/element-ui/2.0.7/theme-chalk/index.css"
  />
</head>
<body>
  <div id="app"></div>
  <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
  <script src="https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js"></script>
  <script src="https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js"></script>
  <script src="https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js"></script>
  <script src="https://cdn.bootcss.com/element-ui/2.6.1/index.js"></script>
  <!-- built files will be auto injected -->
</body>
```

**问题**：开发环境也接入vue.min.js 的cdn 时无法使用chrome 的 Vue.js devtools插件，所以要分环境加载不同的资源。

2、在 webpack.config.js 配置文件

```javascript
module.exports = {
 ···
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      'Axios':'axios'
    }
  },
```

3、卸载依赖的 npm 包，npm uninstall axios element-ui vue vue-router vuex

4、修改 main.js 文件里之前的引包方式

```javascript
// import Vue from 'vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import VueRouter from 'vue-router'

import App from './App.vue'
import routes from './router'
import utils from './utils/Utils'

Vue.use(ELEMENT)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash', //路由的模式
  routes,
})

new Vue({
  router,
  el: '#app',
  render: (h) => h(App),
})
```

### 使用 HappyPack 多进程解析和处理文件

- 由于运行在 Node.js 之上的 Webpack 是单线程模型的，所以 Webpack 需要处理的事情需要一件一件的做，不能多件事一起做。
- HappyPack 就能让 Webpack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。
- HappyPack 对 file-loader、url-loader 支持的不友好，所以不建议对该 loader 使用。

使用方法如下：

1. HappyPack 插件安装： npm i -D happypack
2. webpack.base.conf.js 文件对 module.rules 进行配置

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['happypack/loader?id=babel'],
      include: [resolve('src'), resolve('test')],
      exclude: path.resolve(__dirname, 'node_modules'),
    },
    {
      test: /\.vue$/,
      use: ['happypack/loader?id=vue'],
    },
  ]
}
```

3. 在生产环境 webpack.prod.conf.js 文件进行配置

```javascript
const HappyPack = require('happypack')
// 构造出共享进程池，在进程池中包含5个子进程
const HappyPackThreadPool = HappyPack.ThreadPool({ size: 5 })
plugins: [
  new HappyPack({
    // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
    id: 'babel',
    // 如何处理.js文件，用法和Loader配置中一样
    loaders: ['babel-loader?cacheDirectory'],
    threadPool: HappyPackThreadPool,
  }),
  new HappyPack({
    id: 'vue', // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
    loaders: [
      {
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
    ],
    threadPool: HappyPackThreadPool,
  }),
]
```

### 使用 DLLPlugin 提高打包编译速度

[DLLPlugin](https://webpack.docschina.org/plugins/dll-plugin/) 代码一般简单区分为业务代码和第三方库。如果不做处理，每次构建时都需要把所有的代码重新构建一次，耗费大量的时间，在大部分情况下，很多第三方库的代码不会变更（除非是版本升级），这时就可以使用到 dll：将复用性较高的第三方模块打包到动态链接库中，再不升级这些库的情况下，动态库不需要重新打包，每次构建只需要重新打包业务代码。

DllPlugin 是 webpack 内置的插件，不需要额外安装，直接配置 webpack.dll.config.js 文件，Webpack 已经内置了对动态链接库的支持，需要通过 2 个内置的插件接入，它们分别是：

DllPlugin 插件：用于打包出一个个单独的动态链接库文件。
DllReferencePlugin 插件：用于在主要配置文件中去引入 DllPlugin 插件打包好的动态链接库文件。

相关链接：

- [webpack 使用-详解 DllPlugin](https://segmentfault.com/a/1190000016567986)
- [webpack 编译速度提升之 DllPlugin](https://juejin.cn/post/6844903635072057358)
- [4-2 使用 DllPlugin](http://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-2%E4%BD%BF%E7%94%A8DllPlugin.html)




## 总结

1. 比较实用的方法: 按需加载，优化 loader 配置，关闭生产环境的 sourceMap，CDN 优化。
2. vue-cli 已做的优化： 代码压缩，提取公共代码，再优化空间不大。
3. 根据项目实际需要和自身开发水平选择优化方法，必须避免因为优化产生 bug。
