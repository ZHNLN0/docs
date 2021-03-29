# HTTP CODE

## 准备工作

  1. Wireshark 网络封包分析软件。能狗分析TCP/IP的三次握手，四次挥手过程，能够看到HTTP的请求数据等。
  2. Node.js 编写HTTP服务代码。
  3. 使用 Postman 控制请求头发起请求，Chrome浏览器处理真实HTTP请求。

## Code

  [源码地址](https://github.com/ZHNLN0/docs/tree/master/code/http)

  使用Node.js创建HTTP服务，并简单实现响应浏览器各种请求及以下功能：

  1. 创建HTTP基本服务
  2. 浏览器输入网址过程分析
  3. HTTP缓存控制
  4. Cookie
  5. 处理不同请求头
  6. HTTP重定向
  7. 长连接管理
  8. 请求代理
  9. HTTP2 基础知识

### 创建HTTP服务

  创建HTTP服务，监听7796端口（HTTP默认端口80，HTTPS默认端口443），并返回index.html资源文件

```js
const http = require('http')
const fs = require('fs')
const server = http.createServer()
server.on('request', function(req, res) {
  fs.readFile('./index.html', function(err, data) {
    if(!err) {
      res.write(data)
      res.end()
    }
  })
})
server.listen(7796, '127.0.0.1', () => {
  console.log('http://127.0.0.1:7796')
})
```

  运行代码，浏览器访问 [http://127.0.0.1:7796](http://127.0.0.1:7796) 将会得到index.html内容

### 分析HTTP封包过程

  使用 Wireshark 软件分析，软件[下载地址](https://www.wireshark.org/download.html)
  