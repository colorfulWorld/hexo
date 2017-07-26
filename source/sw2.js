/**
 * Created by yu on 2017/7/21.
 */

var webPush = {
    init: function () {


    },
    aksPermission: function () {
        return new Promise(function (resolve, reject) {
            var permissionResult = Notification.requestPermission(function (result) {
                //旧版本
                //Notification 界面的requestPermission()方法请求用户当前来源的权限已显示通知。
                resolve(result);
            });
            if (permissionResult) {
                //新版本
                permissionResult.then(resolve, reject);
            }
        })
            .then(function (permissionResult) {
                if (permissionResult !== 'granted') {
                    //用户未授权
                }
            });
    },
    urlBase64ToUint8Array: function (base64String) {//将base64的applicationServerKey转换成UInt8Array
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);
        for (let i = 0, max = rawData.length; i < max; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },
    subscribe: function (serviceWorkerReg) {
        serviceWorkerReg.pushManager.subscribe({ //2.订阅
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('<applicationServerKey>')
        })
            .then(function (subscription) {
                //3.发送推送订阅对象到服务器，具体实现中发送请求到后端api
                sendEndpointInSubscription(subscription);
            })
            .catch(function () {
                if (Notification.permission === 'denied') {
                    //用户拒绝订阅请求
                    console.log("用户拒绝请求");
                }
            });
    }
};

//取消订阅。在默写情况下，例如服务器请求推送服务，返回了推送服务时效错误，此时需要取消订阅。
navigator.serviceWorker.ready.then(function (reg) {
    reg.pushManager.getSubscription()
        .then(function (subscription) {
            subscription.unsubscribe()
                .then(function (successful) {
                    console.log("成功退订");
                })
                .catch(function () {
                    console.log("退订失败");
                });
        });
});

function webPush() { //使用web-push 发送消息
    var webpush = require('web-push');
    var vapidKeys = webpush.generateVAPIDKeys();//1.生成公钥
    webpush.setVapidDetails(//2.设置公私钥
        'mailto:sender@example.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
    //3.从数据库中拿出之前保存的pushSubscription,具体实现省略
    //4.向推送服务发起调用请求

    webpush.sendNotification(pushSubscription, '推送消息内容')
        .catch(function (err) {
            if (err.statusCode === 410) {
                console.log("从数据库中删除推送订阅对象");
            }
        });

    //显示通知 service Worker 监听push事件，显示通知

    self.addEventListener('push', function (e) {
        if (e.data) {
            var promiseChain = Promise.resolve(e.data.json())
                .then(data => self.registration.showNotification(data.title, {}));
            e.waitUntil(promiseChain);
        }
    });
    //至此，整个推送流程就结束了
}