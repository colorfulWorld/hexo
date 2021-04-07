---
title: Event loop(JS)
date: 2018-04-28 11:19:52
categories: JavaScript
---

[主线程从任务队列中读取事件，这个过程是循环不断的，所以整个种运行机制又称为Event Loop(事件循环)](https://www.ruanyifeng.com/blog/2014/10/event-loop.html)
<!--more-->

JS 是一门非阻塞单线程语言。

JS 在执行过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入搭配 Task（有多种 Task）队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码放入到执行栈中执行。

运行机制如下：
1. 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack)
2. 主线程之外，还存在一个“任务队列（task quue）”。只要异步任务有了运行结果，就在任务队列中放置一个结果
3. 一旦执行栈中的所有同步任务执行完毕，系统就会读取任务队列，那些对应的异步任务，结束等待状态，进入执行栈开始执行
4. 主线程不断重复上面的第三步



```javascript
console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

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

```javascript

Promise.resolve()
  .then(() => {
    console.log("then1");
    Promise.resolve().then(() => {
      console.log("then1-1");
    });
  })
  .then(() => {
    console.log("then2");
  });

```

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

## Node.js的Event Loop

```javascript
console.log(1)
setTimeout(function(){
  console.log(2)
  new Promise(function(resolve,reject){
    console.log('promise')
    resolve();
  }).then(res=>{
    console.log('promise.then')
  })
})
setTimeout(function(){
  console.log(4)
})
console.log(5)
//1 5 2 promise 4 promise.then
```

浏览器中的Event Loop 和node 的Event Loop 有所不同，node在处理一个执行队列的时候不管怎样都会先执行完当前队列，然后再清空微任务队列，再去执行下一个队列。