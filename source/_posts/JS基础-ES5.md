---
title: JS基础(ES5)
date: 2018-01-18 10:12:34
categories: JavaScript
---

感觉自己的 ES5 掌握的比较杂乱，在此整理一下自己的思路，总结、归纳原生 JS 的知识。

<!--more-->

## 内置类型

JS 中有 7 种内置类型，7 种内置类型又分为两大类型：基本类型和对象（Object）
基础基本类型有 6 种：`null`,`undefined`,`boolean`,`number`,`string`,`symbol`。

## `Typeof`

`typeof` 对于基本类型。除了`null`都可以显示正确的类型

```javascript
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof b // b 没有声明，但是还会显示 undefined

//typeof 对于对象，除了函数都会显示 object

typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'

typeof null // 'object'
```

PS：为什么会出现这种情况呢？因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来

```javascript
let a
// 我们也可以这样判断 undefined
a === undefined
// 但是 undefined 不是保留字，能够在低版本浏览器被赋值
let undefined = 1
// 这样判断就会出错
// 所以可以用下面的方式来判断，并且代码量更少
// 因为 void 后面随便跟上一个组成表达式
// 返回就是 undefined
a === void 0
```

## 对象

创建对象可以通过对象直接量，关键字 new 和 object.creat() 函数来创建对象。每一个对象都有与知相关的原型，类和可扩展性。可分为普通对象和函数对象。凡是通过 new function() 创建的都是函数对象。其他都是普通对象。

### 对象直接量

对象直接量是类似于 var a = {x:0,y:0} 的映射表。对象直接量是一个表达式，这个表达式的每次运算都创建并初始化一个新的对象。每次计算对象直接量的时候。也会计算它的每个属性值，**也就是说在一个循环体内使用了对象直接量，他将会创建很对新对象，并且每次创建的对象的属性值也有可能不同。**

### 通过 new 创建对象

1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

在调用`new`的过程中会发生以上四件事情。

var obj=new MyClass(); new 运算符创建并初始化一个**新对象** 用 new 调用时，this 会指向空的对象，并且这个对象的原型指向 MyClass.prototype

#### new 的过程以及是实现 new

```javascript
let obj = {}
let con = [].shift.call(arguments)
```


## 原型

原型：每一个对象都从原型继承属性。**每个对象都有 _proto_ 属性 , 每个对象都有原对象，但只有函数对象才有 prototype 属性**, 但是除却 function.prototype,function.prototype 也是函数对象，但是没有 prototype。可以使用 p.isPrototype(o) 来检查 p 是否是 o 的原型。

### 原型模式

原型模式是 js 对继承的一种实现

- prototype：构造函数中的属性，指向该构造函数的原型对象。

- constructor ：原型对象中的属性，指向该原型对象的构造函数

- _proto_：实例中的属性，指向 new 这个实例的构造函数的原型对象，对象可以通过`_proto_`来寻找不属于该对象的属性，`_proto_`将对象连接起来组成原型链。所有引用类型的_proto_属性值均指向它的构造函数的prototype的属性值。当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去他的_proto_（即它的构造函数的prototype）中寻找

### prototype 属性的引入

每一个 new 出的实例都有自己的属性和方法的副本，无法做到属性、方法共享，因此 Brendan Eich 决定为构造函数设置一个 prototype 属性。

这个对象包含一个对象（以下简称 “prototype 对象 ”），所有实例对象需要共享的属性及方法，都放在这个对象里面，那些不需要共享的属性及方法，就放在构造函数里面。

实例对象一旦创建，就自动引用 prototype 对象的属性和方法。也就是说。实例对象的属性和方法，分成两种，一种是本地的，一种是引用的。

```javascript
function DOG(name) {
  this.name = name
}
DOG.prototype = { species: '犬科' }

var dogA = new DOG('大毛')
var dogB = new DOG('二毛')

alert(dogA.species)
// 其实是通过dogA._proto_.species 来访问DOG.prototype.species
alert(dogB.species)
// 犬科
DOG.prototype
//{species:''犬科',constructor:fDOG(name),_proto_:Object}
DOG.prototype.constructor === DOG
//true
```

现在，species 属性放在 prototype 对象里，是两个实例对象共享的。只要修改了 prototype 对象，就会同时影响到两个实例对象。

![network](/images/prototype/1.png)

以上就是一个简单的 DOG 类完整的原型链。

#### 原型链的作用：对象属性的访问修改和删除。

- 访问。优先在对象本身查找，没有则顺着原型链向上查找
- 修改。只能修改跟删除自身属性，不会影响到原型链上的其他对象。

### _proto_ （原型指针）

```javascript
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function () {
    alert(this.name)
  }
}
var person1 = new Person('Zaxlct', 28, 'Software Engineer')
var person2 = new Person('Mick', 23, 'Doctor')
person1.__proto__ == Person.prototype
//person1.__proto__  = person1.constructor.prototype , person1.constructor = Person
Person.__proto__
//Person.constructor = Function => Person.__proto__  = Function.prototype
Person.prototype.__proto__
// Person.prototype 是一个普通对象（原型对象），普通函数的构造函数是Object => Person.prototype.__proto__ =  Object.prototype
Object.__proto__
//普通对象 同上
Object.prototype.__proto__
//对象也有proto属性，但它比较特殊，为null,因为null处于原型链的顶端
```

JS 在创建对象（不论是普通对象还是函数对象）的时候，都有一个叫做 _proto_ 的内置属性，**用于指向创建它的构造函数的原型对象** ，原型链继承是通过 _proto_ 这个原型指针来完成的

### 原型链图

褐色的线为原型链 ![img caption](/images/prototype/2.png)

够造函数、原型和实例的关系：

1.  每个构造函数都有一个原型对象（x.prototype)
2.  原型对象都包含一个指向构造函数的指针（x.prototype.constructor === x)
3.  实例都包含一个指向原型对象的内部指针（a._proto_ ）

** 所有函数的默认原型都是 Object 的实例**

### 继承

常用继承：组合继承，寄生组合继承

javascript 对象具有 “ 自有属性 ” 也有一些属性是从原型对象继承来的。
有两种继承方式：

1. 寄生函数继承（构造函数继承 (call/apply)），利用 call 继承父类上的属性，用子类的原型等于父类实例去继承父类的方法。缺点：调用父类两次，造成性能浪费。
2. 原型链继承 ( 挂载到 prototype 属性上面 )。

```javascript
function Parent(name) {
  this.name = name
}

Parent.prototype.say = function () {
  console.log(this.name)
}

function Child(name) {
  Parent.call(this, name)
}
Child.prototype = new Parent()
let c = new Child('Y')
c.say()
```

寄生函数继承：利用 call 继承父类上的属性，用一个干净的函数的原型去等于父类原型，再用子类的原型的等于干净函数的实例。

## 事件委托

利用事件委托技术能让你对特定的每个节点添加事件监听器；相反，事件监听器是被添加到他们的父元素上的。事件监听器会分析从子元素冒泡上来的事件，找到是哪一个子元素的事件。

- event.target 返回触发事件的元素
- event.currentTarget 返回绑定事件的元素

```html
<ul id="parent-list">
  <li id="post-1">Item 1</li>
  <li id="post-2">Item 2</li>
  <li id="post-3">Item 3</li>
  <li id="post-4">Item 4</li>
  <li id="post-5">Item 5</li>
  <li id="post-6">Item 6</li>
</ul>
<script>
  document
    .getElementById('parent-list')
    .addEventListener('click', function (e) {
      // e.target是被点击的元素!
      // 如果被点击的是li元素
      if (e.target && e.target.nodeName == 'LI') {
        // 找到目标，输出ID!
        console.log('List item ', e.target.id.replace('post-'), ' was clicked!')
      }

      $('li').click(function () {
        $(this).css('background', '#D4DFE6')
      })

      // jQuery的delegate写法
      $('#wrap').delegate('li', 'click', function (ev) {
        // this 指向委托的对象 li
        $(this).css('background', '#D4DFE6')

        // 找到父级 ul#wrap
        $(ev.delegateTarget).css('border', '2px solid #f00')
      })
    })
</script>
```

## `getComputedStyle()`

`getComputedStyle`是一个可以获取当前元素所有最终使用 css 属性值。返回一个 css 样式声明对象([object CSSStyleDeclaration])，只读。之前偶尔有一次要更改伪类元素 ::after 的样式

```javascript
var dom = document.getElementById('test'),
  style = window.getComputedStyle(dom, ':after')
```

### `getComputedStyle`与`style`的区别

- `getComputedStyle`方法是只读的，只能获取样式，不能设置；而`element.style`能读能写。
- 获取对象范围
  `getComputedStyle`方法获取的是最终应用在元素上的所有 css 属性对象；而`element.style`只能获取元素`style`中的 css 样式。因此对于一个光秃秃的元素`<p>`，`getComputedStyle`方法返回对象中的 length 属性值就有 190+,而`element.style`就是 0。

### `getPropertyValue`方法

`getPropertyValue`方法可以获取 CSS 样式申明对象上的属性值（直接属性名称），例如：

```javascript
window.getComputedStyle(element, null).getPropertyValue('float')
```

## `this`

\*\* `this`要在执行的时候才能确定值，定义时是无法确认，因为 js 不是编译型语言而是解释型语言

说明 this 几种不同的使用方式

- 作为构造函数执行
- 作为对象属性执行
- 作为普通函数执行
- `call`,`applay`,`bind`

```javascript
var a = {
  name: A,
  fn: function () {
    console.log(this.name)
  },
}
a.fn() //this===a
a.fn({ name: 'b' }) //this==={name:'b'}
var fn1 = a.fn
fn1() //this===window
```

---

## 深浅拷贝

### 浅拷贝

浅拷贝之解决了第一层的问题，如果接下去的值中还有对象的话，那么就又会出现值引用，改变值会互相影响

- 首先可以通过`Object.assign`来解决这个问题。

  ```javascript
  let a = {
    age: 1,
  }
  let b = Object.assign({}, a)
  a.age = 2
  console.log(b.age)
  ```

- 当然也可以通过展开运算符（···）来解决
  ```javascript
  let a = {
    age: 1,
  }
  let b = { ...a }
  a.age = 2
  console.log(b.age) //1
  ```

### 深拷贝

这个问题可以通过`JSON.parse(JSON.stringfy(object))`来解决。

但是该方法也是有局限性的：

- 会忽略 `undefined`
- 会忽略`symbol`
- 不能序列化函数
- 不能解决循环引用对象

```javascript
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
}
obj.c = obj.b
obj.e = obj.a
obj.b.c = obj.c
obj.b.e = obj.b.c
let newObj = JSON.parse(JSON.stringfy(obj))
console.log(newObj) //会报错
```

```javascript
let a = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function () {},
  name: 'yck',
}

let b = JSON.parse(JSON.stringfy(a))
console.log(b) //{name:'yck'}
```

## `Map`、`FlatMap`、`Reduce`

`Map`作用是生成一个新数组，遍历原数组，将每一个元素拿出来做一些变换然后`append`到新的数组中。

```javascript
;[1, 2, 3].map((v) => v + 1) //=>[2,3,4]
```

`Map`有三个参数，分别是当前索引元素，索引，原数组

```javascript
;['1', '2', '3'].map(parseInt)
//  parseInt('1', 0) -> 1
//  parseInt('2', 1) -> NaN
//  parseInt('3', 2) -> NaN
```

## NaN

```javascript
NaN !== NaN //true
NaN.valueOf() //NaN
NaN.toString() //'NaN
NaN < 3 //false
NaN >= 3 //false
NaN < NaN //false
NaN >= NaN //false
```

## 标签语句

相当于定位符，用于跳转到程序的任意位置。标签通常与 break 语句和 continue 语句配合使用，跳出特定的循环。

```javascript
top: for (var i = 0; i < 3; i++) {
  for (var j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break top
    console.log('i=' + i + ', j=' + j)
  }
}
```

break 命令后加上 top 标签，满足条件时，直接跳出双层循环。如果 break 语句后面不适用标签，则纸条出内层循环，进入下一次外层循环。

continue 语句也可以配合使用

```javascript
top: for (var i = 0; i < 3; i++) {
  for (var j = 0; j < 3; j++) {
    if (i === 1 && j === 1) continue top
    console.log('i=' + i + ', j=' + j)
  }
}
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
// i=2, j=0
// i=2, j=1
// i=2, j=2
```

满足条件时，会跳过当前循环，直接进入到下一论外层循环。如果 continue 语句后面不使用标签，则只能进入下一轮内层循环。

## with

with 语句用途是将代码作用于设置为特定对象，使用例子是：

```javascript
with(location{
  let qs = search.substring(1)
  let hostName = hostname
  let url = href
})
```

使用 with 代替频繁使用的 location 对象，这意味着在这个语句内部，每个变量首先会被认为是一个局部变量，如果没有找到该局部变量，则会搜索 location 对象，看它是否是有一个同名属性。如果有，则该苏醒会被求值成 location 对象属性

由于 with 语句影响性能且难以调试其中代码,通常不推荐在代码中使用

## 原始数据类型

ECMScript 变量可以包含两种不同类型的数据：原始值和引用值。原始值就是最简单的数据，引用值是由多个值构成的对象。

**6 种引用值**：Undefined、Null、Boolean、Number、String 和 Symbol，typeOf 操作符最适合用来判断是否是原始类型，但是如果值是对象或是 null，那么 typeof 返回 Object

保存原始值的变量是**按值**访问的，因为我们操作的就是存储在变量中的实际值

注意，原始类型的初始化可以只使用原始字面量形式。如果使用的是 new 关键字，则 JavaScript 会创建一个 Object 类型的实例，但其行为类似原始值。下面来看看这两种初始化方式的差异：

```javascript
let name1 = "Nicholas";
let name2 = new String("Matt");
name1.age = 27;
name2.age = 26;
console.log(name1.age) //undefined
console.log(name2.age) // 26
console.log(typeOf name1) //string
console.log(typeOf name2) //object
```

## 引用值

一个值得深思的例子

```javascript
function setName(obj) {
  obj.name = 'Nicholas'
  obj = new Object()
  obj.name = 'Greg'
  console.log(obj) //Greg
}
let person = new Object()
setName(person)
console.log(person.name) //“Nicholas"
```

如果 person 是按饮用类型传递的，那么 person 应该自动将指针改为指向 name 为”Greg"的对象。可是，当我们再次访问 person.name 时，它的值是“Nicholas",这表明函数中参数的，原始的引用类型仍然没有改变。

当 obj 在函数内部被重写时，它变成了一个指向本地对象的指针。而那个本地对象在函数执行结束时就被销毁
