---
title: JS基础(ES5)
date: 2018-01-18 10:12:34
categories: 原生JS
---

感觉自己的 ES5 掌握的比较杂乱，在此整理一下自己的思路，总结、归纳原生 JS 的知识。

<!--more-->

## 对象

创建对象可以通过对象直接量，关键字 new 和 object.creat() 函数来创建对象。每一个对象都有与知相关的原型，类和可扩展性。可分为普通对象和函数对象。凡是通过 new function() 创建的都是函数对象。其他都是普通对象。

### 对象直接量

对象直接量是类似于 var a = {x:0,y:0} 的映射表。对象直接量是一个表达式，这个表达式的每次运算都创建并初始化一个新的对象。每次计算对象直接量的时候。也会计算它的每个属性值，**也就是说在一个循环体内使用了对象直接量，他将会创建很对新对象，并且每次创建的对象的属性值也有可能不同。**

### 通过 new 创建对象

var obj=new MyClass(); new 运算符创建并初始化一个**新对象** 用 new 调用时，this 会指向空的对象，并且这个对象的原型指向 MyClass.prototype

#### object.creat()

## 原型

原型：每一个对象都从原型继承属性。**每个对象都有 _proto_ 属性 , 每个对象都有原对象，但只有函数对象才有 prototype 属性**, 但是除却 function.prototype,function.prototype 也是函数对象，但是没有 prototype。可以使用 p.isPrototype(o) 来检查 p 是否是 o 的原型。

### 原型模式

原型模式是 js 对继承的一种实现

- prototype：构造函数中的属性，指向该构造函数的原型对象。

- constructor ：原型对象中的属性，指向该原型对象的构造函数

- _proto_：实例中的属性，指向 new 这个实例的构造函数的原型对象

### prototype 属性的引入

每一个 new 出的实例都有自己的属性和方法的副本，无法做到属性、方法共享，因此 Brendan Eich 决定为构造函数设置一个 prototype 属性。

这个对象包含一个对象（以下简称 “prototype 对象 ”），所有实例对象需要共享的属性及方法，都放在这个对象里面，那些不需要共享的属性及方法，就放在构造函数里面。

实例对象一旦创建，就自动引用 prototype 对象的属性和方法。也就是说。实例对象的属性和方法，分成两种，一种是本地的，一种是引用的。

```javascript
function DOG(name) {
  this.name = name;
}
DOG.prototype = { species: "犬科" };

var dogA = new DOG("大毛");
var dogB = new DOG("二毛");

alert(dogA.species);
// 其实是通过dogA._proto_.species 来访问DOG.prototype.species
alert(dogB.species);
// 犬科
DOG.prototype;
//{species:''犬科',constructor:fDOG(name),_proto_:Object}
DOG.prototype.constructor === DOG;
//true
```

现在，species 属性放在 prototype 对象里，是两个实例对象共享的。只要修改了 prototype 对象，就会同时影响到两个实例对象。

![img caption](/images/prototype/1.png)

以上就是一个简单的 DOG 类完整的原型链。

#### 原型链的作用：对象属性的访问修改和删除。

- 访问。优先在对象本身查找，没有则顺着原型链向上查找
- 修改。只能修改跟删除自身属性，不会影响到原型链上的其他对象。

### _proto_ （原型指针）

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    alert(this.name);
  };
}
var person1 = new Person("Zaxlct", 28, "Software Engineer");
var person2 = new Person("Mick", 23, "Doctor");
person1.__proto__ == Person.prototype;
//person1.__proto__  = person1.constructor.prototype , person1.constructor = Person
Person.__proto__;
//Person.constructor = Function => Person.__proto__  = Function.prototype
Person.prototype.__proto__;
// Person.prototype 是一个普通对象（原型对象），普通函数的构造函数是Object => Person.prototype.__proto__ =  Object.prototype
Object.__proto__;
//普通对象 同上
Object.prototype.__proto__;
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

javascript 对象具有 “ 自有属性 ” 也有一些属性是从原型对象继承来的。有两种继承方式：1. 构造函数继承 (call/apply)，2. 原型链继承 ( 挂载到 prototype 属性上面 )。

## 闭包

创建闭包最常见的方式就是在一个函数内部创建另一个函数。通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。但是，在创建了一个闭包以后，这个函数的作用域就会一直保存到闭包不存在为止。

```javascript
function test() {
  for (var i = 0; i < 4; i++) {
    console.log("i:" + i);
    (function(e) {
      setTimeout(function() {
        console.log(e);
      }, 0);
    })(i);
  }
}
test(); //i:0 => i:1 => i:2=> i:3=>  0 => 1=> 2 => 3
```

循环当中，匿名函数会立即执行，并且会将循环当前的 i 作为参数传入，将其作为当前匿名函数中的形参 e 的指向，即会保存对 i 的引用，它是不会被循环改变的。

```javascript
function makeAdder(x) {
  console.log("x:" + x);
  return function(y) {
    console.log("y:" + y);
    return x + y;
  };
}

var add5 = makeAdder(5);
//x:5 undefined
add5;
//f(y){  console.log('y:' + y) return x + y}
var add10 = makeAdder(10);

console.log(add5(2)); // y:2 => 7
console.log(add10(2)); // 12

// 释放对闭包的引用
add5 = null;
add10 = null;
```

add5 和 add10 都是闭包。他们共享相同的函数定义，但是保存了不同的环境。在 add5 中，x 为 5，在 add10 中，x 则为 10 ，最后通过 null 释放对闭包的引用。

在 javascript 中，如果一个对象不再被引用，那么这个对象就会被垃圾回收机制回收； 如果两个对象互相引用，而不再被第 3 者所引用，那么这两个互相引用的对象也会被回收。

**闭包只能取得包含函数中任何变量的最后一个值，这是因为闭包所保存的是整个变量对象，而不是某个特殊的变量**

```javascript
function test() {
  var arr = [];
  for (var i = 0; i < 10; i++) {
    //作用域1
    arr[i] = function() {
      //作用域2 声明arr[]()
      return i;
    };
  }
  for (var a = 0; a < 10; a++) {
    console.log(arr[a]());
  }
}
test();
// 毫无疑问连续打印 10 个 10。因为在for循环中 a[i] 为一个函数声明
//1.执行完for之后，在for作用域中i的值为10
```

改动一下

```javascript
function test() {
  var arr = [];
  //块1作用域
  for (let i = 0; i < 10; i++) {
    //块2作用域
    arr[i] = function() {
      //块3作用域
      return i;
    };
  }
  //块1作用域
  for (var a = 0; a < 10; a++) {
    console.log(arr[a]());
  }
}
test(); // 连续打印 0 到 9
```

**实现原因 :**

- 当用 var 的时候 函数 2 作用域中没有 i 就向函数作用域 1 中去找，而执行到 `console.log(arr[a]())` 时 i 已经循环完毕，因此 i 全为 10。

* 当使用 let 时，每次迭代 i 都被**重新声明**，即每层迭代会生成一个块作用域，并且变量 i 被定义为上一次结算的值。
* var 是函数作用域，for 循环无论执行多少次，都是去最近的函数里面找，而不是块中找，所以只有一个 i，现在的 i 是 10。

### 闭包中的 this 对象

```javascript
var name = "The Window";

var obj = {
  name: "My Object",

  getName: function() {
    return function() {
      return this.name;
    };
  }
};

console.log(obj.getName()()); // The Window
```

obj.getName()() 实际上是在全局作用域中调用了匿名函数，this 指向了 window。这里要理解函数名与函数功能（或者称函数值）是分割开的，不要认为函数在哪里，其内部的 this 就指向哪里。匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window。

### 闭包的应用

**应用闭包的主要场合是：设计私有的方法和变量。** 闭包的作用：

- 访问函数的内部变量
- 让被引用的变量值始终保存在内存中

```javascript
function fun(n, o) {
  console.log(o);
  return {
    fun: function(m) {
      return fun(m, n);
    }
  };
}

var a = fun(0); // undefined
a.fun(1); // 0
a.fun(2); // 0
a.fun(3); // 0

var b = fun(0)
  .fun(1)
  .fun(2)
  .fun(3); // undefined,0,1,2

var c = fun(0).fun(1); // undefined,0
c.fun(2); // 1
c.fun(3); // 1
```

```javascript
function fn1() {
  var a = 1;
  return function() {
    console.log(++a);
  };
}

var fn2 = fn1();

fn2(); //输出2

fn2(); //输出3
```

## call、apply 、 bind

参数、绑定规则（显示绑定和强绑定），运行效率（最终都会转换成一个一个的参数去运行）、运行情况（call ， apply 立即执行，bind 是 return 出一个 this “ 固定 ” 的函数，这也是为什么 bind 是强绑定的一个原因）。

### call()

```javascript
function class1() {
  this.name = function() {
    console.log(this.names);
    console.log("我是class1内的方法");
  };
}
function class2() {
  this.names = "class2内部变量";
  class1.call(this); //此行代码执行后，当前的this指向了class1（也可以说class2继承了class1）
}

var f = new class2();
f.name(); //调用的是class1内的方法，将class1的name方法交给class2使用
```

```javascript
function eat(x, y) {
  console.log(x + y);
}
function drink(x, y) {
  console.log(x - y);
}
eat.call(drink, 3, 2); //5
```

这个例子中的意思就是用 eat 来替换 drink，eat.call(drink,3,2) == eat(3,2)

```javascript
function Animal() {
  this.name = "animal";
  this.showName = function() {
    console.log(this.name);
  };
}
function Dog() {
  this.name = "dog";
}
var animal = new Animal();
var dog = new Dog();

animal.showName.call(dog); //dog
```

意思是把 animal 的方法放到 dog 上执行，也可以说，把 animal 的 showName() 方法放到 dog 上来执行，所以 this.name 应该是 dog。

#### 继承

```javascript
function Animal(name) {
  this.name = name;
  this.showName = function() {
    console.log(this.name);
  };
}
function Dog(name) {
  Animal.call(this, name);
}
var dog = new Dog("Crazy dog");
dog.showName();
```

Animal.call(this) 的意思就是使用 Animal 对象代替 this 对象，那么 Dog 就能直接调用 Animal 的所有属性和方法。

### apply

```javascript
function class1(args1, args2) {
  this.name = function() {
    console.log(args, args);
  };
}
function class2() {
  var args1 = "1";
  var args2 = "2";
  class1.call(this, args1, args2);
  /*或*/
  class1.apply(this, [args1, args2]);
}

var c = new class2();
c.name();
```

### bind

bind 是在 EcmaScript5 中扩展的方法（IE6,7,8 不支持。

bind() 方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind() 方法的第一个参数作为 this，传入 bind() 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

```javascript
var bar = function() {
  console.log(this.x);
};
var foo = {
  x: 3
};
bar();
bar.bind(foo)(); //undefined 3
/*或*/
var func = bar.bind(foo);
func();
```

## 事件委托

利用事件委托技术能让你对特定的每个节点添加事件监听器；相反，事件监听器是被添加到他们的父元素上的。事件监听器会分析从子元素冒泡上来的事件，找到是哪一个子元素的事件。

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
document.getElementById("parent-list").addEventListener("click",function(e) {
	// e.target是被点击的元素!
	// 如果被点击的是li元素
	if(e.target && e.target.nodeName == "LI") {
		// 找到目标，输出ID!
		console.log("List item ",e.target.id.replace("post-")," was clicked!");
	}

$('li').click(function(){
        $(this).css('background', '#D4DFE6');
});

// jQuery的delegate写法
    $('#wrap').delegate('li', 'click', function(ev){

        // this 指向委托的对象 li
        $(this).css('background', '#D4DFE6');

        // 找到父级 ul#wrap
        $(ev.delegateTarget).css('border', '2px solid #f00');
    });


});</script>
```

## `getComputedStyle()`

`getComputedStyle`是一个可以获取当前元素所有最终使用 css 属性值。返回一个 css 样式声明对象([object CSSStyleDeclaration])，只读。之前偶尔有一次要更改伪类元素 ::after 的样式

```javascript
var dom = document.getElementById("test"),
  style = window.getComputedStyle(dom, ":after");
```

### `getComputedStyle`与`style`的区别

- `getComputedStyle`方法是只读的，只能获取样式，不能设置；而`element.style`能读能写。
- 获取对象范围
  `getComputedStyle`方法获取的是最终应用在元素上的所有 css 属性对象；而`element.style`只能获取元素`style`中的 css 样式。因此对于一个光秃秃的元素`<p>`，`getComputedStyle`方法返回对象中的 length 属性值就有 190+,而`element.style`就是 0。

### `getPropertyValue`方法

`getPropertyValue`方法可以获取 CSS 样式申明对象上的属性值（直接属性名称），例如：

```javascript
window.getComputedStyle(element, null).getPropertyValue("float");
```
