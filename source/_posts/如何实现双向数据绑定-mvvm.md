---
title: 如何实现双向数据绑定 mvvm
categories: vue
tags:
---

目前几种主流的 mvc(vm) 框架都实现了单向数据绑定，而我所理解的双向数据绑定无非就是在单向绑定的基础上给可输入元素（input 、 textare 等）添加了 change(input) 事件，来动态修改 model 和 view，并没有多高深。所以无需太过介怀是实现的单向或双向绑定。

<!--more-->

实现数据双向绑定的集中做法大致如下：

* 发布者 - 订阅者模式（backbone.js ）

* 脏值检查（angular.js ）

* 数据劫持（vue.js ）

## 数据劫持 :

vue.js 则是采用数据劫持结合发布者 - 订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的 setter，getter ，在数据变动时发布消息给订阅者，触发相应的监听回调。

## 1 、实现 Observer

ok, 思路已经整理完毕，也已经比较明确相关逻辑和模块功能了，let’s do it

### 实现监听

我们知道可以利用 Obeject.defineProperty() 来监听属性变动那么将需要 observe 的数据对象进行递归遍历，包括子属性的属性，都加上 set 和 get 这样的话，给这个对象的某个值赋值，就会触发 set，那么就能监听到了数据变化。。相关代码可以是这样：

```javascript
var data = {name:'kindeng'};
observe(data);
data.name = 'dmq'; //监听到值得变化 kindeng -->dmq
function observe(data){
  if(!data||typeof data !== 'object){
    //[]、{}
    return;
  }
  object.key(data).forEach(function(key)){
    defineReactive(data,key,data[key]);
  }
}

function defineReactive(data,key,val){
  observe(val);//监听子属性

  //循环将data 中的每一个元素都绑定上数据劫持
  Object.defineProperty(data,key,{
    enumerable:true,
    //可枚举
    configurable:false,
    //如果为false，则任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable）的行为将被无效化
    get:function(){
    return val;
    },
    set:function(){
         console.log('值变');
         val = newVal ;
    }
  })
}
```

## 数据观测的实现

### Angular

Angular 的数据监测采用的是 “ 脏值检测 ”，每一个指令都会有一个对应的的用来观察到对象的变化，这个应用叫做叫做 watcher，一个作用域中可能有多个 watcher，当数据发生改变，页面更新，Angular 会遍历当前页面中的所有 watcher，对他们一一求值，与之前的值进行对比，如果求值的结果变化了，就会触发对应的更新，这个过程叫做 digest cycle。脏值检测的劣势有两点：

1. 任何数据变动都意味着当前作用域的每一个 watcher 需要被重新求值，且同一时间只允许一个 digest 运行，因此当 watcher 庞大时，应用性能就不可避免的收到影响，并且很难优化。
2. 当数据变化时，框架并不能主动监测到变化的产生，需要手动触发 digest cycle 才能触发相应的 DOM 更新。Angular 通过在 DOM 事件处理函数中自动触发 digest cycle 部分避免了这个问题，但还是有很多情况下需要用户手动进行触发。

#### $watch 对象

Angular 每一个绑定到 UI 的数据，就会有一 $watch 对象这个对象包含 3 个值

```javascript
watch = {
  name: '',
  getNewValue: function($scope) {
    //得到新值
    return newValue
  },
  listener: function(newValue, oldValue) {
    //当数据发生变化时
  }
}
```

getNewValue() 可以得到当前 $scope 上的最新值，listener 函数得到新值和旧值并进行一些操作。

每当我们将数据绑定到 UI 上，angular 就会想你的 watchList 上插入一个 $watch

\** 只有触发 UI 事件，ajax 请求或者 timeout 等回调操作，而数据到界面的呈现则是由脏检查来做。

### Vue

vue 采用的则是基于依赖收集的观测机制，也就是数据劫持，它的基本原理是：

1. 将原生的数据改造成 “ 可观察对象 ”。一个可观察对象可以被取值也可以被赋值。
2. 在 watcher 的求值过程中，每一个被取值的可观察对象都都会将当前的 watcher 注册为自己的一个订阅者，并成为当前的 watcher 的一个依赖。
3. 当一个被依赖的可观察对象被赋值时，它会通知所有订阅自己的 watcher 重新求值，并触发相应的更新。
4. 依赖收集的有点在于可以精准、主动地追踪数据的变化，不存在上述提到的脏检查的两个问题。但传统的依赖收集实现，比如 Knockout, 通常需要包裹原生数据来制造可观察对象，在取值和赋值时需要采用函数的调用形式，在进行数据操作时写法繁琐，不够直观，对复杂嵌套结构的对象支持也不理想。
