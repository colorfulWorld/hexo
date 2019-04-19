---
title: jQuery-组件封装
date: 2019-04-19 11:32:25
categories: jQuery
---

总结在 jQuery 项目开发中所使用到的组件封装技巧，封装一些频繁被使用的功能。

<!--more-->

# JQuery 中封装组件的两种方法

- 使用`$.extend`来扩展 JQuery
- 通过`$.fn`向 JQuery 添加新的方法

## `$.extend`

```javascript
(function() {
  $.extend({
    Alert: function(str) {
      if (!str) return;
      alert(str);
      console.log(str);
    }
  });
})(JQuery);
$.Alert();
$.Alert('Hello');
```

但是这种方式的弊端是无法使用`$("div").Alert()` 这种形式

## `$.fn`

基本语法：

```javascript
$.fn.pluginName = function() {};
```

在插件名字定义的这个函数内部， this 指代的是我们在调用该插件时，用 jQuery 选择器选中的元素

```javascript
$(function() {
  $.fn.bgColor = function(cor) {
    $(this).css('background-color', cor);
  };
});
$('div').bgColor('red');
```
