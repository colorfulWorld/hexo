---
title: Event loop(JS)
date: 2018-04-28 11:19:52
categories: 原生JS
---
JS是一门非阻塞单线程语言。

JS在执行过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入搭配Task（有多种Task）队列中。一旦执行栈为空，Event Loop就会从Task队列中拿出需要执行的代码放入到执行栈中执行。
<!--more-->
```javascript
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

console.log('script end');
```
以上代码虽然 setTimeout 延时为 0，其实还是异步。这是因为 HTML5 标准规定这个函数第二个参数不得小于 4 毫秒，不足会自动增加。所以 setTimeout 还是会在 script end 之后打印。

## 任务队列
JS中有两类任务队列：宏任务队列(macro task) 和 微任务队列(micro task)。宏任务队列可以有多个，微任务队列只有一个。
不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask） 和 宏任务（macrotask）。在 ES6 规范中，microtask 称为 jobs，macrotask 称为 task。

- (macro)task宏任务:
    (macro)task主要包括：script(整体代码)，setTimeout、setInterval、I/O、UI交互事件、setImmediate(Node.js环境)
- (micro)task微任务：
    (micro)task主要包括：Promise、MutaionObserver、process.nextTick(Node.js环境)

代码开始执行都是从script（全局任务）开始，所以，一旦我们的全局任务（属于宏任务）执行完，就马上执行完整个微任务队列。
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
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

new Promise((resolve) => {
    console.log('Promise')
    resolve()
}).then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
// script start => Promise => script end => promise1 => promise2 => setTimeout
```
