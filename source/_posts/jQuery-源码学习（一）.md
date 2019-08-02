---
title: jQuery-源码学习（一）
date: 2018-06-22 11:45:06
categories: jQuery
---


感觉自己的很多的代码质量不够好，最近在频繁的使用 jQuery,感觉 jQuery 中的一些函数的思想是应该去学习的，尤其是设计模式的思想，在以后的 vue 开发中，在不引用 jQuery 的情况下，能借鉴 jQuery 的思想封装一些不依赖 DOM 的公共函数。也觉得自己对一些设计模式之内的了解甚少，所以学习 jQuery 源码势在必行。

<!--more-->


# jQuery框架的核心

任何库与框架设计的第一要点就是解决命名空间与变量污染的问题。jQuery 就是利用 js 函数作用域的特性，采用立即调用表达式包裹自身的方法解决。

- 匹配`HTML`文档中元素并对其执行操作。
- 链式调用。

# jQuery 对象的构建方式

常规构建方式：
```javascript
var aquery = function(selector, context){
  //构造函数
}
aquery.prototype = {
  //原型
  name:function(){},
  age:function(){}
}
var a = new aquery();
a.name();
```
原因：我猜想是因为更好的封装吧。

```javascript
(function(window, undefined) {
  function jQuery(selector) {
    return new jQuery.fn.init(selector);
    // 若是return jQuery.fn.init(selector) 则init中的this是指向jQuery，只有new 后才能隔离作用域
  }
  jQuery.fn = jQuery.prototype = {
    init: function() {
      this.age = 18
      return this
    },
    name:function(){
      console.log(this.age)
    }
    age:20
  };
  jQuery().age //18
  jQuery.fn.init.prototype = jQuery.fn; 
  //主要是将jQuery原型链下的方法挂载在 jQuery.fn.init的原型链下
  window.jQuery = window.$ = jQuery;
})(window);
```
- 闭包结构传参 window
  - 闭包结构传入实参 window,然后里面用形参接收
    - 减少内部每次引用 window 的查询时间
    - 方便压缩代码
- 形参 undefined
  - 因为 ie 低版本的浏览器可以给 undefined 赋值成功，所以为了保证 undefined 一定是 undefined
- jQuery 传参 selector
  - selector 可以是一对标签，可以是 id、类 、后代、子代等等，可以是 jQuery 对象
- jQuery 原型对象赋值给 jQuery 原型方法 init 的原型
- 给 window 暴露可利用成员。

**javascript 中的 undefined 并不是作为一个关键字，因此可以允许用户对其赋值。**

## `jQuery.fn.init.prototype = jQuery.fn` 的作用

** 既能隔离作用域还能使用jQuery原型对象的作用域，在返回实例中访问jQuery的原型对象**

`jQuery.fn.init.prototype = jQuery.fn`使得jQuery的原型对象覆盖了init 构造器的原型对象。


## 对象的构建

类一：

```javascript
function aQuery() {
  this.name = 'jQuery';
  this.sayName = function() {
    return this.name;
  };
}

var a = new aQuery();
var b = new aQuery();
var c = new aQuery();
```

类二：

```javascript
function aQuery() {
  this.name = 'jQuery';
}

aQuery.prototype = {
  sayName: function() {
    return this.name;
  }
};

var a = new aQuery();
var b = new aQuery();
var c = new aQuery();
```

类二 new 产生的 a、b、c 三个实例对象共享了原型的 sayName 方法，这样的好处是节省了内存空间，类一则是要为每一个实例复制 sayName 方法，每个方法属性都占用一定的内存空间，所以如果把所有属性方法都声明在构造函数中，就会无形的增大很多开销。除此之外类一的所有方法都是拷贝到当前实例对象上。类二则是要通过 scope 连接到原型链上查找，这样就无形中多一层作用域链的查找。


## 分离构造器

通过 new 操作符构建一个对象，一般经过 4 步：

- 创建一个新对象
- 将构造函数的作用域给新对象（所以 this 就指向了这个新对象）
- 执行构造函数中的代码
- 返回这个新对象

其实 new 操作符主要是把原型链跟实例的 this 关联起来，所以我们如果需要原型链就必须要 new 操作符来进行处理。否则 this 则变成 window 对象了。

```javascript
var $$ = (ajQuery = function(selsctor) {
  this.selector = selector;
  return this;
});

ajQuery.fn = ajQuery.prototype = {
  selectorName: function() {
    return this.selector;
  },
  constructor: ajQuery
};

var a = new $$('aaa'); //实例化
a.selectorName(); //aaa //得到选择器名字
```

首先改造 jQuery 无 new 的格式，我们可以通过 instanceof 来判断 this 是否是当前实例：

```javascript
var $$ = (ajQuery = function(selector) {
  if (!(this instanceof ajQuery)) {
    return new ajQuery(selector);
  }
  this.selector = selector;
  return this;
});
```
# 链式调用
DOM 链式调用的处理：
1. 节约JS代码
2. 所返回的都是同一个对象，可以提高代码效率。

```javascript
  jQuery.prototype = {
    init:function(){
      return this
    },
    name:function(){
      return this
    }
  }

  jQuery.init().name()

```

# 静态与实例方法共享设计

遍历方法：

```javascript
$('.aaron').each(); //作为实例方法存在
$.each(); //作为静态方法存在
```

第一条语句是给指定的上下文调用的，就是获取('.aaron')获取的 DOM 合集，第二条语句\$.each()函数可用于得带任何集合，无论是“名/值”对象 或是数组。在迭代数组的情况下，回调函数每次都会传递一个数组索引和相应的数组值作为参数。

```javascript
jQuery.prototype = {
  each: function(callback, args) {
    return jQuery.each(this, callback, args);
  }
};
```

实例方法取于静态方法，静态方法挂在 jQuery 构造器上，原型方法呢？jQuery 通过 new 原型 prototype 上 init 方法当成构造器，那么 init 原型链方法就是实例的方法了，所以 jQuery 通过 2 个构造器划分 2 种不同的调用方式，一种是静态，一种是原型。

# 事件绑定

jQuery对事件的绑定分别有几个API `.bind(),.live(),.delegate(),.on()`
不管是用什么方式绑定，归根到底还是用的`addEventListener/attachEvent`处理的，正如选择器不管如何匹配最终还是那些个浏览器接口处理

不管是是用click/bind/delegate之中的哪个方法，最终都是jQuery底层都是调用on方法来完成最终的事件绑定。
