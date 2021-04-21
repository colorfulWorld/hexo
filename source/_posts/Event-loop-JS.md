---
title: 事件循环（Event loop）
date: 2018-04-28 11:19:52
categories: JavaScript
---

[主线程从任务队列中读取事件，这个过程是循环不断的，所以整个种运行机制又称为 Event Loop(事件循环)](https://www.ruanyifeng.com/blog/2014/10/event-loop.html)

<!--more-->

JS 是一门非阻塞单线程语言。

JS 在执行过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入搭配 Task（有多种 Task）队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码放入到执行栈中执行。

运行机制如下：

1. 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack)
2. 主线程之外，还存在一个“任务队列（task quue）”。只要异步任务有了运行结果，就在任务队列中放置一个结果
3. 一旦执行栈中的所有同步任务执行完毕，系统就会读取任务队列，那些对应的异步任务，结束等待状态，进入执行栈开始执行
4. 主线程不断重复上面的第三步

`宏任务（mscro-task）和微任务（micro-task）表示异步任务的两种分类。在挂起任务时，JS引擎会将所有任务按照类别分到这两个队列中，首先在macrotask的队列取出第一个任务，执行完毕后取出microtask队列中的所有任务顺序执行；之后再取macrotask任务，周而复始，直至两个队列的任务都取完`

```javascript
console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)
setInterval(myFunction,60000) //每隔6秒执行一次
funcition myFunction(){
   alert('myFunction()');
}
console.log('script end')
```

以上代码虽然 setTimeout 延时为 0，其实还是异步。这是因为 HTML5 标准规定这个函数第二个参数不得小于 4 毫秒，不足会自动增加。所以 setTimeout 还是会在 script end 之后打印。

## 任务队列

JS 中有两类任务队列：宏任务队列(macro task) 和 微任务队列(micro task)。宏任务队列可以有多个，微任务队列只有一个。
不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask） 和 宏任务（macrotask）。在 ES6 规范中，microtask 称为 jobs，macrotask 称为 task。

- (macro)task 宏任务:
  (macro)task 主要包括：script(整体代码)，setTimeout、setInterval、I/O、UI 交互事件、setImmediate(Node.js 环境)
- (micro)task 微任务：
  (micro)task 主要包括：Promise、MutaionObserver、process.nextTick(Node.js 环境)

代码开始执行都是从 script（全局任务）开始，所以，一旦我们的全局任务（`<script>`属于宏任务）执行完，就马上执行完整个微任务队列。

## Promise 哪些 API 涉及了微任务？

Promise 中只有涉及到状态变更后才需要被执行的回调才算是微任务，比如说 then、catch、finally,其他所有的代码执行都是宏任务（同步执行）

### 1

```javascript
console.log('script start');

Promise.resolve().then(() => {
    console.log('p 1');
});

setTimeout(() => {
    console.log('setTimeout');
}, 0);

var s = new Date();
while(new Date() - s < 50); // 阻塞50ms

Promise.resolve().then(() => {
    console.log('p 2');
});

console.log('script ent');


/*** output ***/

// one macro task
script start
script ent

// all micro tasks
p 1
p 2

// one macro task again
setTimeout
```

### 2

```javascript
console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

new Promise((resolve) => {
  console.log('Promise')
  resolve()
})
  .then(function () {
    console.log('promise1')
  })
  .then(function () {
    console.log('promise2')
  })

console.log('script end')
// script start => Promise => script end => promise1 => promise2 => setTimeout
```

### 3

```javascript
Promise.resolve()
  .then(() => {
    console.log('then1')
    Promise.resolve().then(() => {
      console.log('then1-1')
    })
  })
  .then(() => {
    console.log('then2')
  })
```

### 4

```javascript
let p = Promise.resolve()

p.then(() => {
  console.log('then1')
  Promise.resolve().then(() => {
    console.log('then1-1')
  })
}).then(() => {
  console.log('then1-2')
})

p.then(() => {
  console.log('then2')
})
```

### 5

```javascript
let p = Promise.resolve()
  .then(() => {
    console.log('then1')
    Promise.resolve().then(() => {
      console.log('then1-1')
    })
  })
  .then(() => {
    console.log('then2')
  })

p.then(() => {
  console.log('then3')
})
```

### 6

```javascript
Promise.resolve()
  .then(() => {
    console.log('then1')
    Promise.resolve()
      .then(() => {
        console.log('then1-1')
        return Promise.resolve()
      })
      .then(() => {
        console.log('then1-2')
      })
  })
  .then(() => {
    console.log('then2')
  })
  .then(() => {
    console.log('then3')
  })
  .then(() => {
    console.log('then4')
  })
```

### 7

```javascript
promise2 = new Promise()
promise2
  .then(() => {
    //then new Promise=>a
    console.log(1111)
    Promise.resolve()
      .then(() => {
        //then new promise b
        console.log('1111-1')
      })
      .then(() => {
        // then new promise e
        console.log('1111-2')
      })
  })
  .then(() => {
    // then new promise c
    console.log(2222)
  })

promise2
  .then(() => {
    //同一个promise a
    console.log(3333)
  })
  .then(() => {
    // then new promise d
    console.log(44444)
  })
//1111
//3333
//1111-1
//2222
//44444
//1111-2
```

## Promise 与 asap 异步执行原理

Promise 异步执行是通过[asap](https://github.com/kriskowal/asap)这个库来实现的

### asap 概述

asap 是 as soon as possible 的简称，在 Node 和浏览器环境下，能讲回调函数以高优先级任务来执行（下一个时间循环之前），即把任务放在微队列中执行。
用法：

```javascirpt
asap(function () {
    // ...
});
```

### asap 源码分析-Node 版

asap 源码库包含了支持 Node 和浏览器的两个版本，这里主要分析 Node 版
主要包含两个源码文件

- [asap.js](https://github.com/kriskowal/asap/blob/master/asap.js)
- [raw.js](https://github.com/kriskowal/asap/blob/master/raw.js)

这两个文件分别导出了 asap 和 rawAsap 这两个方法，而 asap 可以看作是对 rawAsap 的进一步封装，通过缓存的 domain（可以捕捉处理 try catch 无法捕捉的异常，针对异步代码的异常处理）和 try/finally 实现了即使某个任务抛出异常也可以恢复任务栈的继续执行，另外也做了一点缓存优化（具体见源码）。

因此这里主要分析 raw.js 里面的代码即可：

#### 首先是对外导出的 rawAsap 方法

```javascript
var queue = []
var flushing = false
function rawAsap(task) {
  if (!queue.length) {
    requestFlush()
    flushing = true
  }
  queue[queue.length] = task
}
```

源码分析：如果任务栈 queue 为空，则触发 requestFlush 方法，并将 flushing 标志为 true，并且始终会将要执行的 task 添加到任务栈 queue 的末尾。这里需要注意的是由于 requestFlush 是异步去触发任务栈的执行的，所以即使 queue[queue.length]=task 在 requestFlush 调用之后执行，也能保证在任务栈 queue 真正执行前，任务 task 已经被添加到了任务栈 queue 的末尾。（如果任务栈 queue 不为空。所以 requestFlush 已经触发了，此时任务栈正在被循环依次执行，执行完毕会清空任务栈）

#### 其次是异步触发 flush 方法执行的 requestFlush 方法

```javascript
var domain
var hasSetImmediate = typeof setImmediate === 'function'

// 设置为 rawAsap 的属性，方便在任务执行异常时再次触发 requestFlush
rawAsap.requestFlush = requestFlush
function requestFlush() {
  // 确保 flushing 未绑定到任何域
  var parentDomain = process.domain
  if (parentDomain) {
    if (!domain) {
      // 惰性加载执行 domain 模块
      domain = require('domain')
    }
    domain.active = process.domain = null
  }

  if (flushing && hasSetImmediate) {
    setImmediate(flush)
  } else {
    process.nextTick(flush)
  }

  if (parentDomain) {
    domain.active = process.domain = parentDomain
  }
}
```

源码解析：核心代码其实就一句：setImmediate(flush)，通过 setImmediate 异步执行 flush 方法。而判断 parentDomain 以及设置和恢复 domain 都只是为了当前的 flush 方法不绑定任何域执行。而这里还有一个 hasSetImmediate 判断，是为了做兼容降级处理，如果不存在 setImmediate 方法，则使用 process.nextTick 方法触发异步执行。但使用 process.nextTick 方法有一个缺陷，就是它不能够处理递归。

#### 最后是执行任务栈的 flush 方法

```javascript
// 下一个任务在任务队列中执行的位置
var index = 0
var capacity = 1024

function flush() {
  while (index < queue.length) {
    var currentIndex = index
    // 在调用任务之前先设置下一个任务的索引，可以确保再次触发 flush 方法时，跳过异常任务
    index = index + 1
    queue[currentIndex].call()

    // 防止内存泄露
    if (index > capacity) {
      for (
        var scan = 0, newLength = queue.length - index;
        scan < newLength;
        scan++
      ) {
        queue[scan] = queue[scan + index]
      }
      queue.length -= index
      index = 0
    }
  }
  queue.length = 0
  index = 0
  flushing = false
}
```

源码解析：通过 while 循环依次去执行任务栈 queue 中的每一个任务，这里需要注意一点，index + 1 表示下一个要执行的任务下标，而其放在 queue[currentIndex].call() 之前，是为了保证当当前任务执行发生异常了，再次触发 requestFlush 方法时，能够跳过发生异常的任务，从下一个任务开始执行。而判断 if (index > capacity) 是为了防止内存泄露，当任务栈 queue 的长度超过了指定的阈值 capacity 时，对任务栈 queue 中的任务进行移动，将所有剩余的未执行的任务置前，并重置任务栈 queue 的长度。当所有任务执行完毕后，重置任务栈以及相应状态。

#### 总结

rawAsap 方法是通过 setImmediate 或 process.nextTick 来实现异步执行的任务栈，而 asap 方法是对 rawAsap 方法的进一步封装，通过缓存的 domain 和 try/finally 实现了即使某个任务抛出异常也可以恢复任务栈的继续执行（再次调用 rawAsap.requestFlush）。

## Node.js 的 Event Loop

```javascript
console.log(1)
setTimeout(function () {
  console.log(2)
  new Promise(function (resolve, reject) {
    console.log('promise')
    resolve()
  }).then((res) => {
    console.log('promise.then')
  })
})
setTimeout(function () {
  console.log(4)
})
console.log(5)
//1 5 2 promise 4 promise.then
```

Node.js 也是单线程的 Event Loop，但是它的运行机制不同于浏览器。

除了 settimeout 和 setInverval 这两个方法，Node.js 还提供了另外两种与任务队列有关的方法：process.nextTick 和 setImmediate。

process.nextTick 方法可以在当前"执行栈"的尾部----下一次 Event Loop（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。setImmediate 方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次 Event Loop 时执行，这与 setTimeout(fn, 0)很像。请看下面的例子（via StackOverflow）。（这就是为什么 promise 的链式 then 会在当前任务队列最后执行的原因吧）

如果有多个 process.nextTick 语句（不管它们是否嵌套），将全部在当前"执行栈"执行。

### process.nextTick 与 setImmediate

process.nextTick 和 setImmediate 的一个重要区别：多个 process.nextTick 语句总是在当前"执行栈"一次执行完，多个 setImmediate 可能则需要多次 loop 才能执行完。事实上，这正是 Node.js 10.0 版添加 setImmediate 方法的原因，否则像下面这样的递归调用 process.nextTick，将会没完没了，主线程根本不会去读取"事件队列"！

另外，由于 process.nextTick 指定的回调函数是在本次"事件循环"触发，而 setImmediate 指定的是在下次"事件循环"触发，所以很显然，前者总是比后者发生得早，而且执行效率也高（因为不用检查"任务队列"）。

### Macrotasks 和 Microtasks

Macrotasks 和 Microtasks 都属于上述的异步任务中的一种，他们分别有如下 API：
macrotasks: setTimeout, setInterval, setImmediate, I/O, UI rendering
microtasks: process.nextTick, Promise, MutationObserver

setTimeout 的 macrotask， 和 Promise 的 microtask 有哪些不同，先来看下代码如下：

```javascript
console.log(1)
setTimeout(function () {
  console.log(2)
}, 0)
Promise.resolve()
  .then(function () {
    console.log(3)
  })
  .then(function () {
    console.log(4)
  })

//1
//3
//4
//2
```

如上代码可以看到，Promise 的函数代码的异步任务会优先于 setTimeout 的延时为 0 的任务先执行。

原因是任务队列分为 macrotasks 和 microtasks, 而 promise 中的 then 方法的函数会被推入到 microtasks 队列中，而 setTimeout 函数会被推入到 macrotasks 任务队列中，在每一次事件循环中，macrotask 只会提取一个执行，而 microtask 会一直提取，直到 microsoft 队列为空为止。

也就是说如果某个 microtask 任务被推入到执行中，那么当主线程任务执行完成后，会循环调用该队列任务中的下一个任务来执行，直到该任务队列到最后一个任务为止。

而事件循环每次只会入栈一个 macrotask,主线程执行完成该任务后又会检查 microtasks 队列并完成里面的所有任务后再执行 macrotask 的任务。

### 最后

```javascript
setImmediate(function () {
  console.log('setImmediate')
  setImmediate(function () {
    console.log('嵌套setImmediate')
  })
  process.nextTick(function () {
    console.log('nextTick')
  })
})

// setImmediate
// nextTick
// 嵌套setImmediate
```

解析：事件循环 check 阶段执行回调函数输出 setImmediate，之后输出 nextTick。嵌套的 setImmediate 在下一个事件循环的 check 阶段执行回调输出嵌套的 setImmediate。

```javascript
var fs = require('fs')

function someAsyncOperation(callback) {
  // 假设这个任务要消耗 95ms
  fs.readFile('/path/to/file', callback)
}

var timeoutScheduled = Date.now()

setTimeout(function () {
  var delay = Date.now() - timeoutScheduled

  console.log(delay + 'ms have passed since I was scheduled')
}, 100)

// someAsyncOperation要消耗 95 ms 才能完成
someAsyncOperation(function () {
  var startCallback = Date.now()

  // 消耗 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
})
```

解析：事件循环进入 poll 阶段发现队列为空，并且没有代码被 setImmediate()。于是在 poll 阶段等待 timers 下限时间到达。当等到 95ms 时，fs.readFile 首先执行了，它的回调被添加进 poll 队列并同步执行，耗时 10ms。此时总共时间累积 105ms。等到 poll 队列为空的时候，事件循环会查看最近到达的 timer 的下限时间，发现已经到达，再回到 timers 阶段，执行 timer 的回调。

### 参考

- [Node 探秘之事件循环](https://www.jianshu.com/p/837b584e1bdd)
- [node.js 下的异步递归 setImmediate 和 process.nextTick 如何使用](https://yijiebuyi.com/blog/c96c2aa46fd0b91e75be22161cceeea1.html)
- [asap 异步执行实现原理](https://www.yht7.com/news/80094)
- [nodejs_setimmediate](https://nodejs.org/api/timers.html#timers_setimmediate_callback_args)
