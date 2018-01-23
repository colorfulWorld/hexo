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
  var o = new Object()
  o.name = name
  o.age = age
  o.job = job
  o.sayName = function() {
    alert(this.name)
  }
  return 0
}

var person1 = createPerson('Nicholas', 29, 'Software Engineer')
var person2 = createPerson('Greg', 27, 'Doctor')

person1 // Person {name: "Zaxlct", age: 28, job: "Software Engineer", sayName: ƒ}
person2 // Person {name: "Mick", age: 23, job: "Doctor", sayName: ƒ}
```

## 构造函数

```javascript
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    alert(this.name)
  }
}
var person1 = new Person('Zaxlct', 28, 'Software Engineer')
var person2 = new Person('Mick', 23, 'Doctor')
var person3 = new Person('Mick', 23, 'Doctor')
person1 // Person {name: "Zaxlct", age: 28, job: "Software Engineer", sayName: ƒ}
person2 // Person {name: "Mick", age: 23, job: "Doctor", sayName: ƒ}
person2 === person3 //false
person1.constructor == Person //true
Person.prototype // {constructor: ƒ}  为原型对象
person1.prototype //undefined
Person.prototype.prototype //undefined
person1.constructor == Person //true
Person.prototype.constructor == Person //true
```

实例的构造函数属性（constructor ）指向构造函数。所有的原型对象都会自动获得一个 constructor （构造函数属性）属性

```javascript
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    alert(this.name)
  }
  return this
}
var person1 = Person('Zaxlct', 28, 'Software Engineer')
var person2 = Person('Mick', 23, 'Doctor')
person1 // this 指向window 且被person2覆盖
person2 // this 指向window
```

#### 与工厂模式的区别

* 没有显示创建对象（new 运算符创建并实例化新对象）。
* 直接将属性和方法赋给了 this 对象。
* 没有 return 语句。
* 要创建新实例必须要使用 new 运算符，否者属性和方法将会被添加到 window 对象
* 可以使用 instanceof 操作符检测对象类型。

构造函数的问题：构造函数的内部方法会被重复构建，不同实例内的同名函数是不相等的。

## 原型链

```javascript
function f1() {}
var o3 = new f1()
var f3 = new Function('str', 'console.log(str)')
typeof f3 // function
typeof o3 //object
```
