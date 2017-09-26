---
title: Observable
---
Observable只是一个普通函数，要想让他有所作为，就需要跟observer一起使用；而这个observer（后面我们会介绍）只是一个带有 next、error、complete 的简单对象而已。最后，还需要通过 subscribe 订阅来
**启动** Observable；否则它是不会有任何反应；而订阅也会返回一个可用于取消操作（在RxJS里叫 unsubscribe）。

- Observer Pattern - (观察者模式/发布订阅模式)
- Iterator Pattern - (迭代器模式)

这两种模式是Observable的基础。

<!--more-->

## 观察者模式
一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。它定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使得它们能够自动更新自己。

Observables 与 Observer 之间的订阅发布关系(观察者模式) 如下：

- 订阅：Observer 通过 Observable 提供的 subscribe() 方法订阅 Observable。
- 发布：Observable 通过回调 next 方法向 Observer 发布事件。


当Observable设置观察者后，而连接并获取原始数据的这个过程叫生产者，可能是DOM中的 click 事件、input 事件、或者更加复杂的HTTP通信。

```javascript
import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `<input type="text"> `
})
export class HomeComponent {
  ngOnInit() {
    const node = document.querySelector('input[type=text]');

    // 第二个参数 input 是事件名，对于input元素有一个 oninput 事件用于接受用户输入
    const input$ = Observable.fromEvent(node, 'input');
    input$.subscribe({
      next: (event: any) => console.log(`You just typed ${event.target.value}!`),
      error: (err) => console.log(`Oops... ${err}`),
      complete: () => console.log(`Complete!`)
    });
  }
}
```
**Observable.fromEvent() 会返回一个Observable，并且监听 input 事件，当事件被触发后会发送一个 Event 给对应的observer观察者。**

## 一、observer

**subscribe订阅就是接收一个observer 方法。**

```javascript
    input$.subscribe((event: any) => {
    });
```

从语法角度来讲和 subscribe({ next, error, complete }) 是一样的。当Observable产生一个新值时，会通知 observer 的 next()，而当捕获失败可以调用 error()。

当Observable被订阅后，除非调用observer的 complete() 或 unsubscribe() 取消订阅两情况以外；会一直将值传递给 observer。

Observable的生产的值允许经过一序列格式化或操作，最终得到一个有价值的数据给观察者，而这一切是由一序列链式operator来完成的，每一个operator都会产生一个新的Observable。而我们也称这一序列过程为：**流**。

--------------------------------
## 二、operator
Observable可以链式写法，这意味着我们可以这样：

```javascript
    Observable.fromEvent(node, 'input')
    .map((event: any) => event.target.value)
    .filter(value => value.length >= 2)
    .subscribe(value => { console.log(value); });
```
下面是顺序步骤：
- 假设用户输入：a
- Observable对触发 oninput 事件作出反应，将值以参数的形式传递给observer的 next()。
- map() 根据 event.target.value 的内容返回一个新的 Observable，并调用 next() 传递给下一个observer。
- filter() 如果值长度 >=2 的话，则返回一个新的 Observable，并调用 next() 传递给下一个observer。
- 最后，将结果传递给 subscribe 订阅块。

#### 取消订阅 

Observable 当有数据产生时才会推送给订阅者，所以它可能会无限次向订阅者推送数据。正因为如此，在Angular里面创建组件的时候务必要取消订阅操作，以避免内存泄漏，要知道在SPA世界里懂得擦屁股是一件必须的事。

##### unsubscribe
前面示例讲过，调用 subscribe() 后，会返回一个 Subscription 可用于取消操作 unsubscribe()。最合理的方式在 ngOnDestroy 调用它。

```javascript
    ngOnDestroy() {
        this.inputSubscription.unsubscribe();
    }
```

##### takeWhile

如果组件有很多订阅者的话，则需要将这些订阅者存储在数组中，并组件被销毁时再逐个取消订阅。但，我们有更好的办法：

使用 takeWhile() operator，它会在你传递一个布尔值是调用 next() 还是 complete()。

```javascript
private alive: boolean = true;
ngOnInit() {
  const node = document.querySelector('input[type=text]');

  this.s = Observable.fromEvent(node, 'input')
    .takeWhile(() => this.alive)
    .map((event: any) => event.target.value)
    .filter(value => value.length >= 2)
    .subscribe(value => { console.log(value) });
}

ngOnDestroy() {
  this.alive = false;
}
```

## Subject

我们在写一个Service用于数据传递时，总是使用 new Subject。
```javascript
@Injectable()
export class MessageService {
    private subject = new Subject<any>();

    send(message: any) {
        this.subject.next(message);
    }

    get(): Observable<any> {
        return this.subject.asObservable();
    }
}
```
当F组件需要向M组件传递数据时，我们可以在F组件中使用send()。

```javascript

    constructor(public srv: MessageService) { }

    ngOnInit() {
        this.srv.send('w s k f m?')
    }
```

而M组件只需要订阅内容就行：

```javascript
    constructor(private srv: MessageService) {}

    message: any;
    ngOnInit() {
        this.srv.get().subscribe((result) => {
            this.message = result;
        })
    }
```

## EventEmitter

其实EventEmitter跟RxJS没有直接关系，因为他是Angular的产物，而非RxJS的东西。或者我们压根没必要去谈，因为EventEmitter就是Subject。

**EventEmitter的作用是使指令或组件能自定义事件。**

```javascript
@Output() changed = new EventEmitter<string>();

click() {
    this.changed.emit('hi~');
}
```

```javascript
@Component({
  template: `<comp (changed)="subscribe($event)"></comp>`
})
export class HomeComponent {
  subscribe(message: string) {
     // 接收：hi~
  }
}
```

上面示例其实和上一个示例中 MessageService 如出一辙，只不过是将 next() 换成 emit() 仅此而已。

## 结论

#### 创建数据流：

- 单值：of, empty, never
- 多值：from
- 定时：interval, timer
- 从事件创建：fromEvent
- 从Promise创建：fromPromise
- 自定义创建：create

#### 转换操作：

- 改变数据形态：map, mapTo, pluck
- 过滤一些值：filter, skip, first, last, take
- 时间轴上的操作：delay, timeout, throttle, debounce, audit, bufferTime
- 累加：reduce, scan
- 异常处理：throw, catch, retry, finally
- 条件执行：takeUntil, delayWhen, retryWhen, subscribeOn, ObserveOn
- 转接：switch

#### 组合数据流：

- concat，保持原来的序列顺序连接两个数据流
- merge，合并序列
- race，预设条件为其中一个数据流完成
- forkJoin，预设条件为所有数据流都完成
- zip，取各来源数据流最后一个值合并为对象
- combineLatest，取各来源数据流最后一个值合并为数组
另，最好使用 $ 结尾的命名方式来表示Observable，例：input$。