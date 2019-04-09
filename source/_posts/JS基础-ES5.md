---
title: JS基础(ES5)
date: 2018-01-18 10:12:34
categories: 原生JS
---

感觉自己的 ES5 掌握的比较杂乱，在此整理一下自己的思路，总结、归纳原生 JS 的知识。

<!--more-->

## 内置类型

JS 中有 7 种内置类型，7 种内置类型又分为两大类型：基本类型和对象（Object）
基础基本类型有 6 种：`null`,`undefined`,`boolean`,`number`,`string`,`symbol`。

## `Typeof`

`typeof` 对于基本类型。除了`null`都可以显示正确的类型

```javascript
typeof 1; // 'number'
typeof '1'; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof b; // b 没有声明，但是还会显示 undefined

//typeof 对于对象，除了函数都会显示 object

typeof []; // 'object'
typeof {}; // 'object'
typeof console.log; // 'function'

typeof null; // 'object'
```

PS：为什么会出现这种情况呢？因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来

```javascript
let a;
// 我们也可以这样判断 undefined
a === undefined;
// 但是 undefined 不是保留字，能够在低版本浏览器被赋值
let undefined = 1;
// 这样判断就会出错
// 所以可以用下面的方式来判断，并且代码量更少
// 因为 void 后面随便跟上一个组成表达式
// 返回就是 undefined
a === void 0;
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

#### object.creat()

## 原型

原型：每一个对象都从原型继承属性。**每个对象都有 _proto_ 属性 , 每个对象都有原对象，但只有函数对象才有 prototype 属性**, 但是除却 function.prototype,function.prototype 也是函数对象，但是没有 prototype。可以使用 p.isPrototype(o) 来检查 p 是否是 o 的原型。

### 原型模式

原型模式是 js 对继承的一种实现

- prototype：构造函数中的属性，指向该构造函数的原型对象。

- constructor ：原型对象中的属性，指向该原型对象的构造函数

- _proto_：实例中的属性，指向 new 这个实例的构造函数的原型对象，对象可以通过`_proto_`来寻找不属于该对象的属性，`_proto_`将对象连接起来组成原型链

### prototype 属性的引入

每一个 new 出的实例都有自己的属性和方法的副本，无法做到属性、方法共享，因此 Brendan Eich 决定为构造函数设置一个 prototype 属性。

这个对象包含一个对象（以下简称 “prototype 对象 ”），所有实例对象需要共享的属性及方法，都放在这个对象里面，那些不需要共享的属性及方法，就放在构造函数里面。

实例对象一旦创建，就自动引用 prototype 对象的属性和方法。也就是说。实例对象的属性和方法，分成两种，一种是本地的，一种是引用的。

```javascript
function DOG(name) {
  this.name = name;
}
DOG.prototype = { species: '犬科' };

var dogA = new DOG('大毛');
var dogB = new DOG('二毛');

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
var person1 = new Person('Zaxlct', 28, 'Software Engineer');
var person2 = new Person('Mick', 23, 'Doctor');
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

常用继承：组合继承，寄生组合继承

javascript 对象具有 “ 自有属性 ” 也有一些属性是从原型对象继承来的。
有两种继承方式：

1. 寄生函数继承（构造函数继承 (call/apply)），利用 call 继承父类上的属性，用子类的原型等于父类实例去继承父类的方法。缺点：调用父类两次，造成性能浪费。
2. 原型链继承 ( 挂载到 prototype 属性上面 )。

```javascript
function Parent(name) {
  this.name = name;
}

Parent.prototype.say = function() {
  console.log(this.name);
};

function Child(name) {
  Parent.call(this, name);
}
Child.prototype = new Parent();
let c = new Child('Y');
c.say();
```

寄生函数继承：利用 call 继承父类上的属性，用一个干净的函数的原型去等于父类原型，再用子类的原型的等于干净函数的实例。

## call、apply 、 bind

- 都是用来改变函数的 this 对象的指向的。
- 第一个参数都是 this 要指向的对象。
- 参数、绑定规则（显示绑定和强绑定），运行效率（最终都会转换成一个一个的参数去运行）、运行情况（call ， apply 立即执行，bind 是 return 出一个 this “ 固定 ” 的函数，这也是为什么 bind 是强绑定的一个原因）。
- 在`javascipt`中，`call`和`apply`都是为了改变某个函数运行时的上下文而存在的，换句话说就是为了改变函数体内部`this`的指向。

### call()

```javascript
function class1() {
  this.name = function() {
    console.log(this.names);
    console.log('我是class1内的方法');
  };
}
function class2() {
  this.names = 'class2内部变量';
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
  this.name = 'animal';
  this.showName = function() {
    console.log(this.name);
  };
}
function Dog() {
  this.name = 'dog';
}
var animal = new Animal();
var dog = new Dog();

animal.showName.call(dog); //dog
```

意思是把 animal 的方法放到 dog 上执行，也可以说，把 animal 的 showName() 方法放到 dog 上来执行，所以 this.name 应该是 dog。

```javascript
function fruits() {}
fruits.prototype = {
  color: 'red',
  say: function() {
    console.log('my color is ' + this.color);
  }
};

var apple = new fruits();
apply.say(); //my color is red

banana = {
  color: 'yellow'
};
apple.say.call(banana); //my color is yellow
apple.say.apply(banana); //my color is yellow
```

所以可以看出`call`和`apply`是为了动态改变 this 二存在的，当一个 object 没有某个方法。但是其他的有。我们可以借助 call 或 apply 用其他对象的方法来操作。

```javascript
func.call(this, arg1, arg2);
func.apply(this, [arg1, arg2]);
```

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
var dog = new Dog('Crazy dog');
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
  var args1 = '1';
  var args2 = '2';
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
  document.getElementById('parent-list').addEventListener('click', function(e) {
    // e.target是被点击的元素!
    // 如果被点击的是li元素
    if (e.target && e.target.nodeName == 'LI') {
      // 找到目标，输出ID!
      console.log('List item ', e.target.id.replace('post-'), ' was clicked!');
    }

    $('li').click(function() {
      $(this).css('background', '#D4DFE6');
    });

    // jQuery的delegate写法
    $('#wrap').delegate('li', 'click', function(ev) {
      // this 指向委托的对象 li
      $(this).css('background', '#D4DFE6');

      // 找到父级 ul#wrap
      $(ev.delegateTarget).css('border', '2px solid #f00');
    });
  });
</script>
```

## `getComputedStyle()`

`getComputedStyle`是一个可以获取当前元素所有最终使用 css 属性值。返回一个 css 样式声明对象([object CSSStyleDeclaration])，只读。之前偶尔有一次要更改伪类元素 ::after 的样式

```javascript
var dom = document.getElementById('test'),
  style = window.getComputedStyle(dom, ':after');
```

### `getComputedStyle`与`style`的区别

- `getComputedStyle`方法是只读的，只能获取样式，不能设置；而`element.style`能读能写。
- 获取对象范围
  `getComputedStyle`方法获取的是最终应用在元素上的所有 css 属性对象；而`element.style`只能获取元素`style`中的 css 样式。因此对于一个光秃秃的元素`<p>`，`getComputedStyle`方法返回对象中的 length 属性值就有 190+,而`element.style`就是 0。

### `getPropertyValue`方法

`getPropertyValue`方法可以获取 CSS 样式申明对象上的属性值（直接属性名称），例如：

```javascript
window.getComputedStyle(element, null).getPropertyValue('float');
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
  fn: function() {
    console.log(this.name);
  }
};
a.fn(); //this===a
a.fn({ name: 'b' }); //this==={name:'b'}
var fn1 = a.fn;
fn1(); //this===window
```

---

## 深浅拷贝

### 浅拷贝

浅拷贝之解决了第一层的问题，如果接下去的值中还有对象的话，那么就又会出现值引用，改变值会互相影响

- 首先可以通过`Object.assign`来解决这个问题。

  ```javascript
  let a = {
    age: 1
  };
  let b = Object.assign({}, a);
  a.age = 2;
  console.log(b.age);
  ```

- 当然也可以通过展开运算符（···）来解决
  ```javascript
  let a = {
    age: 1
  };
  let b = { ...a };
  a.age = 2;
  console.log(b.age); //1
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
    d: 3
  }
};
obj.c = obj.b;
obj.e = obj.a;
obj.b.c = obj.c;
obj.b.e = obj.b.c;
let newObj = JSON.parse(JSON.stringfy(obj));
console.log(newObj); //会报错
```

```javascript
let a = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function() {},
  name: 'yck'
};

let b = JSON.parse(JSON.stringfy(a));
console.log(b); //{name:'yck'}
```

## `Map`、`FlatMap`、`Reduce`

`Map`作用是生成一个新数组，遍历原数组，将每一个元素拿出来做一些变换然后`append`到新的数组中。

```javascript
[1, 2, 3].map(v => v + 1); //=>[2,3,4]
```

`Map`有三个参数，分别是当前索引元素，索引，原数组

```javascript
['1', '2', '3'].map(parseInt);
//  parseInt('1', 0) -> 1
//  parseInt('2', 1) -> NaN
//  parseInt('3', 2) -> NaN
```
