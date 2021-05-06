---
title: CommonJS、AMD、CMD、ES6
date: 2018-04-04 16:24:01
categories: JavaScript
---

以前没有深究的问题，仔细思考之后发现自己并不清楚，然后记个笔记。

<!--more-->

## CommonJS

Node.js 是 commonJS 规范的主要实践者，它有四个重要的环境为模块化的实现提供支持:module、exports、require、global。实际使用时，用 module.exports 定义当前模块对外输出的接口（不推荐直接使用 exports）用 require 加载模块。

```javascript
var basicNum = 0
function add(a, b) {
  return a + b
}
module.export = {
  add:add,
  basicNum:basicNum
}
//引用自定义模块时，参数包含路径，可以省略js
var math = require('./math')
math.add(2,5)
//引用核心模块时，不需要路径
var http = require('http')
http.createService(...)listen(3000)
```

commonJS 用同步的方式加载模块，在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题，但是在浏览器端，咸鱼网路原因，更合理的方式是使用异步加载。

## AMD 和 require.js

AMD 规范采用异步方式加载模块，模块加载不影响它后面语句的运行，所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会执行。这里介绍 require.js 实现 AMD 规范的模块化；用 require.config()制定引用路径等，用 define()定义模块，用 require()加载模块。

```javascript
// 网页中引用require.js及main.js
;<script src="js/require.js" data-main="js/main"></script>
//main.js入口文件/主模块
//首先用config()指定各模块路径和引用名
require.config({
  baseUrl: 'js/lib',
  path: {
    jquery: 'jquery.min',
    underscore: 'underscore.min'
  }
})

//执行基本操作
require(['jquery', 'underscore', function ($, _) {}])
```

引用模块的时候，我们将模块名放在[]中作为 require()的第一参数；如果我们定义的模块本身也依赖其他模块，那就需要将他们放在[]中作为 define()的第一参数。

```javascript
define(function () {
  var basicNum = 0
  var add = function (x, y) {
    return x + y
  }
  return {
    add: add,
    basicNum: basicNum
  }
})
//定义一个依赖underscore.js的模块
define(['underscore'], function (_) {
  var classfiy = function (list) {
    _.countBy(list, function (num) {
      return num > 30 ? 'old' : 'young'
    })
  }
  return {
    classify: classify
  }
})

//引用模块，将模块放在[]内
require(['jquery', 'math'], function ($, math) {
  var sum = math.add(10, 20)
  $('#sum').html(sum)
})
```

## CMD 和 sea.js

require.js 在申明依赖的模块时会在第一时间加载并执行模块内的代码：

```javascript
define(['a', 'b', 'c', 'd'], function (a, b, c, d) {
  if (false) {
    //即便没有用到某个某块b，但是b还是提前执行
    b.foo()
  }
})
```

CMD 是另一种 js 模块化方案，它与 AMD 很类似，不同点在于：AMD 退从依赖前置、提前执行，CMD 推荐依赖将近、延迟执行。此规范其实是在 sea.js 推广过程中产生的。

```javascript
//AMD写法
define(['a', 'b', 'c', 'd'], function (a, b, c, d) {
  //等于在最前面声明并初始化了要用到的所有模块
  a.doSomething()
  if (false) {
    //即使没有用到某个模块b，但b还是提前执行了
    b.doSomething()
  }
})

//CMD写法
define(function (require, exports, module) {
  var a = require('./a') //z在需要时声明
  a.doSomething()
  if (false) {
    var b = require('./b')
    b.doSomething()
  }
})

//sea.js
//定义模块math.js
define(function (require, exports, module) {
  var $ = require('jquire.js')
  var add = function (a, b) {
    return a + b
  }
  exports.add = add
})

seajs.use(['math.js'], function (math) {
  var sum = math.add(1 + 2)
})
```

## ES6 Module

ES6 在语言标准的层面上，实现了某块功能，而且实现得相当简单，只在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：export 和 import。export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供功能。

```javascript
//定义模块math.js
var basicNum = 0
var add = function (a, b) {
  return a + b
}
export { basicNum, add }
//引用模块
import { basicNum, add } from './main'
function test(ele) {
  ele.textContent = add(99 + basicNum)
}
```

如上例所示，使用 import 命令的时候，用户需要知道索要加载的变量名或函数名，其实 ES6 还提供了 export default 命令，为模块指定默认输出，对应的 import 语句不需要使用大括号，这也更趋近于 AMD 的引用写法。

```javascript
export default { basicNum, add }
import math from './math'
function test(ele) {
  ele.textCount = math.add(99 + math.basicNum)
}
```

ES6 的模块不是对象，import 命令会被 JavaScript 引擎静态分析，在编译时就引入模块代码，而不是在代码运行时加载，所以无法实现按条件加载。也正是因为这个，使得静态分析成为可能。

## ES6 模块与 commonJS 模块的差异

### CommonJS 模块输出是一个值得拷贝，ES6 模块输出的是一个值的引用

- CommonJS 模块输出的是值得拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
- ES6 模块的运行机制与 CommonJS 不一样，js 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读的引用，因此，es6 模块时动态引用，并且不会缓存值，模块里面的变量绑定在其所在的模块

### CommonJS 模块是运行时加载，ES6 模块时编译时输出接口

- 编译时加载：ES6 模块不是对象，而是通过 export 命令显示指令输出的代码，import 时采用静态命令的形式，既在 import 时可以指定加载摸个输出值，而不是加载整个模块，这种加载称为编译加载

[参考](https://juejin.cn/post/6844903576309858318)

### 遵循的模块化规范不一样

模块化规范：即为 JavaScript 提供一种模块化编写、模块依赖和模块运行的方案。最初的 JavaScript 没有模块化规范，所以很多都是全局变量。

### require 和 import/export 形式不一样

require/exports 的用法只有以下 3 种简单的写法。

```javascript
const fs = require('fs')
exports.fs = fs
module.exports = fs
```

而 import/export 的写法是：

```javascript
import fs from 'fs'
import {default as fs} from 'fs'
import * as fs from 'fs'
import {readFile} from 'fs'
import {readFile as read} from 'fs'
import fs, {readFile} from 'fs'

export default fs
export const fs
export function readFile
export {readFile, read}
export * from 'fs'
```

### 其他

- CommonJS 加载的是一个对象（既 module.exports 属性），该对象只会在脚本运行玩才会生成，而 ES6 模块不是对象，他的对外接口只是一种静态定义，在代码静态解析阶段就会生成
- CommonJS 支持动态引入（require(${path}/xx.js)），后者目前不支持，但是已有提案
- CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入及时卡住主线程影响也不大，而 ES6 是异步导入，因为用于浏览器，需要下载文件，如果也同步导入会对渲染有很大的影响
- **从规范与实现定义来讲，require 是动态加载，import 是静态加载**，从底层的运行来讲，require 是在程序运行时去解析而 import 是在编译 的时候去做解析请求包，require 是请求整个包对象而 import 是只请求模块中需要的请求的部分。**现在 import 应该还只算是 ES6 的语法规范，babel 打包的还是 require**
