---
title: Vue小知识点运用
date: 2019-07-09 14:56:06
categories: Vue
---

Vue API 中的小知识点运用与总结

<!--more-->

# 状态共享

随着组件的细化，就会遇到多组件状态共享的情况，Vuex 当然可以解决这些问题，但是如果应用不够大，为避免代码繁琐冗余，最好不要使用它。我们可以通过使用 Observable API 应对一些简单的跨组件数据状态共享的情况。

## Observable

让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。可以实现简单的 store 管理。

返回的对象可以直接在渲染函数和计算属性中使用，并在编译时触发适当的更新。它还可以用作简单场景的最小跨组件状态存储：

store.js

```javascript
import vue from 'vue'
export const store = vue.observable({ count: 0 })
export const mutation = {
  setCount(count) {
    store.count = count
  }
}
```

应用组件：

```html
<template>
  <div class="hello">
    <p @click="setCount(testCount + 1)">+</p>
    <p @click="setCount(testCount - 1)">-</p>
    <test />
    <p>{{testCount}}</p>
  </div>
</template>

<script>
  import test from './test'
  import { store, mutation } from '@/store'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    components: {
      test
    },
    methods: {
      setCount: mutation.setCount
    },
    computed: {
      testCount() {
        return store.count
      }
    }
  }
</script>
```

test 组件

```html
<template>
  <div>test{{testCount}}</div>
</template>
<script>
  import { store } from '@/store'
  export default {
    computed: {
      testCount() {
        return store.count
      }
    }
  }
</script>
```

# 长列表性能优化

vue 是通过 object.defineProperty 对数据进行劫持，来实现视图响应数据的变化，然而有些时候我们的组件就是纯粹的展示，不需要 vue 劫持我们的数据，在大量数据展示的情况下，这能够很明显的减少组件初始化的时间，**我们可以通过`object.freeze`方法来冻结一个对象，一旦被冻结的对象就再也不能被修改了**。

```html
export default { data: () => ({ user: {} }), async created() { const users =
await axios.get("api/users"); this.users = Object.freeze(users); } };
```

这里仅仅是冻结了 user 的值，引用不会被冻结，当我们需要 reactive 数据的时候，我们可以重新给 users 赋值。

```html
export default { data: () => ({ users: [] }), async created() { const users =
await axios.get("/api/users"); this.users = Object.freeze(users); }, methods: {
a() { //改变值不会触发视图响应 this.users[0] = newValue;
//改变引用依然会触发视图响应 this.users = newValue; } } };
```

# 函数式组件

App.vue

```html
<template>
  <div id="app">
    <List
      :items="['Wonderwoman', 'Ironman']"
      :item-click="item => (clicked = item)"
    />
    <p>Clicked hero: {{ clicked }}</p>
  </div>
</template>

<script>
  import List from './List'

  export default {
    name: 'App',
    data: () => ({ clicked: '' }),
    components: { List }
  }
</script>
```

List.vue

```html
<template functional>
  <div>
    <p v-for="item in props.items" @click="props.itemClick(item);">
      {{ item }}
    </p>
  </div>
</template>
```

# 监听组件的生命周期

比如有父组件 Parent 和子组件 Child，如果父组件监听到子组件挂载 mounted 就做一些逻辑处理，常规写法可能如下：

```html
// Parent.vue
<Child @mounted="doSomething" />

// Child.vue mounted() { this.$emit("mounted"); }
```

# 混入

分发 Vue 组件中的可复用功能
当我们开发应用时，经常会遇到一些功能和逻辑，需要在不同的组件间多次使用，比如同样的方法逻辑，两个组件都要用到，但我们又不想也不应该完全复制两遍，这个时候就该用 mixins 了。
这意味着，如果我创建了一个组件，它有 X 个不同的方法、周期逻辑、本地的状态等，我想复用它们，我就可以创建个 mixins，让其他的组件扩展这个 mixins，就可以在这些新的组件里使用原本它们没有的方法了

# 前端路由和后端路由

对于路由这快的认知有一个盲点，好像都没有考虑过一直以来 jquery 等应用的页面的路由是怎么样的，webpack 管理的多页应用的路由又是怎么样实现的。

## 后端路由

对于普通的网站，所有超链接都是 URL 地址，所有 URL 地址都对应服务器上对应的资源。

## 前端路由

对于单页应用来说，主要通过 url 中的 hash（#号）来传值，来实现不同网页之间的切换。在单页面应用程序中，这种通过 hash 改变来切换页面的方式，称作前端路由（区别于后端路由）。

### 前端路由实现

#### 1、Pjax(PushState+Ajax)

原理：利用 ajax 请求替代了 a 标签的默认跳转，然后利用 html5 中的 API 修改了 url。

**API：history.pushState 和 history.replaceSate。**

history.pushState 和 history.replaceSate 是 HTML5 的新接口,他们可以做到改变网址却不需要刷新页面，这个特性后来就运用到了单页应用，比如：vue-router,react-router-dom 里面，pushSate 会增加一条新的历史记录，而 replaceState 则会替换当前的历史记录。（Ajax 可以实现页面的无刷新操作，于是，返回的时候，通过 url 或者其他传参，我们就可以还原到 Ajax 之前的模样）

浏览器的前进和后退，会触发 window.onpopstate 事件，通过绑定 popstate 事件，就可以根据当前 url 地址中的查询内容让对应的菜单执行 Ajax 载入，实现 Ajax 的前进和后退效果。

页面首次载入的时候，如果没有查询地址、或查询地址不匹配，则使用第一个菜单的 Ajax 地址的查询内容，并使用 history.replaceSate 更改当前的浏览器历史，然后触发 Ajax 操作。

```javascript
window.history.pushSate(null, null, 'name/blue')
window.history.pushSate(null, null, 'name/orange')
```

#### Hjax(Hash+Ajax)

原理：url 中常会出现# ，一可以表示锚点（如回到顶部的按钮的原理），而是路由里的锚点（hash）,web 服务器并不会解析 hash，也就是说#后的内容 web 服务都会自动忽略，但是 javascript 是可以通过 window.loacation.hash 读取到的，读取到路径加以解析之后就可以响应不同路径的逻辑处理。

### 前端路由的缺陷

使用浏览器的前进后退键时，会重新发出请求，没有合理的利用缓存。

# react/vue 列表组件中的 key 值。其作用是什么。

在没有绑定 key 的情况下，并且在遍历模板简单的情况下（只读模式），会导致虚拟新旧节点对比更快，节点也会被复用，这种复用就是就地复用。

```html
<div id="app">
  <div v-for="i in dataList">{{ i }}</div>
</div>
<script>
  var vm = new Vue({
    el: '#app',
    data: {
      dataList: [1, 2, 3, 4, 5]
    }
  })
</script>
```

以上的例子，v-for 的内容会生成以下的 dom 节点数组：

```javascript
;[
  '<div>1</div>', // id： A
  '<div>2</div>', // id:  B
  '<div>3</div>', // id:  C
  '<div>4</div>', // id:  D
  '<div>5</div>' // id:  E
]
```

改变 dataList 数据，进行数据位置替换，对比改变后的数据

# 组件内导航之 beforeRouteUpdate 的使用

使用场景：

组件复用；路由跳转；

```javascript
beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
```
