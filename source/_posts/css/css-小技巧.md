---
title: css 小技巧
categories: css
---

css 在开发中的填坑总结

<!--more-->

## 一、利用 css 的 content 属性 attr 抓取资料

想要获取伪元素，可以用以下写法：

```html
<div data-msg="open"></div>
div:hover:after{
    content:attr(data-mag);
}
```

## 二、利用：valid 和：invalid 来做表单即使校验

* :required 伪类指定具有 required 属性的表单元素
* :valid 伪类指定一个通过匹配正确的所要求的表单元素
* :invalid 伪类指定一个不匹配指定要求的表单元素

## 三、writing-mode

使用 writing-mode 这个 CSS 属性实现容器的文字从上往下排列。 writing-mode: vertical-rl;

## 四、实现鼠标悬浮内容自动撑开的过渡动画

需要为一个列表添加个动画，容器的高度是不确定的，也就是高度为 auto，悬浮时候撑开内容有个过渡动画。而用 CSS3 实现的话，由于高度的不确定，而 transtion 是需要具体的数值，所以设置 height:auto 是无法实现效果的，可以通过 max-height 这个属性间接的实现这么个效果，css 样式是这样的：

```html
<ul>
  <li>
    <div class="hd"> 列表1 </div>
    <div class="bd">列表内容<br>内容列表内容<br>内容列表内容<br>内容</div>
  </li>
  <li>
    <div class="hd"> 列表1 </div>
    <div class="bd">列表内容<br>内容列表内容<br>内容列表内容<br>内容</div>
  </li>
  <li>
    <div class="hd"> 列表1 </div>
    <div class="bd">列表内容<br>内容列表内容<br>内容列表内容<br>内容</div>
  </li>
</ul>
.bd {
  max-height:0;
  overflow:hidden;
  transition: all 1s ease-out;
}
li:hover .bd {
  max-height: 600px;
  transition-timing-function: ease-in;
}
```

## 五、移动端 web 页面支持弹性滚动

-webkit-overflow-scrolling: touch;

## 六、美化浏览器自带的 radio ，checkbox 属性

```html
<div class="radio-beauty-container">
    <label>
        <span class="radio-name">前端工程师</span>
        <input type="radio" name="radioName" id="radioName1" hidden/>
        <label for="radioName1" class="radio-beauty"></label>
    </label>
    <label>
        <span class="radio-name">后端工程师</span>
        <input type="radio" name="radioName" id="radioName2" hidden/>
        <label for="radioName2" class="radio-beauty"></label>
    </label>
    <label>
        <span class="radio-name">全栈工程师</span>
        <input type="radio" name="radioName" id="radioName3" hidden/>
        <label for="radioName3" class="radio-beauty"></label>
    </label>
</div>
.radio-beauty-container {
    font-size: 0;
    $bgc: green;
    %common {
        padding: 2px;
        background-color: $bgc;
        background-clip: content-box;
    }
    .radio-name {
        vertical-align: middle;
        font-size: 16px;
    }
    .radio-beauty {
        width: 18px;
        height: 18px;
        box-sizing: border-box;
        display: inline-block;
        border: 1px solid $bgc;
        vertical-align: middle;
        margin: 0 15px 0 3px;
        border-radius: 50%;
        &:hover {
            box-shadow: 0 0 7px $bgc;
            @extend %common;
        }
    }
    input[type="radio"]:checked+.radio-beauty {
        @extend %common;
    }
}
```

## 七、改变 input 焦点光标的颜色

```html
<input value="This field uses a default caret." />
<input class="custom" value="I have a custom caret color!" />
input {
  caret-color: auto;
  display: block;
  margin-bottom: .5em;
}

input.custom {
  caret-color: red;
}
```

## 八、rem 布局不再使用 JavaScript 设置

现在移动端 css3 单位 vw ,wh 兼容性已经很不错了，在不需要兼容太低版本的安卓机情况下可以这样来：

```html
html{
font-size: 100vw / 750
}
```

## 切角效果实现

切角效果是时下非常流行的一种设计风格，并广泛运用于平面设计中，它最常见的形态就是把元素的一个或多个切成 45° 的切口，尤其是在最近几年，扁平化设计盖过拟物化设计后，这种切脚设计更为流行，例如下图就是通过切角实现的一个导航栏，在后面将详细论述起实现。

![](https://camo.githubusercontent.com/b07ae76cf4ce21d62ef2a4ce97932d831e723c50/687474703a2f2f636f6e74656e742d6d616e6167656d656e742e62302e7570616979756e2e636f6d2f313437323739393439333539332e706e67)

## BFC（快格式化上下文）
它决定了元素如何对其内容进行定位，以及与其他元素的关系的相互作用。当涉及到可视化布局时，BFC提供了一个环境，HTML元素在这个环境中按照一定规则进行布局。一个环境元素不会影响到其他环境中的布局。

### BFC 的作用：

- 可以包含浮动元素
- 不被浮动元素覆盖
- 阻止父子元素的margin折叠

### BFC的特征：
- 内部的BOX会在垂直方向，一个接一个地放置。
- BOX垂直方向的距离由margin决定。属于同一个BFC的两个BOX的margin会发生重叠。
- BFC的区域不会与float BOX 重叠。
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也是如此。
- 计算BFC的高度时，float元素也会参与计算。

### 如何触发BFC？
- float 的值部位none。
- position 的值不为static 或者是relative。
- display 的值为table-cell,table-caption,inline-block,flex,或者inline-flex中的一个。
- overflow的值不为visible。

