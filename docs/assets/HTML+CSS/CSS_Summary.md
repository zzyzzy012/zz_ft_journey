# CSS八股知识点整理

## 一、CSS选择器

### 1) CSS基础选择器

1. 通配符选择器 `*`：选中页面上所有元素。
2. 元素/标签选择器
3. 类选择器 `.类名`：选中具有 `class` 属性的元素。
4. id 选择器 `#id名`：选中具有 `id` 属性的唯一元素。

```css
* {
    margin:0;
    padding:0;
}
p { color: blue; }
.box { width: 100px; }
#header { background: gray; }
```

### 2) 属性选择器

- 大小写不敏感
- 可与其他选择器（如标签、类）组合，如 `input[type="text"]`

(1) `[attribute]`

```html
<input type="text">
<input type="checkbox">
<button>Click</button>
```

```css
[type] {
  border: 2px solid red;
}
/* 所有带有 type 属性的元素（两个 <input>）有红边框，<button> 无影响 */
```

(2) `[attribute="value"]`

```html
<input type="text">
<input type="checkbox">
```

```css
[type="text"] {
  background: lightblue;
}
/* 仅 <input type="text"> 背景变浅蓝色 */
```

(3) `[attribute~="value"]`：单词匹配（值需是以空格分隔）

```html
<div class="box item"></div>
<div class="box-item"></div>
```

```css
[class~="item"] {
  color: green;
}
/* 仅 <div class="box item"> 文字变绿，因为 item 是独立单词，box-item 不匹配 */
```

(4) `[attribute|="value"]`：连字符前缀匹配，选择属性值以 `value` 开头或以 `value-` 开头的元素。

```html
<p lang="en">English</p>
<p lang="en-us">American</p>
<p lang="fr">French</p>
```

```css
[lang|="en"] {
  font-weight: bold;
}
/* <p lang="en"> 和 <p lang="en-us"> 加粗，因为它们以 en 开头或等于 en */
```

(5) `[attribute^="value"]`：开头匹配

```html
<a href="https://example.com">Link 1</a>
<a href="http://test.com">Link 2</a>
```

```css
[href^="https"] {
  color: blue;
}
/* <a href="https://example.com">文字变蓝 */
```

(6) `[attribute$="value"]`：结尾匹配

```html
<img src="photo.jpg">
<img src="image.png">
```

```css
[src$=".jpg"] {
  border: 3px solid orange;
}
/* <img src="photo.jpg"> 有橙色边框 */
```

(7) `[attribute*="value"]`：包含匹配

```html
<div data-info="user123"></div>
<div data-info="123user"></div>
<div data-info="no-match"></div>
```

```css
[data-info*="user"] {
  background: yellow;
}
/* 前两个 <div> 背景变黄，因为 user 出现在属性值中 */
```

### 3) 组合选择器

1. 后代选择器：空格，选中所有后代
2. 子选择器：`>`，只选中儿子，不选中孙子
3. 相邻兄弟选择器：`+`，选择相邻的第一个兄弟元素
4. 通用 / 一般兄弟选择器：`~`，选择所有符合条件的兄弟，不要求相邻
5. 并集选择器：`,` 通常用于集体声明

```html
<div class="container">
    <div class="box">基准元素</div>
    <p>兄弟元素 1</p>
    <p>兄弟元素 2</p>
    <span>不是 p，不受影响</span>
    <p>兄弟元素 3</p>
</div>
```

```css
div p {
  font-size: 16px;
}

ul > li {
  list-style: none;
}

.box + p {
  margin-top: 10px;  /* 作用于第一个p */
}

.box ~ p {
    color: red;  /* 所有 p 变红，但 span 不受影响 */
}

ul, div {
  font-size: 16px;
}
```

### 4) 伪类选择器

（1）结构伪类

1. `:first-child` / `:last-child`：选择属于父元素的第一个 / 最后一个子元素。
   1. `:first-child` 等同 `:nth-child(1)`
2. `:only-child`：选择了父元素唯一的子元素
3. `:nth-child(n)` / `:nth-last-child(n) `
4. `:first-of-type` / `:last-of-type`：同类型的第一个 / 最后一个子元素
5. `:only-of-type` 同类型的唯一一个子元素
6. `:nth-of-type(n)` / `:nth-last-of-type(n)`

> `2n+1(odd)` 奇数、`2n(even)` 偶数

（2）其他伪类

1. `:root`：文档根元素伪类
2. `:empty`：没有子元素
3. `:not(selector)`

（3）适用于 `a` 链接：`a:link`、`a:active`、`a:hover`、`a:visited`

```css
a:link { color: blue; }      /* 未访问 */
a:visited { color: purple; } /* 已访问 */
a:hover { color: red; }      /* 鼠标悬停 */
a:active { color: orange; }  /* 点击时 */
```

（4）适用于表单

1. `:focus`
2. `:enabled` / `:disabled`：适用 `<input>`
3. `:checked`

（5）`nth-child` 和 `nth-of-type` 区别

1. `nth-child(n)`：基于**父元素的所有子元素**的顺序选择第 n 个元素，不区分元素类型

2. `nth-of-type(n)`：基于**父元素中同类型子元素**的顺序选择第 n 个元素，只考虑指定标签类型

```html
<div class="container">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <span>Span 1</span>
  <p>Paragraph 2</p>
</div>
```

```css
.container p:nth-child(2) {
  background: yellow;  /* <p>Paragraph 1</p>变黄，因为它是第2个子元素，且是<p> */
}

.container p:nth-of-type(2) {
  background: green;  /* <p>Paragraph 2</p>变绿，因为它是第2个<p>（忽略其他类型） */
}
```

### 5) 伪元素选择器

1. `element::first-line`

2. `element::first-letter`
3. `element::before`
4. `element::after`

5. `::selection`


`::before` 和 `::after` 需配合 `content` 属性使用

> 使用场景：添加前后缀、消息气泡、斑马纹、悬浮高亮显示
>

```css
p::before {
  content: "★ ";
  color: gold;
}
p::after {
  content: "!";
  color: red;
}
```

### 6) 伪类和伪元素的区别

1. 伪类（*Pseudo-classes*）：以冒号 `:` 开头，用于选择处于特定状态的元素。作用于已有元素，不创建新元素。

2. 伪元素（*Pseudo-elements*）：以双冒号 `::` 开头，用于在文档中插入虚构的元素。

（1）区别

1. 共同：都是用于向选择器加特殊效果
2. 区别
   1. 本质区别就是是否抽象创造了新元素
   2. 伪类只要不互斥可以叠加使用
   3. 伪元素在一个选择器中只能出现一次，并且只能出现在末尾
   4. 伪类与伪元素优先级分别与类、标签优先级相同

（2）常见伪类

1. 动态伪类：`:active`、`:link`、`:visited`、`:focus`、`:hover`
2. 状态伪类：`:empty`、`:invalid` 和 `:valid`、`:required` 和 `:optional`、`:in-range`和 `:out-of-range`、`:read-only` 和 `:read-write`、`:enabled` 和 `:disabled`
3. 结构伪类：`:first-child`、`:last-child`、`:only-child`、`:nth-child()`、`:nth-last-child()`、`:first-of-type`、`:last-of-type`、`:only-of-type`、`:nth-of-type()`、`:nth-last-of-type()`
4. 其他伪类：`:not`、`:target`、`:root`、``:lang``

![](.\images\伪类其他.jpg)

（3）常见伪元素

![](.\images\伪元素.jpg)

### 7) 优先级

`!important` > 行内样式(1000) > id 选择器(0100) > 类、伪类、属性(0010) > 元素、伪元素(0001) > 通配符 `*`、子选择器 `>`、兄弟选择器 `+`、继承的样式没有权值(0000)

CSS 选择器匹配规则是**从右往左**匹配。

- 如果从**左往右**解析，浏览器需要**遍历整个文档树**，找到所有父级元素，再逐层检查是否匹配选择器规则。
- 从**右往左**解析，可以**先锁定最右侧元素**，再逐层回溯父节点，这样如果**最右侧元素不匹配**，直接放弃，减少无效操作。

在提升性能上：避免使用 `后代选择器` 和 `通配符选择器`，优先使用 `id选择器` 和 `类选择器`。

1. 后代选择器 `空格`：性能最差
2. 子代选择器 `>`：优于后代选择器
3. 相邻兄弟选择器 `+` 和通用兄弟选择器 `~`：性能相对较好

## 二、`font`、`text`、垂直对齐

### 1) `font`

（1）属性

1. `font-style`：字体样式，可设置 `normal`、`italic` 斜体字、`oblique` 倾斜字体

2. `font-variant`：字体变体，可设置 `normal`、`small-caps` 小型大写字母

3. `font-weight`：字体粗细，可设置 `normal`、`bold` 加粗、`bolder` 比父元素更粗、`lighter`、`100-900`

4. `font-size`：字体大小，可以使用绝对单位（`px`、 `pt`）或相对单位（`em`、 `rem`、 `%`）

5. `line-height`：行高。单行文字垂直居中，设置文字行高等于盒子高度。
   - 单位：可以使用数值、单位（`px`、 `em`、`%`）

   - 无单位：行高为字体大小的倍数
   - `em` 单位：行高为字体大小的倍数，类似于无单位数值，但受父元素字体大小影响
   - `%`：行高为字体大小的百分比
   - `normal`：默认值
   - `inherit`：继承父元素的行高值

6. `font-family`：设置字体系列，多个备选字体用 `,` 分隔

（2）字体简写

- 顺序：`[font-style] [font-variant] [font-weight] font-size/[line-height] font-family`
- `font-size` 和 `font-family` 必须指定

```css
p {
  font-family: "Arial", sans-serif;
  font-style: italic;
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5;  /* 1.5倍字体大小 */
}
/* 字体简写 */
p {
  font: italic bold 16px/1.5 Arial;
}
```

### 2) `text`

1. `color`：文本颜色
2. `text-align`：文本对齐，值可设置 `left`、`right`、`center`、`justify`（两端对齐）
3. `text-decoration`：文本装饰，值可设置 `underline`、`overline`、`line-through`、`none`
4. `text-indent`：文本缩进
5. `letter-spacing`：字间距
6. `word-spacing`：词间距
7. `word-wrap`：控制长单词或连续字符在容器中的**换行**方式
   1. `normal` ：默认值，单词在边界**不会换行**，超出容器时**溢出**显示
   2. `break-word` ：在**长单词或连续字符**处进行**强制换行**，避免溢出
   3. `overflow-wrap: break-word;`：现代浏览器中更推荐
8. `white-space`：控制空白和换行，可设置 `normal` 自动换行、`nowrap` 不换行
9. `text-overflow`：文本溢出
   1. `clip`：修剪文本
   2. `ellipsis`：显示省略号来代表被修剪的文本
10. `text-shadow`：文字阴影
    1. 语法：`水平偏移 垂直偏移 [模糊半径] 颜色`
    2. 多阴影：用 `,` 分隔
11. 文本装饰
    1. `text-fill-color` 设置文字**内部填充颜色**
    2. `text-stroke-color` 设置文字**边界填充颜色**
    3. `text-stroke-width` 设置文字**边界宽度**

```css
p { 
  color: #ff0000;  /* 红色 */
  text-align: center;
  text-decoration: none;  /* 去掉下划线 */
  text-indent: 2em;  /* 缩进2个字符 */
  letter-spacing: 2px;
  word-spacing: 5px;
}
/* 文字阴影 */
h1 {
  text-shadow: 2px 2px 4px #000; /* 右下阴影，模糊4px */
  text-shadow: 0 0 3px rgba(255, 0, 0, 0.8); /* 红色发光 */
  text-shadow: -1px -1px gray; /* 左上阴影，无模糊 */
}
/* 多重阴影 */
h1 {
	text-shadow: 1px 1px red, 2px 2px blue;
}  
```

### 3) 溢出文本处理

1. 单行文本溢出

```css
/* 1. 先强制一行内显示文本，默认 normal 自动换行 */
white-space: nowrap;   
/*2. 超出的部分隐藏*/
overflow: hidden;
/*3. 文字用省略号替代超出的部分*/
text-overflow: ellipsis;
```

2. 多行文本溢出

```css
overflow: hidden;            /* 溢出隐藏 */
text-overflow: ellipsis;     /* 溢出用省略号显示 */
display:-webkit-box;         /* 作为弹性伸缩盒子模型显示。 */
-webkit-box-orient:vertical; /* 设置伸缩盒子的子元素排列方式：从上到下垂直排列 */
-webkit-line-clamp:3;        /* 显示的行数 */
```
### 4) `vertical-align`

**`vertical-align`**：设置一个元素的**垂直对齐方式**，只对**行内元素或者行内块元素**有效。

```css
vertical-align : bottom | baseline | middle | top
```

![](.\images\vertical-align.jpg)

1. 设置图片或者表单（行内块元素）和文字垂直对齐：默认 `vertical-align: baseline` ，设置 `middle` 可以让文字和图片垂直居中对齐。
2. 解决图片底部默认空白缝隙问题
   1. 给图片添加 `vertical-align: bottom | middle | top;`
   2. 把图片转换为块级元素 `display: block;`

## 三、`background`

（1）属性

1. `background-color`：可以设置 `颜色名(red)`、`#HEX`、`rgb()`、`rgba()`、`transparent`
2. `background-image`：设置 `url("路径")`
3. `background-repeat`：背景重复
   1. `repeat` 默认，水平垂直重复
   2. `repeat-x` 水平重复
   3. `repeat-y` 垂直重复
   4. `no-repeat` 不重复
4. `background-position`：图片位置
   1. 水平方向：`left`、`center`、`right`
   2. 垂直方向：`top`、`center`、`bottom`
     3. 像素 / 百分比：`50px 20px`、`50% 30%`
   4. 如果只指定一个，另一个默认居中对齐
5. `background-size`：控制图片尺寸

   1. 长度：`100px 50px`
   2. 百分比：`50% 50%`
   3. `cover`：覆盖容器，裁剪多余
   4. `contain`：完整显示，留空隙
6. `background-attachment`：控制背景随滚动行为
   1. `scroll`：默认，随元素滚动
   2. `fixed`：固定于视口
   3. `local`：随内容滚动
7. `background-clip`：定义背景绘制区域
   1. `border-box`：默认，背景覆盖**整个元素（含边框）**
   2. `padding-box`：背景覆盖**内边距区域及内容**
   3. `content-box`：背景仅覆盖**内容区域**
   4. `text`：背景仅覆盖**文本区域**，适用于文字渐变
8. `background-origin`：背景定位的起点，可设置 `border-box` / `padding-box` (默认)  / `content-box`

（2）背景简写：`background` 设置所有背景属性

顺序：`color image repeat attachment position/size clip origin`

注意：`position/size` 用 `/` 分隔

（3）多重背景：一层以上背景叠加，背景之间用 `,` 分隔，每层单独定义，第一层在最上，依次向下。

```css
 div { 
  background-color: #ff0000;  /* 红色 */
  background-image: url("bg.jpg");
  background-repeat: no-repeat;
  background-position: center top;  /* 居中靠上 */
  background-size: cover;
  background-attachment: fixed;
  background-clip: content-box;
  background-origin: padding-box;
 }
/* 背景简写 */
div { 
  background: #fff url("bg.jpg") no-repeat fixed center/cover; 
}
/* 多重背景 */
div { 
  background: url("bg1.png") no-repeat top, url("bg2.jpg") repeat bottom;
}
```

## 四、盒子模型

（1）盒子模型组成

1. `content`：`width` 和 `height` 定义的区域
2. `padding`：内容与边框之间的空间
3. `border`：围绕内边距的框
4. `margin`：边框外的空间
5. 总尺寸：`width/height + padding + border + margin`

（2）标准盒模型 ：`width` 和 `height` 只包括内容，不含 `padding` 和 `border`

![](.\images\标准盒模型.jpg)

（3）怪异盒模型（IE）：宽高包括 `with / height + padding + border`，不含 `margin`

![](.\images\怪异盒模型.jpg)

（4）属性

1. `width / height`
2. `padding`：内边距
   1. 单边设置：`padding-top`、`padding-bottom`、`padding-right`、`padding-left`
   2. 值：一个值(上下左右都是)、两个值(上下、左右)、三个值(上、左右、下)，四个值(上、右、下、左，顺时针)
3. `border`：边框，包含宽度 `border-width`、样式 `border-style`、颜色 `border-color`
   1. `border-style: none | solid | dashed |dotted ;`
   2.  `border-collapse: collapse; `：控制浏览器绘制表格边框的方式，它控制相邻单元格的边框。
   3. 简写：`border: width style color;`
   4. 单边设置：`border-left: 2px dashed blue;`


4. `margin`：外边距
   1. 块级元素水平居中：`margin: 0 auto;`
   2. 行内元素或者行内块元素水平居中给其父元素添加 `text-align: center;`


5. `box-sizing`

```css
box-sizing: content-box | border-box | inherit;  /* inherit 应该从父元素继承 */
```

`border-radius`：圆角边框

1. 值
   1. 1个值：所有四个角相同
   2. 2 个值：第 1 个左上/右下；第 2 个右上/左下
   3. 3 个值：第 1 个左上；第 2 个右上/左下；第 3 个右下
   4. 4 个值：左上、右上、右下、左下
2. `/` 用于分别设置椭圆的水平和垂直半径
3. 单角设置：`border-top-left-radius | border-top-right-radius | border-bottom-right-radius | border-bottom-left-radius`

```css
div {
  border-radius: 10px; /* 四个角10px圆角 */
  border-radius: 10px 20px 30px 40px; /* 各角不同 */
  border-radius: 50%; /* 相对于自身 */
  border-radius: 50px 25px / 30px 10px;  /* 前面的是水平半径（x 方向），后面的是垂直半径（y 方向） */
}
```

## 五、网页布局⭐

文档流其实分为定位流、浮动流、普通流三种。

1. 标准流（普通流/文档流）：指 `BFC` 中的 `FC`（ *Formatting Context*，格式化上下文）
   1. 块级盒子独占一行，从上到下，垂直排列
   2. 内联盒子从左到右，水平排列等，碰到父元素边缘则自动换行
2. 浮动、定位

3. `table` 布局

4. `flex` 、`grid` 布局


### 1) 常见布局效果⭐

#### （1）水平居中

1. 子元素为**行内元素或行内块级元素**，在父元素上加上 `text-align: center;`
2. 子元素为**块级元素**，在子元素上加上 `margin: 0 auto;`
3. 当子元素设置了绝对定位 `position: absolute;` , 需要在左右加上相等的定位距离 `left: 0;right: 0;` 才能使用 `margin: 0 auto;`
4. 使用定位 `position: absolute;` + 父元素宽度的 `50%` 的偏移（`left: 50%;`） + 回退子元素宽度的 `50%`（`transform: translateX(50%);`）
5. 使用定位 `position: absolute;` + 父元素宽度的 `50%` 的偏移（`left: 50%;`） + 回退子元素宽度的 `50%`（ `margin-left: -子元素宽度的一半;`）
6. `flex | grid` 布局

`margin-left: -子元素宽度的一半;` 和 `transform: translateX(-50%);` 区别

1. `margin` 会占据空间；`transform` 是移动，并不会占据原来的空间
2. `margin: 50%;` 是相对于父元素的百分比；`transform: translate(50%, 50%);` 是相对于元素自身的百分比

#### （2）垂直居中

1. 对于单行文本，可以设置 `line-height: 父元素高度;` 
2. `flex | grid` 布局

```css
/* flex */
.parent {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100px;
}

/* grid */
.parent {
  display: grid;
  place-items: center; /* 水平+垂直居中 */
  height: 100px;
}
```

#### （3）两栏布局

> 左边定宽，右边自适应
>

1. 通过 `float: left;` 和 `overflow: hidden;` 实现

```html
<div>
    <div class="left">浮动元素，无固定宽度</div>
    <div class="right">自适应</div>
</div>
```

```css
.left {
    float: left;
    height: 200px;
    with: 200px;
    background-color: red;
}
.right {
    overflow: hidden;
    height: 200px;
    background-color: yellow;
}
```

2. `flex` 布局，`flex: 1;`

```css
.wrapper {
    width: 50vw;
    height: 100vh;
    display: flex;
}
.left {
    width: 100px;
}
.right {
    flex: 1;
}
```

3. `grid` 布局，`grid-template-columns: 100px auto;` 或者 `grid-template-columns: 100px 1fr`

```css
.wrapper {
    width: 50vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 100px auto;  /* grid-template-columns: 100px 1fr; */
}
```

#### （3）三栏布局

> 左右固定，中间自适应。
>

```css
.container {
  display: flex;
  justify-content: space-between;
}
.sidebar-left, .sidebar-right {
  flex: 0 0 200px;  /* 固定宽度 */
}
.main {
  flex: 1;  /* 自动填充剩余空间 */
}
```

```css
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;  /* 定义三列的宽度 */
  gap: 10px;  /* 列间距 */
}
.sidebar-left, .sidebar-right {
	background-color: #f0f0f0;
}
.main {
	background-color: #e0e0e0;
}
```

3. 绝对定位布局

```css
.container {
  position: relative;
  height: 100vh; /* 高度为视口高度 */
}
.sidebar-left, .sidebar-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 200px; /* 固定宽度 */
}
.sidebar-left {
  left: 0;
}
.sidebar-right {
  right: 0;
}
.main {
  position: absolute;
  left: 200px;
  right: 200px;
  top: 0;
  bottom: 0;
}
```

4. 圣杯布局

```html
<div class="container">
    <div class="main">主内容</div>
    <div class="left">左侧栏</div>
    <div class="right">右侧栏</div>
</div>
```

```css
.container {
    padding: 0 200px; /* 为左右栏预留空间 */
    overflow: hidden; /* 清除浮动 */
}

.main, .left, .right {
    float: left;
    height: 200px;
}

.main {
    width: 100%; /* 占满容器宽度 */
    background: lightblue;
}

.left {
    width: 200px; /* 左侧栏宽度 */
    margin-left: -100%; /* 拉回到最左侧 */
    position: relative;
    left: -200px; /* 配合父容器 padding 调整位置 */
    background: lightcoral;
}

.right {
    width: 200px; /* 右侧栏宽度 */
    margin-left: -200px; /* 拉回到最右侧 */
    position: relative;
    right: -200px; /* 配合父容器 padding 调整位置 */
    background: lightgreen;
}
```

5. 双飞翼布局

```html
<div class="container">
    <div class="main">
        <div class="main-inner">主内容</div>
    </div>
    <div class="left">左侧栏</div>
    <div class="right">右侧栏</div>
</div>
```

```css
.container {
    overflow: hidden; /* 清除浮动 */
    min-width: 600px; /* 确保内容区域不被压缩（200px + 主内容 + 200px） */
}

.main, .left, .right {
    float: left;
    height: 200px;
}

.main {
    width: 100%; /* 占满父容器宽度 */
    background: lightblue;
}

.main-inner {
    margin: 0 200px; /* 为左右栏预留空间 */
    background: lightblue; /* 可选：与 main 保持一致 */
}

.left {
    width: 200px;
    margin-left: -100%; /* 拉到最左侧 */
    background: lightcoral;
}

.right {
    width: 200px;
    margin-left: -200px; /* 拉到最右侧 */
    background: lightgreen;
}
```

### 2) 浮动

`float`：使元素脱离标准文档流，向左或右浮动，直到碰到容器边界或另一个浮动元素。

语法：`{ float: left | right | none; }`

特性：

1. **脱离文档流**：浮动元素不占原位置，后续元素会上移填充
2. **块级化**：行内元素浮动后变为块级元素
3. **水平排列**：多个浮动元素按顺序水平排列，超出容器会换行

> 场景：文字环绕显示、块级元素同行显示、行内元素设置宽高
>
> 注意：浮动元素可以使用 `margin`，但是不能使用 `margin: 0 auto;`
>

#### （1）清除浮动⭐

`clear`：不允许元素和之前的浮动元素在同一行显示。

```css
clear: left | right | both;
```

1. 额外标签法
2. 伪元素清除法
3. `.clearfix` 类清除法
4. 父级元素添加 `overflow`：可能裁剪超出容器的内容，且失去滚动功能
5. `display: flow-root`：彻底清除浮动，部分老旧浏览器不支持

```html
<div class="container">
    <div class="float-left">左浮动</div>
    <div class="float-right">右浮动</div>
    <div style="clear: both;"></div>
</div>
```

```css
.container::after {
    content: "";
    display: block;
    clear: both;
}

.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

.container {
    overflow: hidden; /* 或 auto */
}

.container {
    display: flow-root;
}
```

#### （2）浮动引发的问题

1. 父元素高度塌陷：有时候不方便给父元素设置高度，给子元素设置高度，并设置为浮动后，浮动子元素脱离文档流，父元素无法感知高度，父元素高度为 `0`，父元素无法包裹浮动内容，后续布局混乱。


2. 文字环绕问题：浮动元素后的非浮动元素（如文本）会环绕浮动元素。


3. 浮动元素溢出：浮动元素宽度总和超过父容器时，会换行或溢出。

### 3) `position`⭐

`position`：控制元素在页面中的定位方式。

1. `static`：默认值，无定位，遵循文档流，**强制删除应用于无法控制的元素上的某些定位**
2. `relative`：相对于自身原位置偏移，**不脱离文档流**
3. `absolute`：相对于最近的定位祖先（非 `static`）偏移，脱离文档流
4. `fixed`：相对于视口固定，脱离文档流
5. `sticky`：结合 `relative` 和 `fixed`，在滚动到指定位置时固定

偏移属性：`top`、`right`、`bottom`、`left`（单位：`px`、`%` 等）

**（1）`relative` 相对定位**

1. 保留原位置（占位），仅视觉偏移
2. 可作为 `absolute` 的参考父元素

**（1）`absolute` 绝对定位**

1. 相对于最近的非 `static` 定位祖先元素的偏移（`relative`、`fixed`、`absolute`），来确定元素位置。如果没有父元素，则参考 `body`。
2. 脱离文档流，不占原位置
3. 同一父级元素中，`z-index` 值大的在最上层

```css
.parent {
  position: relative;
}
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**（3）`fixed` 固定定位**

1. 相对于视窗定位，即使页面滚动，也始终停留在同一位置上
2. 脱离文档标准流
3. 会创建新的层叠上下文
4. 当元素祖先的 `transform`、 `perspective` 或 `filter` 属性非 ` none` 时，容器由视口改为该祖先


```css
/* 导航栏固定定位 */
.nav {
  position: fixed;
  top: 0;
  width: 100%;
}
```

**（4）`sticky` 粘性定位**

1. 在容器内滚动到指定位置时固定
2. `top`、`bottom`、`left`、`right` 控制元素在其父元素中的粘性位置

注意：

1. 必须指定 `top`、`bottom`、`left`、`right` 中的一个或多个属性，决定了元素粘性定位的起始点
2. 元素的祖先容器不能有 `overflow: hidden | auto;` 等样式，否则 `sticky` 会失效
3. 元素的父元素需要有足够的空间，否则无法触发粘性效果

应用场景：导航栏固定、表头粘性定位、TOC（*Table of Contents*，内容目录）、浮动的侧边栏

```css
.sticky {
  position: sticky;
  top: 0;  /* 滚动到顶部时固定 */
  background: yellow;
}
```

**（5）`z-index`**：控制定位元素的叠放顺序（仅对 `relative`、`absolute`、`fixed`、`sticky` 生效）。

没有 `z-index` 的时候，元素的层叠关系由 2 个因素决定：

1. 该元素的 `position` 是否是 `static`，如果是 `static`，那么这个元素就称为 `non-positioned` ；如果 `position` 值是 `relative`、`absolute`、`fixed`、`sticky`  则称 `positioned`。
  - `non-positioned` 元素中，有 `float` 样式的元素覆盖没有 `float` 的
  - `positioned` 元素享受特权，会覆盖 `non-positioned` 元素
2. 元素出场顺序：同类型元素遵循**后来者居上**的原则。

`z-index` 只有在以下场景适用：

1. 只在 `positioned` 元素上有效果。
2. 要判断元素在 Z轴 上的堆叠顺序，并不仅仅是直接比较两个元素的 `z-index` 值的大小，这个堆叠顺序还由**元素的层叠上下文和层叠等级**共同决定。

## 六、`flex` 布局⭐

`flex` 布局（*Flexible Box*，弹性盒子）专门用于一维（单行或单列）布局，适用于水平或垂直方向上的元素排列。

`flex` 布局主要由 **flex 容器和 flex 项目**组成。

1. 容器（*container*）：`flex-direction`、`flex-wrap`、`justify-content`、`align-items`、`align-content`

2. 项目（*item*）：`order`、`flex-basis` 、`flex-grow`、`flex-shrink`、`flex`、`align-self`


### （1）容器属性

flex 容器的属性决定了子元素如何排列、对齐及换行。

1. `display`

```css
.container {
    display: flex; /* 块级弹性容器 */
    display: inline-flex; /* 行内弹性容器 */
}
```

2. `flex-direction`：主轴方向

```css
.container {
    flex-direction: row;        /* 水平方向（默认，主轴从左到右） */
    flex-direction: row-reverse; /* 水平方向（主轴从右到左） */
    flex-direction: column;      /* 垂直方向（主轴从上到下） */
    flex-direction: column-reverse; /* 垂直方向（主轴从下到上） */
}
```

3. `flex-wrap`：换行

```css
.container {
    flex-wrap: nowrap; /* 默认，不换行，可能导致子元素压缩 */
    flex-wrap: wrap; /* 换行，子元素会溢出时自动换到下一行 */
    flex-wrap: wrap-reverse; /* 反向换行（第一行在下方，第二行在上方） */
}
```

4. `justify-content`：主轴对齐方式

```css
.container {
    justify-content: flex-start;  /* 左对齐（默认） */
    justify-content: flex-end;    /* 右对齐 */
    justify-content: center;      /* 居中 */
    justify-content: space-between; /* 两端对齐，项目之间均匀分布 */
    justify-content: space-around;  /* 两侧间距相等，整体视觉不均匀 */
    justify-content: space-evenly;  /* 所有间距（项目之间和边缘）均等 */
}
```

5. `align-items`：交叉轴对齐方式

```css
.container {
    align-items: flex-start;  /* 顶部对齐 */
    align-items: flex-end;    /* 底部对齐 */
    align-items: center;      /* 居中对齐 */
    align-items: stretch;     /* 拉伸，占满容器高度，默认，如果元素未设置height或设为auto */
    align-items: baseline;    /* 基线对齐（基于文本底线） */
}
```

6. `align-content`：多行对齐方式，设置 `flex-wrap: wrap;` 才会生效

```css
.container {
    align-content: flex-start;  /* 顶部对齐 */
    align-content: flex-end;    /* 底部对齐 */
    align-content: center;      /* 居中对齐 */
    align-content: space-between; /* 每行之间均匀分布 */
    align-content: space-around;  /* 每行周围留有相等的空间 */
    align-content: space-evenly;  /* 每行间距均等 */
    align-content: stretch;       /* 拉伸填满容器（默认） */
}
```

7. `row-gap` 、 `column-gap`、`gap` 设置行间距和列间距，类似 `grid`
8. `flex-flow`：`flex-direction` 和 `flex-wrap` 属性的简写，默认为 `flex-flow: row nowrap;`

### （2）项目属性

1. `order`：项目排列顺序，数值越小，排列越靠前，默认为 `0`。值相等的元素按照文档流原始顺序排列。
2. `flex-basis`：项目在主轴上的初始大小，表示在不伸缩的情况下子容器的原始尺寸。需要跟 `flex-grow` 和 `flex-shrink` 配合使用才能生效。

```css
.item {
  /* 使用元素的 width（主轴为 row）或 height（主轴为 column）作为初始主轴尺寸，若未设置则根据内容自适应，受 min-width/max-width 等约束影响。 */
  flex-basis: auto;
    /* 将 flex 项目的初始主轴尺寸设为 0，忽略元素的 width 或 height。最终尺寸由 flex-grow 和 flex-shrink决定。 */
  flex-basis: 0%;
  /* 设置 flex 项目在主轴上的初始尺寸（主轴为 row 时为宽度，column 时为高度），最终尺寸受 flex-grow 和 flex-shrink 影响。 */
  flex-basis: 100px;
}
```

3. `flex-grow`：放大比例，当前项目相对其他项目的放大比例。

```css
.item {
    flex-grow: 1;  /* 其他项不增长时，当前项占满剩余空间 */
}
/* 示例 */
.item1 {
  	flex-grow: 1;
} 
.item2 {
  	flex-grow: 2;  /* item2 占据两倍于 item1 的空间 */
}
```

4. `flex-shrink`：控制空间不足时，当前项目的缩小比例。

```css
.item {
    flex-shrink: 1; /* 默认值，空间不足时等比例缩小 */
    flex-shrink: 0; /* 空间不足时不缩小 */
}

/* 示例 */
.item1 {
  	flex-shrink: 1;
} 
.item2 {
  flex-shrink: 2;  /* item2 缩小速度是 item1 的两倍 */
}
```

5. `flex`：是 `flex-grow`、`flex-shrink`、`flex-basis` 的缩写。
   1. 当 `flex` 取值为一个**非负**数字，则该数字为 `flex-grow` 值，`flex-shrink` 取 `1`，`flex-basis` 取 `0%`
   2. 当 `flex` 取值为一个长度或百分比，则视为 `flex-basis` 值，`flex-grow` 取 `1`，`flex-shrink` 取 `1`（注意 `0%` 是一个百分比而不是一个非负数字）
   3. 当 `flex` 取值为两个非负数字，则分别视为 `flex-grow` 和 `flex-shrink` 的值，`flex-basis` 取 `0%`
   4. 当 `flex` 取值为一个非负数字和一个长度或百分比，则分别视为 `flex-grow` 和 `flex-basis` 的值，`flex-shrink` 取 `1`

```css
.item { flex: 1; }  /* flex: 1 1 0%; */
.item { flex: auto; }  /* flex: 1 1 auto; 的简写，即元素尺寸可以弹性增大，也可以弹性变小，但在尺寸不足时会优先最大化内容尺寸。 */
.item { flex: 0; }  /* flex: 0 0 0%; */
.item { flex: none; }  /* flex: 0 0 auto; */
.item-1 { flex: 1 1 0%; }  /* flex: 0%; 不推荐直接这样写*/
.item-2 { flex: 24px; }  /* flex: 1 1 24px; */
.item { flex: 2 3; }  /* flex: 2 3 0%; */
.item { flex: 11 32px; }  /* flex: 11 1 32px; */
.item { flex: 0 1 auto; }  /* 默认值 */
```

6. `align-self`：单独对齐，允许某个项目在交叉轴上独立对齐，覆盖 `align-items`。

> 默认值为 `auto`，表示继承父元素的 `align-items` 属性，如果没有父元素，则等同于 `stretch`。
>

```css
.item {
    align-self: flex-start;  /* 顶部对齐 */
    align-self: flex-end;    /* 底部对齐 */
    align-self: center;      /* 居中 */
    align-self: stretch;     /* 拉伸 */
    align-self: baseline;    /* 基线对齐 */
}
```

## 七、`grid` 布局⭐

`grid` 布局是一种**二维布局**系统，可以同时控制行和列。由**网格容器（*Grid Container*）和网格项目（*Grid Items*）**组成。

1. 容器属性：`grid-template-rows` / `grid-template-columns`、`grid-auto-rows` / `grid-auto-columns`、`row-gap` / `column-gap ` / `gap`、`grid-template-areas`、`grid-auto-flow`

2. 项目属性：`grid-row` / `grid-column`、`grid-area`、`justify-content` / `align-content` / `place-content`、`justify-items` / `align-items` / `place-items`、`justify-self` / `align-self` / `place-self`


### （1）容器属性

`grid` 容器属性用于定义网格的行、列、间距等。

1. `display`

```css
.container {
    display: grid; /* 块级 Grid 容器 */
    display: inline-grid; /* 行内 Grid 容器 */
}
```

2. `grid-template-rows` / `grid-template-columns`：定义行高和列宽
   1. `repeat(n, value)`：定义重复的列或行
   2. `auto-fill`：表示自动填充，让一行（或一列）中尽可能的容纳更多的单元格
   3. 常见单位：`px`、`%`（相对容器宽度）
      - `fr`（弹性单位）：表示网格容器中可用空间的一等份
      - `auto`（自适应内容）：由浏览器决定长度
      - `minmax(min, max)`：最小/最大尺寸

```css
.container {
    grid-template-columns: 100px 200px 300px; /* 3 列，固定宽度 */
    grid-template-rows: 100px 150px; /* 2 行，固定高度 */
  	grid-template-columns: repeat(3, 1fr); /* 等宽三列 */
    grid-template-rows: repeat(2, 100px); /* 高度 100px 的两行 */
  	grid-template-columns: repeat(auto-fill, 200px); /* 表示列宽是 200px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素 */
  	grid-template-columns: 1fr 2fr 1fr; /* 第一列和第三列占 1 份，中间列占 2 份 */
    grid-template-rows: minmax(100px, auto) minmax(50px, auto);
}
```

3. `grid-auto-rows` / `grid-auto-columns`：隐式行或列，如果 `grid` 项目超出定义的网格范围，浏览器会自动创建行/列。
4. `row-gap` / `column-gap` / `gap`：定义行、列间距

```css
.container {
    grid-auto-rows: 100px; /* 额外行高 */
    grid-auto-columns: auto; /* 额外列宽 */
    column-gap: 20px; /* 列间距 */
    row-gap: 10px; /* 行间距 */
    gap: 10px 20px; /* 等价于 row-gap 10px, column-gap 20px */
}
```

5. `grid-template-areas`：命名网格区域，可以为网格命名，方便布局，配合 `grid-area`。

```css
.container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto auto;
    grid-template-areas:
        "header header"
        "sidebar content";
}

.header {
  	grid-area: header;
}
.sidebar {
  	grid-area: sidebar;
}
.content {
  	grid-area: content;
}
```

```html
<div class="container">
    <div class="header">Header</div>
    <div class="sidebar">Sidebar</div>
    <div class="content">Content</div>
</div>
```

6. `grid-auto-flow`：控制着自动布局算法怎样运作，精确指定在网格中被自动布局的元素怎样排列。默认放置顺序是先行后列，即先填满第一行，再开始放入第二行。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row | column;
  grid-auto-flow: row dense;   /* 表示尽可能填满表格 */
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

### （2）项目属性

`grid` 项目可以控制其在网格中的位置、跨行跨列等。

1. `grid-row` / `grid-column`：控制项目跨行、跨列
2. `grid-row-start` 、`grid-row-end` 、`grid-column-start`、`grid-column-end`：可以指定网格项目所在的四个边框，分别定位在哪根网格线，从而指定项目的位置
   1. `grid-row-start`：上边框所在的水平网格线
   2. `grid-row-end`：下边框所在的水平网格线
   3. `grid-column-start`：左边框所在的垂直网格线
   4. `grid-column-end`：右边框所在的垂直网格线
3. `grid-area`：可同时设置 `grid-row` 和 `grid-column`

```css
.item {
    grid-column: 1 / 3; /* 从第1列跨到第3列 */
    grid-row: 2 / 4; /* 从第2行跨到第4行 */
}
/* 等价于 */
.item {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 4;
}

/* 特殊值 */
.item {
	grid-row: span 3;  /* 跨3行 */
	grid-column: span 2;  /* 跨2列 */
}

.item {
    grid-area: 2 / 1 / 4 / 3; /* row-start / column-start / row-end / column-end */
}
```

4. `justify-content` / `align-content` / `place-content`：网格整体对齐
5. `justify-items` / `align-items` / `place-items`：项目对齐方式，控制网格**内部**项目的对齐方式
6. `justify-self` / `align-self` / `place-self`：跟 `*-items` 属性一致，但只作用于单个项目

```css
.container {
    justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  	align-content: start | end | center | stretch | space-around | space-between | space-evenly; 
    place-content: center; /* 等价于 justify-content: center + align-content: center */
}

.container {
  	/* 左对齐，水平居中，右对齐，拉伸，占满单元格的整个宽度（默认值） */
    justify-items: start | center | end | strench; 
    align-items: start | center | end | strench; /* 顶部对齐，垂直居中，底部对齐，拉伸 */
    place-items: center; /* 等价于 justify-items: center + align-items: center */
}

.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

## 八、BFC⭐

1. `BFC`（*Block Formatting Context*，块级格式化上下文）：CSS 渲染页面时创建的一个独立区域，内部的元素按照一定的规则进行布局。**内部元素不会影响到外部元素，同一个元素不能同时存在于两个 `BFC` 中。**

2. `IFC`（行级格式化上下文）：`inline` 内联
   1. 水平排列，直到当前行宽度填满，换行
   2. 高度由内容决定，不影响其他元素高度
3. `GFC`（网格布局格式化上下文）：`display: grid`
4. `FFC`（自适应格式化上下文）：`display: flex | inline-flex `

**（1）触发 `BFC`**

1. 根元素：`<html>`
2. 浮动元素：`float: left | right;`
3. 绝对定位元素：`position: absolute | fixed;`
4. `display: inline-block | table | inline-table | table-cell | table-caption | flex | inline-flex | grid | inline-grid;`
5. `overflow: auto | scrol | hidden; `，不为 `visible`

`display: block` 不会触发 `BFC`

**（2）特性**

1. `BFC` 是页面上的一个独立容器，容器里面的子元素不会影响外面的元素
2. `BFC` 内部的块级盒会在垂直方向上一个接一个排列
3. 同一 `BFC` 下的相邻块级元素可能发生外边距折叠，创建新的 `BFC` 可以避免外边距折叠
4. 浮动盒的区域不会和 `BFC` 重叠，计算 `BFC` 的高度时，内部浮动元素也会参与计算
5. 内部元素的 `margin box` 的左边与与其包含块的 `padding box` 左边对齐，即使有浮动，也不会被影响（不会被浮动元素覆盖）

**（3）作用**

1. 多栏自适应布局
2. 防止 `margin` 重叠：相邻兄弟元素、父子元素外边距合并
3. 清除浮动：解决父元素高度坍塌、避免文字环绕

## 九、`margin` 重叠

外边距重叠（*Margin Collapse*）当两个或多个垂直相邻的块级元素的外边距相遇时，它们的外边距会合并为一个外边距。

1. 如果两个外边距都是正值，取较大的值
2. 如果一个外边距是正值，另一个是负值，取它们的和
3. 如果两个外边距都是负值，取绝对值较大的（即较小的负值）

（1）重叠条件

1. 相邻的兄弟元素：两个相邻的块级元素之间的外边距会重叠

```html
<div class="box1">Box 1</div>
<div class="box2">Box 2</div>
```

```css
/* Box 1 和 Box 2 之间的外边距为 30px（取较大的值） */
.box1 {
    margin-bottom: 20px;
}
.box2 {
    margin-top: 30px;
}
```

2. 父元素与第一个/最后一个子元素
   1. 父元素没有边框、内边距或内容分隔
   2. 父元素与第一个子元素的上外边距重叠
   3. 父元素与最后一个子元素的下外边距重叠

```html
<div class="parent">
    <div class="child">Child</div>
</div>
```

```css
/* parent 和 child 的上外边距重叠，取较大的值 30px */
.parent {
    margin-top: 20px;
}
.child {
    margin-top: 30px;
}
```

3. 空块级元素：一个空块级元素的上外边距和下外边距会重叠，空元素不仅指无内容，还需无 `height`，并且没有 `padding` 或 `border`。

```html
<div class="empty"></div>
```

```css
/* empty 元素的上外边距和下外边距重叠，取较大的值 30px */
.empty {
    margin-top: 20px;
    margin-bottom: 30px;
}
```

（2）避免方法

1. 添加 `padding | border`
2. 使用 `BFC`

```css
.parent {
    padding: 1px; /* 或 border: 1px solid transparent; */
}
.parent {
    overflow: hidden; /* 触发 BFC */
}
```

## 十、`display`

`block`、`inline`、`inline-block` 区别

| **属性值**     | **作用**                                  | **关键特点**                  |
| -------------- | ----------------------------------------- | ----------------------------- |
| `none`         | 隐藏元素，不占空间                        | 移除布局，无过渡效果          |
| `block`        | 块级元素，独占一行                        | 宽度默认 `100%`，支持宽高     |
| `inline`       | 行内元素，不换行                          | 宽度由内容决定，不支持宽高    |
| `inline-block` | 行内块元素，不换行但可设置宽高            | 结合 `inline` 和 `block` 特性 |
| `flex`         | 弹性布局容器，子元素为 `flex` 项          | 一维布局，支持主轴/交叉轴对齐 |
| `inline-flex`  | 行内弹性布局容器                          | 同 `flex`，但容器为行内元素   |
| `grid`         | 网格布局容器，子元素为 `grid` 项          | 二维布局，支持行列精确控制    |
| `inline-grid`  | 行内网格布局容器                          | 同 `grid`，但容器为行内元素   |
| `table`        | 表格布局，类似 `<table>`                  | 模拟表格结构                  |
| `inline-table` | 行内表格布局                              | 同 `table`，但为行内元素      |
| `list-item`    | 列表项，类似 `<li>`                       | 默认带项目符号（如圆点）      |
| `contents`     | 元素本身消失，子元素保留布局              | 不渲染容器，仅显示内容        |
| `inherit`      | 继承父元素的 `display` 值                 | 依赖父级设置                  |
| `initial`      | 重置为初始值（通常 `block` 或 `inline` ） | 恢复默认                      |

### 元素隐藏

主要还是采用 `display:none` 和 `visibility:hidden`

> `display: none` 和 `opacity: 0` 是非继承属性，`visibility: hidden` 是继承属性

1. `display:none`

   1. 元素在页面上将彻底消失
   2. 元素本身占有的空间就会被其他元素占有，它会导致浏览器的重排和重绘
   3. 消失后，自身绑定的事件不会触发，也不会有过渡效果
   4. 特点：元素不可见，不占据空间，无法响应点击事件

2. `visibility:hidden`

   1. DOM 元素存在，页面不可见，不会触发重排，但是会触发重绘
   2. 特点：元素不可见，占据页面空间，无法响应点击事件

3. `opacity:0`

   1. 不引发重排，一般情况下会引发重绘
   2. 如果利用 `animation` 动画，对 `opacity` 做变化（`animation` 会默认触发 GPU 加速），则只会触发 GPU 层面的 `composite`，不会触发重绘
   3. 其子元素不能设置 `opacity` 来达到显示的效果
   4. 特点：改变元素透明度，元素不可见，占据页面空间，可以响应点击事件

4. 设置盒模型属性为 `0`

   1. 将影响元素盒模型的属性设置成 `0`，如果元素内有子元素或内容，还应该设置其 `overflow:hidden` 来隐藏其子元素

   2. 元素不可见，不占据页面空间，无法响应点击事件

     ```css
     .hiddenBox {
         margin:0;     
         border:0;
         padding:0;
         height:0;
         width:0;
         overflow:hidden;
     }
     ```

5. `position:absolute`：将元素移出可视区域，元素不可见，不影响页面布局

   ```css
   .hide {
      position: absolute;
      top: -9999px;
      left: -9999px;
   }
   ```

6. `clip-path`：通过裁剪，元素不可见，占据页面空间，无法响应点击事件

   ```css
   .hide {
     clip-path: polygon(0px 0px,0px 0px,0px 0px,0px 0px);
   }
   ```

![](.\images\元素隐藏方式区别.jpg)

## 十一、动画

### 1) `transform`

`transform` 变形，向元素应用 2D 或 3D 转换。该属性允许我们对元素进行移动、旋转、缩放、倾斜。

1. `transform-origin`：指定元素变形的中心点

2. `transform-style`：指定舞台为 2D 或 3D

3. `perspective`：指定 3D 视距

4. `perspective-origin`：视距的基点

5. `backface-visibility`：是否可以看见 3D 舞台背面

（1）`transform-origin` 指定元素变形的中心点

1. 默认中心点就是元素的正中心，即 `XYZ` 轴的 `50% 50% 0` 处。
2. 可以通过该属性改变元素在 `XYZ` 轴的中心点，`XYZ` 轴的正向分别是往右，往下，靠近用户眼睛，反之为反向。
3. 关键字 `top` 等价于 `top center` 等价于 `50% 0%`（`x` 轴仍旧留在 `50%` 处，`y` 轴位移到 `0%` 处）。
4. 表示 2维的 `x-offset/y-offset` 可以设 `px` 或 `%`，也可设 `right` 、 `left` 、`top`、`bottom` 、`center` 等 `keyword`。
5. 表示 3维的 `z-offset` 只能设 `px`，不能设 `%`，也没有 `keyword`。

（2）`transform-style: flat | preserve-3d`：指定舞台为 2D 或 3D。**要在变形元素的父元素上设置该属性才有用。**

（3）`perspective`：只能设 `px`，不能设 `%`。值越小表示用户眼睛距离屏幕越近。

（4）`perspective-origin`：设置视距的基点，默认值是 `50% 50%` 即 `center`，表示视距基点在中心点不进行任何位移。它需要和 `perspective` 属性结合着一起用。

![](.\images\perspective-origin.jpg)

```css
.td1 { 
    transform-style: preserve-3d;
    perspective: 200px;
    perspective-origin: center;
}
```

（5）`backface-visibility`：是否可以看见 3D 舞台背面

1. `visible`：默认值，背面可见
2. `hidden`：背面不可见

#### （1）2D变形

1. `translate()`：平移，不影响布局
   1. `translate(x, y)`：X 轴和 Y 轴平移
   2. `translateX(x)`：仅 X 轴平移
   3. `translateY(y)`：仅 Y 轴平移
   4. 参数：支持 `px`、`%`、`em` 等，`%` 基于元素自身尺寸
2. `rotate()`：旋转
   1. 2D 专用，3D 用 `rotateX/rotateY/rotateZ`
   2. 角度单位：`deg`、`rad`、`turn`
   3. 正值顺时针，负值逆时针，默认原点为中心
3. `scale()`：缩放，不影响布局
   1. `scale(x, y)`：X 轴和 Y 轴缩放比例
   2. `scaleX(x)`：仅 X 轴缩放
   3. `scaleY(y)`：仅 Y 轴缩放
   4. 单位：仅数字，1 为原始大小，负值翻转
4. `skew() `：倾斜
   1. `skew(x-angle, y-angle)`：X 和 Y 轴倾斜角度
   2. `skewX(x-angle)`：仅 X 轴倾斜
   3. `skewY(y-angle)`：仅 Y 轴倾斜
   4. 角度单位：`deg`
5. `matrix()`：矩阵变换，通过矩阵定义 2D 变换，综合平移、旋转、缩放、倾斜
   1. `matrix(a, b, c, d, tx, ty)`：`a, d` 缩放，`b, c` 倾斜，`tx, ty`：平移

```css
.box {
  transform: translate(50px, 20px);  /* 右移50px，下移20px。 */
  transform: rotate(45deg);  /* 顺时针旋转45度 */
  transform: scale(1.5, 0.5);  /* 宽度放大1.5倍，高度缩小为0.5倍 */
  transform: skew(30deg, 10deg);  /* X轴倾斜30度，Y轴倾斜10度 */
  transform: matrix(1, 0.5, -0.5, 1, 50, 20);
}
```

#### （2）3D变形

1. `translate3d(x, y, z)` 和 `translateZ(z)`

   1. 沿 X、Y、Z 轴平移，Z 轴为深度
   2. Z 轴长度只能为 `px`，不能为 `%`
2. `rotate3d(x, y, z, angle)` 、`rotateX(angle)`、`rotateY()`、`rotateZ()`
   1. 围绕 3D 向量或单轴旋转，`rotateZ` 等同 2D `rotate`
   2. `rotate3d(1, 0, 0, 45deg)`（沿 X 轴旋转 45°）
3. `scale3d(x, y, z)` 和 `scaleZ(z)`：沿 X、Y、Z 轴缩放

4. `matrix3d()`：`4x4` 矩阵定义 3D 变换，`16` 个参数


### 2) `Transition`

（1）属性

```css
transition: [property] [duration] [timing-function] [delay];
```

1. `property`：设置过渡效果的 CSS 属性名称， 多个属性同时过渡，可以用逗号 `,` 分隔
   1. 关键词：`none`、`all`、`transform`、`opacity`
2. `duration`：动画持续时间，单位可以是秒 `s` 或毫秒 `ms`
   1. 可以指定多个时长，每个时长会被应用到由 `transition-property` 指定的对应属性上
3. `timing-function`：过渡效果的时间曲线
   1. `linear`：匀速
   2. `ease`：默认值，先慢后快再慢
   3. `ease-in`：先慢后快
   4. `ease-out`：先快后慢
   5. `ease-in-out`：先慢→快→慢
   6. `cubic-bezier(x,y, x2, y2)`：自定义贝塞尔曲线
4. `delay`：延迟时间，单位可以是秒或毫秒
   1. 可以指定多个延迟时间，每个延迟会分别作用于所指定的相符合 `transition-property`

```css
/* 过渡多个属性 */
.box {
    width: 100px;
    height: 100px;
    background: red;
    transition: width 1s, height 1s, background 0.5s;
}

.box:hover {
    width: 200px;
    height: 200px;
    background: blue;
}
/* 设置多个duration和delay */
div {
  transition-property: opacity, left, top, height;
  transition-duration: 3s, 5s, 2s, 1s;
}

/* 鼠标悬停时，背景颜色渐变 */
.button {
    background-color: red;
    transition: background-color 0.5s ease-in-out;
}

.button:hover {
    background-color: blue;
}
```

（2）JS API

1. `transitionrun`：当 CSS `transition` 首次创建时，将触发 `transitionrun` 事件，在任何 `transition-delay` 已经开始之前。此事件不可取消。
2. `transitionstart`：在 CSS `transition` 实际开始的时候触发，或者说在某个 `transition-delay` 已经结束之后触发。
3. `transitionend`
4. `transitioncancel`

```js
element.addEventListener("transitionstart", () => {
  console.log("transition 开始");
});
```

### 3) `Animation`

```css
animation: name duration timing-function delay iteration-count direction fill-mode;
```

1. `@keyframes`：定义关键帧，可用于循环播放、复杂运动轨迹
2. `animation`：所有动画属性的简写属性，除了 `play-state` 属性
3. `name`：用来调用 `@keyframes` 定义好的动画，与 `@keyframes` 定义的动画名称一致
4. `duration`：动画持续时间，默认是 `0`，单位可以是秒或毫秒
5. `timing-function`：规定动画的速度曲线，默认是 `ease`
6. `delay`：延迟时间，默认是 `0`
7. `iteration-count`：重复次数，默认是 `1`，无限次 `infinite`
8. `direction`：播放方向
   1. `normal`：按时间轴顺序，默认
   2. `reverse`：反向播放
   3. `alternate`：正向再反向循环
   4. `alternate-reverse`：动画先反运行再正方向运行，并持续交替运行
9. `fill-mode`：控制动画结束后，元素的样式
   1. `none`：回到动画没开始时的状态，默认
   2. `forwards`：保持最后一帧的样式
   3. `backwords`：回到第一帧的状态
   4. `both`：根据 `direction` 轮流应用 `forwards` 和 `backwards` 规则，注意与 `iteration-count` 不要冲突（动画执行无限次）
10. `play-state`：控制动画的播放状态，暂停和继续
    1. `running`：正在播放，默认
    2. `paused`：暂停

```css
/* 小球左右移动 */
@keyframes move {
    0% { transform: translateX(0); }
    100% { transform: translateX(200px); }
}
/* infinite alternate 让小球来回运动 */
.ball {
    width: 50px;
    height: 50px;
    background: red;
    border-radius: 50%;
    animation: move 2s ease-in-out infinite alternate;
}
```

### 4) 区别

| **对比点**     | `transition`               | `animation`         |
| -------------- | -------------------------- | ------------------- |
| **触发方式**   | 需要用户交互（如 `hover`） | 自动播放            |
| **关键帧**     | 只能设定**起点和终点**     | 可以有多个中间帧    |
| **循环播放**   | 不能循环                   | `infinite` 可以循环 |
| **控制复杂度** | 适用于**简单动画**         | 适用于**复杂动画**  |

![](.\images\animation和transition区别.jpg)

## 十二、单位⭐

### 1) 相对单位

1. `em` 和 `rem`
   1. `em`：相对于**父元素的字体大小**进行计算的

   2. `rem`：根据页面**根元素的字体大小**来计算
2. `vw` 和 `vh`、`vmax` 和 `vmin`
   1. `vw`：布局视口宽度的 `1%`，`1vw = 视口宽度 / 100`
   - `vh`：布局视口高度的 `1%`
   - `vmin`：`vw` 和 `vh` 中较小值
   4. `vmax`：`vw` 和 `vh` 中较大值

视口单位基于**布局视口**，而非视觉视口，布局视口大小不会随着页面缩放变化。

布局视口会随着窗口大小变化而改变（尤其在移动端）。

1. 在桌面端：用户缩放（放大/缩小）时，**布局视口不变，视觉视口变**，此时 `vw` 不变。
2. 在移动端：随着软键盘、地址栏收起等操作，**布局视口会变**，所以 `vw` 也随之变化。

`<meta name="viewport" content="">`：控制移动端布局视口的大小和缩放。

1. 未设置时，移动端默认布局视口较大（如 `980px`），内容缩放显示
2. 设置后，布局视口匹配理想视口，CSS 像素等于设备像素

```css
/* 布局视口等于设备宽度，1:1显示 */
<meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;">
```

### 2) 绝对单位

1. `px`（*Pixels*，像素）：即一个小方块，它具有特定的位置和颜色，可以作为图片或电子屏幕的最小组成单位，并不严格等于显示器的像素。很多时候，`px` 也常被称为 `CSS 像素`。

2. `pt`（*Point*，点）：常用于软件设计和排版印刷行业


### 3) 设备独立像素

1. 物理像素（*Physical Pixels*）：设备屏幕的实际像素点数量，取决于分辨率。

2. CSS 像素（*CSS Pixels*）：Web 开发中使用的逻辑像素单位，与视口大小和设备 `DIP` 相关。

3. `DIP` 或 `DP`（*Device Independent Pixels*，设备独立像素）：用一种单位来告诉不同分辨率的手机，它们在界面上显示元素的大小是多少。

4. `DPR`（*Device Pixel Ratio*，设备像素比 / 像素密度）：是设备物理像素与 CSS 像素的比值，表示一个 CSS 像素对应多少个 物理像素。常见值 `DPR = 1 | 2 | 3`。


通过 `<meta name="viewport" content="">` 设置视口宽度为设备宽度时，CSS 像素与设备独立像素 `DIP` 一致。

![](.\images\设备像素-CSS像素-DIP-DPR-PPI.jpg)

### 4) 百分比单位

**（1）盒模型中的百分比**

1. `width`、`max-width`、`min-width`：值为百分比时，其相对于包含块的 `width` 进行计算。
2. `height`、`max-height`、`min-height`：值为百分比时，其相对于包含块的 `height` 进行计算。
3. `padding`、`margin`：值为百分比时，如果是水平的值，就是相对于包含块的 `width` 进行计算；如果是垂直的值，就是相对于包含块的 `height` 进行计算。

**（2）文本中的百分比**

1. `font-size`：根据父元素的 `font-size` 进行计算
2. `line-height`：根据 `font-size` 进行计算
3. `vertical-align`：根据 `line-height` 进行计算
4. `text-indent`：如果是水平的，则根据 `width` 进行计算；如果是垂直的，则根据 `height` 进行计算

**（3）定位中的百分比**

控制 `position` 位置的 `top`、`right`、`bottom`、`left` 都可以使用 `%` 作为单位。其参照物就是包含块的同方向的 `width` 和 `height`。

1. 如果元素定位为 `static | relative`，包含块一般是其父容器
2. 如果元素定位为 `absolute`，包含块应该是离它最近的有定位的祖先元素， `position: absolute | relative | fixed  `
3. 如果元素定位为 `fixed`，包含块就是视窗 `viewport`

**（4）变换中的百分比**

CSS 中的 `transform` 属性中的 `translate` 和 `transform-origin` 值也可以设置 `%`。

- `translateX()`：根据容器的 `width` 计算
- `translateY()`：根据容器的 `height` 计算
- `transform-origin`：横坐标 ` x ` 相对于容器的 `width` 计算；纵坐标 `y` 相对于容器的 `height` 计算
- `translateZ()`：不接受百分比为单位的值

## 十三、响应式布局⭐

流式布局、`flex`、`grid` 布局、`rem` / `em`、`vw` / `vh` 响应式布局。

### 1) `@media`

`@media`（*Media Queries*，媒体查询）：根据不同设备屏幕尺寸、分辨率、方向等调整页面布局。

(1) 媒体查询属性

1. `width` / `height`
2. `min-width` / `max-width`
3. `orientation`：`portrait`（竖屏） / `landscape`（横屏）
4. `resolution`：分辨率，单位 `dpi`、`dppx`
5. `-webkit-device-pixel-ratio`：是 `WebKit` 私有属性，仅适用于部分浏览器
6. `and` 多个条件同时满足，`,` 多个设备匹配一个即可

```css
/* 横屏或小屏幕设备都会应用此样式 */
@media (max-width: 600px), (orientation: portrait) {
    body { background: green; }
}
```

（2）移动优先还是 PC 优先

① 移动优先（*Mobile First*）

1. 使用 `min-width` 媒体查询
2. 默认样式是**适配最小屏幕**（即移动端）
3. 随着屏幕变宽，逐步增强（*progressive enhancement*）

```css
/* 移动优先：默认样式适配小屏，如 iPhone 5 */
body {
  background-color: red;
}

/* 针对高分屏 iPhone X（375px 宽、3x 像素密度） */
@media screen and (min-width: 375px) and (resolution: 3dppx) {
  body {
    background-color: #0FF000;
  }
}
```

② PC优先（*Desktop First*）

1. 使用 `max-width` 媒体查询
2. 默认样式是**适配 PC 端**
3. 随着屏幕变窄，逐步降级（*graceful degradation*）

```css
/* 默认样式：适配 PC */

body {
  background-color: red;
}

/* 当屏幕宽度小于等于 375px，且 DPR 为 3 时生效（如 iPhone X） */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 3) {
  body {
    background-color: #0FF000;
  }
}
```

### 2) 流式布局

流式 / 百分比布局：CSS3 支持最大最小高，可以将百分比和 `max(min)` 一起结合使用来定义元素在不同设备下的宽高。

缺点：

1. 计算困难，按照设计稿，必须换算成百分比单位
2. 各个属性中如果使用百分比，相对父元素的属性并不是唯一的

弄清楚 CSS 中子元素的百分比到底是相对谁的百分比。

1. 子元素的 `width: %` 总是相对于最近定位父元素的 `width`；子元素的 `height: %` 仅在父元素明确设置 `height`（非 `auto`）时才生效，相对于父元素的 `height`。
2. `left` / `right` 的百分比是相对于最近定位祖先的宽度；`top` / `bottom` 的百分比是相对于最近定位祖先的高度。
3. 所有方向的 `padding` 百分比值（无论水平还是垂直），都相对于 **包含块（通常是父元素）的宽度**。
4. `margin` 百分比通常相对于包含块的宽度计算（无论水平还是垂直方向），这在现代主流浏览器中是统一行为，但曾经存在不一致。
5. `border-radius`、`translateX/Y` 相对于自身尺寸；`background-size` 百分比是相对于背景定位区域（通常是 `padding box`）。

### 3) `rem` 和 `em` 布局

利用媒体查询，设置在不同设备下的字体大小。

`cssrem` 插件可以自动计算元素 `rem` 值，默认的 `rem=16px`，需要修改，到 `settings` 查找 `cssroot` 可以修改。

```less
body {
  font-size: 50px;
}
@number: 15;

@media screen and (min-width: 350px) {
  body {
    font-size: 350px / @number;
  } 
}

@media screen and (min-width: 500px) {
  body {
    font-size: 500px / @number;
  }
}
```

### 4) 视口单位布局

1. 用 `vw` 给 `html` 设置 `font-size`，让 `rem` 相对单位动态适配；
2. 用媒体查询限制 `font-size` 的最大值与最小值；
3. 再用 `rem()` 函数将设计稿 `px` 转为 `rem` 单位；
4. 限制 `body` 的最大最小宽度，避免页面太大或太小。

```scss
// 设定设计稿是 750px 基准（比如 iPhone6）
$vm_fontsize: 75; // 基准 root 字号
$vm_design: 750;  // 设计稿宽度

// px 转 rem 的方法
@function rem($px) {
    @return ($px / $vm_fontsize ) * 1rem;
}

// html 根元素设置字体大小，vw 控制缩放
html {
    font-size: ($vm_fontsize / ($vm_design / 100)) * 1vw; // 即 1vw = 7.5px（在750设计稿上）

    // 限制字体最小最大值，避免极小或极大的视口导致布局过度缩放
    @media screen and (max-width: 320px) {
        font-size: 64px;
    }
    @media screen and (min-width: 540px) {
        font-size: 108px;
    }
}

// 限制 body 的最大/最小宽度，避免响应式布局过宽或过窄
body {
    max-width: 540px;
    min-width: 320px;
    margin: 0 auto;
}
```

### 5) 图片响应式

位图图片（如 `PNG`、`JPG`）是由一个个像素点构成，每个像素拥有固定的颜色信息，按比例绘制在屏幕上。但在高分屏（`DPR > 1`）设备上：一个 CSS 像素 ≠ 一个物理像素。

例如：

- `DPR = 2`，1 个 CSS 像素需要 2×2 = 4 个物理像素渲染；
- 但如果图片仅为 1×1 像素，就无法提供足够的像素信息填满这块区域 → **模糊、锯齿**。

1. 使用 `<img srcset>`，浏览器会根据设备 `DPR` 自动选择最合适的图片加载

> 如果浏览器不支持 `srcset`，则默认加载 `src` 里面的图片
>
> 某些浏览器（如 Mac 上的 Chrome）可能同时加载 `src` 和 `srcset` 图 → 浪费流量；

```html
<img
  srcset="photo_1x.jpg 1x, photo_2x.jpg 2x"
  src="photo_1x.jpg"
  alt="高清图片" />
```

2. 使用 `<picture>` 元素
   1. `<picture>` 可用于格式选择（如 `WebP`）、响应式（不同屏宽）
   2. 不会多加载图片
   3. 更灵活，能替代 `srcset` 单图方案

>  `<source>` 不参与渲染，必须有 `<img>` 才能显示。

```html
<picture>
  <source srcset="banner.webp" type="image/webp" />
  <source srcset="banner_2x.jpg" media="(min-width: 800px)" />
  <img src="banner_1x.jpg" alt="响应式图片" />
</picture>
```

3. 使用 SVG 替代位图，SVG 是矢量图，不依赖像素，放大不会模糊。文件小，可压缩；适合图标、头像、图示等；不适合复杂照片类图像。

```html
<img src="avatar.svg" />
```

4. `max-width`：图片自适应尺寸，不能解决清晰度问题，仅解决尺寸适配

```css
img {
  max-width: 100%;
  height: auto;
  display: inline-block;
}
```

5. 媒体查询切换不同分辨率背景图（仅适用于 `background-image`）
6. 使用 `image-set()`（仅适用于 `background-image`）

```css
.avatar {
  background-image: url('avatar_1x.png');
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .avatar {
    background-image: url('avatar_2x.png');
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .avatar {
    background-image: url('avatar_3x.png');
  }
}

.avatar {
  background-image: -webkit-image-set(
    url('avatar_1x.png') 1x,
    url('avatar_2x.png') 2x
  );
}
```

7. 使用 JavaScript 动态设置图片，可高度定制（加载策略、延迟加载等）；不如 `srcset` / `<picture>` 高效，维护成本高。

```js
const dpr = window.devicePixelRatio;
document.querySelectorAll('img').forEach((img) => {
  const src = img.getAttribute('data-src');
  img.src = src.replace('.', `@${Math.round(dpr)}x.`);
});
```

## 十四、CSS三大特性

层叠性 、继承性、优先级

1. 层叠性（*Cascading*）：多个 CSS 规则作用于同一元素时，后定义的样式会覆盖先定义的（前提是优先级相同）

2. 继承性（ (*Inheritance*）：子元素会自动继承父元素的某些属性
   1. `display: inherit | initial;`：强制继承 | 重置为默认值
   2. 可继承的属性主要与文字相关，如字体、文本格式、列表、`cursor`、`visibility` 等
   3. 不可继承的属性与盒子、布局、背景、视觉样式有关，如 `text-decoration`、`vertical-align`、`opacity`、`box-shadow`、`transform`、`transition` 等

## 十五、变量

1. `--variant`：声明变量，变量名大小写敏感
   1. 如果变量值是一个字符串，可以与其他字符串拼接
   2. 如果变量值是数值，不能与数值单位直接连用，必须使用 `calc()` 函数，将它们连接
2. `var()`：可以读取变量，也可用于变量声明
   1. `var()`：函数第二个参数，表示变量的默认值，如果该变量不存在，就会使用这个默认值

```css
/* 变量声明 */
body {
  --foo: #7F583F;
  --bar: #F7EFD2;
}

--bar: 'hello';
--foo: var(--bar)' world';

.foo {
  --gap: 20;
  margin-top: calc(var(--gap) * 1px);
}

/* 读取变量 */
a {
  color: var(--foo, #7F583F);  /* 默认值 */
  text-decoration-color: var(--bar);
}

:root {
  --primary-color: red;
  --logo-text: var(--primary-color);  /* 变量声明 */
}
```

3. 作用域：同一个 CSS 变量，可以在多个选择器内声明。读取的时候，优先级最高的声明生效。这与 **CSS 的层叠规则**是一致的。**变量的作用域就是它所在的选择器的有效范围。**
   1. 全局变量通常放在根元素 `:root` 里面，确保任何选择器都可以读取它们。
   2. 变量支持继承，子元素可以继承父元素定义的变量的值。
   3. 变量可以被覆盖，并且具有局部作用域。

```css
/* 变量--foo的作用域是body选择器的生效范围，--bar的作用域是.content选择器的生效范围 */
body {
  --foo: #7F583F;
}

.content {
  --bar: #F7EFD2;
}

/* 全局变量 */
:root {
    --main-color: blue;
}

.child {
    --main-color: red; /* 重写父元素的 --main-color 变量 */
    color: var(--main-color); /* 子元素的文字颜色为 red */
}
```

4. 响应式布局：`@media` 命令里面声明变量，使得不同的屏幕宽度有不同的变量值。

```css
body {
  --primary: #7F583F;
  --secondary: #F7EFD2;
}

a {
  color: var(--primary);
  text-decoration-color: var(--secondary);
}

@media screen and (min-width: 768px) {
  body {
    --primary:  #F7EFD2;
    --secondary: #7F583F;
  }
}
```

5. 兼容性处理，`@support` 命令进行检测

```css
a {
  color: #7F583F;
  color: var(--primary);
}

@supports ( (--a: 0)) {
  /* supported */
}

@supports ( not (--a: 0)) {
  /* not supported */
}
```

## 十六、CSS3新增特性

1. 选择器
2. 新样式
   1. 边框属性：`border-radius`、`box-shadow`、`border-image`
   2. 背景属性：`background-clip`、`background-origin`、`background-size`、`background-break`
   3. 文字：`word-wrap`、`text-overflow`、`text-shadow`、`text-fill-color`、`text-stroke-color`、`text-stroke-width`
   4. 渐变：`linear-gradient`、`radial-gradient`
3. 颜色：颜色表示方式 `rgba` 与 `hsla`
   1. `rgba` 分为两部分，`rgb` 为颜色值，`a` 为透明度
   2. `hsla` 分为四部分，`h` 为色相，`s` 为饱和度，`l` 为亮度，`a` 为透明度
4. 过渡和动画： `transform`、`transition` 和 `animation`
5. 布局：`flex`、`grid`、媒体查询、响应式布局

![](.\images\C3新增选择器.jpg)

## 十七、CSS优化

1. CSS 渲染规则：选择器从右往左匹配
2. 层级嵌套最好不要超过 3 层，不要过度依赖 HTML 结构，避免链式选择符
3. 慎用 `*` 通配符选择器，避免后代选择符，不要在 id 选择器前面嵌套其它选择器
4. 避免 `！important`，可以选择其他选择器
5. **避免使用 `@import`**
  - 只有 `@import` 文件下载完浏览器才会继续解析，浏览器无法并行下载所需的样式文件。
  - `@import` 会引发资源文件的下载顺序被打乱，排列在 `@import` 后面的 JS 文件先于 `@import` 下载，打乱甚至破坏 `@import` 自身的并行下载。
6. CSS 文件压缩，打包工具 Webpack
7. 小图处理：精灵图、字体图标
8. 删除无用的 CSS 代码，删除不必要的单位和零。谷歌浏览器的 `Source` 界面——点击 `Coverage`，在 `Coverage analysis` 窗口中高亮显示当前页面上未使用的代码。
9. 使用紧凑的语法，避免不必要的重复，尽可能的精简规则，可以合并不同类里的重复规则
10. 避免不必要的命名空间、避免过度约束
11. 使用语义化名字，如类名应该是描述他是什么而不是像什么

## 十八、回流和重绘

1. 回流：布局引擎会根据各种样式计算每个盒子在页面上的大小与位置

2. 重绘：当计算好盒模型的位置、大小及其他属性后，浏览器根据每个盒子特性进行绘制


> 在页面初始渲染阶段，回流不可避免的触发（页面一开始是空白的元素，后面添加了新的元素使页面布局发生改变）。
>

**（1）触发**

回流这一阶段主要是计算节点的位置和几何信息。

1. 添加或删除可见的 DOM 元素
2. 元素位置发生变化
3. 元素尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
4. 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代
5. 页面一开始渲染的时候（这避免不了）
6. 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

还有一些容易被忽略的操作：获取一些特定属性的值。这些属性有一个共性，就是需要通过即时计算得到。因此浏览器为了获取这些值，也会进行回流。

`offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight、getComputedStyle`

触发回流一定会触发重绘。还有一些其他引起重绘行为：颜色、阴影、文本方向等的修改。

**（2）优化回流和重绘**

1. 批量修改 DOM 样式，添加 `class`

```js
.update{
  margin: 5px;
  border-dadius: 12px;
  box-shadow: 1px 3px 4px #ccc
}
const el = document.querySelector('.box')
el.classList.add('update')
```

2. 如果需要对 DOM 进行多次访问，尽量使用局部变量缓存该 DOM。DOM 离线处理，减少回流重绘次数，离线的 DOM 不属于当前 DOM 树中的任何一部分。
3. `documentFragment` 批量处理 DOM。通过 `documentFragment` 创建一个 DOM 文档片段，在它上面批量操作 DOM，操作完成之后，再添加到文档中，这样只会触发一次重排。

```js
const el = document.querySelector('.box')
const fruits = ['front', 'nanjiu', 'study', 'code'];
const fragment = document.createDocumentFragment();
fruits.forEach(item => {
  const li = document.createElement('li');
  li.innerHTML = item;
  fragment.appendChild(li);
});
el.appendChild(fragment);

// 克隆节点，修改完再替换原始节点
const el = document.querySelector('.box')
const fruits = ['front', 'nanjiu', 'study', 'code'];
const cloneEl = el.cloneNode(true)
fruits.forEach(item => {
  const li = document.createElement('li');
  li.innerHTML = item;
  cloneEl.appendChild(li);
});
el.parentElement.replaceChild(cloneEl,el)
```

4. `display: none`：将元素从渲染树中完全移除，在该 DOM 上的操作不会触发回流与重绘，操作完之后再将`display` 属性改为显示，只会触发这一次回流与重绘。`visibility: hidden;` 影响重绘不影响重排。
5. 避免使用 `table` 布局
6. 元素脱离普通文档流。使用 `absoulte` 或 `fixed` 让元素脱离普通文档流，使用绝对定位会使的该元素单独成为渲染树中 `body` 的一个子元素，重排开销比较小，不会对其它节点造成太多影响。
7. CSS3 硬件加速（GPU加速）。使用 CSS3 硬件加速，可以让 `transform、opacity、filters、Will-change` 这些动画不会引起回流重绘 。但是对于动画的其它属性，比如 `background-color` 这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能。
8. 将节点设置为图层。图层能够阻止该节点的渲染行为影响别的节点。比如对于 `<video>` 标签来说，浏览器会自动将该节点变为图层。


## 十九、三角&渐变&阴影

### 三角

（1）通过 `border` 实现三角

当一个元素的 `width` 和 `height` 为 `0`，且 `border` 具有不同颜色时，边框会在中心交汇，形成一个三角形。

```css
.triangle {
  width: 0;
  height: 0;
  border-top: 100px solid black;
  border-bottom: 100px solid pink;
  border-right: 100px solid purple;
  border-left: 100px solid greenyellow;
}
```

1. 不同方向的三角形：如上三角形 `border-left` 和 `border-right` 设置为透明，使其不显示；`border-bottom` 赋值颜色，形成**朝上的三角形**。
2. 不同类型的三角形：等腰三角形 | 直角三角形
   1. 等腰三角形：宽度 `border-left` 和 `border-right` 一致
   2. 直角三角形：宽度 `border-left` 或 `border-right` 设置为 `0`

```css
.triangle-up {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 50px solid red;
}

.triangle-isosceles {
    width: 0;
    height: 0;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-bottom: 50px solid purple;
}
```

（2）`clip-path`：裁剪元素，可以用 `polygon()` 创建任意形状的三角形，适用于响应式布局，但 IE 不支持。

```css
/* 等腰三角形 */
.triangle-clip {
    width: 100px;
    height: 100px;
    background: red;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);  /* 顶点 底部两个点 */
}
```

（3）`mask-image` 结合 `linear-gradient`，适用于高级 UI 设计，兼容性较差。

```css
.triangle-mask {
    width: 100px;
    height: 100px;
    background: red;
    mask-image: linear-gradient(to top left, transparent 50%, black 50%);
}
```

### 渐变

（1）`linear-gradient` 线性渐变

① 属性

```css
background: linear-gradient(direction, color-stop1, color-stop2, ...);
```

1. `direction`：渐变的方向，可以是角度（如 `45deg`）或关键词（如 `to right`）
   1. 角度：使用 `deg` 单位指定角度
   2. 关键词：`to top | to bottom（默认）| to left | to right | to top left | to top right | to bottom left | to bottom right`
2. `color-stop`：颜色停止点，用于定义渐变的颜色及其位置，`color position`
   1. `color`：颜色值，如 `red`、`#ff0000`、`rgba(255, 0, 0, 0.5)`
   2. `position`：颜色出现的位置，可以是百分比（如 `50%`）或长度值（如 `20px`）

② 应用

1. 设置文字渐变色
   1. 设置文字的 `background` 为渐变色
   2. `-webkit-background-clip: text;`：将背景裁剪为文字形状
   3. `color: transparent;`：隐藏文字的原始颜色，确保只显示渐变背景
2. `repeating-linear-gradient()`：多重颜色渐变

```css
/* 1.指定颜色位置 */
/* 从 0% 到 50%，红色渐变到绿色；从 50% 到 100%，绿色渐变到蓝色 */
background: linear-gradient(to right, red 0%, green 50%, blue 100%);

/* 2.透明度渐变 */
.gradient {
  background: linear-gradient(to right, rgba(255, 0, 0, 0), rgba(255, 0, 0, 1));
}

/* 3.文字渐变 */
.gradient-text {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(90deg, #ff7f50, #1e90ff); /* 定义渐变颜色 */
  -webkit-background-clip: text;
  color: transparent; /* 隐藏原始文本颜色 */
}

/* 4.多重渐变颜色 */
/* 从 45 度方向，红色和蓝色交替重复，每个颜色块宽度为 10px */
background: repeating-linear-gradient(45deg, red, red 10px, blue 10px, blue 20px);
```

（2）`radial-gradient`：径向渐变， 用于创建从中心向外扩展的渐变效果

```css
/* 圆形渐变，默认从中心向外 */
.element {
  background-image: radial-gradient(circle, red, yellow);
}

/* 椭圆形渐变 */
.element {
  background-image: radial-gradient(ellipse, red, yellow);
}

/* 设置渐变的起始位置 */
/* 渐变的中心从元素的左上角开始 */
.element {
  background-image: radial-gradient(circle at top left, red, yellow);
}
```

### `Box Shadow`

`box-shadow`：盒子阴影，多重阴影用 `,` 分隔

语法：`水平偏移 垂直偏移 [模糊半径] [扩散半径] 颜色 [inset]`

1. 水平偏移：正值右移，负值左移
2. 垂直偏移：正值下移，负值上移
3. 模糊半径：越大越模糊（可选，默认为 `0`）
4. 扩散半径：阴影扩展大小（可选，默认为 `0`）
5. 颜色：支持 `#HEX`、`rgb()` 等
6. `inset`：内阴影（可选）

```css
div {
  box-shadow: 5px 5px 10px gray; /* 右下阴影，模糊10px */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); /* 发光效果 */
  box-shadow: inset 2px 2px 5px black; /* 内阴影 */
  box-shadow: 2px 2px red, 4px 4px blue; /* 多重阴影 */
}
```


