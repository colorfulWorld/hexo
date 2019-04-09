---
title: Vue.js内部运行机制
date: 2018-11-06 11:07:19
tags: Vue
---

记录一下 vue.js 内部的整个流程

<!--more-->

## vue 模板如何渲染成 HTML？以及渲染过程

1. vue 模板的本质是字符串，利用各种正则，把模板中的属性去变成 js 中的变量，vif,vshow,v-for 等指令变成 js 中的逻辑
2. 模板最终会被转换成 render 函数
3. render 函数执行返回 vnode
4. 使用 vnode 的 path 方法把 vnode 渲染成真实 DOM

## vue 的整个实现流程

1. 先把模板解析成 render 函数，把模板中的属性 去变成 js 中的变量，vif,vshow,vfor 等指令变成 js 中的逻辑。
2. 执行 render 函数，在初次渲染执行 render 函数的过程中绑定属性监听，收集依赖，最终得到 vnode。利用 vnode 的 path 方法，把 vnode 渲染成真实的 DOM
3. 在属性更新后，重新执行 render 函数，不过这时候就不需要绑定属性和收集依赖了，最终生成新的 vnode
4. 把新的 vnode 和旧的 vnode 去做对比，找出需要更新的 dom，渲染

## 什么是 diff 算法，或者是 diff 算法是用来做什么的

- diff 是 linux 中的基础命令，可以用来做文件，内容之间做比较
- vnode 中使用 diff 算法是为了找出需要更新的节点，避免造成不必要的更新

## vuex 是什么

vuex 就是一个全局的仓库，公共的状态或者复杂组件交互的状态我们会抽离出来放进里面。
vuex 的核心主要是包括以下几个部分：

- state：state 里面就是存放的我们需要使用的状态，他是单向数据流，在 vue 中不予许直接对他进行修改，而是使用 mutations 去进行修改
- mutations：mutations 就是存放如何更改状态 的一些方法
- actions：actions 是用来做异步修改的，他可以等待异步结束后，在去使用 commit mutations 去修改状态
- getters:相当于是 state 的计算属性

使用：

- 获取状态在组件内部 computed 中使用 this.\$store.state 得到想要的状态
- 修改的话可在组件中使用 this.\$store.commit 方法去修改状态
- 如果在一个组件中，方法，状态使用太多，可以使用 mapstate,mapmutations 辅助函数
