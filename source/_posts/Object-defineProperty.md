---
title: Object.defineProperty
categories: JavaScript
date: 2017-11-09 11:28:03
---

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。Vue 是通过数据劫持来做数据绑定的，其中最核心的方法便是通过 Ojbect.defineProperty() 来实现对属性的劫持，达到监听数据变动的目的。

<!--more-->

对象的属性分两种：数据属性和访问属性

## 数据属性

数据属性包含一个保存数据值的位置。数据属性有 4 个特性描述它们的行为

- Configurable：表示属性是否可以通过 delete 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为访问属性，默认为 true
- Enumerable：表示是否可以通过 for-in 循环返回，默认为 true
- Writable：是否可以被修改，默认为 true
- Value：包含属性实际的值，默认值为 undefined

要修改属性的默认特性，就必须使用 Object.defineProperty()方法

### Object.defineProperty(object, propertyname, descriptor) 为对象定义属性

在 js 中我们可以通过下面几种方法定义属性 :

```javascript
// (1) define someOne property name
someOne.name = 'cover';
//or use (2)
someOne['name'] = 'cover';
// or use (3) defineProperty
Object.defineProperty(someOne, 'name', {
  writable:false
  value: 'cover'
});
someOne['name'] = 'bbbb';
console.log(someOne['name'])//cover
```

若是用来封装自定义 API 是非常有用的

#### descriptor

其中 descriptor 的参数值得我们关注下 , 该属性可设置的值有：value 、 writable、configurable 、 enumerable、set 和 get。

#### 【 value】

该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等），默认为 undefined。

#### 【 writable】

该属性是否可写，如果设置成 false，则任何对该属性改写的操作都无效（但不会报错），对于像前面例子中直接在对象上定义的属性，这个属性该特性默认值为为 true。

```javascript
var someOne = {}
Object.defineProperty(someOne, 'name', {
  value: 'coverguo', //由于设定了writable属性为false 导致这个量不可以修改 ，任何修改豆浆无效化
  writable: false,
})
console.log(someOne.name) // 输出 coverguo
someOne.name = 'linkzhu'
console.log(someOne.name) // 输出coverguo
```

#### 【 configurable】

仅当该属性的 configurable 为 true 时，该属性才能够被改变，也能够被删除。默认为 false。

如果为 false，则任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable ）的行为将被无效化，对于像前面例子中直接在对象上定义的属性，这个属性该特性默认值为为 true。

#### 【 enumerable】

是否能在 for-in 循环中遍历出来或在 Object.keys 中列举出来。对于像前面例子中直接在对象上定义的属性，这个属性该特性默认值为为 true。

```javascript
var a = {}
Object.defineProperty(a, 'b', {
  value: 3445,
  enumerable: true,
})
console.log(Object.keys(a)) // 打印["b"]
//改为false
var a = {}
Object.defineProperty(a, 'b', {
  value: 3445,
  enumerable: false, //注意咯这里改了
})
console.log(Object.keys(a)) // 打印[]
```

#### 注意：

在调用 Object.defineProperty() 方法时，如果不指定， configurable ， enumerable， writable 特性的默认值都是 false, 这跟之前所 说的对于像前面例子中直接在对象上定义的属性，这个特性默认值为为 true。并不冲突，如下代码所示：

```javascript
//调用Object.defineProperty()方法时，如果不指定
var someOne = {}
someOne.name = 'coverguo'
console.log(Object.getOwnPropertyDescriptor(someOne, 'name'))
//输出 Object {value: "coverguo", writable: true, enumerable: true, configurable: true}

//直接在对象上定义的属性，这个特性默认值为为 true
var otherOne = {}
Object.defineProperty(otherOne, 'name', {
  value: 'coverguo',
})
console.log(Object.getOwnPropertyDescriptor(otherOne, 'name'))
//输出 Object {value: "coverguo", writable: false, enumerable: false, configurable: false}
```

## 访问器属性

访问器属性不包含数据值。相反他们包含一个获取 getter 函数和一个设置 setter 函数，不过这两个函数不是必需的。在读取访问器属性时，会调用获取函数，这个函数的责任就是返回一个有效的值。

在写入访问器属性时，会调用设置函数并传入新值，这个函数必须决定对数据做出什么修改，访问器属性有 4 个特性描述它们的行为。

- Configurable：表示属性是否可以通过 delete 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为数据属性，默认为 true
- Enumerable：表示属性是否可以通过 for-in 循环返回，默认为 true
- Get：获取函数，在读取属性时调用，默认为 undefined
- Set：设置函数，在写入属性时调用，默认为 undefined

访问器属性是不能直接定义的，不许使用 Object.defineProperty()

#### 【 get】和【set 】

在 descriptor 中不能 同时设置访问器 (get 和 set) 和 wriable 或 value，否则会错，就是说想用 (get 和 set)，就不能用（wriable 或 value 中的任何一个）

```javascript
var a= {}
Object.defineProperty(a,"b",{
  set:function(newValue){
    console.log("你要赋值给我,我的新值是"＋newValue)
    },
  get:function(){
    console.log("你取我的值")
    return 2 //注意这里，我硬编码返回2
   }
})
a.b =1 //打印 你要赋值给我,我的新值是1
console.log(a.b)    //打印 你取我的值
                    //打印 2    注意这里，和我的硬编码相同的
```

\*\* 这个 "b" 赋值 或者取值的时候会分别触发 set 和 get 对应的函数，这就是 observe 的关键，是 vue 实现 observe 的实现的基础，也是实现 \$watch 的基础。

##### 【 get】

一旦目标对象访问该属性，就会调用这个方法，并返回结果。默认为 undefined。 ##### 【 set】 一旦目标对象设置该属性，就会调用这个方法。默认为 undefined。

## 兼容性

在 ie8 下只能在 DOM 对象上使用，尝试在原生的对象使用 Object.defineProperty() 会报错。
