---
title: JS原生-ES6
date: 2018-01-24 10:51:11
categories: JavaScript
---

发现自己对于 javascript 的底层 API 所知甚少，在这里记录一下所遇到的有趣又实在的 API 用法。

ES6 的更新内容主要分为以下几点

- 表达式：声明、解构赋值
- 内置对象：字符串扩展、数值扩展、对象扩展、数组扩展、函数扩展、正则扩展、Symbol、Set、Map、Proxy、Reflect
- 语句与运算：Class、Module、lterator(迭代)
- 异步编程：Promise、Generator、Async

<!--more-->

## var 与 let 的区别

使用 var 关键字来声明变量，会出现重复声明导致变量被覆盖不会报错的问题；
在 ES6 中引入了 let 来解决 var 关键字带来的潜在问题，若是重复声明则会在控制台报错。

## `Symbol`数据类型

`Symbol`是通过`Symbol`函数生成的，凡是属性名属于`symbol`类型，就都是独一无二的，可以保证不会与其他属性名冲突。

### 使用 Symbol 来作为唯一标志

```javascript
const PROP_NAME = Symbol() //解救无意义的赋值
const PROP_AGE = Symbol()

let obj = {
  [PROP_NAME]: '一斤代码', //对象key值或是常量使用，原理相同
}
obj[PROP_AGE] = 18

obj[PROP_NAME] // '一斤代码'
obj[PROP_AGE] // 18
```

### 使用 Symbol 定义类的私有属性

在 JS 中是没有私有变量的，雷伤所有定义的属性或是方法都是公开访问的。因此可能存在污染等情况，而有了 Symbol 以及模块化机制，类的私有属性和方法才能变成可能。

在文件 a.js 中

```javascript
const PASSWORD = Symbol()

class Login {
  constructor(username, password) {
    this.username = username
    this[PASSWORD] = password
  }

  checkPassword(pwd) {
    return this[PASSWORD] === pwd
  }
}

export default Login
```

在文件 b.js 中

```javascript
import Login from './a'

const login = new Login('admin', '123456')

login.checkPassword('admin') // true

login.PASSWORD // oh!no!
login[PASSWORD] // oh!no!
login['PASSWORD'] // oh!no!
```

由于 Symbol 常量 PASSWORD 被定义在 a.js 所在的模块中，外面的模块获取不到这个 Symbol,也不可能在创建一个一个一样的 Symbol 出来，所以这个 PASSWORD 只能被限制在 a.js 内部使用，达到一个私有化的效果

### 注册和获取全局 Symbol

Symbol 在不同 window 中创建的 Symbol 实例总是唯一的，如果应用涉及到多个 window（ifram），并需要这些 window 使用的是同一个，那就不能使用 Symbol()了（若是微前端里面又是什么样的呢？有时间试试），这时可以使用 Symbol.for()，它来注册或获取一个 window 间全局的 Symbol 实例：

```javascript
let gs1 = Symbol.for('global_symbol_1') //注册一个全局Symbol
let gs2 = Symbol.for('global_symbol_1') //获取全局Symbol

gs1 === gs2 // true
```

这时，在多个相关 window 间也是唯一的。

### Symbol.iterator

在 Symbol.iterator 出现后，JS 可以定义自己的迭代器
iterator 模式总是用同一种逻辑来遍历集合

```javascript
for(Iterator it = c.iterater(); it.hasNext(); ) { ... }
//这样就在一定程度上解决了不同的数据类型需要不同的遍历方法
```

```javascript
let students = {
  [Symbol.iterator]: function* () {
    for (var i = 0; i <= 100; i++) {
      yield i
    }
  },
}
for (var s of students) {
  console.log(s)
}
//这个yield其实最后返回的就是iterator函数
```

## yield

yield 关键字用来暂停和恢复一个生成器函数.yield 关键字只能在生成器函数内部使用，用在其他地方会抛出错误。类似函数的 return 关键字，yield 关键字必须直接位于生成器函数定义中，出现在嵌套的非生成器函数中会抛出语法错误

yield 关键字实际返回一个 IteratorResult 对象，它有两个属性，value 和 done。value 属性是对 yield 表达式求值的结果，而 done 是 false，表示生成器函数尚未完全完成。

```javascript
function* countAppleSales() {
  var saleList = [3, 7, 5]
  for (var i = 0; i < saleList.length; i++) {
    yield saleList[i]
  }
}
//一旦生成器函数已定义，可以通过一个构造一个迭代器来使用它

var appleStore = countAppleSales() // Generator { }
console.log(appleStore.next()) // { value: 3, done: false }
console.log(appleStore.next()) // { value: 7, done: false }
console.log(appleStore.next()) // { value: 5, done: false }
console.log(appleStore.next()) // { value: undefined, done: true }
```

## 类 class

面向对象编程中的一个核心概念就是类（多态、封装、继承）。可以把事物都抽象成一个个的类来描述他们的信息和行为。

JavaScript 是一个基于对象的语言，而不是面对对象的语言，它是一个基于 prototype 的语言。它的语法中没有像 Java 之类典型面向对象语言中定义一个类的语法，因此在 ES6 中，提供了一个面向对象风格的类定义方式：使用 class 关键字。

类里面所有的方法都定义在类的 prototype 上面

**注意：类必须使用 new 调用，否则会报错。这是它和普通函数的一个主要区别，后者不用 new 也可以执行**

```javascript
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  walk() {
    console.log("I'm walking...")
  }

  static create(name, age) {
    //定义静态方法
    return new Person(name, age)
  }
}
```

### constructor

- 是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法，一个类必须有 constructor 方法，如果没有显示定义，一个空的 constructor 方法会被默认添加
- 执行这个 constructor 方法默认返回实例对象（this）
### 类的 prototype 属性

类的所有方法都定义在类的 prototype 属性上面

```javascript
class Point {
  constructor() {}
  toString() {}
}

//等同于
Point.prototype = {
  constructor(){},
  toString()
}
```

### class 的静态方法

如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，就是称为“静态方法”

**注意：如果静态方法包含 this 关键字，这个 this 指向的是类，而不是实例**

```javascript
class Foo {
  static classMethod() {
    return 'hello'
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo()
foo.classMethod()
```
### super

super 关键字用于访问和调用一个对象的父对象的函数。( 只能在 class 内部用 )

在构造函数中使用时，super 关键字将单独出现，并且必须在使用 this 之前使用。

super 关键字也可以用来调用父对象上的函数。

```javascript
super([arguments])
// 调用 父对象/父类 的构造函数

super.functionOnParent([arguments])
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

class computer eatends Human{ //使用extend 实现继承另一个类
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
Parent.prototype.getName = function () {
  return this.name
}
function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
//实现继承
Child.prototype = new Parent()
Child.prototype.constructor = Child

Child.prototype.getAge = function () {
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

async function fetchdata() {
  var text1 = await getasync('test.txt')
  console.logtex(text1)
  var text2 = await getasync('test2.text')
  console.log(text2)
  var text3 = await getasync('text3.text')
  console.log(text3)
  return 'Finished'
}

fetchdata().then((msg) => {
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
      modified: '2017/09/20',
    },
    catrgory: 'js',
  },
  url: '/baidu/',
}
var {
  title,
  details: {
    data: { created, modified },
  },
} = jsondata
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
let { length } = 'yes'
console.log(length) //3
```

以对象赋值的方法，如果名称是字符串的自带属性，则会获得属性值

```javascript
let arr = [1, 2]
let obj = { a: 1, b: 2 }
function test({ a = 10, b, c = 10 }) {
  console.log(arguments) //{ a: 1, b: 2 }
  console.log(a) //1
  console.log(b) //2
  console.log(c) //10
}
test(obj)
```

## Spread 操作符

spread(...)操作符也称作展开操作符，作用是讲可迭代的对象进行展开

```javascript
var fruits = ['apple', 'orange', 'peach']
var shoppingList = ['t-shirt', ...fruits, 'egg']

// shoppingList的值：["t-shirt", "apple", "organe", "peach", "egg"]
```

Spread 操作符可以展开 Iterable 的对象，这样的话，除了数组之外，所有实现了 Symbol.iterator 的对象，如：Set, Map 和 Generator 等等，都可以使用 Spread 操作符。

```javascript
var map = new Map()
map.set('a', 1)
map.set('b', 2)
var arr1 = [...map] //[["a", 1], ["b", 2]]

var set = new Set()
set.add(1)
set.add(2)
set.add(1)
set.add(3)
var arr2 = [...set] //[1, 2, 3]

function* myGen() {
  yield 'hello'
  yield 'world'
}
var arr2 = [...myGen()] //["hello", "world"]
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

### 剩余参数 （Rest Parameters）

ES6 中的 Rest Parameters 使得将函数参数转换成数组的操作变得简单。

```javascript
function addit(...theNumber) {
  //get the sum of the array elements
  return theNumber.reduce((prevnum.curnum) => prevnu + curnum, 0)
}
addit(1, 2, 3, 4) //10
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

- 第一步，协程 A 开始执行。
- 第二步，协程执行懂啊一半，进入暂停，执行权转移到协程 B。
- 第三步，一段时间后协程 B 交换执行权。
- 第四步，协程 A 恢复执行。

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
'abcdef'.includes('c') //true
'abcdef'.includes('ye') //false
'abcdef'.startsWith('a') //true
'abcdef'.endswidth('f') //true
//includes(), startsWith(), endsWith() 都支持第二个参数，
//类型为数字类型，意为从第 n 个字符开始，endsWith()的第二个参数有点不一样
'abcdef'.includes('c', 4) //false 从第5个字符开始查找是否有 'c' 这个字符
'abcdef'.startsWith('d', 3) //true 从第4个字符开始查找是否是以 'd' 字符为开头
'abcdef'.endsWith('d', 4) //true 前面的4个字符里，是否以 'd' 字符为结尾
```

**字符串重复输出：**
这个方法接受一个整数参数，表示要将字符串复制多少次，然后返回拼接所有副本后的结果

```javascript
'a'.repeat(5) //aaaaa 重复输出5遍
```

### 模板字符串(``)

```javascript
function authorize(user, action) {
  if (!user.hasPrivilege(action)) {
    throw new Error(`用户 ${user.name} 未被授权执行 ${action} 操作。`)
  }
}
```

在这个示例中，`${user.name}`,`${action}`被称为模板占位符，javascript 将把 user.name 和 action 的值插入到最终生成的字符串中。

```javascript
$('#warning').html(`
  <h1>小心！>/h1>
  <p>未经授权打冰球可能受罚
  将近${maxPenalty}分钟。</p>
`)
```

模板字符串中所有的空格、新进、缩进，都会原样输出在生成的字符串中。

### 原生支持模板语言

```javascript
//es5
$('#result').append(
  'There are <b>' +
    basket.count +
    '</b> ' +
    'items in your basket, ' +
    '<em>' +
    basket.onSale +
    '</em> are on sale!'
)
//es6
//在es6中，内容模板，可以定义在 `` 包起来的字符串中，其中的内容会保持原有格式
//另外可以在字符串中直接使用模板语言进行变量填充，优雅而简洁
$('#result').append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`)
```

### 字符串遍历输出

```javascript
//for ...of 格式为 es6 中的 Iterator 迭代器的输出方式
for (let c of 'abc') {
  console.log(c)
}
//a
//b
//c
```

### 字符串补全

```javascript
//参数1：[number] 目标字符串长度
//参数2：[string] 进行补全的字符串
'12345'.padStart(7, '0') //0012345 - 字符串不足7位，在头部补充不足长度的目标字符串
'12345'.padEnd(7, '0') //1234500 - 在尾部进行字符串补全
```

### 字符串迭代与结构

```javascript
let message = 'abc'
let stringIterator = message[Symbol.iterator]()
stringIterator.next() //{value:a,done:false}
stringIterator.next() //{value:b,done:false}
```

或是用 for of

## 数组扩展

### Array.from()

从一个类似数组或可迭代对象中创建一个新的数组实例。

### 合并数组

```javascript
let a = [1, 2]
let b = [3]
let c = [2, 4]
let d = [...a, ...b, ...c] //[1, 2, 3, 2, 4] 所有内容合并，但并不会去除重复
```

### 快速转换为数组

```javascript
Array.of(3, 4, 5) //[3,4,5]
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

### 可计算属性

```javascript
let nameKey = 'name'
let ageKey = '27'
let jobKey = 'job'
let person = {
  [nameKey]: 'matt',
  [ageKey]: 27,
  [jobKey]: 'software engineer',
}
```

可变 key 是在申明时进行值赋值，而不是地址赋值，就算使用对象作为 key 值，key 值在之后也不是可变的

### 属性的简洁表示

```javascript
//直接使用变量/常量的名称个为对象属性的名称
let a = 'abc'
let b = { a } //{a: 'abc'}

function f(x, y) {
  return { x, y }
}
//等效于
function f(x, y) {
  return { x: x, y: y }
}

let o = {
  f() {
    return 1
  },
}
//等效于
let o = {
  f: function () {
    return 1
  },
}
```

### 对象内容合并

```javascript
let a = { a: 1, b: 2 },
  b = { b: 3 },
  c = { b: 4, c: 5 }
let d = Object.assign(a, b, c)
console.log(d) //{a:1,b:4,c:5}
console.log(a) //{a:1,b:4}
//上面的合并方式会同时更新 a 对象的内容，a 的属性如果有多次合并会被更新数据，
//但自身没有的属性，其它对象有的属性不会被添加到 a 身上；
//参数列中的对象只会影响第一个，后面的参数对象不会被修改数据

//推荐使用这种方式进行对象数据合并
let a = { a: 1, b: 2 },
  b = { b: 3 },
  c = { b: 4, c: 5 }
let d = Object.assign({}, a, b, c) //第一个参数增加一个空对象，在合并时让它被更新，不影响实际的对象变量内容
console.log(d) //{a:1,b:4,c:5}//与上面的方式合并结果一致，使用这种方式, a 对象的内容就不会被影响了
```

对象内容合并的方向是从参数顺序的后向前合并

### 对象内容集合

#### Object.keys()

获取对象中所有的键名，以数组的形式返回

```javascript
var obj = { a: 1, b: 2 }
var name = Object.keys(obj) //['a','b,]
```

#### Object.values()

获取对象中所有值内容，以数组的形式返回

```javascript
var obj = { a: 1, b: 2 }
var values = Object.values(obj) //[1,2]
```

#### Object.entries()

获得对象中所有成员的数据，以数组的形式返回，成员的内容也是数组形式

```javascript
var obj = { a: 1, b: 2 }
var values = Object.entries(obj) //[['a',1],['b',2]]
```

#### 对象内容测试

```javascript
//判断对象是否为数组对象
if (Object.isArray(someobj)) {
}
//判断目标对象是否为空对象
if (someobj && Object.keys(someobj).length);
```

### Map

Map 的用法和普通对象基本一致，但是主要差异是，Map 实例会维护键值对的插入顺序，因此可以根据插入顺序执行迭代操作。

对象和映射之间存在着显著的内存和性能问题：

- 在给定固定大小的内存时，Map 大约可以比 Object 多存储 50% 的键/值对。
- Map 在所有的浏览器中一般会比 Object 的插入速度快
- 从大型 Object 和 Map 中查找键/值对，则 Object 有时候速度会更快。在把 Object 当成数组使用的情况下（比如使用连续整数作为属性），浏览器引擎可以进行优化，在内存中使用更高效的布局。对于这两个类型而言，查找书读不会随着键/值对数量增加而现行增加，如果代码设计大量查找操作，那么某些情况下可能选 Object 更好
- Object 的 delete 性能很差，在现在很多浏览器依然如此，Map 的 delete 操作都比插入和查找更快，如果代码涉及大量删除操作，那么毫无以为应该选择 map

(思考：vue 中的 data 数据使用 Map 是什么样的呢？)

先看一下它能用非法字符串或者数字作为 key 的特性。

```javascript
const map = Map()
const obj = { p: 'hellow' }
map.set(obj, 'ok') //ok
console.log(obj) //{ p: 'hellow' }
map.get(obj) //ok
map.has(obj) //true
map.delete(obj) //true
map.has(obj) //false
```

需要使用 new Map()初始化一个实例。

- size:获取成员数量
- set:设置成员 key 和 value
- get:获取成员属性值
- has:判断成员是否存在
- delete:删除成员
- clear:清空所有
- keys():返回键名的遍历器
- values():返回键值的遍历器
- entries():返回所有成员的遍历器
- forEach():遍历 Map 的所有成员

### set 对象 （可用于去重）

set 独享允许你存储任何类型唯一值，无论是原始值或是对象。NaN 之间视为相同的值。

```javascript
const set1 = new Set([1, 1, 2, NaN, NaN, 5])

console.log(set1.has(1)) // expected output: true

console.log(set1.has(5)) // expected output: true

console.log(set1.has(6)) // expected output:false

console.log(Array.from(set1)) // Array [1, 2, 3, 4, NaN, 5]
```

### 定型数组

所谓定型数组，就是将任何数字转换成一个包含数字比特的数组，随后就可以通过 JS 数组进一步处理

在 JavaScript 中，数字类型变量都是以 64 位浮点型数据格式存储；比如新建一个只需要 8 比特的整数，也需要为其开辟 64 位存储空间，浪费资源，效率也低。而 CanvasFloatArray 需要的是 Float32Array

所有与定型数组有关的操作和对象都集中在这 8 个数据类型上，但是在使用他们之前，需要穿件一个数组缓冲区存储这些数据

数据缓冲区是所有定型数组的根基，它是一段可以包含特定数量字节的内存地址。

## isInteger 与安全整数

isInteger 用于判断一个数值是否为整数。

```javascript
console.log(Number.isInteger(1)) //  true
console.log(Number.isInteger(1.0)) //true
console.log(Nmber.isInteger(1.01)) //false
```

为了鉴别整数是否在安全范围科研使用 Number.isSafeInteger()方法

## 生成器

```javascript
function* generatorFn() {
  yield 'foo'
  yield 'bar'
  return 'baz'
}
let generatorObject1 = generatorFn()
let generatorObject2 = generatorFn()
console.log(generatorObject1.next()) //{done:false,value:'foo'}
console.log(generatorObject2.next()) //{done:false,value:'foo'}
console.log(generatorObject2.next()) //{done:false,value:'bar'}
console.log(generatorObject1.next()) //{done:false,value:'bar'}
```

**也可以用 for of 对 generatorObject1 进行迭代，那这个可以结合 promise 使用吗？是可以的，就是用 yield 实现了 await**。async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

### 使用 yield\* 实现递归算法

yield\* 表达式迭代操作数，并产生它返回的每个值

yield\* 表达式本身的值是当迭代器关闭时返回的值（即 done 为 true）时

yield\*最有用的地方是实现递归操作，此时生成器可以产生自身：

```javascript
function* nTimes(n) {
  if (n > 0) {
    yield* nTimes(n - 1)
    yield n - 1
  }
}

for (const x of nTimes(3)) {
  console.log(x)
}
//0
//1
//2
```

## 箭头函数

**箭头函数不能作为构造函数**：

箭头函数没有自己的 this,arguments,super 或 new.target。箭头函数表达式更实用于那些需要匿名函数的地方，并且它不能用作构造函数，和 new 一起用会抛出错误，箭头函数没有 prototype 属性。

箭头函数是有*proto*属性的，所以箭头函数本身是存在原型链的，他也是有自己的构造函数的，但是因为没有 prototype 属性，他的实例*proto*没法指向，所以箭头函数也就无法作为构造函数。

同时箭头函数由于没有 this 指针，通过 call()和 apply 方法调用一个函数时，只能传递参数，不能绑定 this。
