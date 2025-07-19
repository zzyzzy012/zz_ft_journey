# HTML+CSS不常用知识点

## web components

`Web Components` 是一组 Web 平台 API，允许开发者创建封装性强、可重用的组件，这些组件可以在任何 Web 应用程序中使用。

- **封装性**：借助 *Shadow DOM* 实现结构与样式隔离，避免冲突
- **重用性**：通过自定义元素定义新标签，支持生命周期，可多次复用
- **标准化**：无需依赖框架，兼容各种前端技术

1. 自定义元素（*Custom Elements*）：允许开发者定义新的 HTML 元素及其行为。这些自定义元素可以像内置元素一样被使用，并且支持生命周期回调函数。
2. 模板（*Templates*）：`<template>` 元素用于定义可以重复使用的 HTML 结构。模板中的内容在被使用时才会被实例化和插入到 DOM 中，从而提高性能和重用性。
3. *Shadow DOM*：允许将组件的内部结构和样式封装在一个独立的 DOM 子树中，这样可以避免样式和脚本的冲突。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Web Components Example</title>
    <script>
        class MyElement extends HTMLElement {
            constructor() {
                super();
                const shadow = this.attachShadow({ mode: 'open' });
                shadow.innerHTML = `<style>p { color: red; }</style><p>Hello, Web Components!</p>`;
            }
        }
        customElements.define('my-element', MyElement);
    </script>
</head>
<body>
    <my-element></my-element>
</body>
</html>
```

## 点击回到顶部的功能

1. `<a>` 锚点：标签设置 `id`，`<a>` 标签的 `href` 设置 `#id`

```html
<body style="height:2000px;">
    <div id="topAnchor"></div>
    <a href="#topAnchor" style="position:fixed;right:0;bottom:0">回到顶部</a>
</body>
```

2. `scrollTop`：表示被隐藏在内容区域上方的像素数。

```html
<body style="height:2000px;">
    <button id="test" style="position:fixed;right:0;bottom:0">回到顶部</button>
    <script>
        test.onclick = function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    </script>
</body>
```

3. `scrollTo(x,y)`：滚动当前 `window` 中显示的文档，由坐标 `x` 和 `y` 指定的点位于显示区域的左上角。

```html
<body style="height:2000px;">
    <button id="test" style="position:fixed;right:0;bottom:0">回到顶部</button>
    <script>
        test.onclick = function(){
            scrollTo(0,0);  // 回到顶部
        }
    </script>
</body>
```

4. `scrollBy(x,y)`：滚动当前 `window` 中显示的文档，`x` 和 `y` 指定滚动的相对量。

```html
<body style="height:2000px;">
    <button id="test" style="position:fixed;right:0;bottom:0">回到顶部</button>
    <script>
        test.onclick = function(){
            var top = document.body.scrollTop || document.documentElement.scrollTop
            // 只要把当前页面的滚动长度作为参数，逆向滚动，则可以实现回到顶部的效果
            scrollBy(0,-top);
        }
    </script>
</body>
```

5. `Element.scrollIntoView()`：滚动当前元素，进入浏览器的可见区域。接受布尔值作为参数，前提是当前区域可滚动。
   1. `true`：默认，表示元素的顶部与当前区域的可见部分的顶部对齐
   2. `false`：表示元素的底部与当前区域的可见部分的尾部对齐

> 该方法的原理与锚点类似，在页面最上方设置目标元素，当页面滚动时，目标元素被滚动到页面区域以外，点击回到顶部按钮，使目标元素重新回到原来位置。

```vue
<body style="height:2000px;">
    <div id="target"></div>
    <button id="test" style="position:fixed;right:0;bottom:0">回到顶部</button>
    <script>
        test.onclick = function(){
            target.scrollIntoView();
        }
    </script>
</body>
```

## 浏览器乱码

1. 乱码原因
   1. 字符编码不一致：浏览器解析网页时使用的编码，与网页实际编码不一致，就会乱码。如浏览器默认使用 `GBK`，而网页用的是 `UTF-8`。
   2. 未声明编码：HTML 文件未在 `<head>` 中声明编码，浏览器猜错编码就会乱码。
2. 解决办法
   1. 统一使用 `UTF-8` 编码
      1. 编辑器设置为 `UTF-8` 编码保存文件
      2. 服务器响应头中设置为 `UTF-8`，`Content-Type: text/html; charset=UTF-8`
   2. 在 HTML 中正确声明编码（必须放在 `<head>` 最前面）

## 预解析

文档预解析（*Document Preprocessing*）：在浏览器开始解析和渲染 HTML 文档之前，对文档进行的一系列处理。

主要目的：优化加载时间、降低服务器负载、提高安全性、增强兼容性

常见的预解析技术

1. `HTML Minification`：在服务器端对 HTML 文件进行压缩，去除不必要的空格、换行符和注释，减小文件大小。
2. 模板编译：将客户端模板（如 Vue 组件）预编译成 JS 代码，减少客户端的编译负担。
3. 资源预加载：使用 `<link rel="preload">` 或 `<link rel="prefetch">`，提前加载可能会在后续渲染中用到的资源（如脚本、样式表）。
4. DOM 预处理：对文档结构进行优化，如将复杂的 DOM 操作预处理成更高效的结构。
5. 延迟加载：对资源（如图片）使用延迟加载技术。

> 1. 渐进增强（*progressive enhancement*）：针对低版本的浏览器进行页面重构，保证基本的功能情况下，再针对高级浏览器进行效果，交互等方面的改进和追加功能。
> 2. 优雅降级（*graceful degradation*）：一开始就构建完整的功能，然后再针对低版本的浏览器进行兼容。

## 页面白屏

页面白屏时间：从屏幕空白到显示第一个界面的时间。

白屏优化

1. 减少关键请求资源
2. 资源懒加载
3. 提前加载关键资源，使用 `<link rel="preload">` / `<link rel="dns-prefetch">`
4. JS 异步加载，用 `defer` / `async`，避免阻塞渲染
5. 服务端优化，使用 `SSR` / `SSG` 缩短响应时间
6. 使用缓存，本地缓存、CDN 加速、`Service Worker` 预缓存
7. 使用 `Skeleton Screen` 骨架屏

## 多个Tab页共用渲染进程

很多标签页都是单独一个进程，**同源、环境一致**的页面可能复用同一个渲染进程，以提升性能并便于窗口间通信。

（1）风险

1. 一个页面崩溃，其他共用进程页面也受影响。
2. 存在安全隐患：新页面可通过 `window.opener` 操作父页面，易被恶意脚本利用。

（2）同一个渲染进程触发方式及解决方式

1. 采用 `<a>` 标签跳转，如果调整的是同源页面，会出现。给 `<a>` 标签加上 `rel="noopener norefferrer"` 属性来保证不同页面使用不同的进程。

```html
<a href="http://www.baidu.com"></a>
```

2. 使用 `window.open` 打开相同站点

```js
window.open("http://www.baidu.com")
```

```js
let newWin = window.open("http://my.dome.com")
newWin.opener = null
```

3. 页面中采用 `<iframe>` 框架引入其他页面，`<iframe>` 会独立成辅助框架，有自己的渲染进程，如果同源会采用同一个渲染进程。

## 图片加载与渲染规则

（1）图片加载和渲染的时机（套用浏览器渲染页面的机制）

1. 解析HTML时，如果遇到 `<img>` 或 `<picture>` 标签，将会加载图片
2. 解析加载的样式，遇到 `background-image` 时，并不会加载图片，而会构建样式规则树
3. 加载并执行 JavaScript 代码，如果代码中有创建 `<img>` 元素之类，会添加到 DOM 树中；如有添加 `background-image` 规则，将会添加到样式规则树中
4. DOM 树和样式规则匹配时构建渲染树，如果 DOM 树节点匹配到样式规则中的 `backgorund-image`，则会加载背景图片
5. 计算元素（图片）位置进行布局
6. 开始渲染图片，浏览器将呈现渲染出来的图片

（2）图片加载与渲染规则

1. `<img>`、`<picture>` 和设置 `background-image` 的元素遇到 `display:none` 时，图片会加载但不会渲染。
2. `<img>`、`<picture>` 和设置 `background-image` 的元素祖先元素设置 `display:none` 时，`<img>` 和 `<picture>` 引入的图片会加载但不会渲染；而 `background-image` 不会加载也不会渲染。
3. `<img>`、`<picture>` 和 `background-image` 引入相同路径相同图片文件名时，图片只会加载一次。
4. 样式文件中 `background-image` 引入的图片，如果匹配不到 DOM 元素，图片不会加载。
5. 伪类引入的 `background-image`，比如 `:hover`，只有当伪类被触发时，图片才会加载。

## 获取浏览器大小

1. `window.innerHeight`：获取浏览器视觉视口高度（包括垂直滚动条）。
2. `window.outerHeight`：获取浏览器窗口外部的高度。表示整个浏览器窗口的高度，包括侧边栏、窗口镶边和调正窗口大小的边框。
3. `window.screen.Height`：获取获屏幕取理想视口高度，这个数值是固定的，设备的分辨率 / 设备像素比。
4. `window.screen.availHeight`：浏览器窗口可用的高度。
5. `document.documentElement.clientHeight`：获取浏览器布局视口高度，包括内边距，但不包括垂直滚动条、边框和外边距。
6. `document.documentElement.offsetHeight`：包括内边距、滚动条、边框和外边距。
7. `document.documentElement.scrollHeight`：在不使用滚动条的情况下适合视口中的所有内容所需的最小高度。测量方式与 `clientHeight` 相同，它包含元素的内边距，但不包括边框，外边距或垂直滚动条。

## 字体相关

（1）让 Chrome 支持 `< 12px` 的文字

1. 使用 `transform` 的 `scale`
2. 使用 `zoom`，并非所有浏览器支持
3. 使用 `-webkit-text-size-adjust`：将容器或文本元素该设置为 `none` 或 `auto` 可以控制 Chrome 浏览器对文本大小的调整行为。
   - 设置为 `none`，可以禁用 Chrome 浏览器的最小字体大小限制。这是针对 `WebKit` 内核（包括 Chrome 和 Safari）的私有属性。

```css
.small-text {
  transform: scale(0.8);
}

.small-text {
  zoom: 0.8;
}

.small-text {
  -webkit-text-size-adjust: none;
}
```

（2）单行文本两端对齐

1. `text-align: justify;` ：`justify` 对最后一行无效。可以新增一行，使该行文本不是最后一行。通过创建**空伪元素。**
2. `text-align-last` ：一段文本中最后一行在被强制换行之前的对齐规则。

（3）两个同级的相邻元素之间，有看不见的空白间隔。

> 如果相邻元素有空格，空格也属于字符，会占据空间大小，造成空白间隔。

1. 在父级元素中用 `font-size:0;`
2. 浮动元素 `float:left;`
3. 相邻元素代码代码全部写在一排

## 层叠上下文

`z-index` 存在的一个背景是层叠上下文 （*Stacking Context*）。

![](.\images\层叠上下文.jpg)

（1）层叠上下文是**可以嵌套**的。

1. `<html>` 元素的第一级层叠上下文。
2. 特定样式的元素可以产生新的层叠上下文，且 `z-index` 的值在这些元素中才有效。
3. 子层叠上下文的高度被限制在了父层叠上下文中。
4. 在同级层叠上下文中，没有（有效） `z-index` 的元素依然遵循上一小节的规律；`z-index` 值相同的元素遵循后来者居上原则。

（2）`z-index` 失效情况

1. 元素设置 `position` 属性为 `static` 属性。
2. 当父元素 `position: relative;` 且设置了 `z-index` 创建堆叠上下文时，子元素的 `z-index` 受限于父元素的层级。
3. 浮动元素若未设置 `position: relative/absolute/fixed/sticky;`，`z-index` 无效。
4. 在 iOS 13 的 Safari 中，`-webkit-overflow-scrolling: touch;` 可能导致 `z-index `异常。将 `-webkit-overflow-scrolling` 设置为 `unset`。

## 单位

### （1）相对单位

1. `ex` 和 `ch`：都是排版用的单位，它们的大小取决于元素的 `font-size` 和 `font-family` 属性
   1. `ex`：指的是所用字体中小写字母 `x` 的高度
   2. `ch`：基于数字 `0` 的宽度计算的

### （2）绝对单位

1. `pc`（*Picas*，派卡）：相当于我国新四号铅字的尺寸，印刷术语
2. `cm`（*Centimeters*，厘米）
3. `mm`（*Millimeters*，毫米）
4. `in`（*Inches*，英寸）：一般用英寸描述屏幕的物理大小，**屏幕对角线的长度**

```
1pc = 12pt
1pc=16px
1cm = 37.8px
1mm = 3.78px
1in = 96px
```

### （3）分辨率单位⭐

> 分辨率单位都是正值，不允许为负值。主要用于**媒体查询**等操作。

1. 屏幕分辨率：一个屏幕具体由多少个像素点组成。分辨率高不代表屏幕就清晰，屏幕清晰度还与**尺寸**有关。
2. 图像分辨率：指图片含有的像素数，同一尺寸的图片，分辨率越高，图片越清晰。
3. `PPI`（*Pixel Per Inch*）：每英寸包括的像素数，可用于描述屏幕清晰度以及图片质量。
4. `DPI`（*dot per inch*）：每英寸包含的点的数量。这里的点是一个抽象单位，它可以是**屏幕像素点、图片像素点也可以是打印机的墨点。**
   1. `DPI` 来描述图片和屏幕，这时的 `DPI` 和 `PPI` 应该是等价的
   2. `DPI` 最常用的是用于描述打印机，表示打印机每英寸可以打印的点数
5. `DPCM`（*dot per centimeter*）：表示每厘米包含的点的数量。
6. `DPPX`（*dots per pixel*）：表示每像素 `px` 包含点的数量。它对应于由图像分辨率定义的 CSS 中显示的图像的默认分辨率。

Retina Display（视网膜屏幕）同一大小包含更多像素，显示更清晰。

由于手机尺寸为手机对角线的长度，计算 `PPI` 公式：

![](.\images\PPI计算.jpg)

```js
1dppx = 96dpi
1dpi ≈ 0.39dpcm
1dpcm ≈ 2.54dpi
```

```css
@media screen and (min-resolution: 96dpi) { ... }
@media print and (min-resolution: 300dpi) { ... }
```

**① 移动端开发**

在 `iOS`、`Android` 和 `React Native` 开发中样式单位使用的是设备独立像素 `DP`。

`iOS` 的尺寸单位为 `pt`，`Android` 的尺寸单位为 `DP`，`React Native` 中没有指定明确的单位，它们其实都是设备独立像素 `DP`。

**② WEB端开发**

用的比较多的单位是 `px`，即 CSS像素，当页面缩放比例为 `100%` 时，一个 CSS 像素等于一个设备独立像素 `DP`。

但是 CSS 像素很容易被改变，当用户对浏览器进行了放大，CSS 像素会被放大，这时一个 CSS 像素会跨越更多的物理像素。

页面的缩放系数 = CSS像素 / 设备独立像素，更准确点应该是—页面的缩放系数 = 理想视口宽度 / 视觉视口宽度

用户的缩放操作会改变 `DPR`，所以设备 `DPR` 是在默认缩放为 `100%` 的情况下定义的。

![](.\images\改变DPR.jpg)

### （4）`DPR`

**① 获取 `DPR`**

```css
@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2){ 
	/* 区分 DPR 上面代码表示 DPR = 2 */
}
```

```js
const dpr = window.devicePixelRatio;
console.log(dpr); // 输出设备的 DPR
```

```jsx
// 在React Native中，使用 PixelRatio.get() 来获取 DPR
PixelRatio.get()
```

**② `DPR` 应用场景**

1. 图片适配

```html
<img
    src="image.png"
    srcset="image@2x.png 2x, image@3x.png 3x"
    alt="Example Image"
/>
```

2. CSS 适配：使用 `@media` 查询为高 `DPR` 设备设置不同的样式。

```css
.icon {
    background-image: url('icon.png');
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .icon {
        background-image: url('icon@2x.png');
    }
}
```

3. `Canvas` 绘图：在高 `DPR` 设备上绘制高清 `Canvas`。

```js
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio;

canvas.width = 300 * dpr;
canvas.height = 150 * dpr;
ctx.scale(dpr, dpr);
```

### （5）视口

视口（*viewport*）：当前可见的计算机图形区域。在 `Web` 浏览器术语中，通常与浏览器窗口相同，但不包括浏览器的 `UI`， 菜单栏等，指你正在浏览的文档的那一部分。

1. 布局视口（*Layout Viewport*）：整个文档的布局区域
   1. 在 `PC` 端，布局视口就等于当前浏览器的窗口大小，不包括 `borders` 、`margins`、工具栏、滚动条
   2. 在移动端，布局视口被赋予一个默认值，大部分为 `980px`，这保证 `PC` 的网页可以在手机浏览器上呈现，但是非常小，用户可以手动对网页进行放大
   3. `document.documentElement.clientWidth / clientHeight`：获取布局视口大小
2. 视觉视口（*Visual Viewport*）：用户通过屏幕真实看到的区域
   1. 视觉视口默认等于当前浏览器的窗口大小（包括滚动条宽度）
   2. 当用户对浏览器进行缩放时，不会改变布局视口的大小，所以页面布局是不变的，但是缩放会改变视觉视口的大小
   3. `window.innerWidth / innerHeight`：获取视觉视口大小
3. 理想视口（*Ideal Viewport*）：网站页面在移动端展示的理想大小
   1. 页面的缩放系数 = 理想视口宽度 / 视觉视口宽度
   2. 当页面缩放比例为 `100%` 时，CSS 像素 = 设备独立像素，理想视口 = 视觉视口
   3. `screen.width / height`：获取理想视口大小
4. 关系：布局视口决定 CSS 布局，视觉视口决定用户看到的内容，理想视口优化移动端适配

### （6）其他单位

1. 频率单位：赫兹 `Hz` 和千赫兹 `kHz`

> 频率单位使用在听或说级联样式表中。频率可以被用来改变一个语音阅读文本的音调。低频率就是低音，高频率就是高音。
>
> 当数值为 `0` 时，单位对值没有影响，但是单位是不能省略的。也就是说 `0`、`0Hz`、`0kHz` 是不一样的。所以，在使用频率单位时，不要直接写 `0` 。另外，这两个单位是不区分大小写的。

手写动画的最小时间间隔：多数显示器默认频率是 `60Hz`，即 `1秒` 刷新 `60次`，所以理论上最小间隔为 `1/60＊1000ms ＝ 16.7ms`。

2. 时间单位：秒 `s` 和毫秒 `ms`

```js
1kHz = 1000Hz
1s = 1000ms
```

3. 角度单位：CSS中常用于旋转、线性渐变
   1. `deg`（*Degrees*）：360 度
   2. `grad`（*Gradians*）：表示梯度，一个圆总共 400 梯度
   3. `rad`（*Radians*）：表示弧度，一个圆总共 2π 弧度
   4. `turn`（*Turns*）：表示圈 / 转，一个圆总共一圈 / 转

```js
90deg = 100grad = 0.25turn ≈ 1.570796326794897rad
```

```css
transform: rotate(2deg);
background: linear-gradient(45deg, #000, #fff);
```

## 响应式布局

（1）JS 检测横屏：`window.orientation` 获取屏幕旋转方向

```js
window.addEventListener("resize", ()=>{
    if (window.orientation === 180 || window.orientation === 0) { 
      // 正常方向或屏幕旋转180度
        console.log('竖屏');
    };
    if (window.orientation === 90 || window.orientation === -90 ){ 
       // 屏幕顺时钟旋转90度或屏幕逆时针旋转90度
        console.log('横屏');
    }  
}); 
```

### 适配 `iphoneX`

（1）安全区域

> 在 `iPhoneX` 发布后，许多厂商推出了具有边缘屏幕的手机。这些手机在外观上有：圆角（*corners*）、刘海（*sensor housing*）、小黑条（*Home Indicator*）。

安全区域就是一个不受上面三个效果的可视窗口范围。

（2）`viewport-fit`

`viewport-fit`：限制网页如何在安全区域内进行展示。

1. `auto`：默认，和 `contain` 效果相同
2. `contain`：可视窗口完全包含网页内容
3. `cover`：网页内容完全覆盖可视窗口

![](.\images\contain和cover.jpg)

（3）`env`、`constant`

我们需要将顶部和底部合理的摆放在安全区域内，`iOS11` 新增了两个 `CSS` 函数 `env`、`constant`，用于设定安全区域与边界的距离。

1. `safe-area-inset-left` 安全区域距离**左边**边界距离
2. `safe-area-inset-right` 安全区域距离**右边**边界距离
3. `safe-area-inset-top` 安全区域距离**顶部**边界距离
4. `safe-area-inset-bottom` 安全区域距离**底部**边界距离

> 注意：必须指定 `viweport-fit` 才能使用这两个函数。

```html
<meta name="viewport" content="viewport-fit=cover">
```

`constant` 在 `iOS < 11.2` 的版本中生效，`env` 在 `iOS >= 11.2` 的版本中生效，这意味着我们往往要同时设置他们，将页面限制在安全区域内。

```css
/* 当使用底部固定导航栏时，要为他们设置 padding 值 */
body {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### `1px` 问题

在 `DPR > 1` 的屏幕上，我们写的 `1px` 实际上是被多个物理像素渲染，从而出现 `1px` 在有些屏幕上看起来很粗的现象。

1. 使用 `border: 0.5px solid`，现代浏览器支持

```css
.divider {
  border-bottom: 0.5px solid #ccc;
}
```

2. 使用图片 `border / background-image` 模拟 `1px` 线（不能很好适配圆角、渐变、动态颜色）

```css
.border_1px {
  border-bottom: 1px solid #000;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_1px {
    border-bottom: none;
    border-image: url(../img/1pxline.png) 0 0 2 0 stretch;
    /* 或者使用 background 模拟 */
    /* background: url(../img/1pxline.png) repeat-x left bottom; */
    /* background-size: 100% 1px; */
  }
}
```

3. 伪元素 + `transform: scaleY()` 压缩线条高度

```css
.border_1px:before {
  content: '';
  position: absolute;  /* 需要给 .border_1px 设置 position: relative; */
  top: 0;
  height: 1px;
  width: 100%;
  background-color: #000;
  transform-origin: 50% 0;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_1px:before {
    transform: scaleY(0.5); /* 压缩成 0.5px 实际效果 */
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .border_1px:before {
    transform: scaleY(0.33);
  }
}
```

4. `PostCSS` + SVG 技术生成 `1px border`

```css
@svg border_1px {
  height: 2px;
  @rect {
    fill: var(--color, black);
    width: 100%;
    height: 50%;
  }
}
.example {
  border: 1px solid transparent;
  border-image: svg(border_1px param(--color #00b1ff)) 2 2 stretch;
}
```

编译后：

```css
.example {
  border: 1px solid transparent;
  border-image: url("data:image/svg+xml;...") 2 2 stretch;
}
```

### 实现一个宽高自适应的正方形

1. 利用 `vw` 或 `vh` 单位

```css
.square {
    width: 50vw;              /* 宽度为视口宽度的 50% */
    height: 50vw;             /* 高度与宽度相同 */
    background-color: lightgreen;
}
```

2. `aspect-ratio: <width> / <height>;`：设置元素宽高比，`aspect-ratio` 设置宽高比为 `1:1`

```css
.square {
    width: 100%;              /* 宽度自适应 */
    aspect-ratio: 1 / 1;      /* 宽高比 1:1 */
    background-color: lightcoral;
}
```

3. 利用**内边距百分比是相对于宽度计算**特性，宽度为 `100%`，高度通过**内边距撑开**。

```css
.square {
    width: 100%;              /* 宽度自适应 */
    padding-top: 100%;        /* 高度等于宽度 */
    background-color: lightblue;
    position: relative;
}
```

### 精灵图&二倍图&字体图标

（1）精灵图

精灵图（*CSS Sprite*）：将多个小图片合并成一张大图片，并通过 `background-position` 来显示小图的优化技术，主要用于减少 HTTP 请求，提高网页加载速度。

使用 `background-image` 设置精灵图，并通过 `background-position` 调整可见部分。

`background-position: x y;`

1. `x` 轴（横向）：正值向右，负值向左
2. `y` 轴（纵向）：正值向下，负值向上

```html
<div class="sprite icon-home"></div>
<div class="sprite icon-search"></div>
<div class="sprite icon-user"></div>
<div class="sprite icon-settings"></div>
```

```css
.sprite {
    background-image: url('sprite.png'); /* 统一设置背景图 */
    background-repeat: no-repeat; /* 禁止重复 */
    display: inline-block;
    width: 50px; /* 设置单个图标宽高 */
    height: 50px;
}

/* 具体图标 */
.icon-home { background-position: 0 0; }
.icon-search { background-position: -50px 0; }
.icon-user { background-position: -100px 0; }
.icon-settings { background-position: -150px 0; }
```

> 缺点：修改难度高、无法直接调整单个图标的大小、不适用于动态加载的图像
>
> 适用场景：按钮、导航栏、小图标（如社交媒体、菜单）
>
> 替代方案：SVG Sprite、Icon Font（字体图标）

（2）二倍图（@2x）

二倍图（@2x）：图片尺寸是**设计稿尺寸的 2 倍**，但**显示时缩小一半**，是为高分辨率屏幕（如 Retina 屏幕）优化的图片。主要用于避免图片模糊，提高清晰度。

① 标准分辨率屏幕

1. `1x` 屏幕（普通屏幕）：`DPR = 1`
2. `2x` 屏幕（Retina 屏幕）：`DPR = 2`
3. `3x` 屏幕（部分高端手机屏幕）：`DPR = 3`

② 二倍图的优化

1. `SVG` 替代位图，是矢量图，缩放不失真
2. `WebP` 替代 `PNG`：`WebP` 体积小、加载快，适用于高清图像，兼容性好，现代浏览器支持

```html
<img src="icon.svg" width="100" height="100" alt="矢量图">
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="WebP 优化">
</picture>
```

（3）`Icon Font`

`Icon Font`：使用字体代替图片，每个图标是一个字符

常见库有：`Font Awesome`（最流行）、阿里巴巴 `iconfont`（国内流行）

① 使用原理 `@font-face` 定义一个新的字体

1. `font-family`：为载入的字体取名字
2. `src`
   1. `url` 加载字体，可以是相对路径，可以是绝对路径，也可以是网络地址
   2. `format` 定义的字体的格式，用来帮助浏览器识别，值 `truetype(.ttf)`、`opentype（.otf）`、`truetype-aat`、`embedded-opentype(.eot)`、`svg(.svg)`、`woff(.woff)`。
3. `font-weight`：定义加粗样式
4. `font-style`：定义字体样式

```css
@font-face {
  font-family: <YourFontName>;
  src: <url> [<format>],[<source> [<format>]], *;
  [font-weight: <weight>];
  [font-style: <style>];
}
```

② 使用方式

1. 使用第三方 CDN，以 `Font Awesome` 为例

```html
<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    /* 修改颜色和大小 */
    .fa-house {
    font-size: 30px;
    color: red;
		}
  </style>
</head>

<body>
  <i class="fa-solid fa-house"></i> Home
</body>
```

2. 使用阿里巴巴 `IconFont`
   1. 选择 `iconfont` 下载到本地
   2. 引入项目下面生成的 `fontclass` 代码
   3. 挑选相应图标并获取类名，应用于页面

```html
<link rel="stylesheet" href="./iconfont.css">
<!--注意路径问题，是引用在完整包里面的iconfont.css -->
<span class="iconfont icon-xxx"></span>
<!-- 获取类名，通过demo.html页面的第一行图标名字 -->
```

## 现代化函数或属性

### `calc()`

`calc()`：可以在 CSS 样式中进行动态的数学计算。

1. 支持 `+`、`-`、`*`、`/` 运算符，两边必须有空格
2. `+`、`-` 允许单位的混用，但 `*`、`/` 两边单位必须一致

```css
/* 1.响应式布局 */
.container {
  width: calc(100% - 40px); /* 宽度为 100% 减去 40px 的边距 */
}
/* 2.动态计算字体大小或间距 */
.header {
  font-size: calc(1rem + 2vw); /* 字体大小随着视口宽度的变化而动态调整 */
}
/* 3.定位元素 */
.box {
  position: absolute;
  top: calc(50% - 10px); /* 将元素垂直居中 */
}
```

### `object-fit`

`object-fit`：控制替换元素（如 `<img>`、`<video>` 等）在其容器中的**填充方式**

> 替换元素如何适应容器，常用于响应式布局和避免图片变形。

1. `fill`：默认值，拉伸图片填满容器，可能变形
2. `contain`：保持宽高比缩放，整个图片可见，可能留白
3. `cover`：保持宽高比裁剪，铺满容器，无留白
4. `none`：保持原始尺寸，不缩放
5. `scale-down`：根据图片和容器尺寸，选择 `none` 或 `contain` 中较小的显示方式

`object-position`：控制替换元素在容器中的对齐位置，配合 `object-fit` 使用

```css
img {
    object-fit: cover;
    object-position: left | right | top | bottom | center;
  	object-position: 20% 30%;  /* 表示水平和垂直偏移量 */
}
```

## 常见@语法规则

1. `@import`、`@font-face`、`@keyframes`、`@media`
2. `@charset`：定义 CSS 文件的字符编码，必须放在文件开头。
   1. `@charset "UTF-8";` 仅在外部 CSS 文件有效
3. `@supports`：检查浏览器是否支持某 CSS 特性。
   1. `@supports (display: grid) { .box { display: grid; } }` 优雅降级
4. `@namespace`：定义 XML 命名空间，用于 SVG 或 XML 选择器。
   1. `@namespace svg "http://www.w3.org/2000/svg";` 少用于普通 HTML
5. `@page`：控制打印样式。
   1. `@page { margin: 1cm; }` 定义页面边距，常用于 PDF 输出

## CSS三大特性

（1）继承性

① 可以继承的属性

1. 字体相关属性（完全可继承）：`font`、`font-family`、`font-size`、`font-style`、`font-variant`、`font-weight`
2. 文本相关属性（大部分可继承）：`color`、`text-align`、`line-height`、`letter-spacing`、`word-spacing`、`text-indent`、`text-transform`（控制大小写）、`direction`（文本书写方向）
3. 列表样式：`list-style`、`list-style-type`、`list-style-position`
4. 表格属性（部分可继承）：`caption-side`
5. 引号属性：`quotes`
6. 可见性控制：`visibility`
7. 其他也可继承的少数属性：`white-space`、`unicode-bidi`、`cursor`

② 不可继承的属性

1. 盒模型属性：`margin`、`padding`、`border`、`width`、`height`
2. 布局属性：`display`、`position` / `top` / `left` / `z-index`、`float` / `clear`、`overflow`
3. 背景属性：`background-color`、`background-image`、`background-position`、`background-size`、`background-repeat`、`background`
4.  文本装饰 & 垂直对齐：`text-decoration`、`vertical-align`
5. 视觉表现相关：`opacity`、`box-shadow`、`transform`、`transition`、`filter`
6. 表格属性：`border-collapse`、`border-spacing`、`empty-cells`、`table-layout`
7. 生成内容属性：`content`、`counter-increment`、`counter-reset`
8. 轮廓样式：`outline-style`、`outline-width`、`outline-color`、`outline`
9. 页面样式（用于打印）：`size`、`page-break-before`、`page-break-after`

## 架构

OOCSS（*Object-Oriented CSS*，面向对象的 CSS）

1. 减少对 HTML 结构的依赖
2. 增加样式的复用性

```css
// bad
.container-list ul li a {}
// good
.container-list .list-item {}
```

```html
<div>
  <p class="label label-danger"></p>
  <p class="label label-info"></p>
</div>
```

（1）BEM 是一个分层系统，对应 *block, element, modifier*，分别为块层、元素层、修饰符层。进阶版的 OOCSS，适合中小型网站。

1. 使用 `__` 两个下划线将块名称与元素名称分开
2. 使用 `--` 两个破折号分隔元素名称及其修饰符
3. 一切样式都是一个类，不能嵌套

```html
<div class="menu">
  <div class="menu__tab menu__tab--style1">tab1</div>
  <div class="menu__tab menu__tab--style1">tab2</div>
</div>
```

（2）SMACSS（*Scalable and Modular Architecture for CSS*）：是要编写模块化、结构化和可扩展的 CSS。它对项目中的 CSS 分为五大类

1. Base：默认属性样式重置，知名库为 `normalize.css`
2. Layout：布局样式
3. Modules：可复用模块的样式，比如一些列表展示
4. State：状态样式，比如按钮的置灰或高亮的展示
5. Theme：皮肤样式，比如有些网站具有换肤的功能

（3）ITCSS（*Inverted Triangle Cascading Style Sheets*，倒三角 CSS）：它基于分层的概念把我们项目中的样式分为七层

1. Settings: 项目样式变量，如主题色、字体等
2. Tools：工具类样式，比如定义一个函数，表示字数过多出现省略号等
3. Generic：重置和/或标准化样式、框大小定义等，对应的是 `normalize.css`
4. Base：重置浏览器元素属性默认值
5. Objects：维护 OOCSS 的样式
6. Components：公共组件样式
7. Trumps：让样式权重变得最高，实用程序和辅助类，能够覆盖三角形中前面的任何内容，唯一 `important! ` 的地方

（4）ACSS（*Atomic CSS*， 原子化 CSS）：是一种 CSS 架构方式，其支持小型、单一用途的类，其名称基于视觉功能。

> 原子化 CSS 框架：Tailwind CSS、`Windi CSS`、`UnoCSS`

```html
<style>
	/* 原子化类定义 */
  .text-white { color: white; }

  .bg-black { background-color: black; }

  .text-center { text-align: center; }

</style>

<!-- 原子化类使用 -->
<div class="text-white bg-black text-center">hello Atomic CSS</div>
```

（1）优缺点

优点

1. 更高的复用性：每个类都只包含一个样式，可以在多个组件或页面中复用，减少重复代码。
2. 更高的灵活性：由于每个类代表一个特定样式，开发者可以自由组合这些类来实现各种效果，无需频繁编写新样式。
3. 降低样式冲突：原子化 CSS 避免了命名空间冲突的问题，不需要担心不同组件之间的样式覆盖，因为每个类只包含一个特定的功能，不依赖上下文。
4. 更快速的构建和样式更新：在构建时无需重新定义类名，开发者可以直接在 HTML 中组合样式类，使得开发更高效。

缺点

1. 可读性差：大量短小的类名堆积在一起，可能会降低 HTML 的可读性，尤其是对于不熟悉代码的团队成员。
2. 依赖 HTML 类名：大量的样式依赖于 HTML 的类名，导致 HTML 和 CSS 之间的分离不再明显，这对代码的结构化有一定影响。
3. 学习曲线：原子化 CSS 需要开发者熟悉大量的短小类名和命名规则，例如 Tailwind CSS 的命名规则，可能对新手来说有一定的学习难度。

（2）适用场景：

1. 快速原型设计：可以快速迭代页面，不需要定义大量的样式。
2. 小型项目：项目简单、页面少的情况下，原子化 CSS 可以大大提升开发速度。
3. 组件库：在构建组件库时，可以使用原子类创建灵活、可组合的组件。

## 变量

（1）JS 操作变量

1. 检测浏览器是否支持 CSS 变量
2. 操作 CSS 变量的写法
3. 将任意值存入样式表

```js
const isSupported =
  window.CSS &&
  window.CSS.supports &&
  window.CSS.supports('--a', 0);

if (isSupported) {
  /* supported */
} else {
  /* not supported */
}

// 设置变量
document.body.style.setProperty('--primary', '#7F583F');

// 读取变量
document.body.style.getPropertyValue('--primary').trim();  // '#7F583F'

// 删除变量
document.body.style.removeProperty('--primary');

const docStyle = document.documentElement.style;

document.addEventListener('mousemove', (e) => {
  docStyle.setProperty('--mouse-x', e.clientX);
  docStyle.setProperty('--mouse-y', e.clientY);
});
```

## 预处理器⭐

1. Sass（*Syntactically Awesome Stylesheets*）：基于 Ruby 的 CSS 预处理器（最早），两种语法 SASS（缩进语法）和 SCSS。提供嵌套、变量、混合、继承等特性。
2. SCSS（*Sassy CSS*）：基于 Ruby 的 CSS 预处理器，Sass 的升级版，**完全兼容 CSS 语法**，更直观和主流。
3. Less（*Leaner CSS*）：基于 JS 的 CSS 预处理器，语法接近 CSS，学习成本低。提供变量、嵌套、混合和函数支持。
4. Stylus：基于 JS 的 CSS 预处理器，灵活性极高，语法简洁，支持省略分号和括号。
   1. 支持变量、`Mixin`、函数等功能
   2. 提供丰富的函数和动态计算
   3. 具有强大的插件系统
5. `PostCSS`：不是一种独立的 CSS 预处理器，而是一个 CSS 处理工具集合，可以通过各种插件扩展其功能。
   1. 它不像其他预处理器那样提供自己的语言，而是基于现有的 CSS 语法
   2. 可以用于转换 CSS 语法、提供自动前缀、压缩 CSS 代码、处理嵌套规则、优化图片等
   3. 高度可定制，可用作构建工具链的一部分

### less

1. 变量：`@variant` 定义变量，有作用域，先找当前 `{}`，找不到再去全局
2. 混合：定义好的样式通过加 `()`，类似函数调用，可以快速应用到下一个样式
3. 定义好的样式里面的具体样式通过 `styleName.attr()` 可以快速应用给其他元素
4. 取属性值 `styleName[attr2]`

```less
@width: 10px;

#header {
  width: @width;
}
```

```less
#bundle() {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
}

#header a {
  color: orange;
  #bundle.button();  // can also be written as #bundle > .button
}
```

```less
#colors() {
  primary: blue;
  secondary: green;
}

.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}

// outputs:
.button {
  color: blue;
  border: 1px solid green;
}
```

5. 嵌套：子元素可以写在父元素里面 `{}`，同级则用 `&`
   1. 对于伪类、伪元素选择器则用 `&` 选中
   2. `@` 规则的嵌套，直接嵌套

```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
}

.clearfix {
  display: block;
  zoom: 1;

  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```

```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media  (min-resolution: 192dpi) {
      background-image: url(/img/retina2x.png);
    }
  }
  @media (min-width: 1280px) {
    width: 800px;
  }
}

// outputs:
.component {
  width: 300px;
}
@media (min-width: 768px) {
  .component {
    width: 600px;
  }
}
@media (min-width: 768px) and (min-resolution: 192dpi) {
  .component {
    background-image: url(/img/retina2x.png);
  }
}
@media (min-width: 1280px) {
  .component {
    width: 800px;
  }
}
```

### less函数

**（1）内置函数**

1. 运算符：`+`、`-`、`*`、`/`
2. 颜色操作
   1. `darken($color, $amount)`：使颜色变暗
   2. `lighten($color, $amount)`：使颜色变亮
   3. `saturate($color, $amount)`：增加颜色的饱和度
   4. `desaturate($color, $amount)`：减少颜色的饱和度
   5. `adjust-hue($color, $degrees)`：调整颜色的色相
   6. `rgba($color, $alpha)`：为颜色添加透明度
3. 字符串操作
   1. `unit($value)`：返回值的单位
   2. `str-length($string)`：返回字符串的长度
   3. `str-index($string, $substring)`：返回子字符串的位置
   4. `to-upper-case($string)`：将字符串转换为大写
   5. `to-lower-case($string)`：将字符串转换为小写
4. 媒体查询操作： `media()` 函数来定义响应式设计中的媒体查询

```less
// 颜色操作
@color: #00bcd4;

@lightColor: lighten(@color, 10%); // 更亮的颜色
@darkColor: darken(@color, 10%);   // 更暗的颜色
@semiTransparent: rgba(@color, 0.5); // 半透明的颜色

// 字符操作
@string: "Hello, LESS!";
@stringLength: str-length(@string); // 12

@upper: to-upper-case(@string); // "HELLO, LESS!"
@lower: to-lower-case(@string); // "hello, less!"

// 媒体查询
@breakpoint: 768px;

@media-query: media(max-width: @breakpoint);
```

**（2）自定义函数**

自定义函数（`Mixin`）：通过参数传递来实现一些动态的样式计算，通常用于计算一些动态的值或者重复的样式逻辑

```less
// 1.定义一个计算圆角的函数
.rounded(@radius) {
  border-radius: @radius;
}

// 使用该函数
.button {
  .rounded(5px); // 设置圆角为 5px
}
```

```less
// 2.根据不同的值返回不同的颜色
// 定义一个自定义的颜色选择函数
.chooseColor(@color) {
  @selectedColor: @color == "primary" ? #3498db :
                  @color == "secondary" ? #2ecc71 :
                  #e74c3c; // 默认红色
  color: @selectedColor;
}

// 使用该函数
.button {
  .chooseColor("primary");  // 使用主色
}
```

```less
// 3.定义一个动态计算的函数
.calculatePadding(@padding) {
  padding: @padding * 2; // 将传入的 padding 值翻倍
}

// 使用该函数
.container {
  .calculatePadding(10px); // padding 为 20px
}
```

**（3）函数与条件语句**

支持使用 `@variable` 作为函数的参数，并结合条件语句来动态生成值

```less
@font-size: 16px;

.getFontSize(@size) {
  @calculated-size: @size > 20px ? @size : 20px;
  font-size: @calculated-size;
}

.button {
  .getFontSize(@font-size); // 如果 @font-size 小于 20px，则使用 20px
}
```

**（4）函数的作用域**

函数的作用域是局部的，函数内部的变量不会影响外部环境，函数的参数和局部变量只在函数内部有效

### `scss`

通过 `Live Sass Complier` 自动编译为 `css`，启动底部栏的 `Watch Sass` 按钮。

1. 单文件版

```
sass --watch index.sass index.css
```

2. 多文件版，通过文件夹 `input_folder:output_folder`

```
sass --watch ./scss:./css
```

1. 变量：`$main-color` 形式定义变量
2. 嵌套

```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}

nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
```

3. 混合：`@mixin name($attr: value)` 定义一系列属性，支持动态属性值

```scss
@mixin theme($theme: DarkGray) {
  background: $theme;
  box-shadow: 0 0 1px rgba($theme, .25);
  color: #fff;
}

.info {
  @include theme;
}
.alert {
  @include theme($theme: DarkRed);
}
.success {
  @include theme($theme: DarkGreen);
}

// CSS
.info {
  background: DarkGray;
  box-shadow: 0 0 1px rgba(169, 169, 169, 0.25);
  color: #fff;
}

.alert {
  background: DarkRed;
  box-shadow: 0 0 1px rgba(139, 0, 0, 0.25);
  color: #fff;
}

.success {
  background: DarkGreen;
  box-shadow: 0 0 1px rgba(0, 100, 0, 0.25);
  color: #fff;
}
```

4. 继承：`@extend %name` 继承 `%name` 定义的一系列 CSS 属性

```scss
/* This CSS will print because %message-shared is extended. */
%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.message {
  @extend %message-shared;
}

.success {
  @extend %message-shared;
  border-color: green;
}

.error {
  @extend %message-shared;
  border-color: red;
}

.warning {
  @extend %message-shared;
  border-color: yellow;
}
```

5. 通过 `@use` 导入其他 `.scss` 文件，作为模块化
6. 操作符：`+`, `-`, `*`
   1. `math.div()` 除法运算，避免 `/` 造成的歧义
   2. `%` 取模，计算两个数相除后的余数

```scss
// _base.scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}

// styles.scss
@use 'base';

.inverse {
  background-color: base.$primary-color;
  color: white;
}
```