---
title: PWA-pushMessage
categories: PWA
comments: true
---
## 消息推送介绍
消息推送通知目前整体支持度并不高，在手机端更只有安卓chrome57支持。在订阅消息之前，浏览器主要得到用户授权，同意后才能使用消息推送服务。

<!--more-->

## 获取授权
- 在订阅之前先获取用户授权，** 使用Notification.requestPermission。当用户允许或者拒绝授权之后，后续都不会重复询问。
- 如果不选择1，在正式订阅时，浏览器也会自动弹出。对于开发者而言不需要显示调用。
- <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/notification">Notifications API</a> 的通知接口用于向用户配置和显示桌面通知。
- <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Push_API">push API</a> 允许web 应用程序接受从服务器推送到它们的消息的能力，无论WEB 应用程序是否在用户代理的前台，或者甚至当前加载。这样。开发人员就可以向选择启用的用户投放异步通知和更新，从而更及时的吸引新内容。

## 订阅消息的具体实现
- 在订阅之前先获取用户授权
- 使用pushManager 添加订阅，浏览器向推送服务发送请求，轻重传递参数对象包含两个属性。
    - userVisibleOnly,不允许静默的推出，所有推出都对用户可见，所以值为true
    - applicationServerKey,服务器生成的公钥
- 得到推送服务成功响应后，浏览器将推送服务返回的endpoint加入推送订阅对象，向服务器发送这个对象供其存储。

消息推送的安全性:
- 推送服务确保调用来自可靠的服务端。
- 推送消息内容只有浏览器能够解密，就算是推送服务也不行

## 使用web-push 发送信息
服务器端请求推送服务器，需要涉及加密，设置请求头等复杂操作。使用web-push可以解决大部分问题。
- 使用web-push 生成一对公私钥，还记得 pushManager 订阅时需要用到的applicationServerKey吗，我们需要公钥publicKey传递到订阅脚本所在的页面中。。
- 调用 setVapidDetails 为web-push设置生成的公私钥。
- 之前订阅时浏览器已经将推送订阅对象发送到了服务端，此时从数据库中取出。
- 调用sendNotification向推送服务发起调用请求，如果返回错误状态码，从数据库中删除保存的推送订阅对象。
- 所有推送服务都遵循同意的调用标准，**所有推送服务都遵循统一的调用标准，推送服务如果接到了服务器的调用请求，向设备推送消息，如果处于离线状态，消息将进入待发送队列，过期后队列清空，消息将被丢弃。**

## 推送服务的响应
- 429 too many requests
- 400 invalid request
- 404 not found 订阅过期，需要在服务端删除保存的推送订阅对象。
- 410 Gone 订阅失效，需要在服务端删除保存的推送订阅对象，并调用推送订阅对象的unsubscribe()方法
- 413 Payload size too large

