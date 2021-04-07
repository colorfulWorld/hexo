---
title: 常见的四种post方式
date: 2019-07-16 10:21:57
categories: Web
---
自己常常在开发过程中被后台研发要求的数据格式搞的十分混乱，常常觉得自己记错了，常常不确定怎么设置header。所以现在进行一个彻底的总结。

<!--more-->


# 常见的四种post方式

1. application/x-www-form-urlencoded
2. multipart/form-data
3. text-plain
4. application/json

## 一个form标签中的enctype有三种类型

1. application/x-www-form-urlencoded
2. multipart/form-data
3. text-plain

enctype 属性规定在发送到服务器之前应该如何对表单数据进行编码，默认的情况下是 application/x-www-urlencoded,就是说，在发送到服务器之前，所有的字符都会进行编码。当表单使用POST请求时，数据会被以x-www-urlencoded，当表单使用POST请求时，数据会被以x-www-urlencoede方式编码到Body中来传送。

而如果是get请求，则是附在url链接后面来传送。

get请求只支持ASCLL字符集，因此，如果我们要发送更大字符集的内容，我们应使用POST请求。

## 注意

如果要发送大量的二进制数据（non-ASCLL）,"application/x-www-form-urlencoded"是最低效的，因为它需要用3个字符来表示一个non-ASCLL的字符。因此这时就要使用"multipart/form-data"。

## application/x-www-form-urlencoded
**在发送前编码所有字符**

在通过HTTP向服务器发送POST请求数据，都是通过form表单形式提交的，代码如下：

```html
<form method="post" action="http://w.sohu.com">
    <input type ="text" name="text1">
    <input type="text" name="text2">
</form>
```
提交数据时会向服务器端发出这样的数据

```
POST / HTTP/1.1
Content-Type:application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate
Host: w.sohu.com
Content-Length: 21
Connection: Keep-Alive
Cache-Control: no-cache

txt1=hello&txt2=world

```

对于普通的HTML Form POST 请求，它会在头信息里使用Content-Length 注明长度。
请求头信息每行一条，空行之后便是Body,即内容。内容格式是在头信息中的Content-Type，如上是application/x-www-form-urlencoded。这也意味着消息内容会经过URL格式编码，就像是GET请求时URL中的QueryString。`text1=hello&text2=world`

## multipart/form-data
**不对字符编码，在使用包含文件上传的表单时，必须使用该值**

通过form 表单提交文件操作如下：
```html
<FORM method="POST" action="http://w.sohu.com/t2/upload.do" enctype="multipart/form-data">
    <INPUT type="text" name="city" value="Santa colo">
    <INPUT type="text" name="desc">
    <INPUT type="file" name="pic">
</FORM>
```
浏览器将会发送以下数据：

```
POST /t2/upload.do HTTP/1.1
User-Agent: SOHUWapRebot
Accept-Language: zh-cn,zh;q=0.5
Accept-Charset: GBK,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Content-Length: 60408
Content-Type:multipart/form-data; boundary=ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Host: w.sohu.com

--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data; name="city"

Santa colo
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data;name="desc"
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
 
...
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC
Content-Disposition: form-data;name="pic"; filename="photo.jpg"
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
 
... binary data of the jpg ...
--ZnGpDtePMx0KrHh_G0X99Yef9r8JZsRJSXC--
```

从上面的 multipart/form-data 格式发送的请求来看，他包含了多个parts，每个part都包含头部信息部分，part头信息中必须包含一个Content-disposition 头，其他的头信息则为可选项，比如：Content-Type 等。

## text/plain

**空格转换为“+”加号，但不对特殊字符编码
```javascript
<form action="/example/html/form_action.asp" method="get" enctype="text/plain">
  First name: <input type="text" name="fname" /><br />
  Last name: <input type="text" name="lname" /><br />
  <input type="submit" value="Submit" />
</form>
```

## application/json
最终发送的请求是：
```
BASHPOST http://www.example.com HTTP/1.1 
Content-Type: application/json;charset=utf-8

{"title":"test","sub":[1,2,3]}
```

## Boundary 分隔符

每个部分使用 --boundary 分割开来，最后一行使用--boundary--结尾



# ajax 解读

```javascript

var xhr = new XMLHTTPRequest();

xhr.open("method", "url", "async");

xhr.send(null);

xhr.onreadystatechange = function(){

    if(xhr.readystate == 4){

　　　if(xhr.status == 200){

　　　　　console.log(xhr.responseText)

　　　}

　　}
}
```

- XMLHTTPRequest对象
- 常用方法：
    - `open("method",'url','async')`
        - method 表示通过什么方式进行服务器访问，包括post和get
        - url 表示访问服务器的地址
        - async 表示是否异步，包括true(异步)和false
    - `send(content)`
        - content 表示向服务器发送的数据。


## 原生 JS 的封装

```javascript

//可以以下步骤代替上面的open、setRequestHeader、send三行，此处对GET和POST做了很好的区分
function ajax(){ 
  var ajaxData = { 
    type: (arguments[0].type || "GET").toUpperCase(), 
    url: arguments[0].url || "", 
    async: arguments[0].async || "true", 
    data: arguments[0].data || null, 
    dataType: arguments[0].dataType || "json", 
    contentType: arguments[0].contentType || "application/x-www-form-urlencoded; charset=utf-8", 
    beforeSend: arguments[0].beforeSend || function(){}, 
    success: arguments[0].success || function(){}, 
    error: arguments[0].error || function(){} 
  } 

  ajaxData.beforeSend() 
  var xhr = createxmlHttpRequest();  
  xhr.responseType=ajaxData.dataType; 

  xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);  
  xhr.setRequestHeader("Content-Type",ajaxData.contentType);  
  xhr.send(convertData(ajaxData.data));  

  xhr.onreadystatechange = function() {  
    if (xhr.readyState == 4) {  
      if(xhr.status == 200){ 
        ajaxData.success(xhr.response) 
      }else{ 
        ajaxData.error() 
      }  
    } 
  }  
} 

function createxmlHttpRequest() {  
  if (window.ActiveXObject) {  
    return new ActiveXObject("Microsoft.XMLHTTP");  
  } else if (window.XMLHttpRequest) {  
    return new XMLHttpRequest();  
  }  
} 
  
function convertData(data){ 
  if( typeof data === 'object' ){ 
    var convertResult = "" ;  
    for(var c in data){  
      convertResult+= c + "=" + data[c] + "&";  
    }  
    convertResult=convertResult.substring(0,convertResult.length-1) 
    return convertResult; 
  }else{ 
    return data; 
  } 
}

ajax({ 
  type:"POST", 
  url:"ajax.php", 
  dataType:"json", 
  data:{
    "name":"abc",
    "age":123,
    "id":"456"
　}, 
  beforeSend:function(){ 
    //some js code 
  }, 
  success:function(msg){ 
    console.log(msg) 
  }, 
  error:function(){ 
    console.log("error") 
  } 
})
```