---
title: BFC详解
date: 2019-04-03 11:30:11
categories: css
---

它决定了元素如何对其内容进行定位，以及与其他元素的关系的相互作用。当涉及到可视化布局时，BFC 提供了一个环境，HTML 元素在这个环境中按照一定规则进行布局。一个环境元素不会影响到其他环境中的布局。

<!--more-->

## BFC 的作用

- 可以包含浮动元素
- 不被浮动元素覆盖
- 阻止父子元素的 margin 折叠

## BFC 的特征

- 内部的 BOX 会在垂直方向，一个接一个地放置。
- BOX 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个 BOX 的 margin 会发生重叠。
- BFC 的区域不会与 float BOX 重叠。
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也是如此。
- 计算 BFC 的高度时，float 元素也会参与计算。

## 如何触发 BFC？

- display:inline-block(也能和 overflow 一样解决高度塌陷的问题)
- float 的值不为 none。
- position 的值不为 static 或者是 relative。
- display 的值为 table-cell,table-caption,inline-block,flex,或者 inline-flex 中的一个。
- overflow 的值不为 visible。

## BFC 解决了什么问题

1. 使用 float 脱离文档流，高度塌陷
2. Margin 边距重叠(两个盒子的 margin 外边距都设置为 10px，但实际上两个盒子之间的边距只有 10px)
3. 两栏布局
