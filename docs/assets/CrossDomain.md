# 跨域

## AJAX

**AJAX (*Asynchronous JavaScript and XML*) **：异步的 `JS` 和 `XML`。是一种创建交互式网页应用的网页开发技术，可以在不重新加载整个网页的情况下，与服务器交换数据，并且更新部分网页。

**XML (*Extensible Markup Language*，可扩展标记语言)**：`AJAX` 用来存储和传输数据，标签都是自定义的，而 `HTML` 更多是网页展示数据，标签是预定义的。

`AJAX` 的优缺点

1. 不需要刷新页面即可与服务器通信
2. 可以根据用户事件来刷新部分网页
3. 没有浏览历史，不能回退
4. 存在跨域问题
5. `SEO` 不友好

### （1）原理

通过 `XmlHttpRequest` 或 `Fetch API` 来向服务器发异步请求，从服务器获得数据，然后用 `JS` 来操作 `DOM` 而更新页面。

- 核心是异步通信，即浏览器可以在不阻塞用户操作的情况下，向服务器发送请求并处理响应。
- 传统的同步请求会阻塞页面，直到服务器返回响应。

### （2）实现过程

1. 创建 `AJAX` 的核心对象 `XMLHttpRequest ` 对象
2. 通过 `XMLHttpRequest` 对象的 `open()` 方法与服务端建立连接
3. 构建请求所需的数据内容，并通过 ` XMLHttpRequest` 对象的 `send()` 方法发送给服务器端
4. 通过 `XMLHttpRequest` 对象的 `onreadystatechange` 事件监听服务器端的通信状态
5. 接受并处理服务端向客户端响应的数据结果
6. 将处理结果更新到 `HTML ` 页面中

### （3）`XMLHttpRequest`

`XMLHttpRequest`：浏览器的内置对象，用于向服务器发送 `HTTP` 请求。可以在不刷新页面的情况下请求特定 `URL`，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。

1. 创建 `XMLHttpRequest` 对象

```js
const xhr = new XMLHttpRequest()
```

2. 与服务器建立连接 `open()`

```js
xhr.open(method, url, [async][, user][, password])
```

- `method`：表示当前的请求方式，常见的有 `GET`、`POST`
- `url`：服务端地址
- `async`：布尔值，表示是否异步执行操作，默认为 `true`
- `user | password`：可选，用户名或密码用于认证用途，默认为 `null`

```js
xhr.open('GET', 'http://127.0.0.1:80/server', true);
xhr.open('GET', 'http://127.0.0.1:80/server?user=admin&pwd=123456')
```

3. 给服务端发送数据 `send()`

```js
xhr.send([body])
```

- `body`：要发送的数据体，默认值为 `null`
- 如果使用 `GET` 请求发送数据，需要注意：
  1. 将请求数据添加到 `open()` 方法中的 `url` 地址中
  2. 发送请求数据中的 `send()` 方法中参数设置为 `null`

4. 绑定 `onreadystatechange` 事件

`onreadystatechange`：用于监听服务器端的通信状态。

`readyState`：有5个状态，代表不同的请求生命周期。只要属性值一变化，就会触发一次事件。

| 值   | 状态                               | 描述                                        |
| ---- | ---------------------------------- | ------------------------------------------- |
| `0`  | `UNSENT`（未打开）                 | `open()` 未被调用。                         |
| `1`  | `OPENED`（未发送）                 | `open()` 已经被调用，`send()` 未被调用。    |
| `2`  | `HEADERS_RECEIVED`（已获取响应头） | `send()` 已被调用，响应头和响应状态已返回。 |
| `3`  | `LOADING`（正在下载响应体）        | `responseText` 属性已经包含部分数据。       |
| `4`  | `DONE`（请求已完成）               | 整个请求过程以完毕。                        |

```js
const request = new XMLHttpRequest()
request.onreadystatechange = function(e){
    if(request.readyState === 4){ // 整个请求过程完毕
        if(request.status >= 200 && request.status <= 300){
            console.log(request.responseText) // 服务端返回的结果
        }else if(request.status >=400){
            console.log("错误信息：" + request.status)
        }
    }
}
request.open('POST','http://xxxx')
request.send()
```

### （4）实例属性和方法

① 实例属性

1. `readyState`：表示当前请求所处的阶段，值为 0 到 4 的整数。
2. `responseType`：设定响应数据的类型，告诉浏览器希望接收什么数据类型。

> 注意：要在 `send()` 之前设置

| 值              | 含义                               |
| --------------- | ---------------------------------- |
| `""`（默认）    | 返回字符串（`responseText`）       |
| `"text"`        | 文本                               |
| `"json"`        | 自动将响应解析为 JSON 对象         |
| `"document"`    | 返回 `Document` 对象（HTML/XML）   |
| `"blob"`        | 返回 `Blob` 对象（适合文件下载）   |
| `"arraybuffer"` | 返回二进制缓冲区（用于音频、图像） |

3. `response`：返回的实际数据，类型由 `responseType` 决定。
   1. `responseText` ：服务器返回的纯文本数据。
   2. `responseURL`：实际响应的 `URL`（可能是重定向后的地址）。
   3. `responseXML`：返回 `HTML/XML` 的 `Document` 对象。
4. `status` 和 `statusText`：返回 HTTP 状态码和文本描述。如 `200 "OK" | 404 "Not Found"`。
5. `timeout` 设置超时时间 `ms`，默认为 `0`。

```js
const resultDiv = document.querySelector('.result')
resultDiv.addEventListener('click', () => {
  const xhr = new XMLHttpRequest()
  // 设置超时时间
  xhr.timeout = 2000
  // 超时的回调函数
  xhr.timeout = function() {
    resultDiv.innerHTML = '请求超时'
  }
  // 服务器响应失败的回调函数
  xhr.onerror = function() {
    resultDiv.innerHTML = '服务器响应失败'
  }
  xhr.open('GET', 'http://127.0.0.1:80/delay')
  xhr.send()
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        resultDiv.innerHTML = xhr.response
      }
    }
  }
})
```

6. `withCredentials`：值是布尔值，表示是否该使用类似 `cookie、Authorization` 标头。

② 实例方法

1. `open`
2. `send`
3. `setRequestHeader(header, value)`：设置 `HTTP` 请求标头的值。必须在 `open()` 之后、`send()` 之前调用。

```js
xhr.setRequestHeader('Content-Type', 'application/json');
```

4. `getResponseHeader(header)`：返回特定响应头的值。

```js
const contentType = xhr.getResponseHeader('Content-Type');
```

5. `getAllResponseHeaders()`：返回所有响应头的值，以字符串的形式。

```js
const headers = xhr.getAllResponseHeaders();
```

6. `abort()`：取消仍在进行中的请求。

```js
const btn = document.querySelector('.btn');
// 定义标识符
let isSending = false
btn.addEventListener('click', function() {
  const xhr = new XMLHttpRequest();
  if (isSending) xhr.abort()  // 取消重复请求
  isSending = true
  xhr.open('GET', 'http://127.0.0.1:80/repeat')
  xhr.send()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      isSending = false
      if (xhr.status >=200 && xhr.status < 300) {
        console.log(xhr.responseText)
      }
    }
  }
})
```

## `JSON`

**JSON（*JavaScript Object Notation*）**一种轻量级、结构化的文本数据格式。可表示类型有对象、数组、数值、字符串、布尔值、`null`。基于 JavaScript 的对象语法，被几乎所有编程语言支持。

> 注意：虽然 `JSON` 语法来自 JavaScript，但并非所有 JavaScript 语法都是合法 `JSON`（如函数、`undefined` 不能表示）。

常见用途：前后端数据交换、配置文件存储。

解析 `JSON`： `JSON.parse()`；生成 `JSON`：`JSON.stringify()`。

### （1）`JSON` 语法

```json
{
  "name": "John",
  "age": 30,
  "isStudent": false,
  "address": {
    "city": "New York",
    "zip": "10001"
  },
  "skills": null,
  "hobbies": ["reading", "traveling"]
}
```

### （2）请求 `JSON`

```js
// 浏览器向服务器请求 JSON 格式数据。
app.all('/json-server', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Aceess-Control-Allow-Headers', '*')
  const data = {
    name: 'John',
    age: 30,
    city: 'New York',
    phone: '123-456-7890',
    email: 'john@example.com',
  }
  const dataStr = JSON.stringify(data);
  res.send(dataStr);
})
```

```js
const reqBtn = document.querySelector('.req-btn')
const resultDiv = document.querySelector('.result')
reqBtn.addEventListener('click', () => {
  const xhr = new XMLHttpRequest()
  // 响应数据类型为 'json'
  xhr.responseType = 'json'
  // 初始化，设定请求方法和URL
  xhr.open('GET', 'http://127.0.0.1:80/json-server')
  xhr.send()
  // 事件绑定 处理服务器返回的结果
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        // 自动转换
        resultDiv.innerHTML = xhr.response.name
      }
    }
  }
})
```

## 跨域

跨域：指浏览器允许向服务器发送跨域请求，从而克服 AJAX 只能**同源**使用的限制。

同源策略：是一种约定，同源是指协议+域名+端口相同。如果缺少同源策略，浏览器很容易受到 XSS、CSFR 等攻击。

同源策略限制以下几种行为：

1. `AJAX` 请求不能发送
2. `DOM` 和 `JS` 对象无法获得
3. `Cookie`、`LocalStorage` 和 `IndexDB` 无法读取

### `JSONP` 跨域

利用 `<script>` 标签没有跨域限制，通过 `<script>` 标签 `src` 属性，发送带有 `callback` 参数的 `GET` 请求，服务端将接口返回数据拼凑到 `callback` 函数中，返回给浏览器，浏览器解析执行，从而前端拿到 `callback` 函数返回的数据。

缺点：

1. 只能使用 GET 请求
2. 存在安全隐患，容易被恶意注入 `JS`
3. 不适用于现代复杂的跨域需求，更推荐使用 `CORS`

```js
// server.js
const express = require('express')
const app = express()

app.get('/api/jsonp', (req, res) => {
  const callback = req.query.callback // 获取回调函数名
  const data = {
    message: 'Hello from server!',
    time: new Date().toLocaleString()
  }
  // 返回 JSONP 格式：callback({...})
  res.send(`${callback}(${JSON.stringify(data)})`)
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
```

运行：`node server.js`，然后访问 `http://localhost:3000/api/jsonp?callback=myCallback`

客户端通过 `<script>` 标签实现 `JSONP` 请求

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>JSONP Demo</title>
</head>
<body>
  <h2>JSONP 跨域请求示例</h2>
  <div id="result"></div>

  <script>
    // 定义回调函数（名字必须和 URL 中的 callback 参数一致）
    function handleResponse(data) {
      document.getElementById('result').innerText = 
        `服务器返回数据：${JSON.stringify(data)}`
    }

    // 创建 script 标签，请求服务端 JSONP 接口
    const script = document.createElement('script')
    script.src = 'http://localhost:3000/api/jsonp?callback=handleResponse'
    document.body.appendChild(script)
  </script>
</body>
</html>
```

### 跨域资源共享（CORS）

CORS（*Cross-origin resource sharing*，跨域资源共享）它允许浏览器向跨源服务器，发出 `XMLHttpRequest` 请求，从而克服 `AJAX` 只能同源使用的限制。 CORS 需要浏览器和服务器同时支持。

浏览器将 `CORS` 跨域请求分为简单请求和非简单请求。

#### （1）简单请求

使用以下方法：`head | get | post`

请求的 `Heder`

1. `Accept`
2. `Accept-Language`
3. `Content-Language`
4. `Content-Type`：只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

不同时满足上面的两个条件，就属于非简单请求。浏览器对这两种的处理，是不一样的。

对于简单请求，浏览器直接发出 `CORS` 请求。具体来说，就是在头信息之中，增加一个 `Origin` 字段。

`Origin` 字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

```http
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

`CORS` 请求设置的响应头字段，都以 `Access-Control-` 开头。

1. `Access-Control-Allow-Origin`：必选，它的值要么是请求时 `Origin` 字段的值；要么是一个 `*`，表示接受任意域名的请求。
2. `Access-Control-Allow-Credentials`：可选，它的值是一个布尔值，表示是否允许发送 `Cookie`。默认情况下，`Cookie` 不包括在 `CORS` 请求之中。设为 `true`，即表示服务器明确许可，`Cookie` 可以包含在请求中，一起发给服务器。这个值也只能设为 `true`，如果服务器不要浏览器发送 `Cookie`，删除该字段即可。
3. `Access-Control-Expose-Headers`：可选，`CORS` 请求时，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到 6 个基本字段：`Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma`。如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。

#### （2）非简单请求

非简单请求的 `CORS` 请求，会在正式通信之前，增加一次 `HTTP` 查询请求，称为预检请求（*preflight*）。

预检请求用的请求方法是 `OPTIONS`，用于“询问”服务器是否允许这个跨域操作。请求头信息里面有 3 个关键字段。

1. `Origin`：表示请求来自哪个源。
2. `Access-Control-Request-Method`：必选，用来列出浏览器的 `CORS` 请求会用到哪些 `HTTP` 方法。
3. `Access-Control-Request-Headers`：可选，该字段是一个逗号分隔的字符串，指定浏览器 `CORS` 请求会额外发送的头信息字段。

```http
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0..
```

预检请求的回应：服务器收到预检请求以后，检查了上述关键字段以后，确认允许跨源请求，就可以做出回应。

`HTTP` 回应中，除了关键的是 `Access-Control-Allow-Origin` 字段，其他 `CORS` 相关字段如下：

1. `Access-Control-Allow-Methods`：必选，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。

> 注意：返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次预检请求。

2. `Access-Control-Allow-Headers`：如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则该字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在预检中请求的字段。
3. `Access-Control-Allow-Credentials`：可选，该字段与简单请求时的含义相同。
4. `Access-Control-Max-Age`：可选，用来指定本次预检请求的有效期，单位为秒。

```js
// cors-server.js
const express = require('express')
const app = express()
app.use(express.json()) // 支持 JSON 请求体解析

// 设置允许跨域的 CORS 响应头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // 允许所有域访问
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS') // 允许方法
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization') // 允许的请求头
  next()
})

// 简单请求接口（GET）
app.get('/simple', (req, res) => {
  res.json({ message: '这是简单请求的响应' })
})

// 非简单请求接口（POST + JSON）
app.post('/complex', (req, res) => {
  res.json({
    message: '这是非简单请求的响应',
    received: req.body
  })
})

// 监听端口
app.listen(3000, () => {
  console.log('CORS 服务运行在 http://localhost:3000')
})

```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head><title>CORS 实战</title></head>
<body>
  <h2>CORS 简单 & 非简单请求测试</h2>

  <button onclick="sendSimple()">发送简单请求</button>
  <button onclick="sendComplex()">发送非简单请求</button>

  <pre id="result"></pre>

  <script>
    function show(data) {
      document.getElementById('result').textContent = JSON.stringify(data, null, 2)
    }

    function sendSimple() {
      fetch('http://localhost:3000/simple')
        .then(res => res.json())
        .then(show)
    }

    function sendComplex() {
      fetch('http://localhost:3000/complex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xxx-token' // 加这个就构成“非简单请求”
        },
        body: JSON.stringify({ name: 'Alice', age: 20 })
      })
      .then(res => res.json())
      .then(show)
    }
  </script>
</body>
</html>
```

### Nginx代理跨域

前端页面和后端接口的域名不同会造成跨域问题。**Nginx 可以作为中间代理服务器**，前端请求先发到 Nginx，再由 Nginx 代理转发给后端服务，从而**避免跨域**（浏览器认为前端请求的是同源的 Nginx）。

> 跨域问题：同源策略仅是针对浏览器的安全策略。服务器端调用 `HTTP` 接口只是使用 `HTTP` 协议，不需要同源策略，也就不存在跨域问题。
>
> Nginx 代理跨域：实质和 `CORS` 跨域原理一样，通过配置文件设置请求响应头 `Access-Control-Allow-Origin...` 等字段。

场景：前端页面运行在 `http://localhost:8080`，后端接口是 `http://api.example.com`，存在跨域。

浏览器跨域访问 `js、css、img` 等常规静态资源被同源策略许可，但 `iconfont` 字体文件（`eot|otf|ttf|woff|svg`）例外。可通过配置 `add_header Access-Control-Allow-Origin *;` 支持。

```json
// Nginx 配置
server {
  listen 80;
  server_name localhost;

  location /api/ {
    proxy_pass http://api.example.com/;  # 代理转发到后端服务
    proxy_set_header Host $host;
  	add_header Access-Control-Allow-Origin *;
  }
}
```

```js
// 实际请求发送到 http://localhost/api/user
fetch('/api/user')
```

实际由 Nginx 转发到 `http://api.example.com/user`，浏览器认为是同源，不存在跨域问题。

### `postMessage` 跨域通信

`postMessage` 是浏览器提供的跨窗口通信 API，可以**让两个不同源的窗口之间安全通信**，例如：

- `iframe` 与父页面通信
- 弹出子窗口与原页面通信

优点

1. 不限请求方法（`GET/POST` 都不是问题）
2. 适用于多窗口、`iframe` 场景
3. 安全性高（通过 `origin` 校验）

```html
<!-- 👨父页面（https://parent.com） -->
<iframe src="https://child.com" id="childFrame"></iframe>
<script>
  const iframe = document.getElementById('childFrame')
  iframe.onload = () => {
    // 父页面发送消息给 iframe
    iframe.contentWindow.postMessage('Hello Child!', 'https://child.com')
  }
</script>
```

```js
// 👶子页面（https://child.com）
// 子页面监听接收
window.addEventListener('message', (event) => {
  if (event.origin === 'https://parent.com') {
    console.log('接收到父页面消息:', event.data)
    event.source.postMessage('Hello Parent!', event.origin)
  }
})
```

## WebSocket

在单个 TCP 连接上进行全双工通信的协议。WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接， 并进行双向数据传输。

> WebSocket本质上一种计算机网络应用层的协议，用来弥补 HTTP 协议在持久通信能力上的不足。

### （1）特点

1. 服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，实现双向通信。
2. 建立在 TCP 协议之上，服务器端的实现比较容易。
3. 与 HTTP 协议有着良好的兼容性。默认端口也是 `80` 和 `443`，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
4. 没有同源限制，客户端可以与任意服务器通信。
5. 协议标识符是`ws`（如果加密，则为 `wss`），服务器网址就是 `URL`。
6. 数据格式比较轻量，性能开销小，通信高效。
7. 可以发送文本，也可以发送二进制数据。

### （2）与 HTTP 区别

① HTTP 问题

1. 没有持久通信能力。
2. 通信只能由客户端发起，不具备服务器推送能力。
3. 一个 Request 只能有一个 Response，虽然在 HTTP1.1 进行了改进，有 `keep-alive`，也就是说，在一个 HTTP 连接中，可以发送多个 Request，接收多个 Response。但始终是一个 Request 对应一个 Response，并且 Response 是被动的，不能主动发起。

场景：客户端需要实时获取服务端数据，只能通过**轮询**，客户端不断向服务器发送请求。

1. 服务端被迫维持来自每个客户端的大量不同的连接
2. 造成高开销，比如会带上多余的 `header`，造成了无用的数据传输。

② 联系与区别

相同点：都是基于 TCP 的，都是可靠性传输协议。都是应用层协议。

联系：WebSocket 在建立握手时，数据是通过 HTTP 传输的；但是建立之后，在真正传输时候是不需要 HTTP 协议的。

区别：

1. WebSocket 是双向通信协议，模拟 Socket 协议，可以双向发送或接受信息，而 HTTP 是单向的；


2. WebSocket 是需要浏览器和服务器握手进行建立连接的，而 HTTP 是浏览器发起向服务器的连接。

注意：虽然 HTTP/2 也具备服务器推送功能，但 HTTP/2 只能推送静态资源，无法推送指定的信息。

### （3）建立连接

① 完成 TCP 三次握手

WebSocket 所有通信都必须先建立一条 **TCP 连接通道**。

② 客户端发起 HTTP 请求（带升级字段）

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

1. `Upgrade: websocket`：表示客户端想将当前 HTTP 请求升级为 WebSocket 协议。
2. `Connection: Upgrade`：表示当前连接支持协议升级。与 `Upgrade: websocket` 搭配使用。
3. `Sec-WebSocket-Key`：是浏览器随机生成的 Base64 字符串（16字节的随机数编码）。
   1. 用于防止伪造请求，确保是来自合法客户端。
   2. 服务器会用它计算一个加密结果，返回给客户端，作为校验。
4. `Sec_WebSocket-Protocol`：可选字段，表示客户端支持的子协议，如：`chat`、`json` 等。
   1. 适用于同一个 URL 上支持多个服务逻辑的场景。
   2. 服务器也可以从中选择一个协议并在响应中返回。
5. `Sec-WebSocket-Version`：指定客户端支持的 WebSocket 协议版本，常见为 `13`。

③ 服务器返回 HTTP 响应，同意升级

状态码 101 表示切换协议。

表示握手成功，接下来客户端和服务器之间的数据传输将不再是 HTTP，而是 WebSocket 的帧格式。

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

1. `Sec-WebSocket-Accept`：服务器使用客户端提供的 `Sec-WebSocket-Key` 加上一个固定字符串（GUID）后，进行 `SHA-1` 哈希，再 `Base64` 编码。这是浏览器用来校验“你这个服务器响应是合法的”，避免中间人伪造响应。
2. `Sec-WebSocket-Protocol`：表示最终使用的协议。

④ 升级完成，基于 TCP 的 WebSocket 通信开始

通信变为 WebSocket 协议，**支持全双工通信**，数据以帧（*frame*）格式传输。

### （4）应用场景

1. 即时聊天通信
2. 多玩家游戏
3. 在线协同编辑/编辑
4. 实时数据流的拉取与推送
5. 体育/游戏实况
6. 实时地图位置

## 其他

### `post` 请求

```js
// server.js
// 借助 express 框架搭建服务器。
const express = require('express');
const app = express();

app.get('/server', (req, res) => {
  // 设置允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Aceess-Control-Allow-Headers', '*')
  res.send('GET request received');
})

app.post('/server', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Aceess-Control-Allow-Headers', '*')
  res.send('POST request received');
})
// 设置响应头
app.all('/server', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Aceess-Control-Allow-Headers', '*')
  // res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
  res.send('POST request received');
})

app.listen(80, () => {
  console.log('Server is running at http://127.0.0.1:80');
});
```

```js
const reqBtn = document.querySelector('.req-btn')
    const resultDiv = document.querySelector('.result')
    reqBtn.addEventListener('click', () => {
      const xhr = new XMLHttpRequest()
      // 初始化，设定请求方法和URL
      xhr.open('POST', 'http://127.0.0.1:80/server')
      // 设置请求头，content-type指定请求体格式 
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      // 设置请求头，自定义请求头
      xhr.setRequestHeader('name', 'zhangsan')
      // 发送请求，post请求设置请求体，chrome在Request Payload中查看
      xhr.send('name=zhangsan&age=20')
      // xhr.send('{"name": "张三", "age": 20}')
      // 事件绑定 处理服务器返回的结果
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resultDiv.innerHTML = xhr.responseText
          }
        }
      }
    })
```

### `jQuery`

```js
// jQuery
app.get('/jquery-server', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Aceess-Control-Allow-Headers', '*')
  // res.send('jQuery request received');
  const data = {
    name: 'John',
  }
  res.send(JSON.stringify(data))
})
```

```html
<body>
  <button>GET</button>
  <button>POST</button>
  <button>通用方法</button>
  <script>
    // GET 请求
    $("button").eq(0).click(function() {
      $.get('http://127.0.0.1:80/jquery-server', {a:100,b:200}, function(data) {
        console.log(data)
      }, 'json')
    })

    // POST 请求
    $("button").eq(1).click(function () {
      $.post('http://127.0.0.1:80/jquery-server', { a: 100, b: 200 }, function (data) {
        console.log(data);
      });
    });

    // 通用方法
    $("button").eq(2).click(function () {
        $.ajax({
          url: 'http://127.0.0.1:80/jquery-server',
          data: { a: 100, b: 200 },
          // 响应体结果
          dataType: 'json',
          type: 'GET',
          timeout: 2000,
          success: function (data) {
            console.log(data)
          },
          error: function (xhr, status, error) {
            console.log(xhr.status + '|' + status + '|' + error)
          }
        })
      })
  </script>
</body>
```

### `axios`

```js
// axios
app.get('/axios-server', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Aceess-Control-Allow-Headers', '*')
  const data = {
    name: 'John',
  }
  res.send(JSON.stringify(data))
})
// POST route for axios-server
app.post('/axios-server', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  const data = {
    name: 'John',
  }
  res.send(JSON.stringify(data))
});
```

```html
<body>
  <button>GET</button>
  <button>POST</button>
  <button>AJAX</button>
  <script>
    const btn = document.querySelectorAll('button')
    // 配置 baseUrl
    axios.defaults.baseURL = 'http://127.0.0.1:80'
    // GET Request
    btn[0].addEventListener('click', () => {
      axios.get('/axios-server', {
        // url 参数
        params: {
          name: 'Alice',
          age: 20,
          sex: 'female'
        },
        // 请求头
        headers: {
          price: '100USD',
        },
      })
    })

    // POST Request
    btn[1].addEventListener('click', () => {
      axios.post('/axios-server',
      {
        // 请求体数据
          movie: 'Stranger Things'
      },
      {
        // 请求头
        headers: {
          hobby: 'music', // Custom header
        },
      })
    });

    // 通用请求
      btn[2].addEventListener('click', () => {
        axios({
          method: 'get',
          url: '/axios-server',
          headers: {
            hobby: 'music', // Custom header
          },
          data: {
            movie: 'Stranger Things'
          }
        })
      });
  </script>
</body>
```