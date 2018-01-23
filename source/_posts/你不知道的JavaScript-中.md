---
title: 你不知道的JavaScript(中)
date: 2018-01-15 16:52:42
tags:
---

读 《你不知道的 JavaScript( 中 )》 笔记

<!--more-->

## 类型和语法

### 内置类型

javascript 有 7 中内置类型：

* 空值 (null)
* 未定义 (undefined)
* 布尔值 (boolean)
* 数字 (number)
* 字符串 (string)
* 对象 (object)
* 符号 (symbol,ES6 中新增 )

**除对象之外，其他同称为 “ 基本对象 ”**

javascript 中的变量是没有类型的，只有值才有。变量可以随时持有任何类型的值。变量在未持有值的时候为 undefined。

```javascript
var a
var b = 42
var c
b = c
typeof b //undefined
typeof a //undefined
```

undeclared 表示变量未被声明过，但是 javascript 却将 undefined 与 undeclared 混为一谈，我们试图访问 undeclared 变量时会报错 “is not defined”，并且 typeof 对 undefined 和 undeclared 变量都返回 “undefined”，所以可以通过使用 typeof 的安全机制（阻止报错）来检查 undeclared 变量

## 数组

```javascript
var a = []
a[3] = '2'
a.length //4
```

### 字符串

字符串经常被当成字符数组，但它们仅仅是看上去相似而已

```javascript
var a = 'fff'
var b = ['f', 'f', 'f']
console.log(a.length, b.length) //3,3
```
