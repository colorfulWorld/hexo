---
title: css 小知识
date: 2019-04-03 11:30:11
categories: css
---

css 在开发中的填坑总结

<!--more-->

## 利用 css 的 content 属性 attr 抓取资料

想要获取伪元素，可以用以下写法：

```html
<div data-msg="open"></div>
div:hover:after{ content:attr(data-mag); }
```

## 利用：valid 和：invalid 来做表单即使校验

-   :required 伪类指定具有 required 属性的表单元素
-   :valid 伪类指定一个通过匹配正确的所要求的表单元素
-   :invalid 伪类指定一个不匹配指定要求的表单元素

## writing-mode

使用 writing-mode 这个 CSS 属性实现容器的文字从上往下排列。 writing-mode: vertical-rl;

## 实现鼠标悬浮内容自动撑开的过渡动画

需要为一个列表添加个动画，容器的高度是不确定的，也就是高度为 auto，悬浮时候撑开内容有个过渡动画。而用 CSS3 实现的话，由于高度的不确定，而 transtion 是需要具体的数值，所以设置 height:auto 是无法实现效果的，可以通过 max-height 这个属性间接的实现这么个效果，css 样式是这样的：

```html
<ul>
    <li>
        <div class="hd">列表1</div>
        <div class="bd">
            列表内容<br />内容列表内容<br />内容列表内容<br />内容
        </div>
    </li>
    <li>
        <div class="hd">列表1</div>
        <div class="bd">
            列表内容<br />内容列表内容<br />内容列表内容<br />内容
        </div>
    </li>
    <li>
        <div class="hd">列表1</div>
        <div class="bd">
            列表内容<br />内容列表内容<br />内容列表内容<br />内容
        </div>
    </li>
</ul>
.bd { max-height:0; overflow:hidden; transition: all 1s ease-out; } li:hover .bd
{ max-height: 600px; transition-timing-function: ease-in; }
```

## 移动端 web 页面支持弹性滚动

-webkit-overflow-scrolling: touch;

## 美化浏览器自带的 radio ，checkbox 属性

```html
<div class="radio-beauty-container">
    <label>
        <span class="radio-name">前端工程师</span>
        <input type="radio" name="radioName" id="radioName1" hidden />
        <label for="radioName1" class="radio-beauty"></label>
    </label>
    <label>
        <span class="radio-name">后端工程师</span>
        <input type="radio" name="radioName" id="radioName2" hidden />
        <label for="radioName2" class="radio-beauty"></label>
    </label>
    <label>
        <span class="radio-name">全栈工程师</span>
        <input type="radio" name="radioName" id="radioName3" hidden />
        <label for="radioName3" class="radio-beauty"></label>
    </label>
</div>
.radio-beauty-container { font-size: 0; $bgc: green; %common { padding: 2px;
background-color: $bgc; background-clip: content-box; } .radio-name {
vertical-align: middle; font-size: 16px; } .radio-beauty { width: 18px; height:
18px; box-sizing: border-box; display: inline-block; border: 1px solid $bgc;
vertical-align: middle; margin: 0 15px 0 3px; border-radius: 50%; &:hover {
box-shadow: 0 0 7px $bgc; @extend %common; } }
input[type="radio"]:checked+.radio-beauty { @extend %common; } }
```

## 改变 input 焦点光标的颜色

```html
<input value="This field uses a default caret." />
<input class="custom" value="I have a custom caret color!" />
input { caret-color: auto; display: block; margin-bottom: .5em; } input.custom {
caret-color: red; }
```

## rem 布局不再使用 JavaScript 设置

现在移动端 css3 单位 vw ,wh 兼容性已经很不错了，在不需要兼容太低版本的安卓机情况下可以这样来：

```css
html {
    font-size: 100vw / 750;
}
```

## 切角效果实现

切角效果是时下非常流行的一种设计风格，并广泛运用于平面设计中，它最常见的形态就是把元素的一个或多个切成 45° 的切口，尤其是在最近几年，扁平化设计盖过拟物化设计后，这种切脚设计更为流行，例如下图就是通过切角实现的一个导航栏，在后面将详细论述起实现。

![](https://camo.githubusercontent.com/b07ae76cf4ce21d62ef2a4ce97932d831e723c50/687474703a2f2f636f6e74656e742d6d616e6167656d656e742e62302e7570616979756e2e636f6d2f313437323739393439333539332e706e67)

## BFC（快格式化上下文）

它决定了元素如何对其内容进行定位，以及与其他元素的关系的相互作用。当涉及到可视化布局时，BFC 提供了一个环境，HTML 元素在这个环境中按照一定规则进行布局。一个环境元素不会影响到其他环境中的布局。

### BFC 的作用：

-   可以包含浮动元素
-   不被浮动元素覆盖
-   阻止父子元素的 margin 折叠

### BFC 的特征：

-   内部的 BOX 会在垂直方向，一个接一个地放置。
-   BOX 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个 BOX 的 margin 会发生重叠。
-   BFC 的区域不会与 float BOX 重叠。
-   BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也是如此。
-   计算 BFC 的高度时，float 元素也会参与计算。

### 如何触发 BFC？

-   float 的值部位 none。
-   position 的值不为 static 或者是 relative。
-   display 的值为 table-cell,table-caption,inline-block,flex,或者 inline-flex 中的一个。
-   overflow 的值不为 visible。

## 响应式页面开发

在页头`head`标签内添加`viewoport meta`是实现响应式页面的第一步。

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### 使用`Media Queries`

-   使用 link 标签 ，根据指定特性引入特定的外部样式文件

    ```html
    <link rel="stylesheet" media="(max-width:640px)" href="max-640px.css" />
    ```

-   直接在 style 标签或样式文件内使用`@media`规则

### 样式断点

-   moblie 移动设备断点 ，视窗宽度<=768px
-   tablet 平板电脑设备断点，视窗宽度>=769px
-   desktop 桌面电脑断点，视窗宽度>=1024px
-   widescreen 宽屏电脑断点，视窗宽度>=1216px
-   fullhd 高清宽屏电脑断点，视窗宽度>=1408px

## 1px 细线（普通屏幕下 1px，高清屏下 0.5px 的情况）

```css
.mod_grid {
    position: relative;
    &::after {
        // 实现1物理像素的下边框线
        content: '';
        position: absolute;
        z-index: 1;
        pointer-events: none;
        background-color: #ddd;
        height: 1px;
        left: 0;
        right: 0;
        top: 0;
        @media only screen and (-webkit-min-device-pixel-ratio: 2) {
            -webkit-transform: scaleY(0.5);
            -webkit-transform-origin: 50% 0%;
        }
    }
    ...
}...
```

## 需要保持宽高比的图，应该用 padding-top 实现

```css
.mod_banner {
    position: relative;
    /* 使用padding-top 实现宽高比为 100:750 的图片区域 */
    padding-top: percentage(100/750);
    height: 0;
    overflow: hidden;
    img {
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        top: 0;
    }
}
```

## `input type=file onchange`

-   上传同一张图片失效
-   在微信浏览器内无法上传图片 (经测试是不支持`input type=file` 就算支持也无法上传 camera 目录下的文件 )

```javascript
$fileInput.on("change", function(e) {
    e.target.value = "";
});
```

第二个问题实在没有找到方法 准备使用带有 flash 的插件
使用百度网盘，饿了么的网页在微信中有同样的问题

## `meta viewport`

```html
<!DOCTYPE html> H5标准声明，使用 HTML5 doctype，不区分大小写
<head lang="”en”">
    标准的 lang 属性写法
    <meta charset="’utf-8′" />
    声明文档使用的字符编码 <meta http-equiv=”X-UA-Compatible”
    content=”IE=edge,chrome=1″/> 优先使用 IE 最新版本和 Chrome
    <meta name="”description”" content="”不超过150个字符”" />
    页面描述
    <meta name="”keywords”" content="””" />
    页面关键词
    <meta name="”author”" content="”name," email@gmail.com” />
    网页作者
    <meta name="”robots”" content="”index,follow”" />
    搜索引擎抓取 <meta name=”viewport” content=”initial-scale=1,
    maximum-scale=3, minimum-scale=1, user-scalable=no”> 为移动设备添加 viewport
    <meta name="”apple-mobile-web-app-title”" content="”标题”" />
    iOS 设备 begin
    <meta name="”apple-mobile-web-app-capable”" content="”yes”" />
    添加到主屏后的标题（iOS 6 新增）是否启用 WebApp
    全屏模式，删除苹果默认的工具栏和菜单栏 <meta name=”apple-itunes-app”
    content=”app-id=myAppStoreID, affiliate-data=myAffiliateData,
    app-argument=myURL”>添加智能 App 广告条 Smart App Banner（iOS 6+ Safari）
    <meta name="”apple-mobile-web-app-status-bar-style”" content="”black”" />
    <meta name=”format-detection” content=”telphone=no, email=no”/>
    设置苹果工具栏颜色
    <meta name="”renderer”" content="”webkit”" />
    启用360浏览器的极速模式(webkit) <meta http-equiv=”X-UA-Compatible”
    content=”IE=edge”> 避免IE使用兼容模式
    <meta http-equiv="”Cache-Control”" content="”no-siteapp”" />
    不让百度转码
    <meta name="”HandheldFriendly”" content="”true”" />
    针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓
    <meta name="”MobileOptimized”" content="”320″" />
    微软的老式浏览器
    <meta name="”screen-orientation”" content="”portrait”" />
    uc强制竖屏
    <meta name="”x5-orientation”" content="”portrait”" />
    QQ强制竖屏
    <meta name="”full-screen”" content="”yes”" />
    UC强制全屏
    <meta name="”x5-fullscreen”" content="”true”" />
    QQ强制全屏
    <meta name="”browsermode”" content="”application”" />
    UC应用模式
    <meta name="”x5-page-mode”" content="”app”" />
    QQ应用模式
    <meta name="”msapplication-tap-highlight”" content="”no”" />
    windows phone 点击无高光设置页面不缓存
    <meta http-equiv="”pragma”" content="”no-cache”" />
    <meta http-equiv="”cache-control”" content="”no-cache”" />
    <meta http-equiv="”expires”" content="”0″" />
</head>
```

## 字少时居中，多时靠左

```html
<div class="box">
    <p class="content"></p>
</div>

<!-- CSS -->
<style>
    .box {
        text-align: center;
    }
    .content {
        display: inline-block;
        text-align: left;
        word-break: break-all;
    }
</style>
```

## CSS 权重

权重分为 4 级，分别是：

-   内联样式:1000
-   id:100
-   类，伪类和属性选择器 `:hover`,`[attributer]`,权值为 10
-   代表元素选择器和伪元素选择器，`div`

** 需要注意的是：通用选择器（\*），子选择器（>）和相邻通报选择器并不在这四个等级中，所以他们的权值为 0**

## CSS3 动画

-   `animation-name`:对应的动画名称
-   `animation-duration`:是动画时长
-   `animation-timing-function`:规定动画的速度曲线。默认是 ease
-   `animation-delay`:规定动画何时开始。默认是 0
-   `animation-iteration-count`:规定动画播放的次数。默认是 1
-   `animation-diraction`:规定动画是否在下一周期逆向地播放。默认是 normal
-   `animation-play-state`:规定动画是否正在运行或暂停。默认是 running
-   `animation-fill-mode`:规定动画执行之前和之后如何给动画的目标应用，默认是 none，保留在最后一帧可以用 forwords

### 实现动画暂停

使用`animation-play-state`可以实现动画暂停

```html
.play-state { width: 100px; height: 100px; margin: 40px; text-align: center;
line-height: 94px; border: 3px solid #e1efde; border-radius: 50%; animation:
play-state 3s linear infinite; cursor: pointer; } .play-state:hover {
animation-play-state: paused; } @keyframes play-state { 0% { margin-left: 0; }
100% { margin-left: 200px } }
```

## 重绘和回流

-   重绘：指的是当前页面中的元素不脱离文档流。而简单的样式的变化，比如修改颜色，背景等，浏览器重新绘制样式
-   回流：指的是处于文档流中 DOM 的尺寸大小，位置或者默写属性变化时，导致浏览器重新渲染部分或全部文档的情况

## 首行缩进

```css
text-indent: 2em;
```

## 一种奇妙的绝对居中办法

```html
<style>
    .wp {
        writing-mode: vertical-lr;
        text-align: center;
    }
    .wp-inner {
        writing-mode: horizontal-tb;
        display: inline-block;
        text-align: center;
        width: 100%;
    }
    .box {
        display: inline-block;
        margin: auto;
        text-align: left;
    }
</style>
<div class="wp">
    <div class="wp-inner">
        <div class="box">123123</div>
    </div>
</div>
```
