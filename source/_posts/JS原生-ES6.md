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

super 关键字用于访问和调用一个对象的父对象的函数。( 只能在 class 内部用 )

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

**使用 super 调用父类的静态方法。**

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

**原始 class 实现方式**

```javascript
function Parent(name) {
  this.name = name
}
Parent.prototype.getName = function() {
  return this.name
}
function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
//实现继承
Child.prototype = new Parent()
Child.prototype.constructor = Child

Child.prototype.getAge = function() {
  return this.Age
}
var people = new Child('lily', 20)
console.log(people.getName())
```

**语法糖**

```javascript
class Parent {
  construtor(name) {
    this.name = name
  }
  getAge() {
    return this.age
  }
  const people = new Child("lily",20);
  console.log(people.getName())
}
```

## 异步函数

除了 javascript Promise , 异步函数进一步重写了传统的异步代码结构。

### 一个以 async 为前缀的常规函数

```javascript
async function fetchdata(url) {}
```

### 在异步函数（Async function ）内，使用 await 关键字调用异步操作函数

```javascript
function getaSync(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send()
  })
}

async function fetchdata(){
  var text1 = await getasync('test.txt')
  console.logtex(text1)
  var text2 = await getasync('test2.text')
  console.log(text2)
  var text3 = await getasync('text3.text)
  console.log(text3)
  return 'Finished'
}

fetchdata().then((msg)=>{
  console.log(msg) //“test.txt”，“test2.txt”，“test3.txt”
})
```

在异步函数中，我们把异步函数 getasync() 当做是同步函数，没有 then() 方法或回调函数通知下一步。无论何时遇到关键字 await , 执行都会停止，直到 getasync() 解决，然后再转到异步函数中的下一行。结果与纯粹的基于 Promise , 使用一串 then 方法的方式一样

## 解构

ES6 解构并非一个新的功能，而是一个新的复制语法，可以快速解压缩对象属性和数组中的值，并将它们分配给各个变量。

```javascript
var profile = { name: 'georage', age: 39, hobby: 'Tennis' }
var { name, hobby } = profile
console.log(name) //'georage'
console.log(hobby) //'Tennis'
```

这里我用解构快速提取 profile 对象的 name 和 hobby 属性。

使用别名，你可以使用与你正在提取值的对象属性不同的变量名：

```javascript
var profile = { name: 'georage', age: 39, hobby: 'Tennis' }
var { name: n, hobby: h } = profile
console.log(n) //'georage'
console.log(h) //'Tennis'
```

---

### 嵌套对象解构

解构也可以与嵌套对象一起工作，可以使用它来快速解开来自复杂的 JSON 请求的值。

```javascript
var jsondata = {
  title: 'XX',
  details: {
    data: {
      created: '2017/09/19',
      modified: '2017/09/20'
    },
    catrgory: 'js'
  },
  url: '/baidu/'
};
var {title,details:{data:{created.modified}}} = jsondata
console.log(title)
console.log(created)
console.log(modified)
```

---

### 解构数组

数组的解构与对象上的工作方式类似，除了左边的花括号使用**方括号**代替：

```javascript
var soccerteam = ['George', 'Dennis', 'Sandy']
var [a, b] = soccerteam
console.log(a) // "George"
console.log(b) // "Dennis"
```

你可以跳过某些数组元素，通过使用 (,)

```javascript
var var soccerteam = ['George', 'Dennis', 'Sandy']
var [a,,b] = soccerteam
console.log(a) // "George"
console.log(b) // "Sandy"
```

---

## 默认和剩余参数

### 默认参数

在这之前我们都使用：

```javascript
function getarea(w, h) {
  var w = w || 10
  var h = h || 15
  return w * h
}
```

有了 ES6 对默认参数的支持后

```javascript
function getarea(w = 10, h = 15) {
  return w * h
}
getarea(5) //75
```

### 剩余参数 （Rest Parameters ）

ES6 中的 Rest Parameters 使得将函数参数转换成数组的操作变得简单。

```javascript
function addit(...theNumber) {
  //get the sum of the array elements
  return theNumber.reduce( (prevnum.curnum)=>prevnu+curnum,0)
}
addit(1,2,3,4)//10
```

通过在命名参数前添加 3 个点。在该位置和之后输入到函数中的参数将自动转换为数组。

没有 Rest Parameters 则会手动将参数转换为数组 :

```javascript
function addit(theNumbers) {
  // force arguments object into array
  var numArray = Array.prototype.slice.call(arguments)
  return numArray.reduce((prevnum, curnum) => prevnum + curnum, 0)
}

addit(1, 2, 3, 4) // returns 10
```

```javascript
function f(...[a, b, c]) {
  return a + b + c
}

f(1) // NaN (b and c are undefined)
f(1, 2, 3) // 6
f(1, 2, 3, 4) //6 (the fourth parameter is not destructured)
```
