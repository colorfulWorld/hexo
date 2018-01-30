---
title: JS原生-ES6
date: 2018-01-24 10:51:11
categories: 原生JS
---

发现自己对于 javascript 的底层 API 所知甚少，在这里记录一下所遇到的有趣又是在的 API。

<!--more-->

## set 对象 （可用于去重）

set 独享允许你存储任何类型唯一值，无论是原始值或是对象。NaN 之间视为相同的值。

```javascript
引用 const set1 = new Set([1,1, 2, NaN, NaN, 5]);

console.log(set1.has(1)); // expected output: true

console.log(set1.has(5)); // expected output: true

console.log(set1.has(6)); // expected output:false

console.log(Array.from(set1)) // Array [1, 2, 3, 4, NaN, 5]
```

## Array.from()

从一个类似数组或可迭代对象中创建一个新的数组实例。

## super

super 关键字用于访问和调用一个对象的父对象的函数。

在构造函数中使用时，super 关键字将单独出现，并且必须在使用 this 之前使用。

super 关键字也可以用来调用父对象上的函数。

```javascript
super([arguments]);
// 调用 父对象/父类 的构造函数

super.functionOnParent([arguments]);
// 调用 父对象/父类 上的方法
```

```javascript
class Polygon {
  construector(height, width) {
    this.name = 'Polygon'
    this.height = height
    this.width = width
  }
  sayName() {
    console.log('Hi,I am a', this.name + '.')
  }
  class Square extends Polygon{
    constructor(length){
      this.height;
      // ReferenceError ,super 需要先被调用！

      /*
       这里，它调用父类的构造函数的length,
       作为Polygon 的 width 和 height
       */
       super(length,length)
       /*
       注意，在派生的类中，在你可以使用this之前，必须 先调用super()。忽略这，这将导致引用错误。
       */
       this.name = 'Square'
    }
    get area(){
      return this.height * this.width
    }
    set area(value){
      this.area = value
    }
  }
}
```

使用 super 调用父类的静态方法。

```javascript
class Human{}
  constructor(){}
    static ping(){
      return 'ping'
  }
}

class computer eatends Human{
  constructor(){}
  static pingpong(){
    return super.ping()+'pong'
  }
}

Computer.pingpong()
```
