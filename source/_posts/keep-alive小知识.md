---
title: keep-alive小知识
date: 2020-03-09 11:28:03
categories: Vue
---
keep-alive 使用的小知识点

<!--more-->

- 在动态组件中的应用
```html
<keep-alive :include="whiteList" :exclude="blackList" :max="amount">
     <component :is="currentComponent"></component>
</keep-alive>
```
- include 定义白名单
- exclude定义黑名单
- max 定义缓存组件的上限，超出上限使用LRU的策略置换缓存数据

LRU:
内存管理的一种置换算法，对于在内存中但又不用数据块（内存块）叫做LRU，造作系统会根据那些数据属于LRU而将其移出内存而腾出空间来加载另外的数据。


只有当组件在keep-alive 内被切换，才会有actived和deactived 这两个钩子函数。

## keep-alive 组件的渲染
