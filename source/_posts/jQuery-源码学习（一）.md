---
title: jQuery 源码学习（-）
date: 2018-06-22 11:45:06
tags:
---

# 为什么想要学习 jQuery 源码

感觉自己的很多的代码质量不够好，最近在频繁的使用 jQuery,感觉 jQuery 中的一些函数的思想是应该去学习的，尤其是设计模式的思想，在以后的 vue 开发中，在不引用 jQuery 的情况下，能借鉴 jQuery 的思想封装一些不依赖 DOM 的公共函数。也觉得自己对一些设计模式之内的了解甚少，所以学习 jQuery 源码势在必行。

<!--more-->

## 分析：jquery 的无 new 构建

javascript 是函数式语言，函数可以实现类，类就是面向对象编程中最基本的概念

```javascript
var aQuery = function(selector, context) {
  //构造函数
};

aQuery.prototype = {
  name: function() {},
  age: function() {}
};

var a = new aQuery();
a.name();
```

这是常规的使用方法，显而易见 jquery 不是如此的

因此 源码可能是:

```javascript
var aQuery = function(selector,context){
    return aQuery.prototype.init();
}
aQuery.prototype={
    init:function(){
        this.age = 18;
        return this;
    }, 
    name:function(){},
    age:20
}

aQuery().age //18
```

这种情况下就出错了，因为this只是只想aquery，所以需要*设计独立的作用域* 才行;
怎么访问jquery类原型上的属性与方法？
    做到既能隔离作用域还能使用jquery原型对象的作用域呢？还能在返回实例中方为jquery的原型对象。
实现关键点：

```javascript
jQuery.fn.init.prototype =jQuery.fn;
```

通过原型对象传递解决问题。把jquery的原型传递给jquery.prototype.init.prototype 换句话说jquery的原型对象覆盖了init构造器的原型对象

```javascript
var aQuery = function (selector,context){
    return new aQuery.prototype.init();
}

aQuery.prototype = {
    init:function(){
        return this;
    },
    name:function(){
        return this.age
    },
    age:20
}

aQuery.prototype.init.prototype = aQuery.prototype;
console.log(aQuery.name()) //20
```

## 链式调用

DOM链式调用的处理：

- 节约代码。
- 所返回的都是同一个对象。

通过简单扩展原型方法并通过return this的形式来实现跨浏览器的链式调用。
利用JS的简单工厂模式，来将所有对同一个DOM对象操作指定同一实例。

```javascript
aQuery.prototype = {
    init:function(){
        return this;
    },
    name:function(){
        return this;
    }
}
```

所以我们在需要链式的方法访问this就可以了，因为返回当前实例的this，从而又可以访问你自己的原型了

## 插件接口

如果要为jQuery或者jQuery prototype添加属性方法，同样如果要提供给开发者对方法的扩展，从封装的角度讲应该提供一个接口，而不是看上去直接修改prototype

jquery支持自己扩展属性，这个对外提供了一个接口，jquery.fn.extend()来对对象增加方法

从jquery的元am中可以看到，jquery.extend和jquery.fn.extend其实是同指向同一方法的不同引用。
--------------------------------

## $.trim 去掉字符串两端空格

主要用于用户在页面上输入的文本情景下。

```javascript
class2type = {},
  core_deletedIds = [],
  core_version = "1.9.0",

  // Save a reference to some core methods
  core_concat = core_deletedIds.concat,
  core_push = core_deletedIds.push,
  core_slice = core_deletedIds.slice,
  core_indexOf = core_deletedIds.indexOf,
  core_toString = class2type.toString,
  core_hasOwn = class2type.hasOwnProperty,
  core_trim = core_version.trim,

  //等同以下代码：
  core_concat = Array.prototype.concat,

core_trim = core_version.trim,
rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

trim:core_trim&&!core_trim.call("\uFEFF\xA0")?
function(text){
    return text == null?"":core_trim.call(text);}
:
function(text){
return text ==null?"":(text+"").replace(rtrim,"");}
```

剖析：
`var core_trim = String.prototype.trim;`jquery 为了避免它无法解析全椒空白，所以多加了一个判断："\uFEFF\xA0".trim() !== ""。`\uFEFF`是 utf8 的字节序标记，'\xA0'是去全角空格，如果以上条件成立了，那就直接用原生的 trim 函数。

## $.each 遍历一个数组或者对象 (es6 可替代)

```javascript
//each接受2个参数， 数组[1,2,3],回调函数
$.each([1, 2, 3], function(key, value) {
  console.log("[" + key + "]=" + value);
  return false;
});
//输出：[0]=1  [1]=2  [2]=3 [1,2,3]
//可以看到回调函数具有两个参数，key是数组的索引，value是对应的元素

//each接受3个参数， 数组[1,2,3],回调函数，一个额外的参数数组args=[4,5]
$.each(
  [1, 2, 3],
  function(arg1, arg2) {
    console.log(this + "," + arg1 + "," + arg2);
  },
  [4, 5]
);
//输出：1,4,5  2,4,5  3,4,5 [1,2,3]
//可以看到回调函数的两个参数就是each的第三个参数args，在函数里边的this就是遍历元素自己
```

```javascript
$.each = function(obj, callback, args) {
  var value,
    i = 0,
    length = obj.length,
    isArray = isArraylike(obj); //判断是否是数组

  if (args) {
    if (isArray) {
      //数组
      for (; i < length; i++) {
        value = callback.applay(obj[i], args);
        //相当于：
        //args = [arg1,arg2,arg3];
        //callback(args1,args2,args3)。然后callbakc里面的this指向obj[i]

        if (value === false) {
          //注意到，当callback函数返回值会false的时候，循环结束
          break;
        }
      }
    } else {
      //非数组
      for (i in obj) //遍历对象
        value = callback.apply(obj[i], args);
        if(value === flase){
            break;
        }
    }
  }
  else {
    if(isArray){
        for(;i<length;i++){
            value = callback.call(obj[i], i ,obj[i]);
            //相当于callback(i,obj[i])。然后callback里边的this指向了obj[i]
            if(value==false){
                break;
            }
        }
    } else{
        for(i in obj){
            value = callback.call(obj[i], i ,obj[i]);
            //相当于callback(i,obj[i])。然后callback里面的this指向obj[i]

            if(value ===false){
                break;
            }
        }
    }
  }
  return obj;
};
```

## $.inArray

```javascript
core_deletedIds = [],
core_indexOf = core_delectedIds.indexOf,

// elem 规定需要检索的值
// arr数组
// i 可选的整数参数。规定在数组中开始检索的位置。它的合法取值是0到arr.length-1。如省略该参数，则将从数组首元素开始检索
inArray:function(elem,arr,i){
    var len;
    if(arr){
        //原生的Array对象支持indexOf方法，直接调用
        if(core_index0f){ //这句话感觉有问题，不是恒成立的条件吗？
           return core_indexOf.call(arr,elem,i);
        }

        len = arr.length;
        //当i为负数的时候，从数组后边的len+i的位置开始索引
        i= i?i<0?Math.max(0,len+i):i:0;

        //jquery 这里的(i in arr)判断是为了跳过稀疏数组中的元素
        //例如 var arr = [];arr[2]= 1;
        //此时 arr == [undefined,undefined,1]
        for(;i<length;i++){
            if(i in arr &&arr[i]===elem){
             return i;
            }
        }

        return -1;
    }
}
```

## $.grep 根据其返回值过滤

inv 为 true 表示 callback 过滤器返回 true 的那些过滤掉。

使用示例：

```javascript
$.grep([0, 1, 2], function(n, i) {
  return n <= 0;
}); //[0]

$.grep(
  [0, 1, 2],
  function(n, i) {
    return n <= 0;
  },
  true
);
```

源码：

```javaScript
grep:function(elems,callback,inv){
    var retVal,
    ret=[],
    i=0,
    length = elems.length;
    inv = !!inv; //转成布尔型

    for(;i<length;i++){
        retVal = !!callback(elems[i],i); //注意这里的callback参数是先value，后key
        if(inv!==retVal){
            ret.push(elems[i]);
        }
    }

return ret
}
```
