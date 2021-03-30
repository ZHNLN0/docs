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
  由于 Wireshark 需要访问链路层数据，需要授权pbf的访问权限，MAC 输入 ``` sudo chown user:admin /dev/bpf* ```，设置 Wireshark:

  ![Wireshark](../.vuepress/public/http/http-wireshark.jpg 'Wireshark')

  为了体现一次简单HTTP请求的全部过程，我使用Postman控制请求头请求页面数据，设置请求头 Connection: close，（HTTP/1.1 默认为 keep-alive，无法观察到四次挥手），发起请求后得到整体的封包的过程：

  ![HTTP封包](../.vuepress/public/http/http-package.jpg 'HTTP封包')

  设置过滤条件 ``` tcp.stream eq 0 ``` 后，剩下12个包的记录，对12个包进行分析：

  1. HTTP 协议是运行在 TCP/IP 基础上的，依靠 TCP/IP 协议来实现数据的可靠传输。所以要用 HTTP 协议收发数据，首先要做的就是建立 TCP 连接。1，2，2包对应的TCP协议的三次握手的过程，显示本次请求的客户端的端口号为58083，服务端的端口号为7796。
  2. TCP建立连接后开始传输数据（第四个包详情见[Windows TCP 功能说明](https://docs.microsoft.com/zh-CN/troubleshoot/windows-server/networking/description-tcp-features)），Postman向服务端发送一个 GET HTTP/1.1 的请求，也就是第五个包。
  3. 服务端收到后在 TCP 协议层面确认，也就是第六个包，不过这个 TCP 包 HTTP 协议是看不见的。服务端根据HTTP 协议的规定，解析报文，看看客户端发送这个请求想要干什么。解析后得到结果返回对应的响应的数据 index.html 文件，也就是第七个数据包。
  4. 当客户端收到对应的请求应答后，向服务端发送了确认收到数据包，也就是第八个包，由于请求头设置了 Connection: close，服务端在完成本次HTTP服务响应后将断开TCP的连接，第9，10，11，12个数据包为TCP的四次挥手。
  5. 至此本次HTTP的请求-应答完成，注意：所有的传输都是TCP在传输

  ![HTTP报文](../.vuepress/public/http/http-content.jpg 'HTTP报文')
  可见HTTP的明文传输（非https/http2）和报文格式。
  