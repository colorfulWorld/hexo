---
title: require与import 的区别
date: 2018-04-04 16:24:01
tags:
---
以前没有深究的问题，仔细思考之后发现自己并不清楚，然后记个笔记。

<!--more-->

## 遵循的模块化规范不一样

模块化规范：即为JavaScript提供一种模块化编写、模块依赖和模块运行的方案。最初的JavaScript没有模块化规范，所以很多都是全局变量。

## require 和 import/export 形式不一样
require/exports 的用法只有以下3种简单的写法。

```javascript
const fs = require('fs')
exports.fs = fs
module.exports = fs
```

而import/export的写法是：
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
## 一些不同点

- import静态编译，import的地址不能通过计算

- require就可以，例如 const url = "a" + "b"; 

- Import url 直接报错了

- require(url)不会报错

- 所以require都会用在动态加载的时候

- 从规范与实现定义来讲，require是动态加载，import 是静态加载，从底层的运行来讲，require 是在程序运行时去解析而import 是在编译 的时候去做解析请求包，require是请求整个包对象而import是只请求模块中需要的请求的部分。**现在import应该还只算是ES6的语法规范，babel打包的还是require**

