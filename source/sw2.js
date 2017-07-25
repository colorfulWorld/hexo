/**
 * Created by yu on 2017/7/21.
 */
function urlBase64ToUint8Array(base64String) {
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
}

function subscribe(serviceWorkerReg) {
    serviceWorkerReg.pushManager.subscribe({ //2.订阅
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('<applicationServerKey>')
    })
        .then(function (subscription) {
            //3.发送推送订阅对象到服务器，具体实现中发送请求到后端api
            sendEndpointInSubscription(subscription);
        })
        .catch(function () {
            if (Notification.permission == 'denied') {
                //用户拒绝订阅请求
                console.log("用户拒绝请求");
            }
        });
}

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

function webPush() {
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
            if (err.statusCode===410){
                console.log("从数据库中删除推送订阅对象");
            }
        });

    //显示通知 service Worker 监听push事件，显示通知

    self.addEventListener('push', function (e) {
        if(e.data){
            var promiseChain = Promise.resolve(e.data.json())
                .then(data => self.registration.showNotification(data.title, {}));
            e.waitUntil(promiseChain);
        }
    });


}