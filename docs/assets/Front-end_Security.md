# 前端安全

## XSS防御

XSS（*Cross-site scripting*，跨站脚本）通常指的是利用网页开发时留下的漏洞，通过巧妙的方法注入恶意指令代码到网页，使用户加载并执行攻击者恶意制造的网页程序。

> 防止与 CSS（*Cascading Style Sheets*，层叠样式表）混淆，所以叫 XSS。

### XSS 类型

1. 反射型 XSS（*Reflected*）：诱导用户访问 URL 恶意链接，需要点击对应的链接才能触发。
2. 存储型 XSS：恶意代码存入数据库，在访问资源时执行了恶意代码。用户访问服务器—跨站链接—返回跨站代码。

> 存储型 XSS 攻击最常发生在由社区内容驱动的网站或 Web 邮件网站，不需要特制的链接来执行。黑客仅仅需要提交 XSS 漏洞利用代码到一个网站上其他用户可能访问的地方。这些地区可能是博客评论，用户评论，留言板，聊天室，HTML 电子邮件，wikis 等。一旦用户访问受感染的页，执行是自动的。

3. DOM 型 XSS（*DOM-based XSS*）：脚本通过前端 JS 动态插入 DOM 执行，如通过 `innerHTML`、`location.hash` 等 DOM 操作。不经过服务器，直接前端触发。

> DOM 型 XSS 是基于 DOM文档对象模型的。对于浏览器来说，DOM 文档就是一份 XML 文档，当有了这个标准的技术之后，通过 JavaScript 就可以轻松的访问 DOM。
>
> 当确认客户端代码中有 DOM 型 XSS 漏洞时，诱使(钓鱼)一名用户访问自己构造的 URL，利用步骤和反射型很类似，但是唯一的区别就是，构造的 URL 参数不用发送到服务器端，可以达到绕过 WAF、躲避服务端的检测效果。

4. 通用型 XSS（*Universal XSS*，UXSS）：利用浏览器或者浏览器扩展漏洞来制造产生 XSS 的条件并执行恶意代码。
5. 突变型 XSS（*Mutation-based XSS*，MXSS）：由于 `HTML` 内容进入 `innerHTML` 后发生意外变化，导致 XSS 的攻击流程。

> 通过 JS 执行到 `innerHTML` 属性，将本来安全的 `HTML` 代码渲染为具有潜在危险的 XSS 攻击代码，随后这段攻击代码被再次执行或渲染。

（1）XSS 常见触发场景

1. 页面中插入用户输入内容时用到了：
   1. `innerHTML`
   2. `document.write`
   3. `<div>、<a href="">、<img src="">、<style>` 等标签属性
2. 没对用户输入进行 `HTML` 编码或过滤。

```html
<!-- 如果 name 参数值是 <script>alert(1)</script>，就会弹窗 -->
<p>Hello, <span id="user"></span></p>
<script>
  const name = new URLSearchParams(location.search).get('name')
  document.getElementById('user').innerHTML = name // ⚠️ 危险点
</script>
```

### 防御

1. `textContent` 替代 `innerHTML` 处理用户输入内容，防止执行 `HTML` 标签。
2. 对用户输入进行转义处理（如 `<` → `&lt;`）。
3. 配置 CSP（内容安全策略），浏览器层面限制脚本来源。
4. 使用成熟的 XSS 库（如 `DOMPurify`、`js-xss`）。
5. 后端也要进行输入输出校验，防止双向攻击。

## CSRF攻击

### CSRF是什么

CSRF（*Cross-site request forgery*，跨站请求伪造）：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求，利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

一个典型的 CSRF 攻击有着如下的流程：

1. 受害者登录 `a.com`，并保留了登录凭证 `Cookie`。
2. 攻击者引诱受害者访问了 `b.com`。
3. `b.com` 向 `a.com` 发送请求。
4. `a.com` 接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。
5. `a.com` 以受害者的名义执行了这个请求。
6. 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让 `a.com` 执行了自己定义的操作。

### CSRF的特点

1. 攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。
2. 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作，而不是直接窃取数据。
3. 整个过程攻击者并不能获取到受害者的登录凭证，仅仅是“冒用”。
4. 跨站请求可以用各种方式：图片 URL、超链接、CORS、Form 提交等等。

### 防御

1. 阻止不明外域的访问
   1. 同源检测
   2. `Samesite Cookie`
2. 提交时要求附加本域才能获取的信息
   1. `CSRF Token`
   2. 双重 `Cookie` 验证

#### （1）同源检测

`Cookie` 的同源和浏览器的同源策略有所区别：

- 浏览器同源策略：协议+域名+端口都相同即同源
- `Cookie` 同源策略：域名相同即同源

在 `HTTP` 协议中，每个异步请求都会携带两个 `header`：`Origin Header | Referer Header` 用来标记来源域名。

这两个 `Header` 在浏览器发起请求时，大多数情况会自动带上，并且不能由前端修改，服务器接收到后可以根据这两个 `Header` 确定来源的域名。

同源检测相对简单，能预防大多数 CSRF，但并非万无一失，对于安全性要求较高，或者有较多用户输入内容的网站，我们就要对关键的接口做额外的防护措施。

#### （2）`Samesite Cookie` 属性

浏览器 `Cookie` 的 `Samesite` 属性用来限制第三方 `Cookie`，从而减少安全风险，它有三个值：

```http
Set-Cookie: SameSite = Strict | Lax | None;
```

1. `Strict`：最为严格，完全禁止第三方 `Cookie`，跨站点时，任何情况都不发送 `Cookie`。
2. `Lax`：限制稍微宽松，大多数情况下时不发送第三方 `Cookie` 的，除了 `a` 链接、预加载请求和 GET 表单。
3. `None`：关闭 `SameSite` 属性，但必须同时设置 `Secure` 属性。

#### （3）`CSRF token`

`CSRF token` 的防护策略分为三步：

1. 将 `token` 输出到页面：用户打开页面的时候，服务器需要给这个用户生成一个 `token`，该 `token` 通过加密算法对数据进行加密，**一般 `token` 都包括随机字符串和时间戳的组合**，在提交时 `token` 不能再放在 `Cookie` 中了，否则又会被攻击者冒用。
2. 请求中携带 `token`
3. 服务端验证 `token` 是否正确：服务端拿到客户端给的 `token` 后，先解密 `token`，再比对随机字符串是否一致、时间是否有效，如果字符串对比一致且在有效期内，则说明 `token` 正确。







