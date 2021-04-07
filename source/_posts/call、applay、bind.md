---
title: call、applay、 bind
date: 2019-04-13 17:36:56
categories: JavaScript
---

- 都是用来改变函数的 this 对象的指向的。
- 第一个参数都是 this 要指向的对象。
- 参数、绑定规则（显示绑定和强绑定），运行效率（最终都会转换成一个一个的参数去运行）、运行情况（call ， apply 立即执行，bind 是 return 出一个 this “ 固定 ” 的函数，这也是为什么 bind 是强绑定的一个原因）。
- 在`javascipt`中，`call`和`apply`都是为了改变某个函数运行时的上下文而存在的，换句话说就是为了改变函数体内部`this`的指向。
  <!--more-->

## call()

```javascript
function class1() {
  this.name = function () {
    console.log(this.names)
    console.log('我是class1内的方法')
  }
}
function class2() {
  this.names = 'class2内部变量'
  class1.call(this)

  //class2内部变量 我是class1内的方法
  //此行代码执行后，当前的this指向了class1（也可以说class2继承了class1）
}

var f = new class2()
f.name() //调用的是class1内的方法，将class1的name方法交给class2使用
```

```javascript
function eat(x, y) {
  console.log(x + y)
}
function drink(x, y) {
  console.log(x - y)
}
eat.call(drink, 3, 2) //5
```

这个例子中的意思就是用 eat 来替换 drink，eat.call(drink,3,2) == eat(3,2)

```javascript
function Animal() {
  this.name = 'animal'
  this.showName = function () {
    console.log(this.name)
  }
}
function Dog() {
  this.name = 'dog'
}
var animal = new Animal()
var dog = new Dog()

animal.showName.call(dog) //dog
```

意思是把 animal 的方法放到 dog 上执行，也可以说，把 animal 的 showName() 方法放到 dog 上来执行，所以 this.name 应该是 dog。

```javascript
function fruits() {}
fruits.prototype = {
  color: 'red',
  say: function (a, b) {
    console.log('my color is ' + this.color + ' ' + a + '' + b)
  },
}

var apple = new fruits()
apple.say() //my color is red undefinedundefined

banana = {
  color: 'yellow',
}
apple.say.call(banana, 'red', 'blue') //my color is yellowredblue
apple.say.apply(banana) //my color is yellow undefinedundefined
```

所以可以看出`call`和`apply`是为了动态改变 this 二存在的，当一个 object 没有某个方法。但是其他的有。我们可以借助 call 或 apply 用其他对象的方法来操作。

```javascript
func.call(this, arg1, arg2)
func.apply(this, [arg1, arg2])
```

**查找数组中的最大值**

```javascript
var numbers = [5, 458, 120, -215]
Math.max.apply(Math, numbers) //458
Math.max.call(Math, 5, 458, 120, -215) //458

// ES6
Math.max.call(Math, ...numbers) // 458

//或者
var arr = [1, 2, 3]
var max = Math.max(...arr)
```

## 继承


```javascript
function Animal(name) {
  this.name = name
  this.showName = function () {
    console.log(this.name)
  }
}
function Dog(name) {
  Animal.call(this, name)
}
var dog = new Dog('Crazy dog')
dog.showName()
```

Animal.call(this) 的意思就是使用 Animal 对象代替 this 对象，那么 Dog 就能直接调用 Animal 的所有属性和方法。

```javascript
var toString = Object.prototype.toString
console.log(toString.call(2)) //[object Number]
console.log(toString.call(true)) //[object Boolean]
console.log(toString.call(function () {})) //[object Function]
```

## apply

```javascript
function class1(args1, args2) {
  this.name = function () {
    console.log(args, args)
  }
}
function class2() {
  var args1 = '1'
  var args2 = '2'
  class1.call(this, args1, args2)
  /*或*/
  class1.apply(this, [args1, args2])
}

var c = new class2()
c.name()
```

## bind

bind 是在 EcmaScript5 中扩展的方法（IE6,7,8 不支持。)

bind() 方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind() 方法的第一个参数作为 this，传入 bind() 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

```javascript
var bar = function () {
  console.log(this.x)
}
var foo = {
  x: 3,
}
bar()
bar.bind(foo)() //undefined 3
/*或*/
var func = bar.bind(foo)
func()
```
