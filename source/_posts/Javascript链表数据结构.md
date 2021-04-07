---
title: Javascript链表数据结构
date: 2021-04-07 15:23:51
categories: JavaScript
---

数组和列表可能是最常用的数据结构，但是要实现从起点插入或者是从中间插入或移出项的成本很高，因为需要移动元素。链表的好处在于添加或者移除元素时不需要移动其他的元素。然而想要访问链表中间的一个元素，则需要从起点开始迭代链表知道找到所需要的元素。

<!--more-->

链表存储有序的元素集合，不同于数组，链表中的元素在内存中不是连续放置的。每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（也称指针活链接）组成。

![network](/images/common/linked-list.jpg)

## 实现单向数据链表

```javascript
class Node {
  constructor(element) {
    this.element = element
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.count = 0
    this.head = null
    this.equalsFn = function (a, b) {
      return a === b //用于实现indexOf的方法
    }
  }
  push(element) {
    //向链表尾部添加一个新元素
    const node = new Node(element)
    let current
    if (this.head === null) {
      this.head = node
    } else {
      current = this.head
      while (current.next !== null) {
        current = current.next
      }
      current.next = node
    }
    this.count++
  }
  insert(element, position) {
    //向链表的特定位置插入一个新元素
    if (index >= 0 && index <= this.count) {
      const node = new Node(element)
      if (index === 0) {
        const current = this.head
        node.next = current
        this.head = node
      } else {
        const previous = this.getElementAt(index - 1)
        const current = previous.next
        node.next = current
        previous.next = node
      }
      this.count++
      return true
    }
    return false
  }
  getElementAt(index) {
    //返回链表中特定位置的元素，若是不存在则返回undefined
    if (index >= 0 && index <= this.count) {
      let node = this.head
      for (let i = 0; i < index && node != null; i++) {
        node = node.next
      }
      return node
    }
    return undefined
  }
  remove(element) {
    //从链表中移出一个元素 可以使用getElementAt来重构remove方法
    const index = this.indexOf(element)
    return this.removeAt(index)
  }
  indexOf(element) {
    //返回元素在链表中的索引，如果链表中没有改元素则返回-1
    let current = this.head
    for (let i = 0; i < this.count && current != null; i++) {
      if (this.equalsFn(element, current.element)) {
        return i
      }
      current = current.next
    }
    return -1
  }
  removeAt(index) {
    //从链表的特定位置移出一个元素
    if (index >= 0 && index < this.count) {
      let current = this.head
      if (index === 0) {
        this.head = current.next
      } else {
        //将previous与current 的下一项链接起来，跳过current，从而移除它
        const previous = this.getElementAt(index - 1)
        current = previous.next
        previous.next = current.next
      }
      this.count--
      return current.element
    }
    return undefined
  }
  isEmpty() {
    return this.size() === 0
  }
  size() {
    return this.count
  }
  getHead() {
    return this.head
  }
  toString() {
    //返回表示整个链表的字符串
    if (this.head == null) {
      return ''
    }
    let objString = `${this.head.element}`
    let current = this.head.next
    for (let i = 1; i < this.size() && current != null; i++) {
      objString = `${objString},${current.element}`
      current = current.next
    }
    return objString
  }
}
```

