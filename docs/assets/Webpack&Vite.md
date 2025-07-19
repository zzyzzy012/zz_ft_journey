# `webpack`

## 学习笔记

### `loader`

#### 打包 CSS

1. `css-loader`：解析 CSS 文件资源，但不会在页面中生效。

2. `style-loader`：在 CSS 文件解析完后，将样式插入到页面中。

3. `less-loader`：处理 `less` 文件资源。

4. `postcss-loader`：通过 JS 来转换样式的工具，可以进行一些 CSS 的转换和适配，比如自动添加浏览器前缀、CSS样式的重置。


> 1. `autoprefixer`：是 `postcss` 的一个插件，添加浏览器前缀。
> 2. `postcss-reset-env`：是 `postcss` 的一个插件，将一些现代 CSS 特性，转成大多数浏览器认识的 CSS，并且根据目标浏览器或者运行时环境添加所需的 `polyfill`，会帮我们自动添加 `autoprefixer`。

```bash
npm install css-loader style-loader less-loader postcss-loader postcss-reset-env -D
npm uninstall autoprefixer
```

```json
module: {
  rules: [
    {
      test: /\.css$/,
      // use: [  // 使用顺序，从下往上
      //   { loader: "style-loader" }  // 对象形式，可配置如 options 等其他属性
      //   { loader: "css-loader" },
      // ]
      // 如果只有一个 loader
      // use: "css-loader"
      // 如果多个 loader
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                "autoprefixer"
              ]
            }
          }
        }
      ]
    },
    {
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        "less-loader",  // less 解析为 css，css 样式插入页面中
        "postcss-loader"
      ]
    }
  ]
}
```

可以将复杂配置抽取到独立文件。

```js
// postcss.config.js
module.exports = {
  plugins: [
    // require("autoprefixer")
    postcss-preset-env
  ]
}
```

#### 打包图片

在 webpack5 之前，加载资源需要使用如 `file-loader`、`url-loader`、`raw-loader`；

在 webpack5 之后，可以直接使用资源模块类型（*asset module type*），来替代上面的这些 `loader`。

1. `asset/resource`：发送一个单独的文件并导出 URL，之前通过 `file-loader` 实现。
2. `asset/inline`：导出一个资源的 data URL，之前通过使用 `url-loader` 实现。
3. `asset/source`：导出资源的源代码，之前通过 `raw-loader` 实现。
4. `asset`：在到处一个 data URL 和发送一个单独的文件之间自动选择，之前通过 `url-loader`，并且配置资源体积限制实现。

```json
{
  test: /\.(png|jpe?g|svg|gif)$/,
  // 1.打包图片，图片都有自己的地址，将地址设置到img/bg-image中
  // 多图片次数的网络请求
  // type: "asset/resource"
  // 2.将图片进行base64编码，并且直接将编码后的文件放入到打包后的js文件中
  // 少网络请求，js文件很大，阻塞浏览器解析
  // type: "asset/inline"
  // 合理规范
  // 对于小一点的图片，进行base64编码
  //对于大一点的图片，单独的图片打包，形成URL地址，单独请求这个URL图片
  type: "asset",
  parser: {
    dataUrlCondition: {
      // 以什么图片为分界线，从而进行对于处理
      maxSize: 60*1024  // 单位字节
    }
  },
  generator: {
    // 占位符
    // name: 原来的名字
    // ext: extension 扩展名
    // hash: webpack生成的hash值，可以截取，用:8，表示截取8位
    // img/ 自动生成打包图片的文件夹
    filename: img/[name]_[hash:8][ext]
  }
}
```

#### 打包JS

使用 `babel-loader` 将 ES6 语法降级为 ES5 语法。如果要转换的内容过多，一个个设置是比较麻烦的，可以使用预设 `@babel/preset-env`。

常见的预设：env、react、TypeScript

```bash
npm install babel-loader @babel/preset-env
```

```json
{
  test: /\.js/,
  use: [
    {
      loader: "babel-loader",
      options: {
        plugins: [
          "@babel/plugin-transform-arrow-functions",  // 处理箭头函数
          "@babel/plugin-transform-block-scoping"  // 处理块级作用域，let/const定义的变量等
        ]
      }
    }
  ]
}
```

单独配置

```js
module.exports = {
  // plugins: [
  //   "@babel/plugin-transform-arrow-functions",  // 处理箭头函数
  //   "@babel/plugin-transform-block-scoping"  // 处理块级作用域，let/const定义的变量等
  // ]
  presets: [
    "@babel/preset-env"
  ]
}
```

#### 打包Vue

```bash
npm install vue-loader -D
```

```js
const { VueLoaderPlugin } = require("vue-loader/dist/index")
module.exports = {
  module: {
    test: /\.js/,
    use: [
      {
        loader: "vue-loader",
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()  // 还需配置插件
  ]
}
```

#### 解析文件

- 如果是一个文件
  - 如果文件有扩展名，直接打包文件
  - 否则，使用 `resolve.extensions` 选项作为文件扩展名解析
- 如果是一个文件夹
  - 会在文件夹中根据 `resolve.mainFiles` 配置选项中指定的文件顺序查找
  - `resolve.mainFiles` 的默认值是 `["index"]`
  - 再根据 `resolve.extensions` 来解析扩展名

```js
// webpack.config.js
module.exports = {
  resolve: {
    extensions: [".js", ".json", ".vue", ".jsx", ".ts", ".tsx"],
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
    }
  }
}
```

`resolve.alias`：创建 `import` 或 `require` 的别名，来确保模块引入变得更简单。对象。

```js
import Utility from '../../utilities/utility';
// 替换“在导入时使用相对路径”这种方式
import Utility from 'Utilities/utility';
```

`resolve.extensions`：尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。字符串数组，默认是 `['.js', '.json', '.wasm']`。

能够使用户在引入模块时不带扩展。

```js
import File from '../path/to/file';
```

### `plugin`

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { DefinePlugin } = require("webpack")
module.exports = {
  mode: "development",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '电商项目',
      template: ./index.html // 选择自己提供的模板
    }),
    new DefinePlugin({
      Base_URL: "%"  // 里面代码视为是JS代码运行
    }),
    // new CleanWebpackPlugin()  // 在配置文件中直接设置 clean: true 替代了
  ]
}
```

### 本地服务器

搭建本地服务器，打包后的东西放入内存中，而不是放入磁盘中，读写磁盘里的文件效率低。

```bash
npm install webpack-dev-server -D
```

```json
// package.json
"scripts": {
  "build": "webpack build --config webpack.config.js"
 	"server": "webpack serve  --config webpack.config.js"
}
```

```bash
npm run build  // 打包
npm run serve // 搭建本地服务器
```

### HMR

HMR（*Hot Module Replacement*，模块热替换）在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个页面。

HMR通过如下几种方式，来提高开发的速度：

1. 不重新加载整个页面，这样可以保留某些应用程序的状态不丢失；
2. 只更新需要变化的内容，节省开发的时间；
3. 只修改了 `css、js` 源代码,会立即在浏览器更新，相当于直接在浏览器的 `devtools` 中直接修改样式。

使用HMR

默认情况下，`webpack-dev-server` 已经支持 HMR，我们只需要开启即可(默认已经开启)；

在不开启 HMR 的情况下，当我们修改了源代码之后，整个页面会自动刷新，使用的是 `live reloading`。

```js
// webpack.config.js
module.exports = {
  // ...
  devServer {
  hot: true
	}
}
```

```js
// 针对特定module的HMR
// ./utils/math.js
if (module.hot) {
  module.hot.accept("./utils/math.js")
}
```

```js
// 其他常见配置
// webpack.config.js
module.exports = {
  // ...
  devServer {
    host: "",
    port: 8888,
    hot: true,
    open: true,
    compress: true,
    proxy: // ...
	}
}
```

### 区分开发环境和生产环境

创建 `config` 文件，里面分别放开发环境和生成环境的配置文件。

```js
// webpack.dev.config.js
// webpack.prod.config.js
// 对于相同的配置，抽取为独立文件 webpack.comm.config.js
```

```bash
npm install webpack-merge -D
```

```js
// webpack.dev.config.js
const { merge } = reqire("webpack-merge")
const commonConfig = reqire("./webpack.com.config")

module.exports = merge(commonConfig, {
  mode: "development",
  devServer: {
    hot: true,
    // ...
  }
})
```

```js
// webpack.prod.config.js
const { cleanWebpackPlugin } = reqire("clean-webpack-plugin")
const { merge } = reqire("webpack-merge")
const commonConfig = reqire("./webpack.com.config")

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    clean: true
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
})
```

## 补充知识

### `loader`&`plugin`

#### `loader`

`loader`：可以处理不同格式文件。可以编译文件，从而使其能够添加到依赖关系中。

Webpack 本身只能打包 `commonJS` 规范的 JS 文件，针对 CSS，图片等格式的文件没法打包，需要引入第三方的模块进行打包。`loader` 类似翻译官，对其他类型的资源进行转译的预处理工作。

> `loader` 只专注于转化文件，完成压缩、打包、语言翻译。`loader` 本质是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。

在 `module.rules` 中配置，**作为模块的解析规则而存在**。 类型为数组，每一项都是一个 `Object`，`test` 处理特定类型的文件 ，`use` 使用特定的 `loader` 处理文件，可具体配置 `options`。

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                "autoprefixer"
              ]
            }
          }
        }
      ]
    },
  ]
}
```

常用 `loader`

**① 处理 CSS**

1. `less-loader`：将 `less` 代码转换成 `css`
2. `sass-loader`：将 `scss/sass` 代码转换成 `css`
3. `css-loader`：加载 `css`，支持模块化、压缩、文件导入等特性
4. `style-loader`：把 `css` 代码注入到 `JavaScript` 中，通过 `DOM` 操作去加载 `CSS`
5. `postcss-loader`：扩展 `CSS` 语法，可以配合 `autoprefixer` 插件自动补齐 `CSS3` 前缀

**② 处理图片、其他资源**

1. `file-loader`：把文件输出到文件夹中，在代码中通过相对 `URL` 引用输出的文件（处理图片和字体）
2. `url-loader`：与 `file-loader` 类似，区别是用户可以设置⼀个阈值，大于阈值会交给 `file-loader` 处理，小于阈值时返回文件 `base64` 形式编码
3. `raw-loader`：加载文件原始内容 `utf-8`
4. `image-loader`：加载并且压缩图片文件
5. `svg-inline-loader`：将压缩后的 `SVG` 内容注入代码中
6. `source-map-loader`：加载额外的 `SourceMap` 文件，以方便断点调试

> `file-loader、url-loader、image-webpack-loader` 过时了

**③ 处理 `JS | TS | React | Vue`**

1. `babel-loader`：把 ES6 转换成 ES5
3. `ts-loader`：将 `TS` 转换成 `JS`
4. `awesome-typescript-loader`：将 `TS` 转换成 `JS`，性能优于 `ts-loader `
5. `eslint-loader`：通过 `ESLint` 检查 `JS` 代码
5. `tslint-loader`：通过 `TSLint` 检查 `TS` 代码
6. `json-loader`：加载 `JSON` 文件（默认包含） 
7. `vue-loader`：加载 `.vue` 文件组件
8. `cache-loader`：在⼀些性能开销较大的 `loader` 之前添加，将结果缓存到磁盘里

#### `plugin`

`plugin`：在 Webpack 运行的生命周期中会广播出许多事件，`plugin` 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

扩展 webpack 的功能，作用于 webpack 本身。从打包优化和压缩，到重新定义环境变量，可以处理各式任务。

在 `plugins` 中单独配置，类型为数组，每一项都是一个 `plugin` 实例，参数都通过构造函数传入。

```js
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  // 其他配置
  plugins: [
    new webpack.DefinePlugin({
      // process.env.NODE_ENV 和 process.env.API_URL 在代码中将被替换为对应的环境变量值
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    })
  ]
};
```

（1）`plugin` 实现机制

1. 创建：Webpack 在其内部对象上创建各种钩子；
2. 注册：插件将自己的方法注册到对应钩子上，交给 Webpack ；
3. 调用：Webpack 编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。

（2）常用 `plugin`

1. `clean-webpack-plugin`：在构建新版本的项目时自动清理输出目录，确保每次构建时，输出目录只包含最新的构建文件，而不会保留旧文件
2. `mini-css-extract-plugin`：分离样式文件，将 `CSS` 提取为独立文件，支持按需加载
3. `html-webpack-plugin`：简化 `HTML` 文件创建，依赖于 `html-loader`
4. `web-webpack-plugin`：为单页面应用输出 `HTML`，比 `html-webpack-plugin` 好用
5. `define-plugin`：定义环境变量，Webpack4 之后指定 `mode` 会自动配置
6. `ignore-plugin`：忽略部分文件
5. `webpack-bundle-analyzer`：可视化 Webpack 输出文件的体积
6. `webpack-parallel-uglify-plugin`：多进程执行代码压缩，提升构建速度
7. `terser-webpack-plugin`：支持压缩 ES6
8. `uglifyjs-webpack-plugin`：压缩 ES6 代码（Webpack4）
10. `serviceworker-webpack-plugin`：为网页应用增加离线缓存功能
11. `module-concatenation-plugin`：开启 *Scope Hoisting*
13. `speed-measure-webpack-plugin`：可以看到每个 `loader` 和 `plugin` 执行耗时（整个打包耗时、每个 `plugin` 和 `loader` 耗时）
14. `@svgr/webpack`：将 `SVG` 文件转换为 `React` 组件

#### 区别

1. 职责
   1. `loader` 负责文件类型转换，如将 `less、scss、ES6、jsx` 等文件转换为 Webpack 可识别的模块，并打包成最终的静态资源文件。
   2. `plugin` 扩展 Webpack 的功能，可以对 Webpack 输出的结果进行优化、处理和修改。
2. 作用范围
   1. `loader`：针对每个模块进行处理，对于特定类型的文件，在打包过程中，找到对应的 `loader` 进行处理，其作用范围仅限于自己匹配的文件。
   2. `plugin`：作用于构建过程的整个生命周期中，Webpack 运行的生命周期中会广播出许多事件，`plugin` 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
3. 使用方式
   1. `loader` 通过 `module.rules` 配置使用，`test` 处理特定文件，`use` 使用对应 `loader`。
   2. `plugin` 通过 `plugins` 配置，`new` 生成实例，以传入参数的方式进行配置。
4. 编写方式
   1. `loader`：一般是以纯函数的形式编写，接受模块源码作为输入，转换后的结果作为输出。
   2. `plugin`：是一个 JavaScript 类，包含一个 `apply` 方法，用于接收 Webpack 的 `Compiler` 对象，通过`Compiler` 对象可以获取到 Webpack 在打包过程中产生的各种 `hook`，然后在 `hook` 中完成特定操作。

### `module`&`chunk`&`bundle`

1. `module`：是 Webpack 处理的单个文件，代表了应用程序的组成部分。
2. `chunk`：是逻辑上的代码块，表示一组相互依赖的模块。它可以根据需要进行拆分和加载。
3. `bundle`：是由 Webpack 生成的最终输出文件，它包含了所有模块的代码和资源。

#### module

`module`（模块）：是 Webpack 处理代码的单个文件，可以是 JS、CSS、图片或其他类型的文件。

模块可以包含代码、依赖关系和其他相关资源，它们通常用于组织和管理应用程序的各个部分。

#### bundle

`bundle`（捆绑包）：由 Webpack 根据模块之间的依赖关系生成的最终输出文件。通常是用于在浏览器中加载和执行的最终文件，包含了应用程序所需的所有代码和资源。

在开发过程中，Webpack 会根据入口文件 `entry` 和模块之间的依赖关系，将多个模块递归地构建一个或多个捆绑包。

#### chunk

`chunk`（代码块）：打包过程中生成的代码块，Webpack 在构建过程中生成的一个或多个模块的集合。每个 `chunk` 可以被视为一个独立的代码块，可能包含多个模块的代码。

当 Webpack 构建应用程序时，它会根据依赖关系将模块组织成不同的代码块，例如代码分割，实现按需加载（懒加载）。

（1）类型

1. 主 `chunk`：入口文件生成的主要代码块，包含了应用的核心逻辑。
2. 异步 `chunk`：通过代码分割或动态导入 `import()` 生成的代码块，这些块在应用运行时按需加载。

（2）结构

1. `Chunk ID`
2. 文件名
3. 依赖关系：该 `chunk` 依赖的模块和其他 `chunk`
4. 模块列表：实际包含的模块代码

（3）作用

1. 按需加载/懒加载：异步 `chunk` 支持按需加载，减少初始加载的 JS 文件大小。
2. 并行加载：浏览器可以并行请求多个 `chunk`。
3. 缓存优化：`chunk` 可以被缓存，如果某个 `chunk` 发生变化，其他未变化的 `chunk` 依然可以利用缓存。

（4）打包和加载运行时 `chunk`

运行时 `chunk`（*Runtime Chunk*）：负责管理 Webpack 打包后生成的模块交互的代码，它包含了 Webpack 的模块加载逻辑，例如模块引入、模块之间的依赖解析、异步加载逻辑等。

在项目运行时，Webpack 需要运行时 `chunk` 来确保应用程序能够正确加载、解析并执行各个模块。

① 作用

1. 模块管理：它维护模块的依赖图，确保正确加载所需的模块。
2. 按需加载/懒加载/异步加载
3. 哈希映射：在生产环境中，运行时 `chunk` 会帮助 Webpack 跟踪模块和文件的哈希值，确保浏览器能够正确缓存和更新资源。

② 打包运行时 `chunk`

Webpack 提供了配置项来将运行时代码抽离成一个单独的文件 `chunk`，而不是与业务逻辑一起打包。

Ⅰ 优点

1. 运行时代码较为稳定，不经常变化，抽离后可以更好利用浏览器缓存。
2. 将运行时代码与业务逻辑分开，减少业务 `bundle` 体积。

Ⅱ 使用 `optimization.runtimeChunk` 将运行时代码提取为单独的 `chunk`。

1. 设置为 `true`：Webapck 会生成一个默认的 `runtime` 文件。
2. 设置为 `{ name: 'runtime' }`：可以为这个运行时 `chunk` 自定义名字。

```js
module.exports = {
  // 其他配置...
  optimization: {
    runtimeChunk: {
      name: 'runtime', // 自定义运行时 chunk 的名字
    },
  },
};
```

Ⅲ 打包后的输出文件：配置完成后，Webpack 会将运行时代码打包成一个单独的 `runtime.[hash].js` 文件，这个文件需要与业务代码一起在 `HTML` 页面中引入。

③ 加载运行时 `chunk`，确保在页面中正确引入。

1. 手动引入

```html
<!-- index.html -->
<script src="/dist/runtime.js"></script>
<script src="/dist/main.js"></script>
```

2. 自动引入：`HtmlWebpackPlugin` 会自动将生成的所有 `chunk`，包括运行时 `chunk`，注入到生成的 `html` 文件中。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 其他配置...
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
```

### Webpack 常见配置

1. `entry`：定义应用的入口点，可以是单个文件或多个文件。


2.  `output`：配置打包后文件的输出位置和文件名。


3. `loaders`：处理非 JavaScript 文件（如 CSS、图片、字体等）。


4. `plugins`：用于扩展 Webpack 的功能，执行各种任务（如压缩、优化等）。


5. `mode`：指定构建模式，`'development' | 'production'`，影响默认的优化设置。


6. `devServer`：开发服务器，配置 `Webpack Dev Server`，用于本地开发时的实时刷新和热模块替换。


7. `resolve`：模块解析，配置模块解析的选项，包括别名和文件扩展名。


8. `optimization`：优化设置，配置打包优化选项，如代码分割和压缩。


9. `devtool`：源映射，配置调试源映射，帮助开发者调试代码。


10. `performance`：性能提示，配置性能提示，帮助识别打包后的文件大小。

```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // 1. 入口文件
  entry: './src/index.js',

  // 2. 输出设置
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  // 3. 加载器（Loaders）：处理非 JS 文件
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // 处理 CSS
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'], // 处理图片
      },
    ],
  },

  // 4. 插件（Plugins）：扩展功能
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 自动生成 HTML 文件
    }),
    new CleanWebpackPlugin(), // 每次打包清空 dist 目录
  ],

  // 5. 模式（Mode）：影响默认优化行为
  mode: 'development', // 'production' 也可以

  // 6. 开发服务器（DevServer）：本地开发用
  devServer: {
    contentBase: './dist',
    hot: true, // 热模块替换
  },

  // 7. 模块解析（Resolve）：简化 import 路径
  resolve: {
    extensions: ['.js', '.jsx'], // 自动解析文件扩展名
    alias: {
      '@': path.resolve(__dirname, 'src'), // 设置路径别名
    },
  },

  // 8. 优化配置（Optimization）：代码分割等
  optimization: {
    splitChunks: {
      chunks: 'all', // 自动提取公共模块
    },
    minimize: true, // 启用压缩（生产模式默认开启）
  },

  // 9. 源映射（Devtool）：便于调试
  devtool: 'source-map',

  // 10. 性能提示（Performance）：监控构建产物大小
  performance: {
    hints: 'warning',
    maxAssetSize: 100000, // 超过 100kb 提示警告
  },
};
```

#### `externals` 配置选项

`externals`：指定哪些模块不应该被打包到最终的 `bundle` 中。

(1) 优点

1. 将第三方库标记为外部依赖，通过 CDN 或其他外部来源加载，如 `jQuery、React`，避免重复打包，提高性能。通常 CDN 会提供更好的性能和缓存策略。
3. 在一些特定环境下，希望某些库或模块在运行时由外部提供，而不是被打包到应用中。

(2)  使用

1. 通过 CDN 加载库时，可以将这些库设置为外部依赖。
2. 多页面应用：多个页面可能共享一些库，使用 `externals` 可以避免在每个页面的 `bundle` 中都包含这些共享库。
3. 第三方插件：当你的应用依赖某些大型的第三方插件，且这些插件在运行时会由其他地方提供时，可以使用 `externals` 将其排除在打包之外。

```js
// webpack.config.js
module.exports = {
  // ...
  externals: {
    // 将 react 和 react-dom 标记为外部依赖
    react: 'React',  // 表示在打包过程中，import React from 'react' 会被处理为使用全局变量 React，而不是打包到 bundle 中
    'react-dom': 'ReactDOM',
    // 通过 CDN 加载的 jQuery
    jquery: 'jQuery'  // 这样在打包时，import $ from 'jquery' 会被替换为使用全局变量 jQuery
  }
};
```

#### `optimization` 配置选项

`splitChunks`：将代码拆分为独立块，提取共享代码到单独文件，利用缓存减小打包文件大小。

1. `chunks`：对同步代码还是异步代码进行处理。默认配置中，`chunks` 仅仅针对于异步（*async*）请求，可以设置为 `"initial | all"`。
2. `minSize`： 拆分包的大小, 至少为 `minSize`，如果包的大小不超过 `minSize`，这个包不会拆分。
3. `maxSize`： 将大于 `maxSize` 的包，拆分为不小于 `minSize` 的包。
4. `minChunks`：被引入的次数，默认是 `1`。

```js
module.exports = {
  // 优化配置
  optimization: {
    splitChunks: {
      // chunks仅仅针对异步async请求，也可设为all
      chunks: "all",
      // 当一个包大于指定大小时，继续拆包
      maxSize: 20000,
      // 根据Module使用频率分包
      // 设定引用次数超过2的模块才分包
      minChunks: 2
    }
  }
};
```

（1）规则

1. 代码块大小：默认将超过 `30KB` 的代码块拆分为单独文件。
2. 共享模块：提取被多个模块引用的共享模块到独立共享块，避免重复加载。
3. 缓存组：根据模块属性分组，定制拆分规则。
4. 预取/预加载模块：根据策略拆分模块，优化加载。

（2）原理

1. 静态分析：解析模块依赖、函数调用和变量引用。
2. 模块共享和重复引用：查找被多模块引用的共享模块或重复引用模块。
3. 拆分共享块：提取共享模块到独立共享块，生成单独文件。
4. 缓存组和拆分规则：根据属性分组，灵活控制拆分。
5. 加载和引用共享块：生成单独文件，通过 `<script>` 标签或异步加载引用。

#### 配置相关问题

> （1）Webpack 怎么配置多入口应用， 并实现公共依赖的提取？

1. `entry` 配置多入口：每个入口对应一个输出文件。

```js
const path = require('path');

module.exports = {
  entry: {
    // app 和 admin 是两个入口点，每个入口点生成一个独立的 bundle 文件
    app1: './src/app1/index.js',
    app2: './src/app2/index.js',
  },
  output: {
    filename: '[name].bundle.js', // 使用入口名称生成文件名
    path: path.resolve(__dirname, 'dist'),
  },
};
```

2. `SplitChunksPlugin` 提取公共依赖：确保不同入口点共享的模块只打包一次。

```js
module.exports = {
  // ...其他配置
  optimization: {
    splitChunks: {
      chunks: 'all', // 从所有块中提取公共模块
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, // 只提取来自 node_modules 的模块
          name: 'vendor', // 公共依赖的名称
          chunks: 'all',
        },
      },
    },
  },
};
```

3. 处理输出文件：通过以上配置，Webpack 将生成多个入口文件以及一个包含公共依赖的文件。如 `app1.bundle.js、app2.bundle.js、vendor.bundle.js`（公共依赖）
4. `HtmlWebpackPlugin` 生成 `html` 文件，自动引入打包生成的 `JS` 文件。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...其他配置
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app1/index.html',
      filename: 'app1.html',
      chunks: ['vendor', 'app1'], // 引入公共依赖和 app1
    }),
    new HtmlWebpackPlugin({
      template: './src/app2/index.html',
      filename: 'app2.html',
      chunks: ['vendor', 'app2'], // 引入公共依赖和 app2
    }),
  ],
};
```

> （2）对于一个使用 Webpack 的项目，如果需要直接通过 `<script>` 标签引入第三方的资源，应该怎么处理？

1. 使用 `html-webpack-plugin` 插件：可以自动化地将文件中的外部资源转换为 `<script>` 标签引入到生成的 `index.html` 文件中。

```bash
npm install html-webpack-plugin --save-dev
```

```js
// webpack.config.js，配置 html-webpack-plugin 插件来引入第三方脚本
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // 你的入口文件
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',  // 你的模板文件
      scriptLoading: 'defer', // 这里配置脚本加载方式，'defer' 表示异步加载脚本
      // 如果需要引入第三方的外部资源，可以通过该插件在 head 或 body 中插入 <script> 标签。
      inject: 'body', // 控制脚本注入的位置，可以是 'head' 或 'body'
      // 添加外部资源的 <script> 标签
      external: {
        scripts: [
          'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js', // 通过 CDN 引入外部库
          'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
        ]
      }
    })
  ]
};
```

2. 通过 `externals` 配置：如果你希望避免将外部资源打包到 Webpack 构建的输出文件中，而是希望直接通过 `<script>` 标签加载这些资源。

```js
module.exports = {
  entry: './src/index.js', // 你的入口文件
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  externals: {
    // vue 和 axios 会被排除在 Webpack 打包之外
    'vue': 'Vue',   // 将 vue 设置为外部资源，表示通过 <script> 标签引入
    'axios': 'axios' // 将 axios 设置为外部资源，表示通过 <script> 标签引入
  }
};
```

3. 如果你希望将第三方库（例如 `jQuery、Vue、Axios`）作为全局变量直接注入到每个模块中，避免每次都要通过 `import` 来加载，可以使用 `ProvidePlugin` 插件。

```js
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js', // 你的入口文件
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Vue': 'vue',  // 自动提供 Vue，避免每个文件都需要 import Vue
      'axios': 'axios'  // 自动提供 axios，避免每个文件都需要 import axios
    })
  ]
};
```

4. 手动添加 `<script>` 标签

```html
<!DOCTYPE html>
<!-- 在生成的 HTML 文件中，Vue 和 Axios 库需要通过 <script> 标签从 CDN 引入 -->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webpack Example</title>
  <!-- 手动添加外部 CDN 引入 -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
  <div id="app"></div>
  <script src="bundle.js"></script>
</body>
</html>
```

> （3）一个使用了 Webpack 的前端项目，该怎么配置，实现使用 `babel-loader` 来编译 `tsx` 文件？

1. 安装相关依赖库：包括 `babel-loader`、Babel 的预设，用于处理现代 `JavaScript、TypeScript、React`、TypeScript 及其他工具。

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript typescript
```

2. 配置 `.babelrc` 或 `babel.config.json`：支持现代 JavaScript、TypeScript、React 的编译。

```json
{
  "presets": [
    "@babel/preset-env",        // 转译现代 JavaScript
    "@babel/preset-typescript"  // 支持 TypeScript
    "@babel/preset-react",      // 支持 React 的 JSX
  ]
}
```

3. 配置 `tsconfig.json`：用于 TypeScript 的类型检查和配置。

```json
{
  "compilerOptions": {
    "target": "ESNext",                  // 将 TypeScript 转译为最新的 JS 版本
    "module": "ESNext",
    "jsx": "react-jsx",                  // 让 TypeScript 处理 JSX
    "strict": true,                      // 启用严格模式检查
    "moduleResolution": "node",          // 使用 Node 模块解析方式
    "esModuleInterop": true,             // 启用与 ES 模块的兼容
    "skipLibCheck": true,                // 跳过库的类型检查
    "forceConsistentCasingInFileNames": true // 强制一致的文件名大小写
  },
  "include": ["src/**/*"]                // 包含 src 文件夹中的所有文件
}
```

4. 配置 Webpack：以使用 `babel-loader` 来处理 `.tsx` 文件。
   1. `resolve.extensions`：解析 `.ts` 和 `.tsx` 文件的扩展名。这样可以在导入模块时省略扩展名。
   2. `module.rules`：使用 `babel-loader` 来处理 `.ts` 和 `.tsx` 文件。
   3. `test: /\.(ts|tsx)$/`：匹配所有 TypeScript 文件，包括 React 的 `.tsx` 文件。
   4. `exclude: /node_modules/`：避免处理 `node_modules` 中的文件，提升编译速度。

```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.tsx', // 指定项目的入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js'                  // 输出的文件名
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // 允许省略的文件扩展名
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,               // 匹配 .ts 和 .tsx 文件
        exclude: /node_modules/,           // 排除 node_modules 目录
        use: {
          loader: 'babel-loader',          // 使用 babel-loader 进行处理
        },
      },
    ],
  },
  devtool: 'source-map',                   // 可选：生成 source map 以便调试
};
```

5. 编译并运行项目

```bash
npx webpack --mode development  // 生成开发模式下的代码
npx webpack serve  // 或通过开发服务器运行项目
```

> （4）webpack 在打包时，给生成的文件名上添加的 `hash` 码，是如何生成的？

添加 `hash` 码是：确保缓存的文件在内容发生变化时能更新，避免用户浏览器缓存旧版本文件。

生成的 `hash` 值通常通过文件内容的哈希值来计算的，确保文件内容变化时，文件名也会变化。

1. `[hash]`：基于整个构建过程的内容生成的哈希值。它是 Webpack 打包过程中所有文件（包括代码、图片、资源等）内容的总体哈希。如果构建过程中任何文件内容发生变化，`[hash]` 就会变化。

> 缺点：如果构建过程中只是某一个文件的内容变化，其他文件的哈希值也会变化，因为 `[hash]` 是针对所有文件一起计算的。因此，它通常不适合缓存控制。

2. `[chunkhash]`：基于 **每个输出 `chunk`** 内容生成的哈希值。每个代码块（或模块）都会有一个不同的哈希值，只有当该代码块的内容变化时，该代码块的哈希值才会发生变化。通常用于 JavaScript、CSS 文件等资源的命名。

> 对缓存友好，因为即使项目中的某个模块发生变化，只有那个模块的哈希值会改变，其他模块依然保持不变。

3. `[contenthash]`：基于文件内容生成的哈希值，适用于生成静态资源文件（如图片、字体、CSS）。针对单个文件内容。

### Webpack的构建及原理⭐

#### 构建流程

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 `Compiler` 对象，加载所有配置的插件，执行对象的 `run` 方法开始执行编译；
3. 确定入口：根据配置中的 `entry` 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 `loader` 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：使用 `loader` 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`，再把每个 `Chunk` 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

简单来说：

1. 初始化流程：从配置文件和 `Shell` 语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数
2. 编译构建流程：从 `entry` 发出，针对每个 `Module` 串行调用对应的`loader` 去翻译文件内容，再找到该 `Module` 依赖的 `Module`，递归地进行编译处理
3. 输出流程：对编译后的 `Module` 组合成 `Chunk`，把 `Chunk` 转换成文件，输出到文件系统

如何实现一个Webpack？

1. 将 `import` 这种浏览器不认识的关键字替换成了 `__webpack_require__` 函数调用。
2. `__webpack_require__` 在实现时采用类似 `CommonJS` 的模块思想。
3. 一个文件为一个模块，对应模块缓存上的一个对象。
4. 模块代码执行时，会将 `export` 内容添加到这个模块对象上。
5. 当再次引用一个以引用过的模块时，会直接从缓存上读取模块。

#### `require` 的原理

1. 有一个全局对象 `{}`，初始情况下是空的。
2. 当你 `require` 某文件时，就将这个文件拿出来执行。
3. 如果这个文件里面存在 `module.exports`，当运行到这行代码时将 `module.exports` 的值加入这个对象，键为对应的文件名。
4. 当你再次 `require` 时，若对象有对应值直接返回给你。
5. 如果没有就重复前面的步骤，否则执行目标文件，将 `module.exports` 加入全局对象并返回给调用者。
6. 这个全局对象就是我们常说的缓存。

#### 打包后的 JS 脚本是什么样

1. 打包工具将 JavaScript 应用的多个文件和模块合并为一个或几个捆绑文件，供浏览器使用。在打包过程中，每个模块被封装在一个函数中，以保持其作用域独立，防止全局变量污染。
2. 构建工具生成的代码中包含一个模拟的 `require` 函数（如 `__webpack_require__`），负责解析依赖和加载模块。
3. 构建工具会对代码进行压缩，包括移除多余的空格、换行、注释，缩短变量名。
4. 模块之间的依赖关系得到妥善处理，确保正确执行顺序。
5. 最终，打包后的 JS 脚本包含所有必要模块和引导代码，使得即使是复杂前端应用也能以单个文件或少量文件的形式部署在 Web 服务器上，简化了部署过程，并提升用户访问应用时的性能。

#### 原理

Webpack 的实现原理是**将整个应用程序视为一个模块化系统，通过分析模块之间的依赖关系来构建打包后的文件**。

1. Webpack 从入口文件开始，递归分析每个模块依赖的其他模块，将这些模块打包成一个或多个文件。
2. Webpack 的核心是 `Compiler` 对象，它分析整个应用程序，生成包含模块依赖关系图和打包代码的 `Compilation` 对象。
3. `loader` 和 `plugin`
4. `Chunk`
   - **`Chunk` 是 Webpack 对模块打包后的代码块，包含多个模块，可同步或异步加载。**
   - 每个 `Chunk` 有一个唯一的入口模块，可通过入口模块名称访问。

#### 异步加载原理

Webpack 的异步加载（懒加载）原理主要涉及**动态导入和代码分割**。通过按需加载模块来减少初始加载的资源量，优化页面的加载速度和性能。

1. 代码分割（*Code Splitting*）：将代码分割成多个小块，按需加载这些小块。入口点分割—将代码分割成多个入口文件，每个入口文件对应一个独立的 `bundle`。

```js
// webpack.config.js
module.exports = {
  entry: {
    // 如为不同的页面或功能创建不同的入口文件
    main: './src/main.js',
    admin: './src/admin.js'
  },
  // ...
};
```

2. 动态导入（*Dynamic Imports*）：语法是 `import()`，它返回一个 `Promise`，当模块加载完成时，`Promise` 会被解析。按需加载模块。

（1）异步加载流程

1. **编译阶段**：Webpack 分析代码中的动态导入 `import()`，并为每个动态导入创建一个新的 `chunk`。
2. **生成阶段**：Webpack 在生成阶段会创建多个文件 `chunks`，包括主 `bundle` 和按需加载的 `chunks`。每个 `chunk` 对应一个独立的文件，通常在 `dist` 目录中。
3. **运行时**：Webpack 生成的 `runtime` 代码负责加载和注入这些异步 `chunks`。Webpack 会动态插入 `<script>` 标签来请求这些 `chunks`，并在它们加载完成后执行相关代码。

> **缓存和 `Chunk ID`**：使用文件名和 `chunk ID` 来缓存和标识 `chunks`。避免重复加载，确保正确的缓存策略。

#### 热更新原理

热更新又称热替换（*Hot Module Replacement*，HMR）：不用刷新浏览器而将新变更的模块替换掉旧的模块。

> 自动刷新会导致整个应用整体刷新，页面中的状态信息会丢失。

2. Webpack 创建 `WebServer` 静态服务器，供浏览器请求编译生成的静态资源；同时创建 `WebSocket` 服务，建立本地服务与浏览器的双向通信。
3. 以 `watch` 模式启动编译，监听到文件变化后，根据配置文件对模块重新编译打包，通过 `WebSocket` 告知浏览器执行热更新逻辑。
3. 浏览器接收服务器端推送的消息，若需热更新，则发起 `HTTP` 请求到服务器端获取新的模块资源，解析并局部刷新页面。

> 通过 `WebSocket` 建立浏览器端与服务器端的通信。

```js
const webpack = require('webpack')
	module.exports = {
    // ...
    devServer: {
      // 开启 HMR 特性
      hot: true
      // hotOnly: true
    }
 }
```

### `webpack-dev-server`

`webpack-dev-server` 是 Webpack 提供的一个基于 `Express.js` 的开发服务器工具，支持**开发环境的实时重载（*live reloading*）和模块热替换（*Hot Module Replacement*，HMR）**。

> 开发者可以实时查看代码变更效果，而不需要每次都手动重新编译和刷新浏览器。

#### (1) 工作原理

通过在内存中创建虚拟文件系统来提供开发服务器功能。它监听文件变化并通过 `WebSocket` 与浏览器通信，以实现实时重载和热模块替换，提供高效的开发环境。

1. 启动开发服务器：通过运行 `webpack-dev-server` 命令或在配置文件中设置 `devServer` 属性，启动 `webpack-dev-server`。它将监听指定的端口，并根据配置文件中的配置进行工作。
2. 编译和构建：读取 webpack 配置文件中的配置信息，并进行代码的打包处理。
3. 内存中的文件系统：将所有的项目文件存储在内存中的虚拟文件系统中，而不是写入磁盘。这使得每次修改源代码时，无需重新写入磁盘，可以更快地更新文件。
4. 请求转发：当浏览器请求文件时，例如 HTML、CSS、JavaScript 或静态资源等，`webpack-dev-server` 会监视这些请求，并将请求路由到内存中的虚拟文件系统中对应的文件。能直接提供文件，而无需访问实际的物理文件。
5. 实时重载和热模块替换：一旦文件发生更改，`webpack-dev-server` 会通过 `WebSocket` 与浏览器建立连接，并向浏览器发送更新通知。浏览器接收到通知后，可以选择重新加载整个页面或仅更新受影响的模块，从而实现实时重载和热模块替换。

#### (2) 主要作用和特点

1. **提供本地开发服务器**：`webpack-dev-server` 启动一个本地服务器，默认运行在 `localhost:8080`，可以自定义配置端口和主机地址。
2. **内存中编译和打包**：与生产环境不同，支持静态资源托管，不会将编译结果写入磁盘，而是保存在内存中，以提高构建和重新编译的速度。
3. **自动刷新**：每次代码变动并重新打包后，自动通知浏览器刷新页面，而不需要手动刷新，方便开发者即时查看最新效果。
4. **模块热替换（HMR）**：即当代码发生变化时，只重新编译和刷新受影响的模块，而不是整个页面。这种局部更新机制避免了页面整体刷新，减少状态丢失，提升开发体验。
5. **代理 API 请求**：开发者可以通过配置 `devServer.proxy` 来实现请求代理，将特定的 API 请求转发到其他服务器，处理跨域问题。

#### (3) 不适用于生产环境原因

1. **性能和内存限制**：`webpack-dev-server` 将打包后的文件保存在内存中，而不是写入磁盘，可以加快开构建速度。在生产环境中，这种方式会占用大量内存，对服务器资源消耗较大。
2. **缺乏优化**：`webpack-dev-server` 不会对代码进行生产级优化。而生产环境代码通常需要经过压缩、`Tree-shaking`、分包等优化步骤，以减小文件大小，提升加载速度。
3. **安全性问题**：`webpack-dev-server` 主要用于本地开发，没有针对线上环境的安全配置。默认配置下，没有针对 XSS、CSRF 等攻击进行专门的保护，也没有对敏感信息进行过滤。
4. **缺少持久化支持**：`webpack-dev-server` 的内存存储方式不适合生产环境的文件持久化需求。如，文件需要长期存储/缓存以减少服务器压力，而它会在每次重启时重新生成文件。
5. **不支持高并发**：由于 `webpack-dev-server` 的设计主要是为了快速响应开发中的变化，缺乏针对高并发的优化。在生产环境中，多个用户同时请求会导致响应时间延长，影响用户体验。
6. **日志和监控不足**：`webpack-dev-server` 没有提供生产环境所需的日志和监控功能，例如请求日志、错误日志、性能监控等。这些功能对于监控线上应用的健康状况和及时定位问题非常关键。

#### (4) 常用配置

1. `contentBase`：告诉服务器从哪里提供内容，默认情况下，将使用当前工作目录作为提供内容的位置。
2. `host`：设置开发服务器的主机地址，默认是 `localhost`。
3. `port`：设置开发服务器的端口号，默认是 `8080`。
4. `open`：设置为 `true` 时，开发服务器启动后将自动打开浏览器。
5. `hot`：开启热模块替换功能，即如果模块更新了，只替换更新的部分，网页不会全部刷新。
6. `historyApiFallback`：任意的 404 响应都可能需要被替换为 `index.html`，适合单页应用。
7. `headers`：允许开发者自定义服务器响应的 HTTP 头。
8. `proxy`：代理配置，可以将特定的 API 请求代理到另一台服务器上。对象形式，对象中每一个属性就是一个代理的规则匹配。属性的名称是需要被代理的请求路径前缀，一般为了辨别都会设置前缀为 ` /api`，值为对应的代理匹配规则。
   1. `target`：要代理到的目标服务器地址。
   2. `pathRewrite`：重写请求路径，如：`^/api` → `''`，去掉前缀。
   3. `secure`：是否验证 SSL 证书。默认 `true`，若目标是 `https://`，需设为 `false` 才能代理成功。
   4. `changeOrigin`：是否修改请求头中的 `origin` 和 `host` 为目标地址。为了防止后端因来源不同而拒绝请求，建议设为 `true`。
9. `compress`：为所有服务启用 `gzip` 压缩。

```js
// 在 webpack.config.js 中配置以启用 webpack-dev-server
module.exports = {
  // 开发服务器配置
  devServer: {
    contentBase: path.join(__dirname, 'dist'),  // 设置服务器访问的基本目录
    host: 'localhost',  // 服务器 IP 地址，默认是 'localhost'
    port: 8080,  // 服务器端口号
    open: true,  // 自动打开浏览器
    hot: true,  // 启用 HMR 功能
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',  // 在所有响应中添加首部内容：
    },
    // 配置 API 代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 代理到的服务器地址
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true,
      },
    },
    compress: true, // 开启所有服务的 gzip 压缩
  },
};
```

### `proxy`

`proxy` 是 Webpack 提供的代理服务。基本行为就是启动一个本地服务器，接收客户端发送的请求后转发给其他服务器，便于开发者在开发模式下解决跨域问题。

> 注意：服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制。

(1) 工作原理

需要一个中间服务器 `webpack-dev-server`，自动封装了 `http-proxy-middleware` 代理中间件，将请求转发给其他服务器，实现代理。

1. 在开发阶段， `webpack-dev-server` 会启动一个本地开发服务器，我们的应用在开发阶段运行在 `localhost ` 的一个端口上，而后端服务又是运行在另外一个地址上；
2. 设置 `proxy` 实现代理请求后，相当于在浏览器和服务器之间添加一个代理者；
3. 当本地发送请求的时候，代理服务器响应该请求，并将请求转发到目标服务器，目标服务器响应数据后再将数据返回给代理服务器，最终再由代理服务器将数据响应给本地；
4. 在代理服务器传递数据给本地浏览器的过程中，两者同源，并不存在跨域行为，浏览器就能正常接收数据。

请求：`http://localhost:3000/api/foo/bar` 被代理为 `http://www.example.org/api/foo/bar`。

```js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'http://www.example.org',
  changeOrigin: true
}));

app.listen(3000);
```

```js
// webpack.config.js 或 vue.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://www.example.org',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
}
```

### 分包⭐

分包（或代码分割）用于将应用程序的代码拆分成多个较小的包，提高加载效率。

#### 入口点分割

入口点分割（*Entry Points Split*）：配置多个入口点，将应用程序分成多个独立的包。每个入口点可以生成一个单独的 `bundle`。通常用于多页面应用（MPA），不同页面各自打包，互不干扰。

#### 动态导入

动态导入（*Dynamic Imports*）：使用 `import()` 动态加载模块。Webpack 会将动态导入的模块分割成单独的 `chunks`，在需要时异步加载。

```js
// 在需要的时候动态加载模块
function loadComponent() {
  import('./components/MyComponent')
    .then(module => {
      const MyComponent = module.default;
      // 使用 MyComponent
    })
    .catch(err => {
      console.error('Failed to load component', err);
    });
}
```

在 `React` 中使用 `React.lazy` 和 `Suspense` 实现组件的异步加载。

> 路由懒加载。

```jsx
import React, { Suspense, lazy } from 'react';

const MyComponent = lazy(() => import('./MyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>  // MyComponent 会在需要时异步加载
        <MyComponent />
      </Suspense>
    </div>
  );
}
```

#### 提取公共代码

`optimization.splitChunks`：提取多个入口点之间的公共模块到一个单独的 `bundle` 中。

```js
splitChunks: {
  chunks: 'all', // 所有类型的 chunk（同步 + 异步）都分割
  minSize: 20000, // 最小分割体积
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      priority: -10
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true
    }
  }
}

```

#### 提取CSS样式

`MiniCssExtractPlugin`：提取 CSS 样式到单独的文件。仅在生产环境中使用该插件，开发环境下建议用 `style-loader` 以热更新更快。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};
```

#### 压缩 `bundle` 体积

1. `BundleAnalyzerPlugin`：用于可视化查看打包体积组成，查找体积大的依赖进行优化
2. `CompressionWebpackPlugin`：会在打包后生成 `.gz` 或 `.br` 压缩文件（如 `main.js.gz`），需要配合 `nginx` 设置 `gzip_static` 才能生效。

```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');

plugins: [
  new CompressionWebpackPlugin({
    algorithm: 'gzip',
    test: /\.(js|css)$/,
    threshold: 10240,
    minRatio: 0.8
  })
]
```

### `tree shaking`

`tree shaking`（*Dead code elimination*）通过清除多余代码方式来优化项目打包体积。

#### (1) 作用原理

1. `CommonJS` 使用 `require/exports` 语法，是动态的，不能静态分析，因此不支持 `tree shaking`。

```js
let dynamicModule;
// 动态导入
if (condition) {
  myDynamicModule = require("foo");
} else {
  myDynamicModule = require("bar");
}
```

2. ES6 模块的 `import/exports` 是静态结构，可以在编译阶段分析出哪些代码被使用。

> ESM（*ECMAScript Module*）是 ES6 引入的模块系统，使用 `import` 和 `export`。

静态分析流程

1. 分析模块依赖关系：了解模块依赖、函数调用和变量引用关系，在构建过程中完成。
2. 标记未使用代码：分析导出和导入语句，判断哪些代码未使用。
3. 打包时删除未使用代码。
4. 优化输出只保留必要代码。

#### (2) 失效情况

1. 未使用 ES6 模块语法。
2. 使用的第三方库不支持 ESM，无法分析导入导出关系。
3. 使用 `CommonJS`、AMD、CMD 等模块规范，无法静态分析。
4. 动态导入和动态属性访问：如 `import(variable)` 或 `require(variable)`，使得 Webpack 无法静态分析，确定哪些模块或代码是未使用的。
5. 模块有副作用：如修改全局状态、改变外部变量，Webpack 无法安全地移除这些模块，因为它不能确定这些副作用是否被实际使用。
6. 插件或 `loader` 修改模块结构：破坏静态依赖分析能力。
7. Webpack 配置问题：`mode: development` 开发模式下不支持 `tree shaking`。
8. `package.json` 中的 `sideEffects` 配置错误，没有标记哪些文件是“纯模块”。

#### (3) 启用条件

1. 使用 ESM 规范编写模块代码。
2. `mode: 'production'`
3. `optimization.usedExports` 为 `true`，启用标记功能。
3. `optimization.minimize` 为 `true`，或提供 `optimization.minimizer` 数组。

```js
// webpack.config.js
module.exports = {
  mode: 'production', // 必须设置为 production
  optimization: {
    usedExports: true // 标记未使用导出
  }
}
```

```json
// package.json
"sideEffects": false
// 如果你有副作用文件不能摇树删除，可指定保留的文件：
"sideEffects": ["*.css"]
```

### 性能优化⭐

#### 借助Webpack优化前端性能

用 Webpack 优化前端性能是指**优化 webpack 的输出结果，让打包的最终结果在浏览器运行快速高效**。

1. 分包（*Code Splitting*）：通过配置 `entry`、动态 `import`、`React.lazy` 和 `Suspense` 组件，配置 `optimization.splitChunks` 等实现代码分包
2. `tree shaking`：依赖 ESM
3. 压缩代码 `JS、CSS、HTML`、文件、图片
6. 内联 `chunk`
7. 利用 CDN 加速：将静态资源路径指向 CDN，配置 `output.publicPath` 和 `loader` 中相应路径。

```js
output: {
  publicPath: 'https://cdn.example.com/assets/'
}
```

##### JS代码压缩

在 `production` 模式下，默认使用 `TerserPlugin` 处理 JS 代码。

自定义配置参数

1. `extractComments`：默认值为 `true`，表示会将注释抽取到一个单独的文件中，开发阶段，我们可设置为 `false` ，不保留注释。
2. `parallel`：使用多进程并发运行提高构建的速度，默认值是 `true`，并发运行的默认数量是  `os.cpus().length - 1`。
3. `terserOptions`：设置 `terser` 相关配置
   1. `compress`：设置压缩相关的选项
   2. `mangle`：设置丑化相关的选项，可以直接设置为 `true`
   3. `toplevel`：底层变量是否进行转换
   4. `keep_classnames`：保留类的名称
   5. `keep_fnames`：保留函数的名称

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true, // 电脑cpu核数-1
                terserOptions: {
                  compress: {},
                  mangle: true, // Note `mangle.properties` is `false` by default.
                  toplevel: false,
                  keep_classnames: undefined,
                  keep_fnames: false,
        			},
            })
        ]
    }
}
```

##### CSS代码压缩

`css-minimizer-webpack-plugin`

> CSS 压缩通常是去除无用的空格等，因为很难去修改选择器、属性的名称、值等。

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                parallel: true
            })
        ]
    }
}
```

##### HTML代码压缩

使用 `HtmlWebpackPlugin` 生成 `HTML` 的模板时候，配置 `minify` 属性优化。

> 设置了 `minify`，实际会使用另一个插件 `html-minifier-terser`。
>

```js
module.exports = {
    plugin:[
        new HtmlwebpackPlugin({
            minify:{
                minifyCSS:false, // 是否压缩css
                collapseWhitespace:false, // 是否折叠空格
                removeComments:true // 是否移除注释
            }
        })
    ]
}
```

##### 文件大小压缩（`gzip`）

使用 `compression-webpack-plugin` 减少 `http` 传输过程中宽带的损耗。

```js
new ComepressionPlugin({
    test:/\.(css|js)$/,  // 哪些文件需要压缩
    threshold:500, // 设置文件多大开始压缩
    minRatio:0.7, // 至少压缩的比例
    algorithm:"gzip", // 采用的压缩算法
})
```

##### 图片压缩

`Asset Modules`，并结合现代图片优化工具（如 `sharp` 或 `squoosh`）来处理图片压缩。

使用 `asset/resource` 或 `asset/inline` 来处理图片等静态资源。

> `file-loader，url-loader，image-webpack-loader` 过时了

1. `asset/resource` 会将文件输出到指定目录，类似于 `file-loader`；
2. `asset/inline` 则将文件转为 `Data URL`，类似于 `url-loader`。

```js
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      type: 'asset/resource',
      generator: {
        filename: 'images/[name]_[hash][ext]'
      }
    }
  ]
}
```

##### 内联 `chunk`

通过 `InlineChunkHtmlPlugin` 将一些 `chunk` 的模块内联到 `html`，如 `runtime` 的代码（对模块进行解析、加载、模块信息相关的代码），代码量并不大，但是必须加载的。

```js
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 其他配置
  plugins: [
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime.+\.js/])
  ]
};
```

#### 提高Webpack打包速度

1. 优化 `loader` 配置
2. 使用 `cache-loader` 进行缓存
3. 优化 `resolve.alias` 起别名
5. 合理使用 `sourceMap`
5. 外部扩展 `externals`：将不怎么需要更新的第三方库脱离 Webpack 打包，不被打入 `bundle` 中，从而减少打包时间，比如 `jQuery` 用 `<script>` 标签引入。
6. `HappyPack` 启动多线程
7. `dll`：采用 Webpack 的 `DllPlugin` 和 `DllReferencePlugin` 引入 `dll`，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。

##### 优化 `loader` 配置

在使用 `loader` 时，通过配置 `include、exclude、test` 属性精准匹配应使用 `loader` 的文件。

1. `include` 指定编译文件夹
2. `exclude` 排除指定文件夹

```js
module.exports = {
  module: {
    rules: [
      {
        // 如果项目源码中只有JS文件就不要写成 /\.jsx?$/，提升正则表达式性能
        test: /\.js$/,
        // babel-loader支持缓存转换出的结果，通过cacheDirectory选项开启
        use: ['babel-loader?cacheDirectory'],
        // 使用include来指定编译文件夹只对项目根目录下的src目录中的文件采用babel-loader
        include: path.resolve(__dirname, 'src'),
        // 使用exclude排除指定⽂件夹
        exclude: /node_modules/,
      },
    ]
  },
};
```

##### 使用 `cache-loader` 缓存

在性能开销较大的 `loader` 前添加 `cache-loader`，将结果缓存到磁盘，提升二次构建速度。

> 注意：保存和读取缓存文件有时间开销，仅对性能开销较大的 `loader` 使用，如：`webpack.cache`、`babel-loader.cacheDirectory`、`HappyPack.cache`。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src')
      }
    ]
  }
}
```

##### 优化 `resolve.alias`

`resolve.alias` 给常用路径起别名，特别当项目目录结构较深时，文件路径可能为 `./../../` 的形式。通过配置 `alias` 减少查找过程。

```js
module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src')
    }
  }
}
```

##### 合理使用 `SourceMap`

1. 开发环境开启 `SourceMap`：方便调试源码，定位问题
2. 生产环境建议关闭 `SourceMap`：减少包体积、保护源码安全

`SourceMap` 模式

1. `cheap-module-source-map`：仅标记行不标记列，大幅减少构建时间，精度较低但足够调试。
2. `eval-source-map`：使用 `eval` 包裹，构建最快，但安全性差。


1. `inline-source-map`：`SourceMap` 嵌入打包文件，调试方便但体积大。
2. 使用 `external` 模式：将 `SourceMap` 分离到单独文件中，避免打包文件过大。

##### `HappyPack` 启动多线程

`HappyPack` 将 `loader` 的同步执行转为并行，充分利用系统资源加快打包效率。它将模块加载和构建过程分解为多个子线程，实现多线程构建。

```js
module: {
  rules: [
    {
      test: /.js$/,
      loader: 'happypack/loader?id=js',
      include: [resolve('src')],
      exclude: /node_modules/
    }
  ]
},
plugins: [
  new HappyPack({
    id: 'js', // 与rule中指定的id一致
    threads: 4, // 开启四个线程，必须配置，建议设为os.cpus().length
    verbose: true, // 是否输出详细日志信息
    loaders: ['babel-loader?cacheDirectory'] // 如何处理js文件，如转成es5代码
  })
]
```

### Webpack5 新特性

1. 持久化缓存（*Persistent Caching*）： 通过缓存模块和生成的 `chunk`，提高重复构建速度。利用了更稳定的 `HashedModuleIdsPlugin` 和 `NamedChunksPlugin`，改善构建性能。
2. 缓存组（*Caching Groups*）： 可以更细粒度地控制模块的缓存策略。
3. 支持分包，动态导入 `import()`、优化代码分割 `optimization.splitChunks`
4. `tree shaking`
6. 模块联邦（*Module Federation*）： 允许将多个独立的 Webpack 构建连接在一起，实现模块共享，从而更好地支持微服务架构。
7. 支持 `WebAssembly`（WASM）
7. 默认配置优化，开箱即用的性能更好。
8. 移除废弃特性和 API。

#### 模块联邦

模块联邦（*Module Federation*）可以实现多个独立 webpack 构建之间的共享模块和代码。它通过让每个构建的应用程序能够使用其他应用程序中的模块来提高代码共享和复用的效率。

模块联邦基于 Webpack 的远程容器特性，它允许将一个应用程序的某些模块打包为一个独立的、可远程加载的 `bundle`，并在运行时动态地加载这些模块。这样，在另一个应用程序中就可以通过远程容器加载这些模块，并直接使用它们。这种方式可以避免重复打包和加载相同的模块或库，提高了应用程序的性能和效率。

优势

1. 多个应用程序之间可以共享代码和模块，从而减少重复代码量。
2. 应用程序可以更加灵活地划分为更小的子应用程序，从而降低应用程序的复杂度。
3. 可以避免在应用程序之间传递大量数据，从而提高应用程序的性能和效率。
4. 可以支持应用程序的动态加载和升级，从而实现更好的版本管理和迭代。

(1) 在远程应用的 `webpack.config.js` 中，使用 `ModuleFederationPlugin` 定义暴露模块。

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  // 其他配置
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp", // 远程应用名称
      filename: "remoteEntry.js", // 远程入口文件名称
      exposes: {
        "./Button": "./src/Button.js" // 定义暴露的模块及其路径
      },
      shared: ["react", "react-dom"] // 指定共享依赖，避免重复加载
    })
  ]
};
```

(2) 在宿主应用的 `webpack.config.js ` 中，使用 `ModuleFederationPlugin` 配置远程模块引用。

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  // 其他配置
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js" // 远程应用名称和URL
      },
      shared: ["react", "react-dom"] // 与远程应用共享的依赖
    })
  ]
};
```

(3) 在宿主应用中，使用动态 `import()` 或 `React.lazy` 加载远程应用暴露的模块。

```js
// 动态导入远程模块
const RemoteButton = React.lazy(() => import("remoteApp/Button"));

function App() {
  return (
    <div>
      <h1>宿主应用</h1>
      <React.Suspense fallback="Loading Button...">
        <RemoteButton />
      </React.Suspense>
    </div>
  );
}

export default App;
```

# `Vite`

## 补充知识

### Webpack和`Vite`的区别

1. 构建速度
   1. `Vite` 的构建速度比 Webpack 更快，因为 `Vite` 在开发环境下使用了浏览器原生的 ESM 加载，而不是像 Webpack 一样使用打包后的文件进行模块加载。
   2. 在 `Vite` 中，每个模块都可以独立地进行编译和缓存，这意味着它只需要重新编译修改过的模块，而不是整个应用程序。
2. 配置复杂度
   1. Webpack 的配置更加复杂，需要针对具体项目进行不同的配置。
   2. `Vite` 的配置相对更简单，只需指定一些基本的选项就可以开始开发。
3. 功能特性
   1. Webpack 是一个功能更加全面的打包工具，支持各种 `plugin` 和 `loader` ，可以处理多种类型的文件和资源。
   2. `Vite` 的设计初衷是专注于开发环境下的快速构建，对一些高级特性的支持相对较少。
4. 生态环境：Webpack 更早，`Vite` 尚处于发展阶段。

### `Vite`为什么比Webpack快

Webpack 的瓶颈

1. **启动慢**：Webpack 启动需完整打包项目，涉及构建依赖图、模块合并、读写大量文件，项目越大越慢。
2. **热更新慢**：每次文件修改都触发重新打包，即便有缓存，效率仍低。

`Vite` 的优势：利用浏览器原生 ESM 特性，+ 现代构建工具（如 `esbuild`）提升开发体验

1. 启动快

   1. 启动时仅启动静态页面服务器，不打包文件代码。
   2. 启动只需初始化操作，其余交由浏览器处理。
   3. 源文件依赖通过浏览器 ESM 支持解析，模块在浏览器中按需解析。
   4. 浏览器将 `import` 语句处理为 `HTTP` 请求，获取 `import` 引入的模块。

2. 热更新快（HMR）
   1. 文件变化后，通过 `WebSocket` 通知浏览器重新加载变更文件。
   2. 使用 **原生 ESM + `import.meta.hot`**，精确更新变动模块，无需重新打包。
   3. 更新机制轻量，仅失活模块及其最近边界，性能与应用大小无关。
   4. 源码缓存：利用 `HTTP` 头加速页面重新加载，源码模块请求根据 `304 Not Modified` 协商缓存。
   5. 依赖模块缓存：解析后依赖请求通过 `Cache-Control: max-age=31536000, immutable` 强缓存，一经缓存无需再次请求。

3. 打包快：`Vite` 使用 `esbuild` 预构建依赖， 用 Go 编写，速度快于 JS 编写的打包器（Webpack 用 Node）。

但 `Vite` 并非全方位快，首屏加载和懒加载方面 Webpack 更优

1. Webpack 在 `dev` 启动已完成打包，首屏渲染更快；构建时处理依赖，懒加载无问题。
2. `Vite` 无 `bundle` 操作，导致大量 `HTTP` 请求；`dev` 服务运行期间对源文件转换需时间。`Vite` 将 Webpack `dev` 启动的工作移至响应浏览器过程，时间延长。

### `Vite`和Webpack 在热更新上的区别

1. 开发服务器模式
   1. `Vite`：基于浏览器原生 ESM，模块按需加载，无需构建依赖图。
   2. Webpack：使用内置的开发服务器，需要构建完整依赖图，将所有模块打包到一个 `bundle` 中。
2. 模块重载机制
   1. `Vite`：使用 `import.meta.hot` 精确更新变动模块。
   2. Webpack：HMR 插件和 Webpack 特定配置 `module.hot`，更新模块或模块树的整个部分，即使只是小的模块更改，可能仍需重新打包和加载。
3. 依赖预构建
   1. `Vite`：在启动时，`esbuild` 会对依赖进行预构建并缓存，浏览器可直接请求缓存的模块。因为依赖模块基本不会变动，`Vite` 只需对应用模块进行热更新。
   2. Webpack：没有预构建缓存机制，所有依赖在开发和更新时都要重新打包和处理。
4. 构建和更新性能
   1. `Vite`：通过原生 ESM 和模块加载机制，初始构建时只加载应用代码，更新时只更新变动部分。热更新只需重载特定模块，整个过程无需打包。
   2. Webpack：初始构建会生成整个应用的 `bundle`，更新时也需重新打包部分代码。模块热替换涉及打包、编译和代码注入，尤其在大型应用中，热更新速度较慢，且会随着应用增大而变慢。


