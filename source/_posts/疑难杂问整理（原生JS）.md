---
title: 疑难杂问整理（原生JS）
date: 2018-01-19 10:12:08
categories: 原生JS
---

在学习原生的过程中的困惑与解惑的总结

<!--more-->

## 工厂模式

```javascript
function createPerson(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function() {
    alert(this.name);
  };
  return 0;
}

var person1 = createPerson('Nicholas', 29, 'Software Engineer');
var person2 = createPerson('Greg', 27, 'Doctor');

person1; // Person {name: "Zaxlct", age: 28, job: "Software Engineer", sayName: ƒ}
person2; // Person {name: "Mick", age: 23, job: "Doctor", sayName: ƒ}
```

## 构造函数

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    alert(this.name);
  };
}
var person1 = new Person('Zaxlct', 28, 'Software Engineer');
var person2 = new Person('Mick', 23, 'Doctor');
var person3 = new Person('Mick', 23, 'Doctor');
person1; // Person {name: "Zaxlct", age: 28, job: "Software Engineer", sayName: ƒ}
person2; // Person {name: "Mick", age: 23, job: "Doctor", sayName: ƒ}
person2 === person3; //false
person1.constructor == Person; //true
Person.prototype; // {constructor: ƒ}  为原型对象
person1.prototype; //undefined
Person.prototype.prototype; //undefined
person1.constructor == Person; //true
Person.prototype.constructor == Person; //true
```

实例的构造函数属性（constructor ）指向构造函数。所有的原型对象都会自动获得一个 constructor （构造函数属性）属性

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    alert(this.name);
  };
  return this;
}
var person1 = Person('Zaxlct', 28, 'Software Engineer');
var person2 = Person('Mick', 23, 'Doctor');
person1; // this 指向window 且被person2覆盖
person2; // this 指向window
```

**与工厂模式的区别**

- 没有显示创建对象（new 运算符创建并实例化新对象）。
- 直接将属性和方法赋给了 this 对象。
- 没有 return 语句。
- 要创建新实例必须要使用 new 运算符，否者属性和方法将会被添加到 window 对象
- 可以使用 instanceof 操作符检测对象类型。

构造函数的问题：构造函数的内部方法会被重复构建，不同实例内的同名函数是不相等的。

## html 页面的渲染过程

当用户请求页面时，浏览器获取 HTML 并构造 DOM。然后获取 CSS 并构造 CSSOM。然后通过匹配 DOM 和 CSSDOM 生成渲染树。如果有任何的 javascript 需要解决，浏览器将不会开始渲染页面，知道 javascript 解决完毕。

## 事件模型是什么

w3c 中定义的事件发生过程中的 3 个阶段：捕获阶段，目标阶段，冒泡阶段

## 为什么操作真实 DOM 有性能问题

因为 DOM 是属于渲染引擎中的东西，而 JS 又是 JS 引擎中的东西。当通过 JS 操作 DOM 的时候，其实这个操作涉及到了两个线程之间的通信，那么势必会带来一些性能能上的损耗。操作 DOM 次数一多，也就等同于一直在进行进程之间的通信，并且操作 DOM 可能还会带来重绘回流的情况，所以就导致一些性能上的问题。
