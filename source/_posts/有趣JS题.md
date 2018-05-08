---
title: 有趣JS题
date: 2018-03-08 15:57:30
categories: 原生JS
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
## 综合(1)

```javascript
function Foo(){
  getName = function(){
    alert(1);
  }
  return this;
}

Foo.getName = function(){alert(2);};
Foo.prototype.getName = function(){alert(3);};
var getName = function(){alert(4);};
function getName() {alert(5)};

//请写出以下输出结果,先写以下SB作者的答案，然后接受残酷的事实
Foo.getName(); //alert(2);
getName();//alert(5);
Foo().getName();//alert(5);
getName();//alert(5);
new Foo.getName();//function(){alert(2);}
new Foo().getName();//function getName {alert{5}}
new new Foo.getName();//function(){alert(2);}

```
首先定义了一个叫Foo 的函数，然后为Foo创建了一个叫getName的静态属性存储了一个匿名函数，之后为Foo的原型对象创建了一个叫getName 的匿名函数。之后又通过函数变量表达式创建了一个getName的函数，最后声明一个叫做getName函数。

### Foo.getName();

**答案： 2**

Foo.getName()访问的Foo函数上存储的静态属性

```javascript
 function User(name){
   var name = name ;//私有属性
   this.name = name ;//公有属性
   function getName(){//私有方法
     return name;
   }
 }

 User.prototype.getName = function(){ //公有方法
  return this.name;
 }

 User.name = 'Wscats';//静态属性
 User.getName = function(){
   //静态方法
   return this.name;
 }
 var Wscat = new User('Wscats');//实例化

```

注意以下几点：
- 调用公有方法，公有属性，我们必须要实例化对象，也就是用new操作符实例化对象，就可构造函数实例化对象的方法和属性，并且公有方法是不能调用私有方法和静态方法的。
- 静态方法和静态属性就是我们无需实例化就可以调用。
- 而对象的私有方法和属性，外部是不可以访问的。

### getName()

**答案是4**

直接调用getName函数。既然是直接调用，那么就是访问当前作用域内的getName的函数，所以这里应该是4或者5.这里的坑有，一是变量声明提升，而是函数表达式和函数声明的区别。答案是4，5的函数声明被4的函数表达式覆盖了。

#### 函数声明与函数表达式
```javascript

  getName()
  //oaoaafly 函数被提升 这里受函数声明的影响，虽然函数声在最后但可以被提升到最前面了 而此时的函数表达式还没有被赋值（赋值是顺序执行）。

  var getName = function(){
    console.log('wscat');
  } 
//函数表达式此时才开始覆盖函数声明的定义。

  getName()//wscat

  funtion getName(){
    console.log('oaoafly');
  }
  getName()//wscat 这里就执行函数表达式的值
  ```
  - **JS解释器中存在一种变量被提升的机制，也就是说函数声明会被提升到作用域的最前面，即使写在代码的最后面，也会被提升到最前面。**

  - **而用函数表达式创建的函数是在运行时被赋值，且要等到表达式赋值完成后才能调用。**


### Foo().getName()

**答案是：1**

Foo().getName();先执行了Foo函数，然后调用Foo函数的返回对象的getName属性函数。

Foo函数的第一句`getName = function(){alert(1);};`是一句函数赋值语句，注意它没有var声明，所以先向当前Foo函数作用域内寻找getName变量，没有，再项当前函数的作用域上层，及外层的作用于内寻找是否含有getName变量，找到了，也就是第二问中的alert(4)函数，将此变量的值赋值为`function(){alert(1)}`。此处实际上是将外层作用域内的getName函数覆盖了。

注意：此处若依然没有找到会一直向上查找到window对象，若window对象中也没有getName属性，就在window对象中创建一个getName变量。

之后就返回了this，此时的this是指向的window对象。所以相当于执行了window.getName()。


### getName()

**答案是：1**

直接调用getName函数，相当于window.getName()，因为这个变量已经被Foo函数执行时修改了，遂结果与第三问相同，为1，也就是说Foo执行后把全局的getName函数给重写了一次，所以结果就是Foo()执行重写的那个getName函数


### new Foo.getName()

**答案是：2**

此处考察的是JS的运算符优先级的问题。[MDN运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

- 点的优先级比new高 所以Foo.getName 是一起的.
- 因为有()，因此是new 有参数列表，new 的有参数列表为18比函数调用（17）高 ，所以是 new Foo.getName
-  所以最后是(new Foo.getName)();
- 最后弹出2

### new Foo().getName()

**答案是：3**

new 的有参数列表跟点的优先级都是18,同级的话按照从左向右的执行顺序，所以先执行new 的有参数列表，再执行点的优先级，最后进行函数调用。(new Foo()).getName(); new之后就调用公用办法，调用原型链上的getName，因此是3。


### new new Foo.getName()

**答案是：3**
等同于：new ((new Foo()).getName)();


## 综合(2)
```javascript
      function Foo() {
			this.getName = function() {
				console.log(3);
				return {
					getName: getName//这个就是第六问中涉及的构造函数的返回值问题
				}
			};//这个就是第六问中涉及到的，JS构造函数公有方法和原型链方法的优先级
			getName = function() {
				console.log(1);
			};
			return this
		}
		Foo.getName = function() {
			console.log(2);
		};
		Foo.prototype.getName = function() {
			console.log(6);
		};
		var getName = function() {
			console.log(4);
		};

		function getName() {
			console.log(5);
		} //答案：
		Foo.getName(); //2
		getName(); //4
		console.log(Foo())
		Foo().getName(); //1
		getName(); //1
		new Foo.getName(); //2
		new Foo().getName(); //3
                //多了一问
		new Foo().getName().getName(); //3 1
		new new Foo().getName(); //3
 ```