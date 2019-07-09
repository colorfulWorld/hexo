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

## 生命周期

- 窗前前/后（beforeCreate/created）:在 beforeCreate 阶段，Vue 实例的挂载元素 el 和数据对象 data 都为 undefined，还未初始化。在 created 阶段，Vue 实例的数据对象 data 有了，el 还没有
- 载入前后/后（beforeMount/mounted）:在 beforeMount 阶段，vue 实例的\$el 和 data 都初始化了，但还是挂载之前为虚拟 DOM 节点，data 尚未替换，在 mounted 阶段，vue 实例挂载完成，data 成功渲染
- 更新前/后（beforeDestory/destory）：beforeDestroy 是在 vue 实例销毁前触发，一般在这里要通过 removeEventLisener 解除手动绑定事件。实例销毁后，触发 destroyed。

## 组件间的通信

1. 父子通信：
   父向子传递数据是通过 props，子向父是通过 event（\$emit）;通过父链/子链也可以通信（$parent,$children）；ref 也可以访问组件实例。proved/injectApi
2. 兄弟通信：
   Bus;Vuex;
3. 跨级通信
   Bus；Vuex;provide/inject Api

## 数组监听漏洞
Vue检测数据的变动是通过Object.defineProperty实现的，所以无法监听数组的添加操作是可以理解的，因为是在构造函数中就已经为所有属性做了这个检测绑定操作。
但是官方的原文：由于 JavaScript 的限制， Vue 不能检测以下变动的数组：
- 当你利用索引直接设置一个项时，例如： vm.items[indexOfItem] = newValue
- 当你修改数组的长度时，例如： vm.items.length = newLength

Vue.js观察数组变化主要通过以下7个方法（push、pop、shift、unshift、splice、sort、reverse），由于 Vue 会在初始化实例时对属性执行 getter/setter 转化过程，所以属性必须在 data 对象上存在才能让 Vue 转换它，这样才能让它是响应的。

vue 中是通过对每个键设置getter/setter 来实现响应式的，开发者使用数组，目的往往是遍历，此时电泳getter开销太大了，所以vue不在数组每个键上设置，而是在数组上定义`_ob_`,并且替代了push等等能够影响原数组的原型方法。

```javascript
var vm = new Vue({
    el: '#app',
    data: {
        orderList: [{
            status: 0,
            points: 3,
            money: 300,
            checked:false
        },
        {
            status: 0,
            points: 3,
            money: 300
        },
        {
            status: 1,
            points: 3,
            money: 400
        }]
    },
    created() {
        this.orderList.forEach(function (item) {
            item.checked = false;
        })
    },
    methods: {
        handleChoose(item) {
            item.checked = !item.checked;
        }
    }
})
```
上面是检测不到后面两个checked的变化的。

### 解决方案

- Vue.set(vue.obj,'e',0)
- this.obj= Object.assign({}, this.obj, { a: 1, e: 2 })

```javascript
var vm = new Vue({
    el: '#app',
    data: {
        orderList: []
    },
    created() {
        var data = [{
            status: 0,
            points: 3,
            money: 300,
        },
        {
            status: 0,
            points: 3,
            money: 300
        },
        {
            status: 1,
            points: 3,
            money: 400
        }];
        data.forEach(function (item) {
            item.checked = false;
        })
        this.orderList = data;
    },
    methods: {
        handleChoose(item) {
            item.checked = !item.checked;
        }
    }
})
```
这样写也是没有问题的，浅层次操作数组是没有问题的。