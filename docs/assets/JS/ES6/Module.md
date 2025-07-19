# JS模块化

## Module 的语法

### （1）`export` 命令

`export` 导出，外部能够读取模块内部的变量，可以使用 `as` 重命名。

1. 具名输出：`export {变量名}`
2. 默认输出：`export default`

① `export` 能够对外输出的就是三种接口

1. `var`、`let`、`const` 声明的变量
2. 函数
3.  类

② 注意

1. `export` 输出的接口，与其对应的值是**动态绑定关系，即通过该接口，可以取到模块内部实时的值**。

2. `export` 可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，`import` 也是如此。


```js
// profile.js
// 写法1：分别导出
export var name = 'Michael';
export var year = 1958;
export function multiply(x, y) {
  return x * y;
};

// 写法2：统一导出，优先🚀
var name = 'Michael';
var year = 1958;
const fn() = () => {}
export { name, year, fn };
// 导出变量重命名
export { name as uname, year as uyear };
```

#### `export default`

`export default`：默认导出，只能使用一次，`import` 后面不用使用 `{}`。

默认导出非匿名函数，在模块外部是无效的。加载的时候，视同匿名函数加载。

```js
// export-default.js
// 导出匿名函数
export default function () {
  console.log('foo');
}


// export-default.js
// 非匿名函数
export default function foo() {
  console.log('foo');
}
// 或者写成
function foo() {
  console.log('foo');
}

export default foo;
```

```js
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

本质上，`export default` 就是输出一个叫做 `default` 的变量或方法，然后系统允许你为它取任意名字。它后面不能跟变量声明语句。可以直接将一个值写在 `export default` 之后。

```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
```

`export` 输出的结合：默认输出、分别输出；

`import` 导入的结合：默认导入、命名导入。

```js
import _, { each, forEach } from 'lodash';

export default function (obj) {
  // ···
}

export function each(obj, iterator, context) {
  // ···
}

export { each as forEach };
```

### （2）`import` 命令

`import` 命令接受一对大括号 `{}`，里面指定要从其他模块导入的变量名。`{}` 里面的变量名，必须与被导入模块对外接口的名称相同。`as` 为输入的变量重命名。

`import` 命令输入的变量都是只读的，因为它的本质是输入接口。不允许在加载模块的脚本里面，改写接口。

`from` 指定模块文件的位置，可以是相对路径或绝对路径。如果不带有路径，只是一个模块名，必须有配置文件，告诉 JavaScript 引擎该模块位置。

**`import` 命令具有提升效果，会提升到整个模块的头部，首先执行。本质是 `import` 命令是编译阶段执行的，在代码运行之前。**

```js
// 命名导入，对应分别导出和统一导出
import { name as uname, year } from './profile.js';

function setInfo(element) {
  element.textContent = `用户是:${uname}，出生日期是：${year}`;
}

// 默认导入，对应默认导出，不加{}
import school from './school.js'
```

模块的整体加载 `*`

```js
import * from './profile.js';
import * as info from './profile.js';
```

### （3）`export` 与 `import` 的复合写法

`export` 与 `import` ：`foo` 和 `bar`实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用 `foo` 和 `bar`。

```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

模块的接口改名和整体输出

```js
// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';

export * as ns from "mod";

// 等同于
import * as ns from "mod";
export {ns};
```

默认接口的写法

```js
export { default } from 'foo';
```

具名接口改为默认接口的写法

```js
export { es6 as default } from './someModule';

// 等同于
import { es6 } from './someModule';
export default es6;
```

默认接口也可以改名为具名接口

```js
export { default as es6 } from './someModule';
```

### （4）跨模块

将不同的变量分模块存储，统一导出，导入到 `index.js`，再由 `index.js` 统一导出。

```js
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3

// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3
```

```js
// constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};

// constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];
```

```js
// constants/index.js
export {db} from './db';
export {users} from './users';
```

```js
// script.js
import {db, users} from './constants/index';
```

### （5）`import()`

`import(specifier)` 函数，支持动态加载模块。

`specifier`：指定所要加载的模块的位置。返回一个 `Promise` 对象。使用 `then()` 方法指定处理函数，推荐使用 `await` 命令。

`import()` 函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。

场景：按需加载、条件加载

```js
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});
```

`import()` 加载模块成功以后，这个模块会作为一个对象，当作 `then` 方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。

如果模块有 `default` 输出接口，可以用参数直接获得。

加载多个模块，用 `Promise.all()`

```js
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});

// default默认输出
import('./myModule.js')
.then(myModule => {
  console.log(myModule.default);
});
// 将默认改为具名输入
import('./myModule.js')
.then(({default: theDefault}) => {
  console.log(theDefault);
});

async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main();
```

1. `import.meta`：返回当前模块的元信息。只能在模块内部使用，如果在模块外部使用会报错。

2. `import.meta.url`：返回当前模块的 URL 路径。

3. `import.meta.scriptElement`：是浏览器特有的元属性，返回加载模块的那个 `<script>` 元素，相当于 `document.currentScript` 属性。


## module 的加载和实现

### （1）浏览器加载

#### 同步加载 JS

浏览器通过 `<script>` 标签加载 JavaScript 脚本。由于浏览器脚本的默认语言是 JavaScript，因此`type="application/javascript"` 可以省略。

**默认情况下，浏览器是同步加载 JavaScript 脚本**，即渲染引擎遇到 `<script>` 标签就会停下来，等到执行完脚本，再继续向下渲染。

如果是外部脚本，还必须加入脚本下载的时间。如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞。

```html
<!-- 页面内嵌的脚本 -->
<script type="application/javascript">
  // module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js"></script>
```

#### `defer` 和 `async` 属性

`defer` 和 `async` 属性：脚本会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行完，而是直接执行后面的命令。

`defer` 与 `async` 的区别：

1. `defer` 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行
2. `async` 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染
3. `defer` 是渲染完再执行，`async` 是下载完就执行
4. 如果有多个 `defer` 脚本，会按照它们在页面出现的顺序加载，而多个 `async` 脚本是不能保证加载顺序的

```js
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```

### （2）ES6 模块与 `CommonJS` 模块的差异

#### ES6 模块

浏览器加载 ES6 模块，使用 `<script>` 标签，要加入 `type="module"` 属性。

1. 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。
2. 模块脚本自动采用严格模式，不管有没有声明 `use strict`。
3. 模块之中，顶层的 `this` 关键字返回 `undefined`，而不是指向 `window`。因此在模块顶层使用 `this` 关键字，是无意义的。
4. 模块之中，可以使用 `import` 命令加载其他模块（`.js` 后缀不可省略，需要提供绝对或相对 URL），也可以使用 `export` 命令输出对外接口。
5. 同一个模块如果加载多次，将只执行一次。

```js
<script type="module" src="./foo.js"></script>
```

#### `CommonJS` 语法

（1）导出：`module.exports = value | exports.xxx = value`

```javascript
// school.js
// 导出
const username = '张三'
const userage = 18
function add (n) {
  userage += n
}
exports.username = username
exports.usernage = userage
exports.add = add
module.exports = { username, userage, add }
```

（2）`require(xxx)` 导入：如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径。

```javascript
// index.js
// 导入
const school = require('./school.js')
const student = require('./student.js')
// 可以解构赋值
const { username, userage, add } = require('./school.js')
// 防止命名冲突，重新命名
const { stuname,stuage, add:stuadd } = require('./student.js')
```

#### 各模块化区别⭐

##### `CommonJS`

1. `CommonJS` 是用在服务器端的，如 `node.js`；同步的，即只有加载完成，才能执行后面的操作。
2. 模块就是对象，即在输⼊时是先加载整个模块，⽣成⼀个对象，然后再从这个对象上面读取⽅法，这种加载称为运行时加载。
3. `require` 引用和加载模块，`module.exports | exports` 导出内容。

##### AMD

AMD（*Asynchronous Module Definition*，异步模块定义）采用异步方式加载模块。**所有依赖模块的语句，都定义在一个回调函数中，等到模块加载完成之后，这个回调函数才会运行。**

它主要有两个接口 `define` 和 `require`。 `define` 是模块开发者关注的⽅法；而 `require` 则是模块使用者关注的方法。 

```js
define(id?, dependencies?, factory);
// id：可选参数，它指的是模块的名字
// dependencies：可选参数，定义中模块所依赖模块的数组
// factory：模块初始化要执⾏的函数或对象
```

```js
require([module], callback);
// module：⼀个数组，⾥⾯的成员就是要加载的模块
// callback：模块加载成功之后的回调函数
```

##### UMD

`UMD` 是 `AMD` 和 `CommonJS` 的⼀个糅合。 `AMD` 是浏览器优先，异步加载；`CommonJS` 是服务器优先，同步加载。 先判断是否支持 `node` 模块，支持就使用 `node`； 再判断是否支持 `AMD`，支持则使用 `AMD` 的方式加载。这就是所谓的 `UMD`。

```js
(function (window, factory) {
   if (typeof exports === "object") {
   	// CommonJS
   	module.exports = factory();
 } else if (typeof define === "function" && define.amd) {
   // AMD
   define(factory);
 } else {
	// 浏览器全局定义
	window.eventUtil = factory();
 }
 })(this, function () {
	// do something
 });
```

##### ES6

1. ES6 模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。
2. ES6 是编译时加载，不同于 `CommonJS` 的运行时加载（实际加载的是⼀整个对象）， ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，输入时也采用静态命令的形式。 
3. 模块功能主要由两个命令构成：`export` 和 `import`。

##### `export` 和 `export default` 导出方式的区别

1. `export`：导出⼀个或多个具名的变量、函数或类，在其他模块中，可以使用 `import` 导入这些具名的变量、函数或类。
2. `export default`：⼀个模块只能有⼀个默认导出，而且在导入时不需要使用大括号。

##### ES6 和 `CommonJS` 区别⭐

1. 语法不同
   1. ES6 是原生支持的 JS 模块系统，使用 `import/export` 实现模块的导入导出；
   2. `CommonJS` 是 `Node` 最早引⼊的模块化方案，使用 `require /module.exports & exports` 实现模块的导入导出。

2. 加载方式不同
  1. **编译时输出接口**：ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。通过 `export` 显式指定输出的代码，`import` 采用静态命令的形式；即在 `import` 时可以指定加载某个输出值，而不是加载整个模块，这种加载称为编译时加载。
  2. **运行时加载**：`CommonJS` 加载的是一个对象，即 `module.exports` 属性，该对象只有在脚本运行完才会生成。在输入时是先加载整个模块，⽣成⼀个对象，然后再从这个对象上面读取方法，这种加载称为运行时加载。
3. 导入导出特性不同
  1. ES6 支持**异步加载（有一个独立的模块依赖的解析阶段），动态导入和命名导入**等特性，可以根据需要动态导入导出，模块里面的变量绑定其所在的模块。
  2. `CommonJS` 只支持**同步加载**。 
4. 循环依赖处理方式不同：ES6 采用在编译阶段解决并处理；而 `CommonJS` 只能在运行时抛出错误。
5. 兼容性不同：ES6 需要在支持 ES6 的浏览器或者 `Node.js` 的版本才能使用；而 `CommonJS` 的兼容性更好 。


6. **ES6 模块输出的是值的引用，`CommonJS` 模块输出的是一个值的拷贝。**
  1. ES6 模块的运行机制与 `CommonJS` 不⼀样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。原始值变了，`import` 加载的值也会跟着变。**ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。ES6 输入的模块变量，只是一个符号连接，所以这个变量是只读的，对它进行重新赋值会报错。**
  2. `CommonJS` 模块输出的是值的拷贝（浅拷贝），一旦输出一个值，模块内部的变化就影响不到这个值。
     1. `CommonJS` 输出的是对象的**引用**，不是值的拷贝。若导出的是原始值，则无法追踪变化；若导出的是对象/函数，其他模块可以访问并影响其状态。

### （3）Node.js 的模块加载方法

#### 概述

JavaScript 现在有两种模块：ES6 模块，简称 ESM；`CommonJS` 模块，简称 CJS。

`CommonJS` 模块是 Node.js 专用的，与 ES6 模块不兼容。`CommonJS` 模块使用 `require` 和 `module.exports`，ES6 模块使用 `import` 和 `export`。

① 用 ES6 加载

1. 文件后缀改为 `.mjs`；

2. `package.json` 文件的 `type` 属性指定为 `module`。


```json
{
   "type": "module"
}
```

② 用 `CommonJS` 加载

1. 文件后缀改为 `.cjs`；

2. `package.json` 文件的 `type` 属性指定为 `commonjs`。


#### `package.json` 的配置

（1）`main` 字段

有两个字段可以指定模块的入口文件：`main` 和 `exports`。比较简单的模块，可以只使用 `main` 字段，指定模块加载的入口文件。

（2）`exports` 字段

`exports` 字段的优先级高于 `main` 字段。

① 子目录别名：可以指定脚本或子目录的别名。

```json
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/": "./src/features/" // 指定src/submodule.js别名为submodule
  }
}

import feature from 'es-module-package/features/x.js';  // 然后就可以从别名加载这个文件
// 加载 ./node_modules/es-module-package/src/features/x.js
```

② `main` 的别名

`exports` 字段的别名如果是 `.`，就代表模块的主入口，优先级高于 `main` 字段，并且可以直接简写成 `exports` 字段的值。

```json
{
  "exports": {
    ".": "./main.js"
  }
}

// 等同于
{
  "exports": "./main.js"
}
```

由于 `exports` 字段只有支持 ES6 的 Node.js 才认识，所以可以搭配 `main` 字段，来兼容旧版本的 Node.js。

```js
{
  "main": "./main-legacy.cjs",  // 老版本的 Node.js （不支持 ES6 模块）的入口文件是main-legacy.cjs
  "exports": {
    ".": "./main-modern.cjs"  // 新版本的入口文件是main-modern.cjs
  }
}
```

③ 条件加载

利用 `.` 这个别名，可以为 ES6 模块和 `CommonJS` 指定不同的入口。如果同时还有其他别名，就不能采用简写，否则会报错。

```json
{
  "type": "module",
  "exports": {
    ".": {
      "require": "./main.cjs",  // require 条件指定 require() 命令的入口文件（即 CommonJS 的入口）
      "default": "./main.js"  // default 条件指定其他情况的入口（即 ES6 的入口）
    }
  }
}
```

#### `CommonJS` 模块加载 ES6 模块

可以用 `import()` 方法加载 ES6 模块，不能用 `require()` 方法。

`require()` 不支持 ES6 模块的一个原因是，它是同步加载，而 ES6 模块内部可以使用顶层 `await` 命令，导致无法被同步加载。

```js
(async () => {
  await import('./my-app.mjs');
})();
```

#### ES6 模块加载 `CommonJS` 模块

`import` 命令可以加载 `CommonJS` 模块，但是只能整体加载，不能只加载单一的输出项。

因为 ES6 模块需要**支持静态代码分析**，而 `CommonJS` 模块的输出接口是 `module.exports`，是一个对象，无法被静态分析，所以只能整体加载。

```js
// 正确
import packageMain from 'commonjs-package';
// 加载单独一项
const { method } = packageMain;

// 报错
import { method } from 'commonjs-package';
```
#### 同时支持两种格式的模块

（1）

① 如果原始模块是 ES6 格式，那么需要给出一个整体输出接口，比如 `export default obj`，使得 `CommonJS` 可以用 `import()` 进行加载。

② 如果原始模块是 `CommonJS` 格式，那么可以加一个包装层。你可以把这个文件的后缀名改为 `.mjs`，或者将它放在一个子目录，再在这个子目录里面放一个单独的 `package.json` 文件，指明 `{ type: "module" }`。

```js
import cjsModule from '../index.js';  // 先整体输入 CommonJS 模块
export const foo = cjsModule.foo;  // ，然后再根据需要输出具名接口
```

(2) 在 `package.json` 文件的 `exports` 字段，指明两种格式模块各自的加载入口。

```js
"exports"：{
  "require": "./index.js"，
  "import": "./esm/wrapper.js"
}
```

### （4）循环加载

循环加载（*circular dependency*）指的是，`a` 脚本的执行依赖 `b` 脚本，而 `b` 脚本的执行又依赖 `a` 脚本。通常，循环加载表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现。

① `CommonJS` 模块的加载原理：`CommonJS` 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。

② `CommonJS` 模块的循环加载：**`CommonJS` 输入的是被输出值的拷贝，不是引用**。

③ ES6 模块的循环加载：ES6 处理循环加载与 `CommonJS` 有本质的不同。ES6 模块是动态引用，如果使用 `import` 从一个模块加载变量（即 `import foo from 'foo'`），那些变量不会被缓存，而是成为一个指向被加载模块的引用。
