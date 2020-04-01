---
title: vue懒加载与分组打包
date: 2020-04-01 18:28:07
categories: vue
---

vue 打包优化小知识点

<!--more-->

在 vue-router 的 index.js 文件中
将原来的组件引入方式改变如下：

```javascript
import Test from '@/component/test1'
```

变为

```javascript
const Test1 = r =>
  require.ensure([], () => r(rquire('../components/test1')), 'chunkname1')
```

示例代码：

```javascript
const HelloWorld = r =>
  require.ensure([], () => r(require('../components/HelloWorld')), 'chunkname1')
const Test1 = r =>
  require.ensure([], () => r(require('../components/test1')), 'chunkname1')
const Test2 = r =>
  require.ensure([], () => r(require('../components/test2')), 'chunkname3')
```
