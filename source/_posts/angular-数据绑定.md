---
title: angular 数据绑定详解
date: 2017-07-31 12:08:10
categories:
tags:
---
## 绑定
- 1. 绑定表达式的指令ngBind
    <div ng-Bind = "vm.info"></div>
这样就把控制器中额vm.info的值绑定在div标签中，这样页面在网速不好的时候就不会出现angular 中的{{}}的解析符，它隐藏了angular解析表达式的过程
- 2. ngBindTemplate 
ngBindTemplate 这个指令与上一个指令的不同之处在于它可以绑定多个表达式
<div ng-bind-template="{{vm.info}}{{vm.msg}}"></div>


—------------------------
## 数据绑定
 数据绑定可以分为3种：
 1. 属性绑定和插值表达式 组件类 -> 模板
 2. 事件绑定：模板 -> 组件类
 3. 双向绑定： 模板 <-> 组件类

#### 事件绑定
    <a (click)="test()"></a>    
(click) 表示要进行的操作，当用户点击时就会执行组件类中的test()方法

#### 属性绑定和插值表达式
属性绑定和插值表达式是同一种东西，因为在解析代码的时候，插值表达式会转换为属性绑定,例如下面的两种写法是一样的
    <img src="{{ingURL}}"/>>
    <img [src]="imgUrl">
属性绑定又分为HTML属性绑定和DOM绑定， 例如：
    <input type ="text" value = "hello" (input) = "doInput($event)" >
    doInput(event:any){
        console.log(event.target.value);
        console.log(event.target.getAttribute('value'));
    }
其中event.target.value 是获取的DOM 属性，是可变的，表示当前元素的状态。
而 event.target.getAttribute("value")获取的是HTML属性，是不可变的。只负责初始化HTML元素，不可改变。

<strong>注意：</strong>
1. 有的DOM属性没有映射的HTML属性，同样有些HTML属性也没有映射的DOM属性。
2. 模板绑定的是DOM属性。

##### HTML属性绑定
1. 基本HTML属性绑定
    <td [attr.colspan]="表达式"></td>

2. css绑定
    <div class ="a" [class]="b"></div> //b会完全替代a
    <div [class.a]="fn()"></div>//fn()返回true、false,如果true则添加.a
    <div [ngClass]="{a:isA,b:isB}"></div>// b会完全替代a

3. 样式绑定
    <button [style.color]="a?red:green">button</button>
    <button [ngStyle] = "{'font-style':a?'red':'green'}">button</button>

4. 双向绑定
双向绑定可以从组件类->模板，也可以模板->组件类，利用[(ngModel)]可以实现双向数据绑定




