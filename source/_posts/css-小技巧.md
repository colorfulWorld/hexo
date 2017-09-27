---
title: css 小技巧
date: 2017-09-26 11:14:44
categories:
tags:
---
## 一、利用css 的content属性attr 抓取资料
想要获取伪元素，可以用以下写法：

```html
<div data-msg="open"></div>
div:hover:after{
    content:attr(data-mag);
}
```

## 二、利用：valid 和：invalid来做表单即使校验
- :required 伪类指定具有required 属性的表单元素
- :valid 伪类指定一个通过匹配正确的所要求的表单元素
- :invalid 伪类指定一个不匹配指定要求的表单元素

## 三、writing-mode
使用writing-mode 这个 CSS 属性实现容器的文字从上往下排列。 writing-mode: vertical-rl;

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

## 五、移动端web页面支持弹性滚动
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