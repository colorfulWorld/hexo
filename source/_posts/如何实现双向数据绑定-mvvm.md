---
title: 如何实现双向数据绑定 mvvm
date: 2017-11-09 18:55:56
categories: vue
tags:
---
目前几种主流的mvc(vm)框架都实现了单向数据绑定，而我所理解的双向数据绑定无非就是在单向绑定的基础上给可输入元素（input、textare等）添加了change(input)事件，来动态修改model和 view，并没有多高深。所以无需太过介怀是实现的单向或双向绑定。
<!--more-->

实现数据双向绑定的集中做法大致如下：

- 发布者-订阅者模式（backbone.js）

- 脏值检查（angular.js）

- 数据劫持（vue.js）

### 数据劫持:

vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

## 1、实现Observer
ok, 思路已经整理完毕，也已经比较明确相关逻辑和模块功能了，let’s do it
### 实现监听
我们知道可以利用Obeject.defineProperty()来监听属性变动
那么将需要observe的数据对象进行递归遍历，包括子属性的属性，都加上 set和get
这样的话，给这个对象的某个值赋值，就会触发set，那么就能监听到了数据变化。。相关代码可以是这样：
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

