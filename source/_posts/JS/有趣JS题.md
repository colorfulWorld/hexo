---
title: 有趣JS题
date: 2018-03-08 15:57:30
tags:
---

一些出乎意料的题及面试题的积累

<!--more-->

## 变量提升

```javascript
if (!'abc' in window) {
  var abc = 10
}
console.log(abc) //undefined
//因为先变量声明提升 所以提升之后abc的值系统默认会赋值为undefined。 !abc为false ,in是检查对象中是否存在某个属性。很显然 false属于是一个布尔类型。不存在对象中。所以没有走if里面的变量赋值。

console.log(a) //undefined
if (!('a' in window)) {
  var a = 10
}
console.log(a) //undefined
//因为先变量声明提升 所以提升之后a的值系统默认会赋值为undefined。 变量提升会存在GO中也就是window。所以("a" in window)肯定为true。!去反一下就为false。所以不走赋值。

var x = 1
if (function f() {}) {
  x += typeof f
}
console.log(x) //1undefined
//因为函数题在()中会以表达式去运行。最后转换为true,不会存在函数整体声明提升。所以typeof为undefined
```

## 闭包

```javascript
function fun(n, o) {
  console.log(o)
  return {
    fun: function(m) {
      return fun(m, n)
    }
  }
}
var a = fun(0)
a.fun(1)
a.fun(2)
a.fun(3) //输出什么 undefined 0 0 0
var b = fun(0)
  .fun(1)
  .fun(2)
  .fun(3) //输出什么 undefined 0 1 2
var c = fun(0).fun(1)
c.fun(2)
c.fun(3) //输出什么 undefined 0 1 1

//答案很显而易见。换一个形式看着道题

function fun(n, o) {
  console.log(o)
  return {
    fun: function(m) {
      return fun(m, n)
    }
  }
}
var a = fun(0)
a.fun(1)
a.fun(2)
a.fun(3) //输出什么 undefined 0 0 0
```
