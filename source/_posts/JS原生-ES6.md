---
title: JS原生-ES6
date: 2018-01-24 10:51:11
categories: 原生JS
---

发现自己对于 javascript 的底层 API 所知甚少，在这里记录一下所遇到的有趣又实在的API用法。

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

### 解构赋值
```javascript
let [a, b, c] = [1, 2, 3];
//定义了三个变量，并对应赋了值；如果值的个数与变量名个数不匹配，没有对应上的变量值为 undefined

let [a, b, c='default'] = [1, 2];
//指定默认值，在定义变量时就指定了默认值，如果赋值时，没有给定内容，则会取默认值

let [a, …b] = [1,2,3];
//这里 b 的值为[2，3]，这样可以快速使用剩余的数据赋值给变量，
//但实际使用中为了避免代码阅读的歧义，不推荐这么使用，仅作了解即可

let [a,b,c] = 'yes';
console.log(a);//y
console.log(b);//e
console.log(c);//s
```
字符串的结构赋值会以单个字符串的方式进行赋值。

```javascript
let {length} ='yes';
console.log(length);//3
```
以对象赋值的方法，如果名称是字符串的自带属性，则会获得属性值

```javascript
let arr =[1,2];
let obj = {a:1,b:2};
function test({a=10,b}){
  console.log(a);
  console.log(b);
}
test(obj);
``` 

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

## Generator 函数

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。协程：多个现成互相协作，完成异步任务。

协程有点像函数，又有点想线程。他的运行流程大致如下：

* 第一步，协程 A 开始执行。
* 第二步，协程执行懂啊一半，进入暂停，执行权转移到协程 B。
* 第三步，一段时间后协程 B 交换执行权。
* 第四步，协程 A 恢复执行。

```javascript
function* gen(x) {
  var y = yield x + 2
  return y
}
```

上面整个代码就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 yield 语句注明。Generator 函数的执行方法如下。

```javascript
var g = gen(1)
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```

next 方法的作用是分阶段执行 Generator 函数。每次调用 next 方法，返回一个对象，表示当前阶段的信息（value 和 done 属性）。value 属性是 yield 语法后面表达式的值。表示当前阶段的值；done 属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。

这是一个生成器的例子：

```javascript
function* genFn() {
  console.log('begin')
  var value = yield 'a'
  console.log(value) // 'B'
  return 'end'
}

var gen = genFn()
console.log(typeof gen) // 'object'
var g1 = gen.next()
g1.value // 'a'
g1.done // false
var g2 = gen.next('B')
g2.value // 'end'
g2.done // true
```
## 字符串扩展

### 字符串内容测试

```javascript
'abcdef'.includes('c');//true
'abcdef'.includes('ye');//false
'abcdef'.startsWith('a');//true
'abcdef'.endswidth('f');//true
//includes(), startsWith(), endsWith() 都支持第二个参数，
//类型为数字类型，意为从第 n 个字符开始，endsWith()的第二个参数有点不一样
'abcdef'.includes('c', 4);//false 从第5个字符开始查找是否有 'c' 这个字符
'abcdef'.startsWith('d', 3);//true 从第4个字符开始查找是否是以 'd' 字符为开头
'abcdef'.endsWith('d', 4);//true 前面的4个字符里，是否以 'd' 字符为结尾
```

**字符串重复输出：** 
```javascript
'a'.repeat(5);//aaaaa 重复输出5遍
```

## 模板字符串(``)

```javascript
function authorize(user, action) {
  if (!user.hasPrivilege(action)) {
    throw new Error(
      `用户 ${user.name} 未被授权执行 ${action} 操作。`);
  }
}
```
在这个示例中，`${user.name}`,`${action}`被称为模板占位符，javascript 将把user.name 和 action 的值插入到最终生成的字符串中。

```javascript
$("#warning").html(`
  <h1>小心！>/h1>
  <p>未经授权打冰球可能受罚
  将近${maxPenalty}分钟。</p>
`);
```
模板字符串中所有的空格、新进、缩进，都会原样输出在生成的字符串中。

### 原生支持模板语言
```javascript
//es5
$('#result').append(
  'There are <b>' + basket.count + '</b> ' +
  'items in your basket, ' +
  '<em>' + basket.onSale +
  '</em> are on sale!'
);
//es6
//在es6中，内容模板，可以定义在 `` 包起来的字符串中，其中的内容会保持原有格式
//另外可以在字符串中直接使用模板语言进行变量填充，优雅而简洁
$('#result').append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`);
```
### 字符串遍历输出

```javascript
//for ...of 格式为 es6 中的 Iterator 迭代器的输出方式
for(let c of 'abc'){
  console.log(c);
}
//a
//b
//c
```
### 字符串补全
```javascript
//参数1：[number] 目标字符串长度
//参数2：[string] 进行补全的字符串
'12345'.padStart(7, '0')//0012345 - 字符串不足7位，在头部补充不足长度的目标字符串
'12345'.padEnd(7, '0')//1234500 - 在尾部进行字符串补全
```

## 数组扩展

### Array.from()

从一个类似数组或可迭代对象中创建一个新的数组实例。

### 合并数组
```javascript
let a = [1, 2];
let b = [3];
let c = [2, 4];
let d = [...a, ...b, ...c];//[1, 2, 3, 2, 4] 所有内容合并，但并不会去除重复
```
### 快速转换为数组

```javascript
Array.of(3,4,5);//[3,4,5]
```
### 内容过滤
```javascript
//判断对象是否为数组
if(Array.isArray(obj)){...}

[1,2,3].includes(5);//false，检索数据中是否有5

//找出第一个匹配表达式的结果，注意是只要匹配到一项，函数即会返回
let a = [1, 3, -4, 10].find(function(value, index, arr){
  return value < 0;
});
console.log(a);//-4

//找出第一个匹配表达式的结果下标
let a = [1, 3, -4, 10].findIndex(function(value, index, arr){
  return value < 0;
});
console.log(a);//2

//排除负数内容
let a = [1, 3, -4, 10].filter(function(item){
  return item > 0;
});
console.log(a);//[1, 3, 10]
```

## 对象扩展

### 属性的简洁表示
```javascript
//直接使用变量/常量的名称个为对象属性的名称
let a = 'abc';
let b = {a};//{a: 'abc'}

function f(x, y){ return {x, y};}
//等效于
function f(x, y){ return {x: x, y: y}}

let o = {
  f(){ return 1; }
}
//等效于
let o = {
  f: function(){ return 1; }
}
```
### 对象内容合并
```javascript
let a = {a:1,b:2}, b = {b:3}, c = {b:4,c:5};
let d = Object.assign(a, b, c);
console.log(d);//{a:1,b:4,c:5}
console.log(a);//{a:1,b:4}
//上面的合并方式会同时更新 a 对象的内容，a 的属性如果有多次合并会被更新数据，
//但自身没有的属性，其它对象有的属性不会被添加到 a 身上；
//参数列中的对象只会影响第一个，后面的参数对象不会被修改数据

//推荐使用这种方式进行对象数据合并
let a = {a:1,b:2}, b = {b:3}, c = {b:4,c:5};
let d = Object.assign({}, a, b, c);//第一个参数增加一个空对象，在合并时让它被更新，不影响实际的对象变量内容
console.log(d);//{a:1,b:4,c:5}//与上面的方式合并结果一致，使用这种方式, a 对象的内容就不会被影响了
```
对象内容合并的方向是从参数顺序的后向前合并

### 对象内容集合

#### Object.keys()

获取对象中所有的键名，以数组的形式返回
```javascript
var obj={a:1,b:2};
var name=Object.keys(obj);//['a','b,]
```
#### Object.values() 

获取对象中所有值内容，以数组的形式返回

```javascript
var obj={a:1,b:2};
var values=Object.values(obj);//[1,2]
```
#### Object.entries()
获得对象中所有成员的数据，以数组的形式返回，成员的内容也是数组形式

```javascript
var obj={a:1,b:2};
var values=Object.entries(obj);//[['a',1],['b',2]]
```
#### 对象内容测试
```javascript
//判断对象是否为数组对象
if(Object.isArray(someobj)){};
//判断目标对象是否为空对象
if(someobj&&Object.keys(someobj).length);
```
