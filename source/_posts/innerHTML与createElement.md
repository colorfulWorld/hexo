---
title: innerHTML与createElement
date: 2018-05-11 15:05:13
categories: JavaScript
---

最近看到一道海量渲染的面试题的答案，看到他用的是`createElement`然后`appendChild`感觉无法理解为什么要这样使用，难道`innerHTML`比这种方法的性能差吗？
由此自己做了一些实验
<!--more-->

自测代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
    <div id="a"></div>
    <div id="b"></div>
</body>

</html>
<script>
        var $a = document.getElementById("a");
        var $b = document.getElementById("b");
        var html1='',html2='';
        function test1(){
            console.time("html1:")
           for(let i = 0;i<1000;i++){
            html1 +='<p>'+i+'</p>';
           }
           $a.innerHTML = html1;
           console.timeEnd("html1:")
        }

        function test2(){
            console.time("html2:")
            let fragment = document.createDocumentFragment();
           for(let i = 0;i<1000;i++){
               let p = document.createElement("p");
               p.innerHTML = i;
               fragment.appendChild(p);
           }
           $b.appendChild(fragment);
           console.timeEnd("html2:")
        }
        test1(); //html1:: 3.000244140625ms
        test2(); //html2:: 10.999755859375ms 
</script>
```
最后得出的结论是`innerHTML`的方法明显会比 `createElement`这种 办法好，就算是先`appendChild`到虚拟节点里面，也仍然性能不好。那为什么那些大佬们会用第二种办法？难道就是为了使用`createDocumentFragment`这个API？

那么究竟`createElement`会比`innerHTML`好在哪里呢？

看到一位大佬的答案是因为觉得拼接字符串丑陋。。。emmmmmm

### `createElement`
在创建节点后就能直接事件监听事件，可是这种大量渲染，使用事件委托不是更完美吗？何必每一个都要绑定事件监听？
```javascript
var oButton = document.createElement("input");
    oButton.type = "button";
    oButton.value = "xxxxx";
    aaa.appendChild(oButton);
 ```
