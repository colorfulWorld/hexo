---
title: this指向
date: 2018-01-23 11:39:32
tags:
---

[链接](http://mp.weixin.qq.com/s/2PnWD8bIFgEJxYONoPZs6w)

1. js 函数中 this 指向并不是在函数定义的时候确定的，而是在函数调用的时候确定的，所以函数的调用方式决定 this 的 指向。this 永远指向最后调用它的那个对象。
2. 普通的函数有 3 种调用方式：直接调用，方法调用和 new 调用。除此之外还有通过 bind() 将函数绑定到对象之后再调用，通过 call()、apply() 进行调用等。es6 引入箭头函数之后，其 this 指向又有所不同。
3. this 既不是指向函数自身也不指向函数作用域，this 实际上是在函数被调用是发生绑定的，它的指向完全取决于函数在哪里调用。

<!--more-->

```javascript
var a = {
  name: 'A',
  fn: function() {
    console.log(this.name);
  }
};

a.fn(); //this===a;
a.fn.call({ name: 'B' }); //this==={name:'B'}
var fn1 = a.fn;
fn1(); //this===window
```

this 执行会有不同，主要是几种在这几个场景中：

- 作为构造函数执行，构造函数中
- 作为对象属性上执行，上述代码中的 a.fn()
- 作为普通函数执行，上述代码中的 fn1()
- 用于 bind,call,apply 上述代码中 a.fn.call({name:'B'})

## 默认绑定

在 JavaScript 中，最常用的函数调用类型就是独立函数调用。如果在调用函数的时候，函数不带任何修饰，也就是光秃秃的调用，那就会应用默认绑定规则，默认绑定的指向的是全局作用域。

```javascript
<script type="text/javascript" charset="utf-8">
  var name = "g";
  function a() {
      console.log(this.name);        //g
      a.name = 'inside';
      function b() {
          console.log(this.name);  //g


      }
      b();
  }
  a();
</script>
```

`a()` 函数在全局作用域中被调用，因此第 1 句中的 `this` 就绑定在了全局对象上。`b()` 函数在 `a()` 函数里面调用，即使这样第二句中的 `this` 指代的仍然是全局对象，即使 `a()` 函数设置了 `name` 属性。这就是默认绑定规则，它是 `js` 中最常见的一种函数调用模式，`this` 的绑定规则也是最简单的一种，就是绑定在全局作用域上

** 但是如果使用了严格模式，则 `this` 不能绑定到全局对象，在严格模式下，把 `this` 绑定到全局对象上时，实际上绑定的是 `underfined`，因此上面的代码会报错 **

---

```javascript
var name = 'g';
function a() {
  console.log(this.name); //g
  var c = this;
  c.name = 'inside';
  function b() {
    console.log(this.name); //inside
  }
  b();
}
a();
```

---

```javascript
var name = 'g';
function a() {
  console.log(this.name); //g
  name = 'inside';
  function b() {
    console.log(this.name); //inside
  }
  b();
}
a();
```

---

```javascript
var name = 'g';
function a() {
  console.log(this.name); //g
  var name = 'inside';
  function b() {
    console.log(this.name); //g
  }
  b();
}
a();
```

---

```javascript
var name = 'g';
function a() {
  console.log(this.name); //g
  var name = 'inside';
  function b() {
    console.log(name); //inside
  }
  b();
}
a();
```

---

```javascript
var name = 'g';
function a() {
  console.log(name); //underfined
  var name = 'inside';
  function b() {
    console.log(name); //inside
  }
  b();
}
a();
```

---

```javascript
var name = 'g';
function a() {
  console.log(name); //underfined
  var name = 'inside';
  function b() {
    console.log(this.name); //g
  }
  b();
}
a();
```

所以通过上面的实验可以充分的得出一个结论，this 确实不是指向的当前作用域的，this 和词法作用域是完全不同的。

---

## 隐式绑定

当函数在调用时，如果函数有所谓的 “ 落脚点 ”, 即有上下文对象时，隐式绑定规则会把函数中的 this 绑定到这个上下文对象。如果觉得上面这段话不够直白的话，还是来看代码。

```javascript
function say() {
  console.log(this.name);
}
var obj1 = {
  name: 'zxt',
  say: say
};
var obj2 = {
  name: 'zxt1',
  say: say
};
obj1.say(); // zxt
obj2.say(); // zxt1
```

obj1 ， obj2 就是所谓 say 函数的落脚点，专业一点的说法就是上下文对象，给函数指定了这个上下文对象的时，函数内部的 this 自然指向了这个上下文对象。这是很常见的函数调用模式

** 对象属性引用链中只有最顶层或者说是最后一层会影响调用位置 **

```javascript
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo
};
var obj1 = {
  a: 2,
  obj2: obj2
};
obj1.obj2.foo();
```

### 隐式绑定上下文的时丢失上下文

```javascript
function say() {
  console.log(this.name);
}
var name = 'global';
var obj = {
  name: 'inside',
  say: say
};
var alias = obj.say; // 设置一个简写   (1)
alias(); // 函数调用 输出"global"  (2)
```

由于在 js 中，函数是对象，对象之间是引用传递，而不是值传递，因此第一句代码只是 alias = obj.say= say, 也就是 alias = say，obj.say 只是起了一个桥梁的作用，alias 最终引用的是 say 函数的地址，而与 obj 这个对象无关了，这就是所谓的 “ 丢失上下文 ”。最终执行 alias 函数只不过简单的执行了 say 函数

```javascript
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  // fn其实引用的是foo
  fn(); // <-- 调用位置！
}
var obj = {
  a: 2,
  foo: foo
};
var a = 'oops, global'; // a是全局对象的属性
doFoo(obj.foo);
```

参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值。回调函数丢失 this 是很常见的情况，除此之外回调函数的函数可能会修改 this，实际上你无法控制回调函数的执行方式，因此就没办法控制会影响绑定的调用位置

---

## 显示绑定

显示绑定，显示的将 this 绑定到一个上下文，js 中，提供了三种显示绑定的方法，apply,call ， bind。apply 和 call 的用法基本相似，他们之间的区别是：

- apply(obj,[arg1.arg2,...]); 被调用函数的参数以数组的形式给出

- call(obj,arg1,arg2,arg3,...); 被调用函数的参数依次给出

- bind 函数执行后，返回的是一个新函数。

** 硬性绑定的应用场景：**

```javascript
function foo(something) {
console.log( this.a, something );
return this.a + something;
} v
ar obj = {
a:2
};
var bar = function() {
return foo.apply( obj, arguments );
};
var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

另一种使用方法是创建一个

```javascript
function speak() {
  console.log(this.name);
}
var name = 'global';
var obj1 = {
  name: 'obj1'
};
var obj2 = {
  name: 'obj2'
};
speak(); // global 等价于speak.call(window)
speak.call(window);
speak.call(obj1); // obj1
speak.call(obj2); // obj2
```

带参数：

```javascript
// 带参数
function count(num1, num2) {
  console.log(this.a * num1 + num2);
}
var obj1 = {
  a: 2
};
var obj2 = {
  a: 3
};
count.call(obj1, 1, 2); // 4
count.apply(obj1, [1, 2]); // 4
count.call(obj2, 1, 2); // 5
count.apply(obj2, [1, 2]); // 5
```

因此可以看出，apply ， call 的作用就是给函数绑定一个执行上下文，且是显示绑定的。因此函数内的 this 自然而然就绑定在了 call 或者 apply 所调用的对象上。而 bind 函数，则返回一个绑定了制定的执行上下文的新函数：

```javascript
// 带参数
function count(num1, num2) {
  console.log(this.a * num1 + num2);
}
var obj1 = {
  a: 2
};
var bound1 = count.bind(obj1); // 未指定参数
bound1(1, 2); // 4
var bound2 = count.bind(obj1, 1); // 指定了一个参数
bound2(2); // 4
var bound3 = count.bind(obj1, 1, 2); // 指定了两个参数
bound3(); //4
var bound4 = count.bind(obj1, 1, 2, 3); // 指定了多余的参数,多余的参数会被忽略
bound4(); // 4
```

所以 bind 方法只是返回了一个新的函数，这个函数内的 this 指定了执行上下文，而返回这个新函数可以接受参数。

---

new 绑定最后要将的一种 this 绑定规则，是指通过 new 操作符调用构造函数时发生的 this 绑定。构造函数也仅仅是普通函数而已，只不过构造函数以答谢字母开头，也只不过它可以通过 new 操作符调用而已。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  console.log('我也只不过是个普通函数');
  console.log(this); //window、window、Person
}
Person('zxt', 22); // "我也只不过是个普通函数"
console.log(this.name); // "zxt"
console.log(age); // 22
Person('yh', 122);
console.log(this.name); //yu
var zxt = new Person('zxt', 22); // "我也只不过是个普通函数"
console.log(zxt.name); // "zxt"
console.log(zxt.age); // 22
console.log(this.name); //yu
```

定义的 Person 函数，既可以普通调用，也可以构造函数的形式上的调用，当普通函数调用时，则按正常的函数执行，输出一个字符串。如果通过一个 new 操作符，则构造了一个新的对象。

两种调用方式的不同之处：

- ** 普通函数调用时，应用启用默认绑定规则 **，this 绑定在全局上，此时全局对象上回分别增加 name 和 age 两个属性。
- 当通过 new 操作符时，会产生一个新对象，并且会把构造函数内的 this 绑定到这个对象上，事实上，在 js 中，使用 new 来调用函数，会自动执行下面的操作
  1. 创建一个全新的对象。
  2. 这个新对象或被执行原型链连接
  3. 这个新对象会绑定到函数调用的 this
  4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象

---

## 四种绑定的优先级

这四种绑定规则基本上涵盖了所有函数调用情况。但是同时应用了这四种规则中的两种甚至更多，又该是怎么样的一个情况，或者说这四种绑定的优先级顺序又是怎么样的。** 默认优先级最低 < 隐式绑定第二 < 显示绑定第三 < new 绑定最高 **

---

## 箭头函数中的 this

箭头函数的 this 是根据外层的 ( 函数或则全局 ) 作用于来决定的，函数体内的 this 对象指的是定义时所在的对象，而不是之前介绍的调用时绑定的对象。箭头函数的 this 始终指向函数定义时的 this，而非执行时。箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined。

```javascript
var a = 1;
var foo = () => {
  console.log(this.a); // 定义在全局对象中，因此this绑定在全局作用域
};
var obj = {
  a: 2
};
foo(); // 1 ,在全局对象中调用
foo.call(obj); // 1,显示绑定，由obj对象来调用，但根本不影响结果
```

箭头函数的 this 强制性的绑定在了箭头函数定义时所在的作用域，而且无法通过显示绑定，如 apply，call 方法来修改

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.speak = function() {
    console.log(this.name);
    // 普通函数（非箭头函数),this绑定在调用时的作用域
  };
  this.bornYear = () => {
    // 本文写于2016年，因此new Date().getFullYear()得到的是2016
    // 箭头函数，this绑定在实例内部
    console.log(new Date().getFullYear() - this.age);
  };
}
var zxt = new Person('zxt', 22);
zxt.speak(); // "zxt"
zxt.bornYear(); // 1994
// 到这里应该大家应该都没什么问题
var xiaoMing = {
  name: 'xiaoming',
  age: 18 // 小明永远18岁
};
zxt.speak.call(xiaoMing);
// "xiaoming" this绑定的是xiaoMing这个对象
zxt.bornYear.call(xiaoMing);
```

以上就是 javascript 中所有 this 绑定的情况，在 es6 之前，前面所说的四种绑定规则可以涵盖任何的函数调用情况，es6 标准实施以后，对于函数的扩展新增了箭头函数，与之不同的是，箭头函数的作用于位于箭头函数定义时所在的作用域。

---

```javascript
var obj = {
  id: 'awesome',
  cool: function coolFn() {
    var _this = this;
    console.log(_this.id);
  }
};
var id = 'not awesome';
obj.cool(); // 酷,object
setTimeout(obj.cool, 100); //window
```

cool() 函数丢失了同 this 之间的绑定， var self = this 这种方案可以圆满解决了理解和正确使用 this 绑定的问题。

```javascript
function Obj(name) {
  var _this = this; //_this = object{}
  _this.id = name;
  _this.cool = function() {
    console.log(_this.id);
  };
}
var id = 'not awesome';
var test = new Obj('yaya'); //yaya
test.cool(); //yaya
var xiaohong = {
  id: xiaohong,
  age: 18
};
test.cool.call(xiaohong); //根本不执行
```

---

```javascript
function identify() {
  return this.name.toUpperCase();
}
function speak() {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}
var me = {
  name: 'Kyle'
};
var you = {
  name: 'Reader'
};
identify.call(me); // KYLE
identify.call(you); // READER
speak.call(me); // Hello, 我是KYLE
speak.call(you); // Hello, 我是READER
```

---

```javascript
function foo(num) {
  console.log('foo: ' + num);
  // 记录foo被调用的次数

  this.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
// foo被调用了多少次？
console.log(foo.count); // 0 -- WTF?
```

执行 foo.count = 0 时，的确向函数对象 foo 添加了一个属性 count。但是函数内部代码 this.count 中的 this 并不指向那个函数，所以虽然属性名相同，跟对象却并不相同。这段代码在五一中创建了一个全局变量 count。

** 匿名函数无法指向自身 **，arguments.callee 是唯一一种从匿名函数对象中引用自身的方法，已被弃用。，然而更好的是避免使用匿名函数，至少在需要自引用时使用时使用具名函数

**this 在任何情况下都不指向函数的词法作用域 **，作用域 “ 对象 ” 无法通过 js 代码来访问，它存在于 js 引擎内部 \*\*

```javascript
function foo() {
  var a = 2;
  this.bar();
}
function bar() {
  console.log(this.a);
}
foo();
```

试图用 this 联通 foo() 和 bar() 的词法作用域，从而让 bar 可以 i 访问 foo() 变量的 a，这是不可能实现的，** 不能使用 this 来引用一个词法作用域内部的东西 **，每当想要把 this 和此法作用域混用的时候，一定要提醒自己，这是无法实现的

---

## 综合题

### 1

```javascript
var names = '宋伟老师';
var obj = {
  names: '张健老师',
  showName: function() {
    console.log(this.name);
  },
  returnName: function() {
    return this.name;
  },
  returnFunctionName: function() {
    return function() {
      console.log(this.name);
    };
  }
};
obj.showName(); //输出什么？   "张健老师"
obj.returnName(); //输出什么？   "张健老师"
obj.returnFunctionName()(); //输出什么？   "宋伟老师"
obj.showName.call(names); //输出什么？   undefined
obj.returnName.call(names); //输出什么？   undefined
obj.returnFunctionName().call(names); //输出什么？   undefined
var newObj = obj.returnFunctionName().bind(window);
newObj.call(obj); //输出什么？   "宋伟老师"
//为什么最后一个输出"宋伟老师"？因为bind指向this对象后  再一次调用的话  this指向不会被改变
```

### 2

```javascript
var big = '万达老师';

var obj = {
  big: '宋伟老师',
  showBig: function() {
    return this.big;
  }
};
obj.showBig.call(big); //ƒ big() { [native code] }  //精通String的操作方法的同学就把为什么回复出来吧
```

### 3

```javascript
function a(a,b,c){
    console.log(this.length);                 //4
    console.log(this.callee.length);          //1
}

function fn(d){
    arguments[0](10,20,30,40,50);
}

fn(a,10,20,30);


//第一个输出结果:因为this当前指向的是arguments 。 arguments是一个伪数组具备length属性。arguments又是保存函数的实参。
fn调用的时候传入4个实参。所以arguments长度为4。这个时候arguments[0] 等同于 arguments.a调用这个函数。所以this指向的是arguments这个伪数组也是(对象)(听到这还有疑惑小伙伴留言问我)

//第二个输出结果：callee是arguments的一个属性,主要返回当前arguments直属的函数体。所以this.callees是返回fn 。每一个函数有一个length属性主要用来返回函数的形参的所以就是1。
```
