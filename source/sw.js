var dataCacheName = 'githubPage';
var cache_name = 'githubPage-2';
var current_caches = {
    prefetch: 'prefetch-cache-v' + dataCacheName
};
var filesToCache = [
    '/',
    '/archives/index.html',
    '/css/apollo.css',
    '/favicon.png',
    '/img/icon/favicon-128.png'
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    /*ExtendableEvent.waitUntil():
     延长了时间的生命周期。在服务工作中，延长事件的生命周期阻止浏览器在事件中的一部操作完成之前终止service worker。
     当在与安装事件相关联的EventHandler中调用时，它会延时将已安装的工作程序视为安装，
     直到传递的promise成功解析为止。这主要用于确保service worker在其依赖的所有核心高速缓存填充之前不会被考虑安装*/
    e.waitUntil(
        caches.open(cache_name).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            console.log(cache);
            return cache.addAll(filesToCache);
        })
    );
});
/*这里我们新增了install 事件监听器，接着在事件上接了一个ExtendableEvent.waitUntil()方法
 这会确保service worker不会在waitUntil()里面的代码执行完毕之前安装完成*/
/*我们使用caches.open()方法创建了一个githubPage-1的新缓存，将会是我们站点资源的缓存的第一个版本。它返回了一个创建缓存的promise,
 当它resolved 的时候，我们接着会调用在创建的缓存上的一个方法addALL()，这个方法的参数是一个由一组相对于origin的URL组成的数组，
 这个数组就是你想缓存的资源的列表*/

self.addEventListener('activate', function (e) {
    console.log('[serviceWorker] Cacheing app shell');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cache_name && key !== dataCacheName) {
                    console.log('[serviceWorker] removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[service worker] fetch', e.request.url);
    /*respondWith()方法旨在包裹代码，这些代码为来自受控页面的request生成的自定义的response。用来劫持我们的http响应*/
    e.respondWith(
        caches.match(e.request).then(function (response) {
            //如果sw有自己的返回，就直接返回，减少一次http请求。
            if (response) {
                console.log("response:" + response);
                return response;
            }

            //如果没有返回，就直接请求真实远程服务
            var request = e.request.clone(); //拷贝原始请求
            //clone()允许多次请求body()对象。
            return fetch(request).then(function (httpRes) {
                //http请求的返回已经抓到，可以进行设置

                //请求失败，直接返回失败的结果
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }
                //  请求成功，将请求缓存
                var responseClone = httpRes.clone();
                caches.open(cache_name).then(function (cache) {
                    cache.put(e.request, responseClone);
                });
                return httpRes;
            });

        })
    );

});
/*每次任何被service worker 控制的资源被请求到时，都会触发fetch事件，这些资源包括了指定的scope内的
 html 文档，和这些html文档内引用的其他任何资源（比如index.html发起了一个跨域的请求来嵌入一张图片，这个也会通过service worker*/
/*我们可以在install 的时候进行静态资源缓存。也可以通过fetch事件回调来代理页面请求从而实现动态资源缓存*/

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