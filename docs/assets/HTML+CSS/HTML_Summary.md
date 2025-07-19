# HTML八股知识点整理

## 一、网页

网页（Web Page）：用 HTML 编写的文档，通过浏览器访问。网页可以包含文本、图片、视频、超链接、表单等多种内容，可以通过 CSS 美化，使用 JS 实现交互。

Web 标准（Web Standards）：由国际组织，主要是 W3C制定的一系列技术规范，旨在确保网页的**结构、表现、行为**的分离。确保 Web 的**兼容性、可访问性、可维护性**，让网页在不同浏览器、设备和平台上都能正常工作。

> **W3C**（World Wide Web Consortium，万维网联盟）是一个国际性的非营利组织，负责制定这些标准，比如 HTML5 和 CSS3，它通过工作组发布推荐规范，推动浏览器厂商统一实现。

（1）前端页面构成：结构层、表示层、行为层

1. 结构（*Structure*）：HTML（*HyperText Markup Language*）定义网页的结构和内容。主流是 HTML5，由 W3C 制定。
2. 表现（*Presentation*）：CSS（*Cascading Style Sheets*）控制网页的样式和布局。主流是 CSS3，由 W3C 制定。
3. 行为（*Behavior*）：JavaScript（ECMAScript）实现网页的交互和动态行为。主流是 ES6+，由 ECMA 国际组织制定。

（2）其他相关 Web 标准

1. DOM（文档对象模型）：JavaScript 操作 HTML 结构的 API，由 W3C 维护。 
2. HTTP/HTTPS（超文本传输协议）：定义了浏览器与服务器之间的通信规则，由 IETF 维护。
3. WebAccessibility（Web 可访问性）：确保网页对所有用户（包括残障人士）都友好，使用 WAI-ARIA 技术。
4. Web APIs：如 Fetch API、Canvas API、WebRTC 等，让浏览器提供更多功能。
5. SEO（搜索引擎优化）：通过语义化 HTML 让搜索引擎更好地理解网页内容，提高排名。

（2）HTML、XML、XHTML 区别

1. HTML：超文本标记语言，用于描述网页结构的标记语言，使用标签来定义页面内容。是语法较为松散的、不严格的 Web 语言。

2. XML：可扩展的标记语言，主要用于存储数据和结构，可扩展。

3. XHTML：可扩展的超文本标记语言，基于 XML，作用与 HTML 类似，但语法更严格。


（3）`DOCTYPE` 文档类型声明

`DOCTYPE`：指示浏览器使用哪种 HTML 或 XHTML 版本来渲染页面，位于 HTML 文档的最顶部。

它的主要作用是确保浏览器以**标准模式**解析文档，从而避免不同浏览器间的渲染差异。

1. 保证页面在不同的浏览器上显示一致性。
2. 如果省略了 `DOCTYPE` 声明，浏览器会进入**混杂模式（*Quirks mode*）**，这种模式下浏览器的渲染方式与早期的浏览器相同，可能导致页面的显示出现不可预测的错误；而指定了 `DOCTYPE` 声明，则会触发**标准模式（*Standards mode*）**，使得浏览器按照 HTML 规范的要求进行页面渲染，从而保证页面的稳定性和可靠性。
3. 浏览器知道要使用哪种渲染模式，能更快解析 HTML 文档。

HTML5 简化了 `DOCTYPE` 声明为 `<!DOCTYPE html>`。

> HTML4 和 XHTML：`DOCTYPE` 声明较为复杂，需要指定具体的 DTD（*Document Type Definition*）。
>
> 如 HTML4：`<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
```

## 二、结构性标签⭐

`<html>`、`<head>`、`<title>`、`<body>`

`<h1> - <h6>`、`<p>`、`<br>` 换行 *break*、`<hr>` 水平分割线

### 1) `<head>`

`<head>` 描述了文档的各种属性和信息，包括文档的标题、在 Web 中的位置以及和其他文档的关系等。

下面这些标签可用在 `<head>` 部分：`<base>`、` <meta>`、`<title>`、`<link>`、` <script>`、` <style>`。

`<title>` 定义文档的标题，它是 `<head>` 唯一必需的元素。

**`<style>` 和 `<script>` 放置位置**

1. `<script>` 建议放在 `<body>`底部：因为浏览器从上往下顺序解析，如果遇到 JS 文件，会停止解析，去下载执行完成 JS 代码后，才会继续解析后续内容。如果将 `<script>` 标签放在头部，可能导致延长首屏加载时间。
2. `<style>` 放在 `<body>` 前后的区别
   1. 前：页面加载自上而下，先加载样式。
   2. 后：浏览器停止之前的渲染，等待加载且解析完成样式表后再重新渲染。

### 2) HTML嵌套规则

1. 块级元素与内联元素的嵌套
  1. 块级可以包含块级或行内元素
  2. 行内元素不能嵌套块级元素
2. 标题元素不能嵌套其他元素
3. 自闭合标签嵌套：`<img>`、`<br>`、`<hr>` 不能包含任何子元素
4. 表单元素嵌套、列表元素嵌套、表格元素嵌套
5. 语义化标签嵌套：可以嵌套其他元素
6. `<script>` 和 `<style>` 标签，只处理 JS 代码或者 CSS 代码

### 3) `<meta>`

`<meta>` 是**文档级元数据元素**，用于传递信息。

1. `charset` 字符集声明
2. `name` 属性，`<meta>` 提供的是文档级别的元数据，应用于整个页面
3. `http-equiv` 属性，`<meta>` 是编译指令，提供的信息与类似命名的 HTTP 头部相同
4. `itemprop` 属性，`<meta>` 提供用户定义的元数据

（1）`charset`：指定文档编码格式，常用 `utf-8`（*Unicode* 的字符编码）或 `ISO-8859-1`（拉丁字母的字符编码）。

```html
<meta charset="utf-8">
```

（2）`name` & `content`：一起使用，前者表示元数据的名称，后者是元数据的值。

```html
<!-- 1.定义网页作者 -->
<meta name="author" content="Tony">
<!-- 2.为搜索引擎提供关键字，content="" , 隔开 -->
<meta name="keywords" content="HTML, CSS, JavaScript">
<!-- 3.对网页整体的描述，对 SEO 有用 -->
<meta name="description" content="My tutorials on HTML, CSS and JavaScript">
```

4. `viewport`：为视口初始大小提供指示，目前仅用于移动设备。

- `width=device-width`：将页面宽度设置为跟随屏幕宽度变化而变化
- `initial-scale=1.0`：初始缩放比例
- `maximum-scale=1.0`：允许用户缩放的最大比例
- `minimum-scale=1.0`：允许用户缩放的最小比例
- `user-scalable=yes | no`：是否允许用户手动缩放

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minmum-scale=1.0">
```

```html
<!-- 5.表示爬虫对此页面的处理行为，用来做搜索引擎抓取 -->
<meta name="robots" content="all">  <!-- 默认行为，索引该页面，追踪链接 -->
<meta name="robots" content="none">  <!-- 不索引该页面，也不追踪任何链接 -->
<meta name="robots" content="index, nofollow">  <!-- 只索引该页面，不追踪任何链接 -->
<meta name="robots" content="noindex, follow">  <!-- 不索引页面，但允许跟踪页面上的链接（不希望页面被搜到，但希望通过它发现其他页面） -->

<!-- 6.指定双核浏览器的渲染方式 -->
<meta name="renderer" content="webkit">  <!-- 默认webkit内核 -->
<meta name="renderer" content="ie-comp">  <!-- 默认IE兼容模式 -->
<meta name="renderer" content="ie-stand">  <!-- 默认IE标准模式 -->

<!-- 7.包含生成页面软件的标识符 -->
<meta name="generator" content="Hexo 3.8.0">

<!-- 8.定义主题颜色 -->
<meta name="theme-color" content="#222">
```

（3）`http-equiv` & `content`：一起使用

```html
<!-- 1.每30s刷新一次文档 -->
<meta http-equiv="refresh" content="30">

<!-- 2.告知浏览器以何种版本渲染界面 -->
<meta http-equiv="X-UA-Compatible" content="ie=edge">
```

3. `Cache-Control`：请求和响应遵循的缓存机制，可以声明缓存的内容，修改过期时间，可多次声明。

- `no-transform`：不得对资源进行转换或转变
- `no-siteapp`：禁止百度进行转码

```html
<meta http-equiv="Cache-Control" content="no-transform">
<meta http-equiv="Cache-Control" content="no-siteapp">
```

（4）`property` & `content`：可以让网页成为一个富媒体对象，同意网页内容被其他网站引用，同时在应用的时候不会只是一个链接，会提取相应的信息展现给用户。

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://zjgyb.github.io/index.html">
<meta property="og:site_name" content="tony's blog">
```

### 4) `<script>`

`<script>` 嵌入或引用 JS 代码，可以控制脚本的加载和执行方式。

1. `src`：指定外部 JS 文件的 URL。当使用 `src` 属性时，`<script>` 标签内部的内容会被忽略。

```html
<script src="path/to/your/script.js"></script>
```

2. `type`：指定脚本的 `MIME` 类型，用于区分不同类型的脚本。

> `nomodule`：指定在不支持 ES6 模块的浏览器中不执行此脚本。常与 `type="module"` 配合使用，提供对旧浏览器的兼容。

```html
<script type="text/javascript" src="path/to/your/module.js"></script>
<script type="module" src="path/to/your/module.js"></script> <!-- 引入 ES6 模块 -->
<script nomodule src="path/to/your/script.js"></script>
```

3. `defer`：延迟脚本的执行，直到 HTML 文档完全解析完毕。适用于外部脚本文件。仅在有 `src` 时，这个属性才有效。
4. `async`：异步加载脚本文件，加载完后立即执行，不会阻塞 HTML 的解析。适用于外部脚本文件。`async` 和 `defer` 不能同时使用，如果都写了，`async` 会被忽略。

```html
<script src="path/to/your/script.js" async></script>
```

5. `charset`：指定外部脚本文件的字符编码，通常用于避免字符集问题。仅在 `src` 属性存在时使用。

```html
<script src="path/to/your/script.js" charset="UTF-8"></script>
```

6. `crossorigin`：控制跨域请求的设置，用于指定如何处理跨域脚本。

```html
<!-- 1.不发送用户凭据（如 Cookies 或 HTTP 认证） -->
<script src="https://example.com/script.js" crossorigin="anonymous"></script>
<!-- 2.发送用户凭据，身份验证，服务器在响应头中包含 Access-Control-Allow-Credentials: true -->
<script src="https://example.com/script.js" crossorigin="use-credentials"></script>
```

7. `referrerpolicy`：控制加载外部脚本时的 `Referer HTTP` 头部的内容。

值：`no-referrer`、 `origin`、 `origin-when-cross-origin`、`unsafe-url` 等。

```html
<script src="https://example.com/script.js" referrerpolicy="no-referrer"></script>
```

8. `integrity`：验证外部脚本的完整性，通过对比哈希值确保脚本文件未被篡改。

```html
<script src="https://example.com/script.js" integrity="sha384-OgVRvuATP..."></script>
```

### 5) `<link>`

`<link>`：在 HTML 中用于链接外部资源，最常见的是引入 CSS 样式表。

1. `href`：指定要链接的外部资源的 `URL`。

```html
<link rel="stylesheet" href="styles.css">
```

2. `rel`：定义当前文档与目标资源之间的关系，用于指示链接资源的类型。

- `stylesheet`：指示链接资源是一个样式表
- `icon`：指示链接资源是网站图标（*favicon*）
- **`preload`：指示预加载资源（如字体、脚本）**
- **`prefetch`：指示预取资源，以便在用户可能需要时可以更快地加载**

```html
<link rel="stylesheet" href="styles.css">
<link rel="icon" href="favicon.ico">
```

3. `type`：指定链接资源的 `MIME` 类型，主要用于 `CSS`。

```html
<link rel="stylesheet" type="text/css" href="styles.css">
```

4. `as`：指定加载资源的类型，主要用于资源预加载 `rel="preload"`。

```html
<link rel="preload" href="font.woff2" as="script | style | image | font" type="font/woff2" crossorigin="anonymous">
```

5. `crossorigin`：处理跨域请求（尤其在涉及到字体和图像时）。通常与 `rel="preload"` 和 `as` 属性一起使用。

```html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="stylesheet" href="styles.css" crossorigin="use-credentials">
```

6. `media`： 指定样式表应用的媒体类型或设备条件，用于响应式设计，决定样式表在哪些条件下应用。

```html
<!-- 1.所有设备 | 屏幕设备 | 打印设备 -->
<link rel="stylesheet" media="all | screen | print" href="print.css">
<!-- 2.具有至少 600px 宽度的设备 -->
<link rel="stylesheet" media="(min-width: 600px)" href="responsive.css">
```

5. `sizes`：定义图标尺寸。这对于不同尺寸的图标非常有用，例如用于高分辨率屏幕上的不同图标大小。

```html
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="icon" href="favicon-large.ico" sizes="64x64">
```

**`<link>` 和 `@import` 的区别**

1. `<link>` 属于 HTML 标签；而 `@import` 是 CSS 语法。
2. 页面被加载时，`<link>` 会同时被加载；而 `@import` 引用的 CSS 等到页面被加载完再加载。
3. `<link>` 是 XML 标签，无兼容问题；而 `@import` 只在 IE5 以上才能识别。
4. `<link>` 的样式权重高于 `@import` 的权重。


> `url()` 是 CSS 的一个函数。

```css
.box {
      background-image: url(./images/01.jpg);
    }
```

### 6) `src` 和 `href` 的区别

`src`（*source*）：用于指定外部资源的 `URL`，告诉浏览器从哪个 `URL` 加载资源，加载的资源会嵌入到当前页面中或执行。通常用在 `<img>`、`<script>`、`<iframe>`、`<audio>` 和 `<video>` 等标签中。

`href`（*Hypertext Reference*，超文本引用）：用于定义超链接的目标 `URL`，指定链接或引用的资源地址。通常用在 `<a>`和 `<link>` 标签中。

**区别**

1. 应用场景

- `src`：用于嵌入或加载外部资源（如图像、脚本、音频等）。
- `href`：用于定义超链接和引用外部资源（如导航链接、样式表等）。

2. 资源加载方式

- `src`：浏览器会立即请求并加载指定的资源，这会影响页面的呈现或功能。
- `href`：主要用于超链接或资源引用，浏览器会在用户点击链接时进行导航或加载资源。

3. 不同标签支持

## 三、文本格式化标签和实体字符

| 标签              | 作用                                                        | 显示效果            | 是否有语义 |
| ----------------- | ----------------------------------------------------------- | ------------------- | ---------- |
| `<b>`、`<strong>` | 加粗 (*Bold*)、强调加粗                                     | **粗体**            | 否         |
| `<i>`、`<em>`     | 斜体  (*Italic*)、强调斜体 (*Emphasis*)                     | *斜体*              | 否         |
| `<u>`             | 下划线 (*Underline*) ，多用 `text-decoration`  CSS 属性替代 | <u>下划线</u>       | 否         |
| `<s>`、`<del>`    | 删除线                                                      | ~~删除线~~          | 轻微       |
| `<sup>`           | 上标  (*Superscript*)                                       | x²                  | 是         |
| `<sub>`           | 下标  (*Subscript*)                                         | H₂O                 | 是         |
| `<small>`         | 小号文本                                                    | `<small>小</small>` | 是         |
| `<strong>`        | 强调加粗                                                    | **粗体**            | 是         |
| `<em>`            | 强调斜体 (*Emphasis*)                                       | *斜体*              | 是         |
| `<del>`           | 删除文本， 常与 `<ins>` 搭配使用                            | ~~删除~~            | 是         |
| `<ins>`           | 插入文本  (*Inserted*)                                      | <u>插入</u>         | 是         |
| `<mark>`          | 高亮                                                        | `<mark>高亮</mark>` | 是         |
| `<q>`             | 短引用  (*Quotation*)                                       | “引用”              | 是         |
| `<blockquote>`    | 长引用                                                      | 缩进块              | 是         |
| `<cite>`          | 引用出处 (*Citation*)                                       | *斜体*              | 是         |

实体字符：避免 HTML 解析冲突，显示特殊符号（有些在键盘上没有）

（1） 空格和控制字符

1. `&lt;`：小于号 `<`

2. `&gt;`：大于号 `>`

3. `&amp;`：与符号 `&`

4. `&quot;`：双引号 `"`

5. `&apos;`：单引号 `'`
6. **`&nbsp;`（*Non-Breaking Space*，不间断空格）：可以防止自动换行、保留连续空格。**

（2）数学符号

1. `&plus;`：加号 `+`

2. `&minus;`：减号 `−`

3. `&times;`：乘号 `×`

4. `&divide;`：除号 `÷`


## 四、`<a>`

`<a>`（ *Anchor*，锚点链接）

使用场景：

1. **超链接**：将用户从当前页面引导到另一个资源（图片作为跳转链接，网页 `<iframe>`、文件等）
2. **锚点**：在页面内部跳转到指定位置，跳转到指定位置的标签设置 `id`，`<a>` 标签 `href` 属性设置 `href="#id"`
3. **交互性**：触发特定行为（如发送邮件、拨打电话）

```html
<a href="目标地址">链接文本</a>
```

```html
<a href="https://www.example.com">
    <img src="logo.png" alt="网站标志">
</a>
```

**（1）属性**

① `href`：指定链接指向的资源地址。可以是绝对路径、相对路径、**页面 `#id`**。

1. `href="#"`：表示占位符，点击无跳转

2. `mailto:邮箱地址`：打开邮件客户端
3. `tel:电话号码`：拨打电话（移动端）

```html
<a href="https://www.google.com">谷歌</a>
<a href="mailto:example@email.com">发送邮件</a>
<a href="tel:+1234567890">拨打电话</a>
<a href="#top">回到顶部</a>
```

4. `id` 锚点标识：配合 `href="#id"` 实现页面内跳转。

```html
<a href="#section1">跳转到章节1</a>
<!-- 页面下方 -->
<h2 id="section1">章节1</h2>
```

> 路径的分类
>
> 1. 绝对路径：从根目录开始的完整路径。
>
> 2. 相对路径：基于当前文件位置的路径。依赖当前文件位置，适合项目内部资源引用。
>    1. `./`：当前目录
>    2. `../`：上级目录
>    3. `/`：根目录（在前端项目中通常指项目根目录）

② `target`：指定链接在何处打开。

1. `_self`：当前窗口（默认）
2. `_blank`：新窗口或新标签页
3. `_parent`：父框架（适用于框架页面）
4. `_top`：顶层框架（跳出所有框架）
5. 自定义名称：指定 `<iframe>` 或窗口的名称

```html
<a href="https://www.example.com" target="_blank">在新标签页打开</a>
```

③ `title`：鼠标悬停时显示的提示信息。

④ `rel`：定义当前文档与 `href` 链接资源之间的关系。

1. `nofollow`：告诉搜索引擎不追踪此链接（常用于广告或不可信链接）
2. `noopener`：防止新窗口中的 `window.opener` 引用原始页面（安全性）
3. `noreferrer`：不发送 `HTTP` 引用头信息（隐私性）
4. `alternate`：表示替代资源（如 `RSS` 链接）
5. `external`：表示外部链接

> `rel="noopener noreferrer"` 常与 `target="_blank"` 搭配，提升安全性和隐私性。
>

```html
<a href="https://www.example.com" target="_blank" rel="noopener noreferrer">外部链接</a>
```

⑤ `download`：指示浏览器下载文件。值：可选文件名（不写则使用原文件名）。

```html
<a href="file.pdf" download="myfile.pdf">下载 PDF</a>
```

⑥ `type`：提示链接资源的 `MIME` 类型（不常用）

```html
<a href="file.pdf" type="text/html">html 文件</a>
<a href="file.pdf" type="application/pdf">pdf 文件</a>
```

**（2）禁用 `<a>` 标签跳转页面或定位链接**

```html
<!-- 1.href属性指向空或不返回任何内容 -->
<a href="javascript:void(0);" >点此无反应javascript:void(0)</a>
<a href="javascript:;" >点此无反应javascript:</a>

<!-- 2.从标签事件入手，阻止其默认行为 -->
<a href="" onclick="return false;">return false;</a>
<a href="#" onclick="return false;">return false;</a>
```

```js
// JS：阻止默认点击事件
Event.preventDefault()
```

```css
/* CSS：不响应任何鼠标事件 */
pointer-events: none;
```

## 五、图像与多媒体

### 1) `<img>`

1. `src`：图片来源
2. `alt`（*Alternative Text*）：替代文本，图片加载失败时显示
3. `title`：鼠标悬停时显示的提示信息
4. `width | height`：宽高
5. `loading`：加载方式，值：`eager` 立即加载（默认），`lazy` 延迟加载，当图片进入视口时加载

```html
<img src="https://example.com/pic.png" alt="网络图片">
<img src="./images/photo.jpg" alt="风景" title="点击查看详情">
<img src="image.jpg" alt="图片" width="200" height="150">
<img src="large-image.jpg" alt="大图" loading="lazy">
```

6. **`srcset` 和 `sizes` 响应式图片⭐**

`srcset`：列出图片变体及其分辨率

> 指定**一组图像文件及其对应的描述符**，如**像素密度或宽度**。提供多张不同分辨率的图片，适配不同设备。浏览器会根据这些描述符选择最合适的图像。

`sizes`：指定图片在不同视口下的显示尺寸

> `src`：默认图像，用于不支持 `srcset` 的浏览器
>

①  `x` 描述符，基于像素密度 `DPR`

- `1x`、`2x`、`3x`：表示图像的像素密度 `DPR`。

```html
<img
    src="default-image.jpg"
    srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x"
    alt="描述文本"
>
<!-- image-1x.jpg：用于 DPR = 1 的设备，浏览器会根据设备 DPR 自动选择合适的图像 -->
```

② `w` 描述符，基于图像宽度，以像素为单位，通常与 `sizes` 属性一起使用。

```html
<img
    src="default-image.jpg"
    srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
    alt="描述文本"
>
<!-- small.jpg 400w：图像宽度为400px -->
<!-- - (max-width: 600px) 100vw：如果视口宽度 ≤ 600px，图像宽度为 100%(100vw) 视口宽度 -->
<!-- 否则，图像宽度为 50%(50vw) 视口宽度 -->
```

7. `usemap`：图片映射，将图片与 `<map>` 标签关联，创建可点击区域。

```html
<img src="map.jpg" alt="地图" usemap="#mymap">
<map name="mymap">
    <area shape="rect" coords="0,0,100,100" href="page1.html" alt="区域1">
</map>
```

### 2) `<canvas>` 和 `<svg>`⭐

（1）`<canvas>`

`<canvas>`：位图，通过 JS 绘制 2D 图形，基于像素渲染，不需要管理复杂的 DOM 树，适合动态内容。

优点

1. 对于需要频繁更新的动态内容、复杂的大量的图形场景（如游戏、动画），`<canvas>` 更加高效。
2. 可以直接操作像素数据，适用于图像处理、图形计算等需求。

缺点

1. 没有 DOM 结构，无内容语义。
2. 绘制完成后的图形不能直接访问和操作。无法直接修改已经绘制的内容，需要重新绘制，维护性差。
3. 对于需要响应式设计或动态调整内容，`<canvas>` 不如 `<svg>` 方便。

适用场景

1. 动画和游戏
2. 复杂的图形和渲染效果
3. 图像处理和像素级操作
4. 实时数据可视化（如图表的动态更新）

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
<script>
  var ctx = document.getElementById("myCanvas").getContext("2d");
  ctx.fillRect(50, 50, 100, 50);
</script>
```

> `<canvas>` 在标签上设置宽高，与在 `<style>` 中设置宽高的区别
>
> 1. `<canvas>` 标签的 `width` 和 `height` 是画布实际宽高，绘制的图形都是在这个上面。
> 2. `<style>` 的 `width` 和 `height` 是 `<canvas>` 在浏览器中被渲染的高度和宽度。
> 3. 如果 `<canvas>` 的 `width` 和 `height` 没指定或值不正确，就被设置成默认值。
>

（2）`<svg>`

`<svg>`：基于 XML 的矢量图，支持静态和动态效果。

优点

1. 图形元素在 DOM 中可以直接访问和操作，支持样式和事件处理。
2. 可缩放，适应响应式设计。

缺点：性能问题，不适合大量或复杂的图形元素、需要频繁更新或操作的图形、复杂或动态的图形场景。

适用场景

1. 图标和标志设计
2. 矢量图形和图表（如静态和交互式图表）
3. 响应式和可缩放的图形设计
4. 需要精确控制和访问的图形

```html
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="red" />
</svg>
```

### 3) 多媒体标签

（1）`<audio>` 和 `<video>`

`<audio>`

1. `controls`：显示播放控件
2. `autoplay`：自动播放（需用户交互或静音）
3. `loop`：循环播放
4. `muted`：静音

> `<audio>` 可以嵌套 `<source>`：提供多种音频格式。
>

```html
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    您的浏览器不支持音频播放。
</audio>
```

`<video>`：同 `<audio>` 的常用属性，如 `controls`、`autoplay`、`loop`、`muted`，也可嵌套 `<source>`。

```html
<!-- poster 视频加载前的封面图片 -->
<video width="320" height="240" poster="thumbnail.jpg" controls>
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    您的浏览器不支持视频播放。
</video>
```

（2）使用 JS 控制 `<audio>` 和 `<video>`

1. `.play() | .pause()` 方法：控制音频和视频的播放/停止

2. `.volume` 属性：设置音量，范围是 `0-1`

3. `.currentTime` 属性：设置或获取当前播放时间，秒为单位

4. `.controls` 属性：显示或隐藏默认的音频/视频控件，值为布尔值


```html
<audio id="myAudio" src="audio.mp3"></audio>
<video id="myVideo" src="video.mp4" width="640" height="360"></video>
<button id="playButton">Play</button>
<button id="pauseButton">Pause</button>

<script>
  const audioElement = document.getElementById('myAudio');
  const videoElement = document.getElementById('myVideo');
  const playButton = document.getElementById('playButton');
  const pauseButton = document.getElementById('pauseButton');

  playButton.addEventListener('click', () => {
    audioElement.play();
    videoElement.play();
  });

  pauseButton.addEventListener('click', () => {
    audioElement.pause();
    videoElement.pause();
  });
</script>
```

（3）`<source>` 和 `<track>`

1. `<source>`：为 `<audio>` 或 `<video>` 提供多种格式的备选源，浏览器选择支持的格式。
2. `<track>`：为 `<video>` 添加字幕。
   1. `src`：字幕文件路径

   2. `kind`：字幕类型

     1. `subtitles`：表示字幕，通常用于翻译内容

     2. `captions`：表示听障者的字幕，包含额外的描述信息
     3. `descriptions`：描述性字幕，提供视频内容的额外信息
     4. `chapters`：章节标题

   3. `srclang`：语言，如 `en`、`zh`

   4. `label`：用户界面中显示的语言名称


```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track src="subtitles.vtt" kind="subtitles" srclang="en" label="English">
  <track src="subtitles-zh.vtt" kind="subtitles" srclang="zh" label="中文">
  Your browser does not support the video tag.
</video>
```

### 4) `<iframe>`

`<iframe>`（ *Inline Frame*，内联框架）用于在当前网页中嵌入另一个独立的 HTML 页面或外部资源。

> 内容之间可以添加后备文本，当浏览器不支持 `<iframe>` 时显示。
>

```html
<iframe src="嵌入的资源地址"></iframe>
<iframe src="https://www.example.com"></iframe>
```

（1）属性

1. `src`：指定嵌入的页面或资源的 `URL`。
2. `srcdoc`：内联 HTML，直接在 `<iframe>` 中嵌入 HTML 代码，无需外部文件。
3. `width` 和 `height`，默认值单位为像素
4. `title`
5. `loading` 加载方式，取值 `eager | lazy`

```html
<iframe src="https://www.google.com"></iframe>
<iframe srcdoc="<h1>内联内容</h1><p>这是一个测试。</p>"></iframe>
<iframe src="https://www.example.com" width="600" height="400"></iframe>
<iframe src="https://example.com" title="嵌入的示例网站"></iframe>
<iframe src="https://example.com" loading="lazy"></iframe>
```

6. `name` 框架名称：可作为 `<a>` 标签的 `target` 属性的目标，点击链接后，内容在指定 `<iframe>` 中显示。

```html
<a href="https://www.example.com" target="myframe">在新框架中打开</a>
<iframe name="myframe" width="500" height="300"></iframe>
```
7. `allow`：权限控制 ，指定嵌入内容可使用的功能（如摄像头、麦克风、全屏）。

```html
<iframe src="https://example.com/video" allow="camera; microphone; fullscreen"></iframe>
```

8. `sandbox` 沙盒安全：限制 `<iframe>` 内内容的权限。

- `sandbox=""`：空值，启用所有限制
- `allow-scripts`：允许运行脚本
- `allow-forms`：允许提交表单
- `allow-same-origin`：允许同源访问
- `allow-popups`：允许弹出窗口
- `allow-top-navigation`：允许改变父页面

```html
<iframe src="https://example.com" sandbox="allow-scripts allow-forms"></iframe>
```

（2）优缺点

优点

1. 隔离内容：将外部页面的样式和脚本隔离，减少安全风险。
2. 内嵌资源：嵌入外部资源，如地图、视频、广告；集成第三方服务，如支付网关、社交媒体分享按钮。
3. 独立滚动：内嵌内容可以独立于主页面滚动。
4. 简化布局：如将外部应用嵌入到页面特定部分。
5. 简化测试：可以单独测试嵌入的内容。

缺点

1. 性能问题：`<iframe>` 的内容需要额外的 HTTP 请求；加载多个 `<iframe>` 可能会**增加浏览器的内存和 CPU 使用量**。
2. 跨域问题：与 `<iframe>` 中的内容进行跨域交互（如操作父页面）会受到浏览器的同源策略限制。
3. `SEO` 和可访问性：搜索引擎通常不会索引 `<iframe>` 内容。
4. 用户体验：需要在 CSS 中独立处理 `<iframe>` 默认样式，滚动条和边框；响应式设计处理麻烦。
5. 安全隐患：恶意网站可能使用内嵌内容进行点击劫持攻击，利用用户的点击意图执行恶意操作。

## 六、表单控件⭐

### 1) `<form>`

| **元素/属性** | **描述**                                                     | **值/备注**                                                  |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `<form>`      | 表单元素                                                     |                                                              |
| `action`      | 提交表单的目标（服务端）地址 `URL`                           |                                                              |
| `method`      | 数据提交方式                                                 | **`get` 与 `post` 区别**❗❗❗                                  |
| `target`      | 提交数据时打开 `action url` 的方式                           | `_self`：当前窗口（默认值）；`_blank`：新窗口                |
| `enctype`     | 编码类型（*encode type*），规定了表单在发送到服务器时候编码方式，不常用。 | `application/x-www-form-urlencoded`：编码所有字符（默认）；`multipart/form-data`：混合类型， 表单中有文件上传时使用；`text/plain`：纯文体，空格转换为 “+” 加号，不对特殊字符编码 |
| `submit()`    | 提交表单数据，通过 JS 代码调用                               |                                                              |
| `<fieldset>`  | **表单分组。**                                               |                                                              |
| `form`        | `from` 的 `id`，当`<fieldset>` 不在 `form`中时               |                                                              |
| `disabled`    | 整个分组都不可用                                             |                                                              |
| `<legend>`    | **作为 `<fieldset>` 表单分组标题**。                         | *legend*：铭文、图例                                         |

```html
<fieldset>
  <legend>个人信息</legend>
  <label>姓名：</label>
  <input type="text">
  <br>
  <label>性别：</label>
  <input type="radio" name="gender" value="male"> 男
  <input type="radio" name="gender" value="female"> 女
</fieldset>
```

### 2) `<input>`

**（1）`type`**

| `input.type`     | 描述                                                         | 备注                               |
| ---------------- | ------------------------------------------------------------ | ---------------------------------- |
| `text`           | **文本输入框**（默认），单行文本，不支持换行                 | `<input type="text">`              |
| `password`       | **密码输入框**                                               |                                    |
| `radio`          | **单选框**，相同 `name` 为一组互斥                           | 记得赋值 `value`                   |
| `checkbox`       | **多选框**，相同 `name` 为一组。如选中多个值会提交多个 `key-value` | 记得赋值 `value`                   |
| `number`         | 数字输入，`step` 设置步长                                    |                                    |
| `hidden`         | **隐藏框/域**，页面不可见，用于一些逻辑处理                  |                                    |
| `button`         | **普通按钮**，按钮显示 `value` 值，结合 JS 事件使用 `<input type="button" value="提交" onclick="">` | 建议用 `<button>` 代替             |
| `submit`         | **表单提交按钮**，在 `<form>` 中有效，直接提交表单数据       | 同 `<button>` 元素的 `submit` 模式 |
| `reset`          | **表单重置按钮**，重置表单的数据，`<form>` 中有效。          |                                    |
| `image`          | **图片提交按钮**，同 `submit`，`src` 设置图片，无图则显示 `alt` | `width`、`height` 设置图片大小     |
| `file`           | **文件选择框**，如多值则 `value` 为第一个值，JS 获取 `files` 取多个值 | `capture` 媒体拍摄方式-移动端      |
| `accept`         | 可接受文件类型，多个逗号隔开，`image/png, video/*`           |                                    |
| `email`          | **电子邮箱**，支持邮箱格式验证                               | 验证邮箱格式                       |
| `range`          | **滑块数字**，用 `min` 和 `max` 来设置值的范围，`step` 设置步长 | `list` 可设置刻度                  |
| `search`         | **搜索框**，和 `text` 差不多                                 |                                    |
| `tel`            | **电话号码**，和 `text` 差不多，有些终端支持虚拟键盘         | 不验证（不同地区格式不同）         |
| `url`            | **URL地址**，和 `text` 差不多                                | 验证 URL 格式                      |
| `color`          | **颜色输入控件**                                             |                                    |
| `date`           | **日期输入**，年月日                                         |                                    |
| `datetime-local` | **日期时间输入**，年月日、时分秒                             | `yyyy-MM-ddThh:mm`                 |
| `month`          | **年月输入**，输入年份或月份                                 | `value="2018-05"`                  |
| `week`           | **年和周数**，用于输入以年和周数组成的日期，支持的不多       |                                    |
| `time`           | 时间控件，小时、分                                           |                                    |

**（2）属性**

| 基础属性                 | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `name`                   | **控件名称**（通用属性），表单中须赋值，会作为参数名.        |
| `type`                   | **表单控件类型**。                                           |
| `value`                  | `<input>` 的值，可设置默认值。                               |
| `tabindex`               | 当前文档的 Tab 导航顺序中的位置。                            |
| `size`                   | **宽度**，文本框可显示的**字符宽度**，类似 CSS 的 `width`。  |
| `minlength`、`maxlength` | **可输入字符数量**，文本框可输入最少/大字符数量。            |
| `readonly`               | **只读**，值为布尔值，`true` 值可省略。                      |
| `disabled`               | **不可用**，无光标，值可省略。                               |
| `placeholder`            | **占位符**/水印，用于输入提示。                              |
| `checked`                | **选中状态**，单选、多选，值可省略。                         |
| `min`、`max`             | **最大/小值**，数字、日期值的边界。                          |
| `pattern`                | **模式**（正则表达式），用于值的合法性检测。                 |
| `required`               | **必填**，`hidden`、`image` 或者按钮类型无效，值可省略。     |
| `multiple`               | 是否**允许多个值**，`,` 隔开，如 `email`、`file`，值可省略。 |
| `step`                   | **步长**，数字、日期。                                       |
| `list`                   | **候选值**，输入框的候选值列表，`<datalist>` 值，显示 `value`。 |
| `autocomplete`           | **自动填充**，展示输入的历史记录，值为 `on | off`。          |
| `autofocus`              | 页面加载时**自动聚焦**，值可省略。                           |
| `inputmode`              | **值输入模式**，虚拟键盘，`text, tel, url, email, numeric`。 |
| `form`                   | 所属 `form`，值为其 `id`。                                   |
| `formaction`             | 表单提交属性，还有 `formenctype`、`formmethod`、`formnovalidate`、`formtarget`。 |

`capture` 属性：指定**文件上传控件中媒体拍摄**的方式。

1. `user` 前置
2. `environment` 后置
3. `camera` 相机
4. `camcorder` 摄像机
5. `microphone` 录音

```html
<input type='file' accept='image/*;' capture='camera'>
```

**（3）其他表单控件**

1. `<textarea>`：多行文本可以使用 `<input>` 中的一些常见属性，如 `autocomplete`、`autofocus`、`disabled`、`placeholder`、`readonly`、`required`、`maxlength` 等。

> 可使用 CSS 样式属性 `resize` 设置输入框的大小。
>

```html
<label for="message">留言：</label>
<textarea id="message" name="message" rows="4" cols="30" placeholder="请输入内容"></textarea>
```

2. `<label>`：辅助表单聚焦，当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。`<label>` 通过 `for` 属性和 `<input>` 的 `id` 属性建立关联。

```html
<form>
  <p>请选择性别：</p>
  <!-- 使用相同的 name 属性来分组，使其互斥 -->
  <input type="radio" id="male" name="gender" value="male">
  <label for="male">男</label><br>
  <input type="radio" id="female" name="gender" value="female">
  <label for="female">女</label>
</form>
```

3. `<button>`：可分为 `type="button | submit | reset"`

`<button>` 和 `<input type="button">` 的区别

- `<input>` 是单标签，无关闭标签。
- `<button>` 的显示内容在标签之间，应用场景更丰富；`<input>` 的显示内容在 `value` 属性上，只支持纯文本。
- `<button>` 的鼠标事件里可以直接写代码。

4. `<select>` 下拉选择框

![](.\images\select标签属性.jpg)

```html
<form action="">
    多选multiple：
    <select id="selfruit" name="selfruit" multiple size="4" list="optfruit">
        <optgroup label="热带水果">
            <option value="1">香蕉</option>
            <option value="2">火龙果</option>
        </optgroup>
        <optgroup label="蔬菜">
            <option value="3">绿色蔬菜</option>
            <option value="4">冬瓜</option>
            <option value="4" disabled>男瓜</option>
        </optgroup>
        <option value="5">其他</option>
    </select>
    单选：
    <select name="selsex" size="0" required>
        <option value="" selected>选择性别</option>
        <option value="1">男</option>
        <option value="2">女</option>
        <option value="5">其他</option>
    </select>
    <input type="submit">
</form>
```

5. `<progress>` 和 `<meter>`

![](.\images\progress和meter标签属性.jpg)

```html
<fieldset style="display:inline-block;">
    <legend>Progress</legend>
    progress：<progress value="0.3"></progress><br>
    progress(无value)： <progress></progress><br>
    value溢出： <progress max="100" value="120"></progress>
</fieldset>
<fieldset style="display:inline-block;">
    <legend>Meter</legend>
    普通进度：<meter value="0.2"></meter><br>
    value小于low：<meter value="10" max="60" min="0" optimum="26" low="20" high="30"></meter><br>
    value大于high：<meter value="55" max="60" min="0" optimum="15" low="20" high="30"></meter><br>
    value居中<meter value="25" max="60" min="0" optimum="26" low="20" high="30"></meter>
</fieldset>
```

![](.\images\progress和meter效果.jpg)

## 七、表格、列表

| **标签**    | **作用**                       | **示例**                                             |
| ----------- | ------------------------------ | ---------------------------------------------------- |
| `<table>`   | 定义表格的容器                 | `<table>...</table>`                                 |
| `<tr>`      | 表格的行（*Table Row*）        | `<tr>...</tr>`                                       |
| `<th>`      | 表头单元格（加粗，居中对齐）   | `<th>标题</th>`                                      |
| `<td>`      | 普通单元格（*Table Data*）     | `<td>数据</td>`                                      |
| `<caption>` | 表格标题（位于表格顶部）       | `<caption>学生成绩表</caption>`                      |
| `<thead>`   | 表格头部（可配合 `<th>` 使用） | `<thead><tr><th>姓名</th><th>成绩</th></tr></thead>` |
| `<tbody>`   | 表格主体（存放数据行）         | `<tbody><tr><td>张三</td><td>85</td></tr></tbody>`   |
| `<tfoot>`   | 表格底部（通常用于统计信息）   | `<tfoot><tr><td>平均分</td><td>90</td></tr></tfoot>` |

表格属性：合并单元格 `rowspan`、`collspan`。

> 很多属性已经废气，推荐 CSS 样式调整。

1. 无序列表：`<ul>`、`<li>`

2. 有序列表：`<ol>`、`<li>`

3. 自定义列表：`<dl>`、`<dt>`、`<dd>`


## 八、元素分类

（1）块级元素（*block-level*）

1. 独占一行，默认情况下会在前后产生换行；
2. 宽度默认是父元素的 `100%`；
3. 可以设置 `width`、`height`、`margin`、`padding` 等布局属性。

常见的块级元素：`<div>`、`<p>`、`<h1> `-`<h6>`、`<ul>`、`<ol>`、`<li>`、`<dl>`、`<dt>`、`<dd>`、`<form>`、`<table>`、`<thead>`、`<tbody>`、`<tfoot>`、`<tr>`、`<td>`、`<th>`、`<hr>`、`<header>`、`<footer>`、`<section>`、`<article>`、`<nav>`、`<aside>`、`<main>`、`<figure>`、`<figcaption>`、`<blockquote>`

（2）内联元素（*Inline*）

1. 不会独占一行，不能包含块级元素；
2. 与相邻的内联元素排列在同一行；
3. 仅占据自身内容的宽度，不会在前后产生换行；
4. 不能设置 `width`、`height`（无效），但可以设置 `padding` 和 `margin`，只影响水平方向。

⚠️注意

1. 行内元素只能容纳文本或其他行内元素，文字类的元素内不能放块级元素。
2. 链接里面不能再放链接，特殊情况链接 `<a>` 里面可以放块级元素，但是给 `<a>` 转换一下块级模式最安全。


常见的内联元素：`<span>`、`<a>`、`<label>`、`<b>`、`<strong>`、`<i>`、`<em>`、`<s>`、`<del>`、`<img>`、`<input>`

（3）内联块元素（*Inline-block*）：在布局上是内联的，但表现为块状元素，因此可以设置宽高。

1. 与其他元素排列在同一行，之间不会有间隙；
2. 默认宽度就是它本身内容的宽度；
3. 但可设置宽高和内外边距；
4. 不会自动换行。

常见的内联块元素：`<img>`、`<button>`、`<input type="text">`

转换：`diaplay: block | inline | inline-block;`

（4）自闭合元素（*self-closing elements*）、空元素（*void elements*）：没有闭合标签的元素。它们在 HTML 中没有内容，只有一个开启标签。

常见的空元素：`<meta>`、`<link>`、`<img>`、`<input>`、`<br>`、`<hr>`

## 九、H5 新特性⭐

1. 新增语义化标签：`<header>`、`<footer>`、`<nav>`、`<aside>`、`<section>`、`<article>`、`<main>`
2. 图片标签，`<canvas>` 和 `<svg>`，图片属性 `srcset | sizes | loading`
3. 音频、视频标签：`<audio>`、`<video>`、`<source>`、`<track>`
4. 增强型表单：新增 `<input>` 输入类型、表单元素、表单属性
5. `geolocation`（地理定位）
6. 拖放 `API`、全屏 `API`
7. `history API`：`go`、`forward`、`back`、`pushstate`
8. `WebWorker`、`WebStorage`、`WebSocket`

（1）语义标签

![](.\images\语义标签.jpg)

（2）增强型表单

![](.\images\h5新增input输入类型.jpg)

![](.\images\h5新增表单元素.jpg)

![](.\images\h5新增表单属性.jpg)

（3）地理定位

```js
if (navigator.geolocation) {
  // 获取当前位置信息
  navigator.geolocation.getCurrentPosition(
    // 成功获取位置时的回调
    function(position) {
      const latitude = position.coords.latitude;   // 纬度
      const longitude = position.coords.longitude; // 经度
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      
      // 在页面上展示位置信息
      document.getElementById("location").innerText =
        `您的位置：纬度 ${latitude}, 经度 ${longitude}`;
    },
    // 获取位置失败时的回调
    function(error) {
      // 了解失败原因
      console.error(`Error Code = ${error.code}: ${error.message}`);
      alert("无法获取您的位置信息，请确保已授权！");
    },
    // 可选参数配置
    {
      enableHighAccuracy: true, // 提高精度（消耗更多资源）
      timeout: 5000,            // 超时时间（毫秒）
      maximumAge: 0             // 是否使用缓存中的位置信息，这里不使用缓存
    }
  );
} else {
  alert("您的浏览器不支持 Geolocation API");
}
```

（4）拖放 `API`

1. 拖拽源（*Drag Source*）：设置 `draggable="true"` 属性可以被拖拽。

2. 拖拽目标（*Drop Target*）：接受被拖拽元素的区域。拖拽源元素被拖拽到目标区域时，目标区域会处理拖拽操作。


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML5 Drag and Drop</title>
    <style>
        #drag-source {
            width: 100px;
            height: 100px;
            background-color: lightblue;
            margin: 20px;
            text-align: center;
            line-height: 100px;
            cursor: move;
            transition: background-color 0.3s; /* 添加过渡效果 */
        }
        #drop-target {
            width: 200px;
            height: 200px;
            background-color: lightgreen;
            border: 2px dashed gray;
            margin: 20px;
            text-align: center;
            line-height: 200px;
            transition: background-color 0.3s, border-color 0.3s; /* 添加过渡效果 */
        }
    </style>
</head>
<body>
  	<!-- 开启拖拽 -->
    <div id="drag-source" draggable="true">Drag me</div>
    <div id="drop-target">Drop here</div>

    <script>
        const dragSource = document.getElementById('drag-source');
        const dropTarget = document.getElementById('drop-target');

        // 当拖拽操作开始时触发，通常用于设置拖拽数据。
        dragSource.addEventListener('dragstart', (event) => {
            console.log('dragstart: 拖拽开始');
            event.dataTransfer.setData('text/plain', 'Dragged data');
            event.target.style.opacity = '0.5'; // 拖拽时让源元素变透明
        });

        // 在拖拽过程中不断触发。用于提供实时反馈。
        dragSource.addEventListener('drag', (event) => {
            // console.log('drag: 正在拖拽...'); // 这个事件触发非常频繁，不建议频繁操作DOM
            // 可以在这里更新一些拖拽过程中的状态，但要注意性能
        });

        // 拖拽操作结束时触发，用于清理或更新 UI
        dragSource.addEventListener('dragend', (event) => {
            console.log('dragend: 拖拽结束');
            event.target.style.opacity = '1'; // 拖拽结束后恢复源元素透明度
            if (event.dataTransfer.dropEffect === 'none') {
                console.log('拖拽未成功放置');
            }
        });

        // 当拖拽元素进入目标区域时触发
        dropTarget.addEventListener('dragenter', (event) => {
            console.log('dragenter: 拖拽元素进入目标区域');
            // 可以通过改变目标区域的样式来指示它是一个有效的放置目标
            dropTarget.style.borderColor = 'blue';
            dropTarget.style.backgroundColor = '#e0ffe0'; // 更柔和的颜色变化
        });

        // 当拖拽元素悬停在目标区域上方时触发
        dropTarget.addEventListener('dragover', (event) => {
            // 必须调用 event.preventDefault() 才能接受拖拽
            event.preventDefault(); // Necessary to allow dropping
            // console.log('dragover: 悬停在目标区域'); // 这个事件也触发频繁
            // 可以继续更新样式以保持视觉反馈
            dropTarget.style.backgroundColor = 'lightyellow'; // 持续的悬停反馈
        });
        
      	// 当拖拽元素在目标区域放下时触发。用于处理放置逻辑
        dropTarget.addEventListener('drop', (event) => {
            event.preventDefault();
            console.log('drop: 元素被放置');
            dropTarget.style.backgroundColor = 'lightgreen';
            dropTarget.style.borderColor = 'gray';
            const data = event.dataTransfer.getData('text/plain');
            dropTarget.textContent = `Dropped: ${data}`;
        });

        // 当拖拽元素离开目标区域时触发
        dropTarget.addEventListener('dragleave', () => {
            console.log('dragleave: 拖拽元素离开目标区域');
            dropTarget.style.backgroundColor = 'lightgreen';
            dropTarget.style.borderColor = 'gray'; // 恢复边框颜色
        });
    </script>
</body>
</html>
```

（5）全屏 `API`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>全屏示例</title>
  <style>
    #fullscreenContent {
      width: 100px;
      height: 100px;
      background-color: lightblue;
      margin: 50px auto;
      text-align: center;
      line-height: 100px;
    }
  </style>
</head>
<body>

  <div id="fullscreenContent">点击全屏</div>
  <button id="exitFullscreenBtn" style="display:none;">退出全屏</button>

  <script>
    const fullscreenContent = document.getElementById('fullscreenContent');
    const exitFullscreenBtn = document.getElementById('exitFullscreenBtn');

    // 进入全屏模式
    fullscreenContent.addEventListener('click', function() {
      if (fullscreenContent.requestFullscreen) {
        fullscreenContent.requestFullscreen();
      } else if (fullscreenContent.mozRequestFullScreen) { // Firefox
        fullscreenContent.mozRequestFullScreen();
      } else if (fullscreenContent.webkitRequestFullscreen) { // Chrome, Safari and Opera
        fullscreenContent.webkitRequestFullscreen();
      } else if (fullscreenContent.msRequestFullscreen) { // IE/Edge
        fullscreenContent.msRequestFullscreen();
      }
      exitFullscreenBtn.style.display = 'inline-block';
    });

    // 退出全屏模式
    exitFullscreenBtn.addEventListener('click', function() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      exitFullscreenBtn.style.display = 'none';
    });

    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', () => {
      console.log('全屏状态发生变化');
    });
  </script>

</body>
</html>
```

## 十、图片和字体⭐

### 1) 响应式图片

1. `@media`

```css
.banner{
  background-image: url(/static/large.jpg);
}

@media screen and (max-width: 767px){
  background-image: url(/static/small.jpg);
}
```

2. `image-set()`：支持根据用户分辨率适配图像。

```css
body {
    background-image: -webkit-image-set( url(../images/pic-1.jpg) 1x, url(../images/pic-2.jpg) 2x, url(../images/pic-3.jpg) 600dpi);
    background-image: image-set( url(../images/pic-1.jpg) 1x, url(../images/pic-2.jpg) 2x, url(../images/pic-3.jpg) 600dpi);
}
```

3. `<picture>`：必须要写 `<img>` 标签，否则无法显示。配合 `srcset` 和 `sizes` 属性。

```html
<picture>
    <source srcset="banner_w1000.jpg" media="(min-width: 801px)">
    <source srcset="banner_w800.jpg" media="(max-width: 800px)">
    <img src="banner_w800.jpg" alt="">
</picture>
```

### 2) 图片选择

**（1）图片分类**

1. 位图：用像素点拼起来的图也叫点阵图，如 `png`、`jpg` 等。

2. 矢量图 / 向量图：并不纪录画面上每一点的信息，而是纪录了元素形状及颜色的算法，对画面进行倍数相当大的缩放，它也不会像位图那样会失真。如 `svg`。


**（2）图片压缩类型**

1. 无压缩，如 `BMP`。

2. 有损压缩：压缩不可逆，如 `jpg`。

   > 常见的有损压缩手段是**按照一定的算法将临近的像素点进行合并**。压缩算法不会对图片所有的数据进行编码压缩，而是在压缩的时候，去除了人眼无法识别的图片细节。因此有损压缩可以**在同等图片质量的情况下大幅降低图片的体积**。

3. 无损压缩：在压缩图片的过程中，图片的质量没有任何损耗，可以从无损压缩过的图片中恢复出原来的信息。如 `png`、`gif`。

**（3）图片位数**

1. 通常分为为 `8`、`16`、`24`、`32`。

2. 图片位数越大，表示的颜色越多，颜色过渡越细腻，占用的体积也越大。如 8 位图片，支持 `2 ^8 = 256` 种颜色。
3. 32 位 跟 24 位的区别就是多了一个 `Alpha` 通道，用来支持半透明，其他的跟 24 位基本一样。

**（4）图片格式**

1. GIF（*Graphics Interchange Format*，图形交换格式）：**无损压缩**，但颜色上限仅 256 种；支持动画、支持简单的**背景透明**（像素要么完全透明，要么完全不透明，边缘可能不平滑）；主要用于**简单动画**场景，不适合色彩丰富的照片，如简单的 Logo、图标、表情包动图。
2. JPEG / JPG（*Joint Photographic Experts Group*，联合图像专家组）：**有损压缩**，压缩率高，文件体积小；色彩表现丰富（千万色）；**不支持透明**、动画；**适合照片存储和网络传输**。
3. PNG（*Portable Network Graphics*，便携式网络图形）：**无损压缩**；支持 **Alpha 透明**（可以实现**平滑的半透明**效果）；色彩表现丰富（PNG-24）；不支持动画（标准 PNG）；适用于需要**透明背景**的图片（如 Logo、图标）、需要保证图片细节不丢失的场景（如截图）。文件体积通常比 JPEG 大。
4. APNG（*Animated Portable Network Graphics*，动态便携式网络图形）：PNG 的扩展，支持**高质量动画**；继承 PNG 的**无损**特性和 **Alpha 透明**能力；可以看作是**带透明通道的 GIF 升级版**，但浏览器兼容性和生态不如 WebP。适用于需要带透明背景的高清动画。
5. WebP（谷歌 Web 图片格式）：谷歌开发，旨在取代其他格式；**同时支持有损和无损压缩；支持 Alpha 透明；支持动画**；目标是在同等质量下，提供**更小的文件体积**；现代 Web 开发中的通用图片解决方案，可以替代 JPEG、PNG、GIF。
6. SVG（*Scalable Vector Graphics*，可缩放矢量图形）：**任意缩放不失真**，图像清晰；文件体积通常较小（取决于复杂度）；**矢量格式**，基于 XHTML 描述图形，不是基于像素；可以通过代码直接生成或修改；可以修改样式、添加动画、事件交互；适用于简单的、需要缩放的图形元素，不适合照片，如 Logo、图标、数据可视化图表、需要动态交互或缩放的图形。

### 3) `IconFont`

**字体图标**：不包含字母或数字，而是包含符号和字形。可以使用 CSS 设置样式，就像设置常规文本一样。

优点

1. 适用 CSS 样式、可缩放
2. 只需要发送一个或少量 HTTP 请求来加载它们，而不像图片，可能需要多个 HTTP 请求
3. 尺寸小，加载速度快
4. 支持所有浏览器

不足

1. 通常只限于一种颜色，不能用来显示复杂图像
2. 字体图标通常是根据特定的网格设计的，如 `16x16`, `32×32`, `48×48` 等。如果由于某种原因将网格系统改为 `25×25`，可能得不到清晰的结果。

# 浏览器原理⭐

## 一、Web Storage

**（1）存储**

1. `Cookie`：存储小容量(~4KB)，可设置过期时间，每次请求自动发送给服务器，性能差。适用于配合服务器做登录验证（携带 `token`）。

2. `sessionStorage`：存储容量(5MB)，会话级，关闭标签页即清除。适用于多步骤表单，临时缓存填写内容。

3. `localStorage`：存储容量(5MB)，永久保存。适用于记住主题色、登录状态。

4. `IndexedDB`：存储大量(数百MB)数据，永久保存，支持异步、结构化数据。使用较为复杂，通常涉及打开数据库、创建事务、存储和检索数据等操作。适用于离线网页应用（PWA）、图像、音视频缓存。


![](.\images\localStorage和sessionStorage.jpg)

**（2）`localStorage` 和 `sessionStorage` API**

提供了相同的方法进行存储、检索和删除。在浏览器中通过 `application` 面板查看。

1. `setItem(key, value)`：设置数据，对象和数组必须转换为 `string` 进行存储。

> `JSON.parse()` 和 `JSON.stringify()` 可以将复杂数据类型的值转换为 `string`。

```js
localStorage.setItem("username", "name"); // "name"
localStorage.setItem("count", 1); // "1"
localStorage.setItem("isOnline", true); // "true"
sessionStorage.setItem("username", "name");
// user 存储时，先使用 JSON 序列化，否则保存的是[object Object]
const user = { "username": "name" };
localStorage.setItem("user", JSON.stringify(user));
sessionStorage.setItem("user", JSON.stringify(user));
```

2. `getItem(key)`：获取数据，找不到则返回 `null`。

```js
const usernameLocal = localStorage.getItem("username");
const usernameSession = sessionStorage.getItem("username");
// 获取到的数据为string，使用时反序列化数据
const userLocal = JSON.parse(localStorage.getItem("user"));
const userSession = JSON.parse(sessionStorage.getItem("user"));
```

3. `removeItem(key)`：删除数据
4. `clear()`：清空数据
5. 查找：`hasOwnProperty()`、`Object.keys()`

```js
localStorage.removeItem("username");
sessionStorage.removeItem("username");

localStorage.clear();
sessionStorage.clear();

localStorage.hasOwnProperty("userName"); // true
sessionStorage.hasOwnProperty("userName"); // false
Object.keys(localStorage); // ['username']
Object.keys(sessionStorage);
```

**（3）离线存储**

浏览器是如何对 HTML5 的离线储存资源进行管理和加载？

- HTML5 离线缓存资源的现代方案是 `Service Worker` + `Cache API`
- 资源加载顺序：**优先缓存，没有就网络获取**
- `Service Worker` 工作在浏览器主线程之外，支持离线体验，是 `PWA`（渐进式网页应用）核心

## 二、DOM和BOM

### 1) 概念

DOM 操作网页内容，BOM 操作浏览器环境。

**（1）DOM**

DOM（*Document Object Model*）是表述 HTML 的内部数据结构，它会将 Web 页面和 JavaScript 脚本连接起来，用 JavaScript 操作 HTML 结构的接口（*操标签、改内容、绑事件*），并过滤一些不安全的内容。

浏览器渲染引擎无法直接理解 **HTML 文件字节流**，因此需要将其转化为引擎能够理解的内部结构 DOM。

DOM 提供了对 HTML 文档的**结构化表达**，是表示**页面结构的树状模型**，每个标签是一个节点（*Node*），树的根节点是 `document` 对象，它代表整个文档。

> 在渲染引擎中，DOM的作用：
>
> 1. 从页面视角来看，DOM 是生成页面的基础数据结构。
> 2. 从 JavaScript 脚本视角来看，DOM 提供给 JavaScript 脚本操作的接口，可以访问 DOM，改变文档的结构、样式和内容。
> 3. 从安全视角来看，DOM 是一道安全防护线，一些不安全的内容在 DOM 解析阶段就被拒之门外了。
>

**（2）BOM**

BOM（*Browser Object Model*）表示浏览器窗口及其各个组件的对象模型，用 JS 操作**浏览器功能**的接口。它提供了一组对象，用于访问和控制**浏览器窗口及其各个部分**。

BOM 的核心对象是 `window` 对象，它表示浏览器窗口，并且是 JS 中的全局对象。

1. `window`：全局对象，所有 BOM/DOM 的顶层
2. `location`：当前页面 `URL` 地址
3. `history`：浏览器历史记录，前进、后退
4. `navigator`：浏览器信息、用户设备信息
5. `screen`：屏幕信息（宽高、像素密度等）
6. `alert/prompt/confirm`：弹窗交互

### 2) DOM树

DOM树：将 HTML 文档结构以树状结构表示，浏览器会把 HTML解析成一棵树，每个**标签/文本/属性**都是一个节点。

![](.\images\DOM树生成.jpg)

网络进程和渲染进程之间有一个共享数据通道，网络进程加载了多少数据， 就将数据传给 HTML 解析器进行解析。

**HTML 解析器（*HTML Parser*）接收到数据（字节流）之后，字节流将转化成 DOM。**

![](.\images\DOM树生成2.jpg)

1. 分词器先将字节流转换为一个个 `Token`，分为 `Tag Token` 和 `文本 Token`。
2. `Token` 解析为 DOM 节点。
3. 将 DOM 节点添加到 DOM 树中。

### 3) JS和CSS影响浏览器解析和渲染情况

![](.\images\JS阻塞解析和渲染情况.jpg)

![](.\images\CSS阻塞解析和渲染情况.jpg)

`<image>`、`<iframe>` 等，会阻塞 DOM 的解析，因为顺序执行。

### 4) 页面生命周期

| 事件               | 触发时机                                                 | 应用场景                                                     |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------------ |
| `DOMContentLoaded` | DOM 加载完成，**不含图片、视频、`<iframe>`、样式等资源** | 初始化脚本                                                   |
| `load`             | 页面 **所有资源加载完**（图片、CSS等）                   | 埋点统计                                                     |
| `beforeunload`     | 页面即将离开前，**可弹出提示框**，离开前保存状态         | 用户关闭/刷新页面前弹窗提醒（如表单未提交）                  |
| `unload`           | 页面卸载完成，**不能阻止或交互**                         | 上报数据。页面关闭时触发，不可阻止，也不推荐复杂逻辑，兼容性差 |

## 三、输入 URL 到页面渲染完成❗⭐

### 1) 解析 HTML 文档❗⭐

**(1) DOM解析（*DOM Parsing*）**

将 HTML 标签解析为 *DOM Tree* 的过程。构建网页的最原始结构（DOM 树），是页面加载的第一步。通常由浏览器的**主线程**完成，DOM 解析过程是**从上往下**顺序执行的。

**(2) DOM渲染（*DOM Rendering*）**

将 *DOM Tree* 和 *CSS Tree* 结合后生成 *Render Tree*，并在页面上绘制出来。由浏览器的**渲染线程**完成。

**(3) 并行机制**

DOM 解析和 DOM 渲染**由不同的线程执行**，可以**并行进行**，提升页面加载效率。

解析与渲染分离，使浏览器可以在解析 HTML 的同时渲染页面，用户可以更早看到部分页面内容（**优化首屏加载体验**）。

**(4) 解析 HTML 文档**

1. 接收 HTML 文件：浏览器通过发送 HTTP 请求获取服务器返回的 HTML 文件。该文件可能会包含外部资源（如 CSS、JavaScript、图片等），浏览器会逐步处理这些内容。
2. 构建 DOM 树
   1. **词法分析（*Tokenization*）**：浏览器解析 HTML 源代码，将其拆分为一系列的**标记或词法单元（*tokens*）**，这些标记对应 HTML 标签、属性和文本。
   2. **构建 DOM 树**：根据标记构建一个 DOM 树。DOM 树的每个节点代表 HTML 文档的元素 / 属性 / 文本内容，形成一个层次结构。
   3. **节点顺序**：根据标签的嵌套关系将它们组织成树状结构。
3. 解析 CSS（样式处理）
   1. 在构建 DOM 树的同时，浏览器遇到 `<style>` 标签或者外部 CSS 文件的链接（如 `<link rel="stylesheet">`），浏览器会下载并解析这些 CSS 规则。
   2. 浏览器将 CSS 规则应用到相应的 DOM 节点，生成 **CSSOM 树（*CSS Object Model*）**，它表示页面上所有样式的结构。


4. 生成渲染树
   1. 将 DOM 树和 CSSOM 树结合，生成**渲染树（*Render Tree*）**，它包含了页面中所有可见元素的样式信息。
   2. 渲染树不包括像 `<head>` 标签或隐藏元素（如 `display: none` 的元素），只有**可见的元素和它们的样式**才会被包含在内。


5. 布局&重排（*Layout / Reflow*）
   1. **布局**：浏览器通过渲染树来**确定每个元素的准确位置和大小**。浏览器计算每个元素的几何位置，得到每个元素在页面上的精确位置。
   2. **重排**：如果布局发生了改变（如窗口尺寸变化，或者某个元素尺寸改变），浏览器需要重新计算布局。


6. 绘制&重绘（*Paint*）
   1. 浏览器会将布局好的元素按照样式规则渲染到屏幕上，绘制每个元素的颜色、边框、阴影等外观。
   2. 渲染引擎工作结束，由用户界面后端（*UI Backend*）对渲染树的每个节点进行绘制，呈现页面效果。


7. 合成层（*Composite*）
   1. 在绘制完成后，浏览器可能会**将渲染的内容分为多个层**。某些元素（如动画、滚动条、固定定位的元素等）可能需要单独的图层。
   2. 浏览器将这些层合成，最终生成显示在屏幕上的完整页面。


8. 执行 JavaScript：如果页面中有 JavaScript 代码，浏览器会在文档解析过程中执行它。JavaScript 代码通常会在 HTML 中的 `<script>` 标签内被嵌入或通过外部文件引入。（可能会修改 DOM 或 CSSOM，导致**重排和重绘**，影响浏览器解析和渲染性能。）
9. 事件监听与交互：一旦页面**初始渲染**完成，用户可以与页面进行交互。浏览器会监听用户输入、鼠标点击、键盘事件等，并相应地触发 JavaScript 代码进行处理。

![](.\images\浏览器渲染流程图.jpg)

**(5) 触发重绘和重排**

1. 添加、删除、更新 DOM 节点
2. 通过 `display: none` 隐藏一个 DOM 节点，触发重排和重绘
3. 通过 `visibility: hidden` 隐藏一个 DOM 节点，只触发重绘，因为没有几何变化
4. 移动或者给页面中的 DOM 节点添加动画
5. 添加一个样式表，调整样式属性
6. 用户行为，例如调整窗口大小，改变字号，或者滚动

### 2) 输入 URL 到页面渲染完成❗⭐

**(1) HTTP 请求**

1. 解析 `URL`
   1. 非 `URL`格式：构造搜索引擎请求，进行检索
   2. 合法 `URL`：通过 `IPC` 通信，将 `URL` 发给网络进程发起请求


2. 生成 `HTTP` 请求报文

**(2) 地址查询—DNS**

1. 检查浏览器缓存
2. 操作系统，`hosts` 文件
3. 本地 DNS，问根域—顶级域—权威域

**(3) 建立连接**

1. HTTP：TCP 三次握手
   1. 客户端和服务端 `CLOSE`
   2. 服务端 `LISTEN`
   3. 客户端发送 `SYN=client_isn`，处于 `SYN_SENT`
   4. 服务端返回 `ACK=client_isn+1` 和 `SYN=server_isn`，处于 `SYN_RECEIVED`
   5. 客户端返回 `ACK=server_isn+1`，处于 `ESTABLISED`
   6. 服务端接受，处于 `ESTABLISED`
2. HTTPS：先验证证书合法性，再进行 TLS 握手建立加密连接
3. WebSocket
3. 远程定位 IP：生成 IP 报文，源 IP 地址、目标 IP 地址、 协议
4. 两点传输：生成 MAC 报文，发送方、接收方 MAC 地址，协议
5. 经历网卡、交换机、路由器
6. 服务器响应资源：请求经过多层网络协议到达服务器（或 CDN、代理）


**(4) 服务器响应**

1. 解析响应头
  - 网络进程解析响应头，若含 `Location` 字段，则重定向（如 `HTTP` → `HTTPS`）。
  - 判断 `Content-Type`，决定交由哪个进程处理，若是 HTML，则交由渲染进程。
2. 提交文档流程
  - 网络进程发送“提交文档”给主进程 → 主进程通知渲染进程准备接收数据。
  - 渲染进程建立通道接收资源，准备完成后通知主进程开始页面切换。
3. 页面卸载与替换
  - 页面触发 `beforeunload` 事件（如用于表单离开确认）。
  - 若无阻止操作，浏览器直接加载新页面。
4. 连接断开：资源加载完毕后，触发 TCP 四次挥手，关闭连接。

**(5) 浏览器渲染**

![](.\images\浏览器渲染图.jpg)

**6) 页面完成渲染**

1. 触发 `DOMContentLoaded`：DOM 就绪
2. 触发 `Load`：所有资源加载完毕
3. 用户可交互，页面完整显示

## 四、`SEO`

### `SPA` 和 `MPA`

（1）`SPA`（*Single Page Application*，单页面应用）

通过 JS 去感知到 `URL` 的变化，动态的将当前页面的内容清除掉，然后将下一个页面的内容挂载到当前页面上。路由由前端来做，动态显示需要的组件。

优点：

1. **页面切换速度快**：路由跳转是基于特定的实现（如 `vue-router`，`react-router` 等前端路由），而非原生浏览器的文档跳转，避免了不必要的整个页面重载。
2. **前后端分离**：基于前端路由，`SPA` 与应用后端解耦，使得前端不再依赖于后端的路由分配。

缺点：首屏时间慢、`SEO` 不友好，导航需要自己去实现前进后退。

解决：

1. `SSR` 服务端渲染

2. 预渲染：无需服务器实时动态编译，采用预渲染，在构建时针对特定路由简单的生成静态 HTML 文件。本质就是客户端渲染, 只不过和 `SPA` 不同的是预渲染有多个界面。


（2）`MPA`（*multiple page application*，多页应用）

1. 首屏速度快：每个请求都直接返回 HTML，各个页面相互独立，需要单独维护。
2. 切换页面比较慢
3. `SEO` 友好

### `CSR` 和 `SSR`

（1）`CSR`（*Client Side Rendering*，客户端渲染）

在浏览器上执行 JavaScript 以生成 DOM 并显示内容的渲染方法。`Vue` 和 `React` 默认使用 `CSR`。

1. 减少服务器负载，只需要接收请求和发送数据，不需要渲染HTML；
2. 首屏加载时间长。

![](.\images\CSR.jpg)

（2）`SSR`（*Server Side Rendering*，服务器端渲染）

开发者喜欢使用 `JSP` 或其他模板渲染引擎来构建应用。与客户端渲染不同，`SSR` 输出的是渲染完整的 HTML，整个渲染过程在服务器端进行。

1. 更快的首屏加载时间、利于 `SEO`
2. 服务器负荷较重、页面切换等待时间长

> 早期的 `SSR` 在内容更新/跳转，都需要再次请求服务器，重新加载一次页面。
>
> 但在 `React`、`Vue` 等框架的加持下，我们语境中的 `SSR` 一般指的是首屏服务端渲染或同构渲染（*Isomorphic render*），即新开页面访问 `SSR` 应用时，首屏会返回完整的 HTML，浏览器通[注水]成为`React` 或 `Vue` 应用，后续用户进行跳转等操作时不会再向服务端请求 HTML，而是以类似单页应用的方式进行。

![](.\images\脱水和注水.jpg)

### `SSG` 和 `ISR`

（1）`SSG`（*Static Site Generation*，静态站点生成）

与 `SSR` 的原理非常类似，但不同之处在于 HTML 文件是预先生成的，而不是在服务器实时生成。适用于静态页面，例如文档、博客、帮助站点和电子商务产品。

优点：性能高、`SEO`友好、易于部署、高安全性

缺点：适合静态页面

![](.\images\SSG.jpg)

（2）`ISR`（*Incremental Static Regeneration*，增量式网站渲染）

结合了`SSG` 和 `SSR` 的优势。`ISR` 的核心思想是将部分静态页面在构建时生成，并在用户访问时进行增量更新。

优点：

1. 对于不经常变动的内容，通过 `SSG` 生成完全静态的页面，实现快速加载和低服务器负载。
2. 对于可能需要频繁更新的部分，`ISR` 可以使用 `SSR` 来动态生成这些内容，并在后续的请求中进行增量更新，从而保持页面的实时性。

缺点：

1. 访问到没被预渲染过的次要内容触发 `fallback`，需要进行 `CSR`，加载较慢。
2. 访问到之前被预渲染过，但已经过期且未更新的页面，会得到过期的缓存响应。用户刷新一次，才能看到新的数据。

### `SEO`

`SEO`（*Search Engine Optimization*，搜索引擎优化）：利用搜索引擎的搜索规则来提高网站在有关搜索引擎内的自然排名。

原理：爬行和抓取—索引—搜索词处理—排序

优化：

1. 内部优化
   1. `<meta>` 优化：`title | keywords | description `（TDK）等的优化
   2. `SSR`
   3. 内部链接的优化、网站内容更新
2. 外部优化
   1. 相关信息网等尽量保持链接的多样性
   2. 每天添加一定数量的外部链接，稳定提升关键词排名
   3. 与一些相关、质量好的网站交换友情链接，稳定关键词排名

> 1. PV（页面访问量）：即页面浏览量或点击量，用户每1次对网站中的每个网页访问均被记录1个PV。用户对同一页面的多次访问，访问量累计，用以衡量网站用户访问的网页数量。
>
>
> 2. UV(独立访客)：是指通过互联网访问、浏览这个网页的自然人。访问网站的一台电脑客户端为一个访客。
