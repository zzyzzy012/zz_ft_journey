# JS八股整理1

ECMAScript 和 JavaScript 的关系是，前者是后者的规格(由 ECMA 指定标准)，后者是前者的一种实现。

ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。

Node.js 是 JavaScript 的服务器运行环境 *runtime*。

Babel 转码器，可以将 ES6 代码转为 ES5 代码，从而在老版本的浏览器执行。

## 一、变量⭐

变量是存储数据的容器。

变量命名规则：

1. 只能是字母、数字、下划线、$，且不能能数字开头
2. 区分大小写
3. 不允许使用关键字或保留字
4. 变量有语义

ES6 一共有 6 种声明变量的方法：`var` 、`let`、`const`、`function`、`class`、`import`

### 1）变量声明方式

#### `var`

1. **变量提升（*Hoisting*）**：声明会被提升到作用域顶部，但不会初始化，在声明之前使用变量值为 `undefined`

2. 允许重复声明（会覆盖之前的值）
3. 声明的变量会属于顶层对象属性，全局变量会成为 `window`  对象的属性
   1. 顶层对象，浏览器环境指的是 `window` 对象，Node 指的是 `global` 对象
   2. ES5 中，顶层对象的属性与全局变量是等价的
4. **函数作用域（*Function Scope*）**，只能在函数内访问


```js
console.log(a);  // undefined（变量提升，但未赋值）
var a = 10;  
console.log(a);  // 10

var b = 5;
var b = 20;  // 允许重复声明
console.log(b);  // 20

var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1
```

#### `let`

1. **块级作用域（*Block Scope*）**：只在 `{}` 内有效，它所声明的变量就绑定这个区域，不再受外部的影响。

2. **不会发生变量提升**：必须在变量声明之后访问，在声明前访问会报错 `TDZ`。

3. 不允许在相同作用域内重复声明

4. 声明的变量不会属于顶层对象属性，全局变量不会挂载到 `window`

适用 `for` 循环，设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```js
if (true) {
  let z = 30;
}
// console.log(z);  // 报错：在块级作用域有效

var tmp = 123;
if (true) {
  tmp = 'abc';  // ReferenceError，let 声明绑定了这块块级作用域，在声明之前访问会报错
  let tmp;
}

let y = 10;
// let y = 20;  // 报错：不可以重复声明

let b = 1;
window.b  // undefined
```

临时死区（ *Temporal Dead Zone*，TDZ）：是 `let` 和 `const` 的特性，指在变量声明之前不能访问它。

```js
function bar(x = y, y = 2) {  //  y 未声明就访问
  return [x, y];
}

bar();  // 报错
```

#### `const`

1. **必须初始化，声明时必须赋值**

2. 块级作用域，与 `let` 相同
3. 不会发生变量提升，存在暂时性死区，只能在声明的位置后面使用
4. 不可重复声明，但对于对象和数组，**内容可变**（引用不变）

5. 声明的变量不会属于顶层对象属性，全局变量不会挂载到 `window`


```js
const PI = 3.14;
// PI = 3.1415;  // 不可重复赋值

const obj = { name: "Alice" };
obj.name = "Bob";  // 允许修改对象内容

const arr = [1, 2, 3];
arr.push(4);  // 允许修改数组内容
console.log(arr);  // [1, 2, 3, 4]
```

`const`：**只保证变量指向的地址不可变**，但对象本身可修改，若要彻底冻结对象需使用 `Object.freeze()`

```js
const obj = { name: "Alice" };
obj.name = "Bob";  // 允许修改

Object.freeze(obj);
obj.name = "Charlie"; // 修改失败，但不会报错，且不会生效
console.log(obj.name); // Bob
```

#### 循环

`var` 会污染全局作用域

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// 输出：3 3 3（`i` 变成全局变量，最终值是 3）
```

`let` **具有块级作用域**，每次迭代都有独立的 `i`

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// 输出：0 1 2
```

### 2）变量解构赋值

从数组和对象中提取值，为变量赋值。类似模糊匹配，**只有具备 `Iterator` 接口的类型才可进行解构赋值。**

#### 数组解构

可以指定默认值 `[vari= val]`，只有值严格等于 `undefined` 才会生效，`null` 不会生效。

```js
const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log(a, b, c); // 1 2 3

// 省略某些值
const [x, , y] = [10, 20, 30];
console.log(x, y); // 10 30

// 默认值
const [m, n = 100] = [50];
console.log(m, n); // 50 100

// 默认值
let [x = 1] = [undefined];
x // 1
```

#### 对象解构

变量名必须等于属性名才会解构成功，不需要向数组一样有顺序。

变量名重命名：`旧名:新名`，真正被赋值的是后面的变量名。

嵌套赋值需要指明是哪个对象：`{对象:{变量名}}`。

可以指定默认值，生效条件是值严格等于 `undefined`，`{ varia = val }`。

```js
const person = { name: "Alice", age: 25 };
const { name, age } = person;  //  const { name: name, age: age } = person; 简写
console.log(name, age); // Alice 25

// 变量重命名
const { name: userName, age: userAge } = person;
console.log(userName, userAge); // Alice 25

// 嵌套赋值
const node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

let { loc, loc: { start }, loc: { start: { line }} } = node;
line // 1
loc  // Object {start: Object}
start // Object {line: 1, column: 5}

// 默认值
const { gender = "unknown" } = person;
console.log(gender); // unknown

// ⭐数组作为对象形式的解构赋值
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```

#### 函数参数解构

也可以为参数指定默认值，但是是具体参数指定默认值还是整个指定默认值有区别。

```js
function show({ name, age }) {
  console.log(`Name: ${name}, Age: ${age}`);
}
show({ name: "Bob", age: 30 }); // Name: Bob, Age: 30

// 默认值
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

#### 其他变量类型解构

数值和布尔值，则会先转为对象。只要等号右边的值不是对象或数组，就先将其转为对象。

由于 `undefined` 和 `null` 无法转为对象，所以对它们进行解构赋值，都会报错。

```js
// 字符串
const [a, b] = 'hi';
a  // "h"
b  // "i"

// len 属性
let {length : len} = 'hello';
len  // 5
```

## 二、数据类型⭐

JavaScript 是动态弱类型语言，变量可以存储原始类型 / 基本类型（*Primitive Types*）或 引用类型 / 复杂类型（*Reference Types*）。

- 基本类型：`Number`、`String`、`Boolean`、`undefined`、`null`、`Symbol`、`BigInt`
- 复杂类型：`Object`、`Array`、`Function`、`Date`、`RegExp`（正则表达式）、`Map/WeakMap`（映射）、`Set/WeakSet`（集合）、`Promise`（异步）、`Class`
- 类型检测：`typeof`、`instanceof`、`Object.prototype.toString.call()`
- 包装类型：基本类型是没有属性和方法的，但是为了便于操作基本类型的值，在调用基本类型的属性或方法时 JavaScript 会在后台隐式地将基本类型的值转换为对象。

### 原始类型

**原始类型是不可变值，存储在栈内存中，直接存储值。**

**`null` 和 `undefined`的区别**

`null` 表示没有对象，即该处不应该有值。

1. 作为函数的参数，表示该函数的参数不是对象。
2. 作为对象原型链的终点。

`undefined` 表示缺少值，就是此处应该有一个值，但是还没有定义。

1. 变量被声明了，但没有赋值时，就等于 `undefined`
2. 调用函数时，应该提供的参数没有提供，该参数等于 `undefined`
3. 对象没有赋值的属性，该属性的值为 `undefined`
4. 函数没有返回值时，默认返回 `undefined`

#### `Number`

创建 `Number`：直接数字、构造函数 `new Number()`

```js
const n1 = new Number(110)
console.log(n1)  // [Number: 110]
```

转换为数值类型：`Number()`、`parseInt()`、`parseFloat()`

`Number.isFinite()`、`Number.isNaN()` 检查一个数是否有限、是否为 `NaN`。

> 传统方法需要先调用 `Number()` 转换为数值，而新方法只对数值有效。

`Number.isInteger()`：判断是否为整数，由于计算机存储二进制，JS 存储有限，这个方法精度不高。

`Number.EPSILON()`：极小的常量，表示可以接受的最小误差范围。

> JavaScript 能够准确表示的整数范围在 (-2^53, 2^53) ，超过这个范围，无法精确表示这个值。
>
> `Number.MAX_SAFE_INTEGER` 和 `Number.MIN_SAFE_INTEGER` 这两个常量，用来表示这个范围的上下限。
>
> `Number.isSafeInteger()` 则是用来判断一个整数是否落在这个范围之内。

`toFixed()`：保留几位小数。

```js
const num = 500.3426
console.log(num.toFixed(2))   // 500.34
```

#### `BigInt`

表示整数，没有位数的限制。为了与 `Number` 类型区别，`BigInt` 类型的数据必须添加后缀 `n`。通过 `BigInt()` 生成，不能用关键词 `new`。

⚠️ `BigInt` 和 `Symbol` 不能用关键词 `new` 生成。

1. 因为 `BigInt` 和 `Symbol` 都是原始数据类型，是不可变的、非对象的值。用 `new` 生成，会创建一个对象实例。而 `BigInt` 和 `Symbol` 是原始类型，不能作为对象实例存在。

2. 使用 `new` 创建的 `Number`、`String` 和 `Boolean` 是对象包装器（*Object Wrapper*），它们将原始值包装为一个对象，让原始值可以调用一些方法。

3. `BigInt` 和 `Symbol` 的设计目标是简单、高效，避免对象包装器的额外开销。

```js
const b1 = BigInt(100)
console.log(b1)  // 100n
```

#### `String`

创建 `String`：`''`，构造函数 `new String()`

`toString()` 和 `valueOf()` 都是返回字符串的值。如果对象是字符串类型，行为无区别。

如果是其他类型：

- `toString()` 返回的是字符串值，将对象转为字符串。
- `valueOf()` 返回的是原始值，将对象转为原始值，如果不是返回原始值，则调用 `toString()` 方法。

```js
const str1 = new String('hello')
console.log(str1)  // [String: 'hello']
console.log(str1.toString())  // hello
console.log(str1.valueOf())  // hello
```

模板字符串：`${variant}`

```js
let name = 'Tom'
console.log(`My name is ${name}`)
```

`String.raw()` 转义 `\`

**实例方法**

**① 大小写转换**

1. `toLowerCase() / toUpperCase()`：转换大小写

2. `toLocaleLowerCase()`：根据特定区域设置的大小写映射规则，将字符串转换为小写形式并返回

3. `toLocaleUpperCase()`


```js
// 大小写
const sentence = 'The quick brown fox jumps over the lazy dog.';
console.log(sentence.toLowerCase());
// "the quick brown fox jumps over the lazy dog."

const sentence = 'The quick brown fox jumps over the lazy dog.';
console.log(sentence.toUpperCase());
// "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG."

// 本地大小写
const dotted = "İstanbul";
console.log(`EN-US: ${dotted.toLocaleLowerCase("en-US")}`);
// Expected output: "i̇stanbul"

const city = "İstanbul";
console.log(city.toLocaleUpperCase("en-US"));
// Expected output: "ISTANBUL"
```

**② 检索**

1. `includes(searchString, position[可选，表示开始搜索的位置])`：执行区分大小写的搜索，以确定是否可以在一个字符串中找到另一个字符串，返回布尔值。
2. `startsWith(searchString, position[可选])`：表示参数字符串是否在原字符串的头部，返回布尔值。
   1. `endsWith(searchString, position[可选])`：表示参数字符串是否在原字符串的尾部，返回布尔值。
3. `indexOf(searchString, position[可选]) `：在字符串中搜索指定子字符串，并返回其第一次出现的位置索引。
   1. `lastIndexOf()`：搜索该字符串并返回指定子字符串最后一次出现的索引。
4. `at()`：返回参数指定位置的字符，支持负索引（即倒数的位置）。

```js
const str = 'Hello';

str.includes('o') // true

str.startsWith('H') // true
str.endsWith('o') // true

console.log(str.indexOf('l')) // 2

str.at(1) // "e"
str.at(-1) // "o"
```

**③ 新字符串**

1. `concat(str1, str2, ...strN)`：将字符串参数连接到调用的字符串，并返回新字符串。
2. `repeat(n)`：将原字符串重复 `n` 次，返回新字符串。
3. `padStart(targetLength, padString)` 头部补全；`padEnd()` 尾部补全。
   1. 一共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串，如果没有，默认空格补全。
      - 小于字符串长度，不补全。
      - 补全字符串长度大于补全长度，舍弃超出位数的补全字符串。

```js
const str1 = 'Hello';
const str2 = 'World';

console.log(str1.concat(' ', str2));       // "Hello World"
console.log(str2.concat(', ', str1));      // "World, Hello"

const mood = 'Happy! ';
console.log(`I feel ${mood.repeat(3)}`);
// "I feel Happy! Happy! Happy! "

'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
```

1. `replace()`：只能替换第一个匹配到的字符，想要全局匹配，需要正则表达式加 `g`。
2. `replaceAll(searchValue, replacement)`：一次性替换所有匹配。用法与 `replace()` 相同，返回一个新字符串，不会改变原字符串。
   1. `searchValue`：搜索模式，可以是一个字符串，也可以是一个全局的正则表达式（带有 `g` 修饰符，不带 `g` 会报错）。
   2. `replacement`：一个字符串，表示替换的文本，其中可以使用一些特殊字符串。除了为字符串，也可以是一个函数，该函数的返回值将替换掉第一个参数 `searchValue` 匹配的文本。

```js
'aabbcc'.replace('b', '_')
// 'aa_bcc'
'aabbcc'.replace(/b/g, '_')
// 'aa__cc'

'aabbcc'.replaceAll('b', () => '_')
// 'aa__cc'
```

**④ 截取**

1. `slice(indexStart, indexEnd[可选，包含起始，不包含结束])`：提取字符串的一部分，不修改原字符串，返回新字符串。
2. `substring(indexStart, indexEnd[可选])`：返回该字符串从起始索引到结束索引（不包括）的部分，返回新字符串。
   1. `slice()` 支持负索引，而 `substring()` 不支持。
   2. `slice(7,2)` 返回空字符串 `''`，而 `substring(7,2)` 会自动交换顺序 `substring(2,7)`。
   3. `slice()` 性能相比更高。
3. `trim()`：消除字符串两端空白字符，返回新字符串，不会修改原字符串。
   1. `trimStart()` 消除字符串头部的空格；`trimEnd()` 消除尾部空格，与 `trim()` 行为一致。
   2. 对字符串头部（或尾部）的 `tab` 键、换行符等不可见的空白符号也有效。

```javascript
const str = 'Mozilla';
console.log(str.slice(3));  // "illa"
console.log(str.slice(1, 3));  // "oz"

console.log(str.substring(2));  // "zilla"
console.log(str.substring(1, 3));  // "oz"

const greeting = '   Hello world!   ';
console.log(greeting.trim());   // "Hello world!";
```

**⑤ 转换**

`split(separator, limit[可选，限制返回的子字符串的个数])`：将字符串分割成多个子字符串，并将这些子字符串存储在一个数组中。

- 使用空格作为分隔符，每个空格分隔的内容会作为数组元素。
- 遇到逗号时会进行分割，得到单独的字符串项。

```js
const sentence = "Hello world, welcome to JavaScript.";
const words = sentence.split(" ");
console.log(words);
// 输出: ["Hello", "world,", "welcome", "to", "JavaScript."]

const data = "apple,banana,orange";
const fruits = data.split(",");
console.log(fruits);
// 输出: ["apple", "banana", "orange"]
```

#### `Symbol`

`Symbol`：表示独一无二的值，不能用关键词 `new`。可传入字符串参数，表示对其的描述。`description` 直接返回其描述值。

```js
let s1 = Symbol('foo');

s1 // Symbol(foo)
s1.description // foo
```

作为对象属性名，需要放在 `[]` 而不是 `.`

1. 只能通过 `Object.getOwnPropertySymbols` 得到 `Symbol` 键名。

2. `Reflect.ownKeys` 方法可以返回所有类型的键名，包括常规键名和 `Symbol` 键名。

3. `for...in` 循环和 `Object.getOwnPropertyNames` 方法都得不到 `Symbol` 键名。


```js
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';  // .后的属性名表示字符串而不是 Symbol
a[mySymbol]  // undefined
a['mySymbol']  // "Hello!"
```

```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols  // [Symbol(a), Symbol(b)]

let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
};

Reflect.ownKeys(obj)  //  ["enum", "nonEnum", Symbol(my_key)]
```

`Symbol.for()` 返回同一字符串参数的 `Symbol`，可以重复使用该 `Symbol` 值，会被登记，而 `Symbol()` 不会。

`Symbol.keyFor()` 返回已登记过的 `Symbol` 值。

```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true

let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

### 引用类型

**存储在堆内存**，变量存储的是**引用地址**，而非实际值。

#### `Date`

**（1）创建 `Date` 对象**

1. 无参数，当前日期时间
2. 时间戳(*timestamp*)：毫秒数
3. 字符串格式：`YYYY-MM-DDTHH:mm:ss.sssZ`
  - 带有时间标志 `T` 和时区标志 `Z`
  - 仅日期部分，时间默认为 `00:00:00`
4. 年月日时分秒

月份从 `0 ` 开始，`0 ` 表示 1 月，`11` 表示 12 月。

```js
let now = new Date();
console.log(now); // 输出当前日期时间：2025-04-02T02:50:15.360Z

let date = new Date(1633072800000); // 2021-10-01T00:00:00.000Z

let date = new Date("2021-10-01T00:00:00");
console.log(date);  // 2021-10-01T00:00:00.000Z
let date = new Date("2021-10-01");
console.log(date);  // 2021-10-01T00:00:00.000Z

let date = new Date(2021, 9, 1, 0, 0, 0); // 2021 年 10 月 1 日 00:00:00
```

**（2）获取日期和时间**

① 获取年、月、日

1. `getFullYear()`：获取年份，4 位数
2. `getMonth()`：获取月份，`0-11`
3. `getDate()`：获取日期，`1-31`
4. `getDay()`：获取星期，`0-6`，`0` 表示星期日

② 获取时、分、秒

1. `getHours()`：获取小时，`0-23`
2. `getMinutes()`：获取分钟，`0-59`
3. `getSeconds()`：获取秒数，`0-59`
4. `getMilliseconds()`：获取毫秒数，`0-999`

**③ 获取时间戳**

1. `getTime()`：获取时间戳，毫秒数，从 `1970-01-01` 开始
2. `valueOf()`：与 `getTime()` 相同
3. `getTime()` 专门获取时间戳，而 `valueOf()` 则是获取 `Date()` 对象的原始值即时间戳，前者更直观。

**（3）设置日期和时间**

1. 设置年、月、日：`setFullYear()`、`setMonth()`、`setDate()`

2. 设置时、分、秒：`setHours()`、`setMinutes()`、`setSeconds()`、`setMilliseconds()`

3. 设置时间戳：`setTime()`


**（4）格式化**

① 转换为字符串

1. `toString()`：转换为本地时间字符串
2. `toDateString()`：转换为日期部分字符串
3. `toTimeString()`：转换为时间部分字符串
4. `toLocaleString()`：转换为本地格式字符串
5. `toISOString()`：转换为 `ISO 8601` 格式字符串

```js
date.toString();  // "Fri Oct 01 2021 00:00:00 GMT+0800 (中国标准时间)"

date.toDateString();  // "Fri Oct 01 2021"

date.toTimeString();  // "00:00:00 GMT+0800 (中国标准时间)" 

date.toLocaleString();  // "2021/10/1 上午12:00:00"

date.toISOString();  // "2021-09-30T16:00:00.000Z"
```

**② 格式化🍎**

```js
const formatDate = (d, format="YYYY-MM-DD HH:mm:ss") => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
  .replace('YYYY', year)
  .replace('MM', month)
  .replace('DD', day)
  .replace('HH', hours)
  .replace('mm', minutes)
  .replace('ss', seconds)
}
console.log(formatDate('2024-4-1', "YYYY年MM月DD日"))  // 2024年04月01日
```

**③ 时间差**

计算两个日期的天数差：计算时间戳，将毫秒数转为天数 `/(1000 * 60 * 60 *24)`

#### `Set`

`Set` 是**无重复值集合**，`new Set()` 创建。

1. `size()` 成员个数

2. `add()` 添加，返回 `Set`
3. `delete()` 删除，返回布尔值，表示是否删除成功
4. `has()` 是否有该值，返回布尔值
5. `clear()` 清除所有成员

```js
let s1 = new Set([1,2,3,4,5,5,5,6,7,8,9,10])
console.log(s1.size)  // 10
console.log(s1.add(0))  // Set(11) { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0 }
console.log(s1.delete(5))  // true
console.log(s1.has(5))  // false
console.log(s1.clear())  // undefined
```

遍历：`keys()`、`values()`、`entries()`、`forEach()`、`for ... of` 遍历。

由于 `Set` 无键名，所以 `keys()` 和 `values()` 行为一致。

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

// ❗可直接省略 keys() 和 values()
for (let x of set) {
  console.log(x);
}

// red
// green
// blue
for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

可用扩展运算符转化为数组。可返回并集、交集、差集。

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

`WeakSet` 是不重复的值的集合，只能存放对象和 `Symbol` 值，不能遍历。

#### `Map`

`Map` **是键值对集合**，**键可以是任何类型**（对象、函数）。

与 `Object` 的区别：`Map` 键可以是任意类型，而 `Object` 只能用 `string` 作为键。`Map` 按插入顺序存储，`Object` 无顺序。

1. `size()` 返回 `Map` 结构的成员总数

2. `set(key, value)` 设置键名 `key` 对应的键值为 `value`，然后返回整个 `Map` 结构

3. `get(key)` 读取 `key`，无就返回 `undefined`

4. `has(key)` 表示某个键是否在当前 `Map` 对象之中，返回一个布尔值

5. `delete()` 删除某个键，返回 `true`；如果删除失败，返回 `false`

6. `clear()` 清除所有成员，没有返回值


```js
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

遍历：`keys()`、`values()`、`entries()`、`forEach()`、`for...of`

```js
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
```

扩展运算符，转为数组。

```js
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

```js
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```

`WeakMap` 结构与 `Map` 结构类似，也是用于生成键值对的集合。

`WeakMap` 只接受对象（`null` 除外）和 `Symbol` 值作为键名，不接受其他类型的值作为键名。

`WeakMap` 的键名所指向的对象，不计入垃圾回收机制。

### 变量类型转换

原始数据类型：`Number()`、`parseInt()`、`parseFloat()`、`String()`、`Boolean()`、原始数据类型转为对象`Object()`，由于内存开销不推荐此做法。

除了 `NaN`、`0`、`null`、`undefined`、`''` 会被转换为 `false`，其他类型会被转换为 `true`。

对象转为原始数据类型：

`valueOf()` 如果对象具有原始数据类型的值，则直接返回该值；否则返回对象本身。

- 基本包装类型直接返回原始值
- `Date` 类型返回毫秒数
- 其他都返回对象本身

```js
// 1. 基本包装类
let num = new Number('123')
console.log(num.valueOf()); // 123

let str = 'Ywis'
console.log(str.valueOf()); // Ywis

// 2. Date 类型返回一个内部表示：1970年1月1日以来的毫秒数
let date = new Date();
console.log(date.valueOf()); // 1710155613356

// 3.返回对象本身
let obj = new Array()
console.log(obj.valueOf()); // []
```

`toString()` 用于返回对象的字符串表示形式。

- 基本包装类型直接返回原始值
- 很多类都有实现各自版本的 `toString()`
  - 对象调用：`{}.toSring` 返回由 `"[Object 类型名]"` 组成的字符串
  - 数组调用：`[].toString` 返回由数组内部元素以逗号拼接的字符串
  - `Date` 类型转换为可读的日期和时间字符串
  - 函数调用：返回这个函数定义的 JS 源代码字符串

```js
// 1. 基本包装类
let num = new Number('123abc')
console.log(num.toString()); // NaN

let str = 'Ywis'
console.log(str.toString()); // Ywis

// 2.1 对象调用
let obj = new Object({});
console.log(obj.toString()); // [object Object]

// 2.2 数组调用
let arr = new Array(1, 2, 3);
console.log(arr.toString()); // 1,2,3

// 2.3  Date类型转换为可读的日期和时间字符串
let date = new Date();
console.log(date.toString()); // Mon Mar 11 2024 19:30:58 GMT+0800 (中国标准时间)

// 2.4 函数调用
let fun = function(){console.log('Ywis');}
console.log(fun.toString()); // function(){console.log('Ywis');}
```

显示转换、隐式转换

- 逻辑表达式：逻辑运算符，如逻辑非 `！`、逻辑与 `&&`、逻辑或 `||`，非布尔类型的值会被隐式转换为布尔类型。
- 逻辑语句的类型转换：当使用 `if`、`while`、`for` 时，隐式转换为布尔值。
- 算术表达式：`+`，两边只要有一个为 `string`，则转化为字符串拼接，其他情况下隐式转化为 `number`。


- 比较操作：
  - `==` 两边比较最好都转化为数字
  - `<`、`>` 如果两边都是字符串，则比较字母表顺序

```js
console.log("5" + 3); // "53"（字符串拼接）
console.log("5" - 3); // 2（字符串转数字）
```

### 类型判断⭐

（1）`typeof`：判断原始类型和 `function`，**数组、对象、`null` 都会被判断为 `object`**，其他判断都正确。

```js
console.log(typeof 42); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object"（历史遗留问题）
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
console.log(typeof function() {}); // "function"
```

（2）`instanceof`：检查对象是否在构造函数的原型链上。如果对象是通过指定构造函数创建的实例，则返回 `true`。**判断引用数据类型，而不能判断基本数据类型。**

```js
const obj1 = {
  name: "John",
}
const arr1 = [1,2,]
const set1 = new Set([1,2,3,4,4,5])
const map1 = new Map([['name', 14], [Symbol('aa'), function() { 
  return 'aa'
}]])
// 这些都是true
console.log(obj1 instanceof Object)
console.log(arr1 instanceof Object)
console.log(arr1 instanceof Array)
console.log(set1 instanceof Object)
console.log(set1 instanceof Set)
console.log(map1 instanceof Object)
console.log(map1 instanceof Map)

console.log('下面是简单类型')
const n1 = new Number(12)
const n2 = 135
console.log('数字')
console.log(n1 instanceof Number)  // true
console.log(n2 instanceof Number)  // false

const s1 = new String('what')
const s2 = 'why'
console.log('字符串')
console.log(s1 instanceof String)  // true
console.log(s2 instanceof String)  // false

const flag1 = new Boolean(true)
const flag2 = true
console.log('布尔值')
console.log(flag1 instanceof Boolean)  // true
console.log(flag2 instanceof Boolean) // false

const bi1 = BigInt(333333)
console.log(bi1 instanceof BigInt)  // false

const sb1 = Symbol('bb')
console.log(sb1 instanceof Symbol)  // false
```

（3）`constructor`：判断数据类型，对象实例通过 `constrcutor` 访问它的构造函数。

```js
console.log((2).constructor === Number); // true
console.log((true).constructor === Boolean); // true
console.log(('str').constructor === String); // true
console.log(([]).constructor === Array); // true
console.log((function() {}).constructor === Function); // true
console.log(({}).constructor === Object); // true
```

如果创建一个对象来改变它的原型，`constructor` 就不能用来判断数据类型了。

```js
function Fn(){};
 
Fn.prototype = new Array();
 
var f = new Fn();
 
console.log(f.constructor===Fn);    // false
console.log(f.constructor===Array); // true
```

（4）`Object.prototype.toString.call()`：使用 `Object` 对象的原型方法 `toString` 来判断数据类型。

```js
var a = Object.prototype.toString;
 
console.log(a.call(2));  // [object Number]
console.log(a.call(true));  // [object Boolean]
console.log(a.call('str'));  // [object String]
console.log(a.call([]));  // [object Array]
console.log(a.call(function(){}));  // [object Function]
console.log(a.call({}));  // [object Object]
console.log(a.call(undefined));  // [object Undefined]
console.log(a.call(null));  // [object Null]
```

`obj.toString()` 和 `Object.prototype.toString.call(obj)` 的结果不一样，这是为什么？

- `obj.toString()` 不能得到其对象类型，只能将 `obj` 转换为字符串类型。

- `toString` 是 `Object` 的原型方法，而 `Array`、`function` 等类型作为 `Object` 的实例，都重写了 `toString` 方法。不同的对象类型调用 `toString` 方法时，根据原型链的知识，调用的是对应的重写之后的 `toString` 方法，而不会去调用 `Object` 上原型 `toString` 方法（返回对象的具体类型）。

## 三、运算符

（1）算术运算符： `+`、`-`、`*`、`/`、`%` 取余、`**` 指数运算、`++` 自增、`--` 自减

> `0.1+0.2 ! == 0.3`
>
> 1. 原因：计算机二进制存储，有精度问题
>
> 2. 解决方法
>    1. 小数计算转化为整数再除法计算
>    2. `Number.EPSILON` 误差小于它则默认通过

（2）赋值运算符：`=`、`+=`、`-=`、`*=`、`/=`、`%=` 取余后赋值、`**=` 指数后赋值

（3）逻辑赋值运算符（*logical assignment operators*）：`||=`、`&&=`、`??=` 相当于先进行逻辑运算，然后根据运算结果，再视情况进行赋值运算。

场景：为变量或属性设置默认值

```js
// 或赋值运算符
x ||= y
// 等同于
x || (x = y)

// 与赋值运算符
x &&= y
// 等同于
x && (x = y)

// Null 赋值运算符
x ??= y
// 等同于
x ?? (x = y)

// 老的写法
user.id = user.id || 1;

// 新的写法
user.id ||= 1;
```

（4）比较运算符：返回布尔值

1. `==`：值相等， 如果两边的类型不一致，则会进行强制类型转化后再进行比较
   1. 两个都为简单类型，字符串和布尔值都会转换成数值，再比较
   2. 简单类型与引用类型比较，对象转化成其原始类型的值，再比较
   3. 两个都为引用类型，则比较它们是否指向同一个对象
   4. `null` 和 `undefined` 相等
   5. 存在 `NaN` 则返回 `false`
2. `===`：严格等于，值和类型都相等
   1. `undefined` 和 `null` 与自身严格相等
   2. `Object.is()`：与 `===` 判断大致相同，处理了特殊情况，如 `+0` 和 `-0` 不相等，`NaN` 不相等
3. `!=` 不等于、`!==` 严格不等于、`>`、`<`、`>=`、`<=`

（5）逻辑运算符

1. `&&`：逻辑与， 如果条件判断结果为 `true` 就返回第二个操作数的值；如果为 `false` 就返回第一个操作数的值

2. `||`：逻辑或， 如果条件判断结果为 `true` 就返回第一个操作数的值；如果为 `false` 就返回第二个操作数的值

3. `!`：逻辑非


（6）位运算符：现代计算机中数据都是以二进制的形式存储的（即0、1两种状态），计算机对二进制数据进行的运算加减乘除等都是叫位运算（将符号位共同参与运算的运算）。

（7）条件 / 三元运算符：`条件 ? 表达式1 : 表达式2`，真则返回表达式1，假则返回2

```js
const res = Array.isArray(obj)? [] : {}
```

（8）类型运算符：`typeof`、`instanceof`

（9）其他运算符

1. `...` 展开运算符
2. 空值合并运算符：`??` 行为类似 `||`，只有运算符左侧的值为 `null` 或 `undefined` 时，才会返回右侧的值
3. 可选链运算符（*optional chaining operator*）：`?.` 用于安全访问嵌套对象的属性
4. `!.`：`ts` 中的非空断言

```js
let value = null;
let result = value ?? 'default'; // 'default'

let user = { name: 'Alice' };
let age = user?.age; // undefined（不会报错）

let a: string | null = 'hello';
console.log(a!.length); // 非空断言，告诉编译器 a 一定不是 null 或 undefined
```
**（10）运算符的优先级**

1. 括号 `()` 优先级最高
2. 一元运算符：`++`、`--`、`!`、`typeof`
3. 算术运算符：`**`、`*`、`/`、`%` 、 `+`、`-`
4. 比较运算符：`>`、`<`、`>=`、`<=` 、 `==`、`===`、`!=`、`!==`
5. 逻辑运算符：`&&` 、 `||`
6. 赋值运算符：`=`、`+=`、`-=` 等

## 四、表达式和语句

1. 表达式（*Expression*）：是 JavaScript 中的一个代码片段，它会计算并返回一个值。

2. 语句（*Statement*）：是 JavaScript 中的一个完整的代码单元，用于执行某个操作，不一定会返回值。


### 分支语句

分支语句 ：根据条件执行不同代码块的语句。

1. `if` 、`if...else`、`if...else if...else`：条件可以是任何表达式，会将结果转换为布尔值
2. `switch`
3. 分支语句的嵌套

（1）`if` 条件语句

```js
let score = 85;
if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 80) {
    console.log("Grade: B");
} else if (score >= 70) {
    console.log("Grade: C");
} else {
    console.log("Grade: D");
}
```

（2）`switch`

1. `case` 后的值可以是数字、字符串或其他表达式
2. `break` 用于终止 `switch` 语句，防止代码继续执行到下一个 `case`
3. `default` 是可选的，用于处理未匹配到任何 `case` 的情况

```js
let day = 3;
switch (day) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    case 3:
        console.log("Wednesday");
        break;
    default:
        console.log("Invalid day");
}
```

### 循环语句

循环语句：重复执行某段代码的语句。

1. `for` 循环：适合已知循环次数的情况
   1. `for...of` 循环：用于遍历可迭代对象
   2. `for...in` 循环：用于遍历对象的可枚举属性
2. `while` 循环：适合未知循环次数的情况
3. `do...while` 循环：至少执行一次循环体
6. 嵌套循环

（1）`for` 循环

1. `break`：立即终止循环
2. `continue`：跳过当前循环，继续下一次循环

```js
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break; // 当 i 等于 5 时终止循环
    }
    if (i % 2 === 0) {
        continue; // 跳过偶数
    }
    console.log(i); // 输出 1, 3
}
```

（2）`while` 循环 / `do...while` 循环

```js
let i = 0;
while (i < 5) {
    console.log(i); // 输出 0, 1, 2, 3, 4
    i++;
}

let i = 0;
do {
    console.log(i); // 输出 0, 1, 2, 3, 4
    i++;
} while (i < 5);
```

## 五、数组⭐

数组用于存储有序的元素集合。

### 1）数组创建

（1）字面量创建

1. 数组索引 `[]`，从0开始

2. `at()`：返回索引位置，支持负索引

3. `length`：数组长度，还可以截断数组


```js
let arr = [1, 2, 3];
console.log(arr.length); // 3
arr.length = 2; // 截断数组
console.log(arr); // [1, 2]
```

（2）构造函数创建

```js
let arr1 = new Array()
console.log(arr1)  // []
arr1 = new Array(1)
console.log(arr1)  // [ <1 empty item> ]
arr1 = new Array("1")
console.log(arr1)  // ['1']
arr1 = new Array(1,2,3)
console.log(arr1)  // [ 1, 2, 3 ]
```

（3）`Array.of()`：将一组值转换为数组，解决构造函数 `new Array()` 传入不同的参数行为不一致所造成的问题。

```js
let arr = Array.of(1, 2, 3); // [1, 2, 3]
```

（4）`Array.from()`：将伪 / 类数组的对象和可遍历对象转换为数组。浅拷贝。

```js
let arr = Array.from("hello"); // ['h', 'e', 'l', 'l', 'o']
```

（5）`Array.isArray()`：判断是否为数组

```js
let arr1 = ['apple', 'banana', 'orange', 'grape']

console.log(Array.isArray(arr1)) // true
```

伪数组：具有数组部分特性的对象，可以访问元素，具备 `length` 属性（本质特征），但不是 `Array` 实例，不可继承数组的原型方法。

常见伪数组对象：

1. 函数内部的 `arguments` 对象，剩余参数 `...rest` 是真数组
2. DOM 方法返回的 `NodeList`、`HTMLCollection`
3. 字符串

将伪数组转化为数组：

1. `Array.from()`
2. `...` 扩展运算符：可以将定义了 `Iterator` 接口的对象转化为数组
3. `Array.prototype.slice.call()`

```js
let arr1 = [1, 2];
let arr2 = [3, 4];
let merged = [...arr1, ...arr2]; // [1, 2, 3, 4]
```

### 2）常用方法

#### 增删元素

1. `unshift()`：在数组开头添加**一个或多**个元素，返回数组的新长度

2. `push()`：在数组末尾添加**一个或多个**元素，返回数组的新长度
3. `pop()`：删除数组末尾的一个元素，并返回该元素
4. `shift()`：删除数组开头的一个元素，并返回该元素
5. `splice()`：**增删改数组中的元素**，并且可以**返回被删除的元素**，它会**改变原数组**
   1. `toSpliced()`：不改变原数组，返回新数组
6. `with(index, value)`：对应 `splice(index, 1, value)`，用来将指定位置的成员替换为新的值，不改变原数组，返回新数组

```js
array.splice(start, deleteCount, item1, item2, ...)
// start: 需要更改的数组位置的索引
// deleteCount: 可选，需要删除的元素数量
// item1, item2, ...: 可选，要插入的元素
```

```javascript
let fruits = ['apple', 'banana', 'orange', 'grape'];

// 删除2个元素，从索引1开始
let removedFruits = fruits.splice(1, 2);
console.log(fruits);  // ['apple', 'grape']
console.log(removedFruits);  // ['banana', 'orange']

// 从索引1开始，删除0个元素，插入两个新元素
fruits.splice(1, 0, 'kiwi', 'mango');
console.log(fruits);  // ['apple', 'kiwi', 'mango', 'grape']

// 替换元素，从索引2开始，删除1个元素，插入'pear'
fruits.splice(2, 1, 'pear');
console.log(fruits);  // ['apple', 'kiwi', 'pear', 'grape']
```

```js
const correctionNeeded = [1, 1, 3];
correctionNeeded.with(1, 2) // [1, 2, 3]
correctionNeeded // [1, 1, 3]
```

#### 查找元素

1. `at()`：返回索引位置，支持负索引。
2. `find()`：用于找到**符合条件的第一个元素**，返回该元素；如果没有符合条件的元素，返回 `undefined`。
3. `findIndex()`：返回数组中满足条件的第一个元素的索引；若没有找到对应元素则返回 `-1`。
   1. `findLast()` 和 `findLastIndex()`：从数组的最后一个成员开始，依次向前检查
4. `indexOf(searchElement, fromIndex[可选])`：用于查找**元素在数组中的第一个索引**，如果找不到，则返回 `-1`。
   1. `lastIndexOf()`：最后出现的索引位置，如果找不到，则返回 `-1`
   2. `find()` 、`findIndex()` 都可以识别 `NaN`，但是 `indexOf()` 不可以
5. `includes(searchElement, fromIndex[可选，起始索引])`：用于判断**数组中是否包含某个元素**，返回布尔值。
6. `some()`：检查数组中是否**至少有一个元素符合条件**，返回布尔值。
7. `every()`：检查数组中的**所有元素是否都符合条件**，返回布尔值。

```js
const arr = [5, 12, 8, 130, 44];
arr.at(2) // 8
arr.at(-2) // 130
```

```javascript
let fruits = ['apple', 'banana', 'cherry'];

let foundFruit = fruits.find(fruit => fruit.startsWith('b'));
console.log(foundFruit);  // 'banana'

let foundIndex = fruits.find(fruit => fruit.startsWith('b'));
console.log(foundIndex);  // 2

let index = fruits.indexOf('banana');
console.log(index);  // 1（返回第一个 'banana' 的索引）

let hasBanana = fruits.includes('banana');
console.log(hasBanana);  // true（'banana' 在数组中）

let hasLongName = fruits.some(fruit => fruit.length > 5);
console.log(hasLongName);  // true（'banana' 和 'cherry' 长度大于 5）

let allLongNames = fruits.every(fruit => fruit.length > 5);
console.log(allLongNames);  // false（'apple' 不符合条件）
```

#### 合并/截取数组

`slice(start, end[可选，包含起始位置，不包含结束位置])`：从数组中返回指定部分，返回一个新数组，**不修改原数组**。没有参数时会返回整个数组的浅拷贝。

> `splice()`：增删改数组，改变原数组。
>

```javascript
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));   // ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));  // ["camel", "duck"]

console.log(animals.slice(1, 5));    // ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2));  // ["duck", "elephant"]

console.log(animals.slice(2, -1));   // ["camel", "duck"]

console.log(animals.slice());     // ["ant", "bison", "camel", "duck", "elephant"]
```

`concat(value0, value1, /* … ,*/ valueN)`：连接两个或多个数组，返回一个新数组。浅拷贝。

```javascript
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2);

console.log(array3);    // ["a", "b", "c", "d", "e", "f"]
```

`flat(n)`：拉平数组，默认拉平1层，`Infinity` 关键字表示不管多少层都拉平为1层。不修改原数组，返回新数组。

> 递归实现数组扁平化
>
> `flatMap()`：相当于先执行 `map()` 再执行 `flat()`，但只能展开一层。返回一个新数组，不改变原数组。

```js
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]

[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]
```

`fill()`：填充数组。修改原数组，返回修改后的数组。

```js
fill(value) // 不包含起始和结束，则全部填充为 value 值
fill(value, start)  // 填充到数组末尾
fill(value, start, end)  // 包含起始元素，不包含结束元素
```

```javascript
const array1 = [1, 2, 3, 4];
console.log(array1.fill(0, 2, 4));    // [1, 2, 0, 0]

console.log(array1.fill(5, 1));    // [1, 5, 5, 5]

console.log(array1.fill(6));   // [6, 6, 6, 6]
```

`copyWithin()`：将数组中的一部分元素复制到同一数组的另一个位置。修改原数组。

```js
array.copyWithin(target, start, end);
// target：复制到的目标位置（索引）
// start：起始位置（索引，默认为 0）
// end：结束位置（索引，默认为数组长度），包含起始，不包含结束
```

```js
const arr = [1, 2, 3, 4, 5];
// 将索引 0 到 2 的元素复制到索引 3 的位置
arr.copyWithin(3, 0, 2);
console.log(arr); // [1, 2, 3, 1, 2]
```

#### 遍历

1. `entries()`：返回一个新的数组迭代器对象，该对象包含数组中每个索引的键/值对。

2. `keys()`

3. `values()`
4. `for` 循环、`for ...of` 循环

```js
const arr = ['apple', 'banana', 'peach'];

for (const [index, element] of arr.entries()) {
  console.log(index, element);
}

// 0 'apple'
// 1 'banana'
// 2 'peach'

for (const key of arr.keys()) {
  console.log(key);
}

for (const value of arr.values()) {
  console.log(value);
}

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i])
}

for (let i of arr) {
  console.log(arr[i])
}
```

1. `forEach()`：遍历数组，不修改原数组，也不返回新数组。
2. `map()`：返回一个**新数组**，其中每个元素是原数组元素通过指定函数处理后的结果。
3. `filter()`：根据提供的条件，筛选出符合条件的元素，返回一个新的数组。

```javascript
let fruits = ['apple', 'banana', 'cherry', 'avocado'];

fruits.forEach((item, index) => {
  console.log(`${index + 1}: ${fruit}`);
});

// 1: apple
// 2: banana
// 3: cherry
// 4: avocado

let upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log(upperFruits);  // ['APPLE', 'BANANA', 'CHERRY', 'AVOCADO']

let fruitsWithA = fruits.filter(fruit => fruit.startsWith('a'));
console.log(fruitsWithA);  // ['apple', 'avocado']
```

`reduce()`：用于将数组中的所有元素**累计**为一个值，通常用于对数组求和、拼接或进行更复杂的累积运算。

如果空数组调用 `reduce`，没有提供初始值，会报错，提供初始值，如 `0`，能正确返回结果。

```js
array.reduce(callback(accumulator, currentValue, currentIndex, array), initialValue)
// callback：每个元素执行的函数，包含四个参数
// accumulator：累积的结果，会在每次调用 callback 时更新并传递给下一次调用
// currentValue：当前遍历到的元素
// currentIndex：当前元素的索引（可选）
// array：被遍历的数组本身（可选）
// initialValue：累积的初始值。如果未提供 initialValue，reduce 会把数组的第一个元素当作初始值，跳过它直接从第二个元素开始累积。
```

```javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum); // 输出: 10
```

#### 排序/反转

1. `sort()`：按字典顺序（即字符串的顺序）对数组元素进行排序的。它会将数组中的元素转换为字符串，然后按字典顺序比较这些字符串。修改原数组。
   1. `sort((a,b) => a-b)`：升序
   2. `sort((a,b) => b-a)`：降序
2. `reverse()`：反转数组中元素的顺序，修改原数组

> `toSorted() `：不改变原数组
>
> `toReverse() `：不改变原数组
>

```javascript
const arr = ref([1,2,3,4,5,6,7,8,9,10])
// 升序排序
const arrSort1 = arr.value.sort((a,b) => a-b)
console.log(arrSort1)
// 降序排序
const arrSort2 = arr.value.sort((a,b) => b-a)
console.log(arrSort2)
// 反转数组
const arrReverse = arr.value.reverse()
console.log(arrReverse)
```

#### 转换

1. `join()`：将一个数组的所有元素连接成一个字符串并返回这个字符串。默认用 `,` 分隔，`''` 没有分隔。不修改原数组。
2. `toString()`：将数组转换为字符串。
3. `toLocaleString()`：返回一个字符串，表示数组中的所有元素。每个元素通过调用它们自己的 `toLocaleString` 方法转换为字符串，并且使用特定于语言环境的字符串（例如逗号 `,`）分隔开。

```js
const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join());  // "Fire,Air,Water"
console.log(elements.join(''));  // "FireAirWater"
console.log(elements.join('-'));  // "Fire-Air-Water"
```

```js
const array1 = [1, 2, "a", "1a"];

console.log(array1.toString());  // "1,2,a,1a"

const array1 = [1, "a", new Date("21 Dec 1997 14:12:00 UTC")];
const localeString = array1.toLocaleString("en", { timeZone: "UTC" });

console.log(localeString);  // "1,a,12/21/1997, 2:12:00 PM",
```

## 六、对象⭐

对象用于存储键值对（*key-value pairs*）。

> 对象的底层数据结构主要基于哈希表（*Hash Table*），**哈希表**是一种利用哈希函数将键映射到特定的存储位置的数据结构。**哈希函数**将对象的键转化为一个整数索引，这个索引决定了键在哈希表的位置。
>
> 属性存储顺序：
>
> - 数字键：按升序排序
> - 字符串键和 `Symbol` 键：按创建时间排序
>

### 1) 创建对象

1. 字面量创建
2. 构造函数创建、类创建
3. `Object` 构造函数：通常不用于创建对象，更多是用于处理对象的属性
4. 工厂函数（*Factory Function*）：提供了与构造函数类似的功能，但不需要使用 `new` 关键字
5. `Object.create(proto, propertiesObj)`：以一个现有对象作为原型，创建一个新对象

```js
// 1.字面量
let obj = {
    name: "Alice",
    age: 25
};
```

```js
// 2.构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    console.log('Hello!');
  };
}

const john = new Person('John', 30);

// 2.类
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log('Hello!');
    }
}

const john = new Person('John', 30);
```

```js
// 3.Object()
const person = new Object();
person.name = 'John';
person.age = 30;
person.greet = function() {
    console.log('Hello!');
};
```

```js
// 4.工厂函数
function createPerson(name, age) {
    return {
        name: name,
        age: age,
        greet() {
            console.log('Hello!');
        }
    };
}

const john = createPerson('John', 30);
```

```js
// 5.Object.create(proto)
let proto = { greet: function() { console.log("Hello"); } };
let obj = Object.create(proto);
obj.greet(); // "Hello"
```

### 2) 对象属性

#### （1）属性定义

普通属性

```js
let obj = {
    name: "Alice",
    age: 25
};
```

计算属性名

```js
let key = "name";
let obj = {
    [key]: "Alice" // 属性名由变量决定
};
```

当属性名和变量名相同时，可以简写。

```js
let name = "Alice";
let obj = { name }; // 等同于 { name: name }
```

#### （2）访问/删除属性

1. 点语法
2. 方括号语法
3. `in` 操作符：`prop in obj`
4. `delete` 操作符：`delete obj.prop`

```js
console.log(obj.name); // "Alice"
console.log(obj["name"]); // "Alice"
console.log(name in obj); // "Alice"
delete obj.name;
```

#### （3）遍历属性

1. `for...in` 循环
2. `Object.entries()`、`Object.keys()`、`Object.values()`：返回键值对数组、返回键名数组、返回键值数组
3. `Object.fromEntries()`：将键值对列表转换为一个对象

```js
for (let key in obj) {
    console.log(key, obj[key]);
}
```

```js
let obj = {
  name: 'John',
  age: 30,
  city: 'New York'
}
console.log(Object.entries(obj))
// [ [ 'name', 'John' ], [ 'age', 30 ], [ 'city', 'New York' ] ]
```

```javascript
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42],
]);
const obj = Object.fromEntries(entries);
console.log(obj);  // { foo: "bar", baz: 42 }
```

### 3) 对象方法

#### （1）方法定义

1. 普通方法
2. 简写方法，定义方法时可以省略 `function` 关键字。`this` 指向当前对象。

```js
let obj = {
  	// 普通
    greet: function() {
        console.log("Hello");
    },
  	// 简写
  	greet() {
        console.log("Hello");
    }
};
obj.greet(); // "Hello"
```

#### （2）静态方法

`Object.assign()`：将一个或者多个源对象中所有可枚举的自有属性复制到目标对象，并返回修改后的目标对象。浅拷贝。

```js
Object.assign(target, ...sources)
// target：目标对象，修改后将作为返回值
// sources：源对象
```

```js
let target = { a: 1 };
let source = { b: 2 };
Object.assign(target, source);
console.log(target); // { a: 1, b: 2 }
```

`Object.is(value1, value2)`：判断两个值是否严格相等

> 递归判断对象是否相等

```js
console.log(Object.is(null, null)) // true
console.log(Object.is(undefined, undefined))  // true
console.log(Object.is(NaN, NaN)) // true
console.log(Object.is(+0, -0))  // false
console.log(Object.is('1', 1))  // false
```

**对象属性**

1. `Object.getOwnPropertyNames(obj)`：返回一个数组，其包含给定对象中所有自有属性（包括不可枚举属性，但不包括使用 `symbol` 值作为名称的属性）
2. `Object.getOwnPropertySymbols()`：返回所有 `Symbol` 属性名的数组
3. `Object.hasOwn()`：判断对象自有属性，如果属性是继承的或者不存在，则返回 `false`，可替代 `Object.prototype.hasOwnProperty()`

**定义对象属性**

1. `Object.defineProperty(obj, prop)`：定义对象属性，可以修改现有属性或新增属性
   1. `value`、`writable`、`enumerable`、`configurable`
   2. 可枚举性（*enumerable*）：用来控制所描述的属性，是否将被包括在 `for...in` 循环之中（除非属性名是一个`Symbol`）。`for..in` 循环、`Object.keys`、`JSON.stringify`。
2. `Object.defineProperties(obj, pop1, prop2, ...)`：定义多个属性
3. `Object.getOwnPropertyDescriptor(obj, prop)`：返回对象该属性的所有描述符，返回的是对象。
4. `Object.getOwnPropertyDescriptors(obj)`：返回所有属性的描述符。

```js
const object1 = {};

Object.defineProperty(object1, "property1", {
  value: 42,
  writable: false,
});

object1.property1 = 77;  // 报错
console.log(object1.property1);  // 42

const object1 = {
  property1: 42,
  name: "John",
};
const descriptor1 = Object.getOwnPropertyDescriptor(object1, "property1");
console.log(descriptor1);
// { value: 42, writable: true, enumerable: true, configurable: true }
const descriptor2 = Object.getOwnPropertyDescriptors(object1);
console.log(descriptor2);
// {
//   property1: { value: 42, writable: true, enumerable: true, configurable: true },
//   name: {
//     value: 'John',
//       writable: true,
//         enumerable: true,
//           configurable: true
//   }
// }
```

**对象原型**

1. `Object.getPrototypeOf()`：返回对象原型
2. `Object.setPrototypeOf()`：指定对象原型

**对象是否可扩展**

1. `Object.freeze()`：只会对对象的直接属性进行冻结（浅冻结），而不会递归冻结嵌套的对象或数组。不能对属性进行添加，修改，删除。
   1. 不能添加新属性，使对象不可扩展
   2. 不能删除或修改属性描述符，使对象的现有属性不可配置
   3. 不能修改值，仅限于直接属性，使对象的现有属性值不可写
   4. **不影响嵌套对象**：如果对象的某个属性值是对象或数组，`Object.freeze` 不会冻结这些嵌套对象的内部属性
2. `Object.isFrozen()`
3. `Object.seal()`：密封对象，使其不能添加或删除属性，但可以修改现有属性。
4. `Object.isSealed()`
5. `Object.preventExtensions()`：**防止新属性被添加到对象中**（即防止该对象被扩展）。它还可以防止对象的原型被重新指定。
6. `Object.isExtensible()`

```js
// 冻结对象
let obj = { name: "Alice" };
Object.freeze(obj);
obj.name = "Bob"; // 无效
console.log(obj.name); // "Alice"
```

```js
// 密封对象
let obj = { name: "Alice" };
Object.seal(obj);
obj.name = "Bob"; // 有效
obj.age = 25; // 无效
console.log(obj); // { name: "Bob" }
```

```javascript
// 防止扩展
const object1 = {};
Object.preventExtensions(object1);
try {
  Object.defineProperty(object1, 'property1', {
    value: 42,
  });
} catch (e) {
  console.log(e);  //报错，对象不可扩展，不能新增属性
}
```

#### （3）实例方法

1. `hasOwnProperty()`：表示对象自有属性（而不是继承来的属性）中是否具有指定的属性，返回布尔值

2. `isPrototypeOf()`：用于检查一个对象是否存在于另一个对象的原型链中

3. `toLocaleString()`：返回一个表示对象的字符串

4. `toString()`：返回一个表示该对象的字符串

5. `valueOf()`：返回对象的原始值


```js
const numObj = new Number(42);
console.log(numObj.valueOf()); // 42（返回原始值）

const dateObj = new Date();
console.log(dateObj.valueOf()); // 1698230400000（返回时间戳）

const obj = { name: "Alice" };
console.log(obj.valueOf()); // { name: "Alice" }（默认返回对象本身）
```

#### （4）实例属性

`constructor`：指向创建该实例的构造函数，甚至可以用它创建新的实例。

```js
const obj = {};
console.log(obj.constructor); // ƒ Object() { [native code] }（指向 Object 构造函数）

const arr = [];
console.log(arr.constructor); // ƒ Array() { [native code] }（指向 Array 构造函数）

function Person(name) {
  this.name = name;
}
const person = new Person("Alice");
console.log(person.constructor); // ƒ Person(name) { this.name = name; }（指向 Person 构造函数）

// 使用 constructor 创建新实例
const person2 = new person.constructor("Bob");
console.log(person2.name); // "Bob"
```

## 七、函数⭐

### 1) 函数定义

函数：用于封装可重复使用的代码块。

（1）函数声明：`function`

1. 存在提升，可以在声明之前调用该函数
2. `function` 声明需要函数名
3. 传统声明方式，不支持箭头函数
4. `this` 指向函数调用的对象
5. 会绑定到当前的作用域，并且在全局作用域下，它会绑定到 `window` 对象（非严格模式）

```js
function greet(name) {
    console.log(`Hello, ${name}`);
}
```

（2）函数表达式

1. 不存在提升
2. 支持传统函数写法，也支持箭头函数
3. `const`、`let` 绑定在块级作用域中，而不是全局作用域
4. **函数表达式可以是一个匿名函数或具名函数赋值给变量**
   - 具名函数赋值给变量
     - 该函数名称仅在函数内部可用，用于递归调用或调试
     - 函数名称不会被提升，但函数表达式本身的提升规则与普通函数表达式相同

```js
const greet = function(name) {
    console.log(`Hello, ${name}`);
};
const greet = (name) => {
  	console.log(`Hello, ${name}`);
}
// 具名函数赋值给变量
const myFunction = function namedFunction() {
    console.log('Named Function Expression');
};
```

（3）`new Function()`：只能访问全局作用域的变量，而不能访问局部作用域的变量。

```js
new Function ([arg1, arg2, ..., argN], functionBody)
// arg1, arg2, ..., argN：函数的参数列表
// functionBody：函数体，是一个包含函数代码的字符串
```

```js
const add = new Function('a', 'b', 'return a + b;');
console.log(add(1, 2));  // 输出: 3
```

`eval()`：将字符串作为 JS 代码执行。在 `eval()` 中声明的变量在作用域外部也能访问，反之也能访问外部作用域声明的变量。

```js
eval("console.log('Hello, world!');");  // 输出: Hello, world!
// 变量访问
let x = 10;
eval("console.log(x);");  // 输出: 10
eval("let y = 20; console.log(y);");  // 输出: 20，y 在外部作用域也能访问
```

`toString()` 方法返回函数代码本身，包含注释。

### 2) 函数调用

(1) 直接调用

```js
greet("Alice"); // "Hello, Alice"
```

(2) 作为方法调用

```js
let obj = {
    name: "Alice",
    greet: function() {
        console.log(`Hello, ${this.name}`);
    }
};
obj.greet(); // "Hello, Alice"
```

(3) 作为构造函数调用

```js
function Person(name) {
    this.name = name;
}
let person = new Person("Alice");
console.log(person.name); // "Alice"
```

**(4) 通过 `apply`、`bind`、`call` 调用**

1. `call()`：立即调用函数，并指定 `this` 和参数。
2. `apply()`：立即调用函数，并指定 `this` 和参数数组。
3. `bind()`：返回一个新函数，并绑定 `this` 和部分参数。

```js
greet.call(null, "Alice"); // "Hello, Alice"
greet.apply(null, ["Alice"]); // "Hello, Alice"
let greetAlice = greet.bind(null, "Alice");
greetAlice(); // "Hello, Alice"
```

### 3) 函数参数

#### （1）默认参数

非尾部的参数设置默认值，无法省略，只有尾部可以。

```js
function greet(name = "Guest") {
    console.log(`Hello, ${name}`);
}
greet(); // "Hello, Guest"
```

默认参数可以和函数参数的解构赋值结合。

```js
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined // 没有提供默认参数，报错

function foo({x, y = 5} = {}) {
  console.log(x, y);
}

foo() // undefined 5 // 默认参数为空对象{}
```

#### （2）剩余参数 `rest`

普通函数可以使用 `arguments` 对象来处理不确定数量的参数。`arguments` 是一个**类数组对象**，包含了传递给函数的所有参数。`arguments` 在箭头函数中不可用。

```js
function normalFunction() {
    console.log(arguments); // 输出: 类数组对象
    for (let i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}

normalFunction(1, 2, 3); // 输出: 1 2 3
```

箭头函数的参数必须使用剩余参数语法（*rest parameters*）来处理不确定数量的参数。

**剩余参数**：`...变量名` 将多余的参数收集到一个数组中，是**真数组**。

剩余参数之后不能再有其他参数（即只能是最后一个参数）。

> 函数的 `length` 属性是函数参数个数，不包括默认参数个数。只统计在默认参数之前的函数参数总个数。

```js
function sum(...numbers) {
    return numbers.reduce((acc, num) => acc + num, 0);
}
console.log(sum(1, 2, 3)); // 6
```

### 4) 作用域

执行上下文、变量对象、作用域、作用域链、闭包。

### 5) 重要函数⭐

#### 基础

(1) 匿名函数（*Anonymous Function*）：可以直接被定义和使用的函数，而不需要通过函数名进行引用。通常用在函数表达式、回调、立即执行函数中。

```js
// 可以用函数表达式或箭头函数定义
var func = function() {
  // ...
};
// 箭头函数也是匿名函数的一种
var func = () => {
  // ...
};
```

(2) 自执行函数（*Immediately Invoked Function Expression*，IIFE）：定义后立刻执行的函数，用来创建独立作用域。解决变量污染的问题、模块化早期方案之一。

```js
(function() {
  console.log('IIFE executed');
})();
```

(3) 纯函数（*Pure Function*）：相同输入必定返回相同输出，无副作用（不依赖或修改外部变量）。

副作用（*side effect*）：是指函数或表达式在执行过程中对外部环境产生的影响，而不仅仅是返回一个值。

```js
// 纯函数示例
function add(a, b) {
  return a + b;
}
// 非纯函数示例（有副作用）
let total = 0;
function addToTotal(num) {
  total += num;
}
```

(4) 函数式编程（FP）：一种编程范式，强调使用纯函数、避免副作用和状态变化。核心思想是函数是一等公民，即函数可以作为参数传递、返回值，或者赋值给变量。

(5) 高阶函数（*Higher-Order Function*）：接收函数作为参数，或返回一个函数。

**高阶函数的常见用法**

1. 数组方法：如 `map`、`filter`、`reduce` 等。这些方法接受一个函数作为参数，并对数组中的每个元素执行该函数，从而返回一个新的数组或单一结果。
3. 函数柯里化
3. 闭包
4. 函数组合：将多个函数组合在一起形成一个新的函数。

#### 函数柯里化

函数柯里化（*Currying*）：把接受多个参数的函数转换为**一系列接收一个参数的函数**。

```js
function curry(fn) {
    let curried = (...args) => {
        if (args.length == fn.length) return fn(...args)
        return (...arg) => curried(...args, ...arg)
    }
    return curried
}
```

```js
function add(a, b, c) {
    return a + b + c
}
add(1, 2, 3)
let addCurry = curry(add)
addCurry(1)(2)(3)
```

#### 递归函数

递归函数（*Recursive Function*）：函数直接或间接调用自身。

- 终止条件（*base case*）：用于停止递归，防止无限调用
- 递归条件（*recursive case*）：不断向终止条件靠近
- 尾递归（*Tail Recursion*）
- 实现深拷贝、扁平化数组、将扁平结构转成树形结构、计算树形结构的所有子节点数量、斐波那契数列（Fibonacci）

```js
// deepClone
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  const result = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }

  return result;
}
```

#### 回调函数

回调函数（*Callback Function*）：作为参数传入另一个函数，在特定时机被调用。

- 异步编程（定时器、事件监听、HTTP请求、AJAX）
- 回调地狱（*callback hell*）问题
- `Promise / async / await`

```js
function fetchData(callback) {
  setTimeout(() => {
    callback('data');
  }, 1000);
}
```

回调和递归的区别：递归是自己调用自己，回调是被其他函数调用。

#### 箭头函数

（1）简写

1. 如果只有1个参数，可以省略 `()`，如果函数体只有一行代码，可以省略 `{}` 和 `return`

2. 如果返回对象，必须 `()` 包裹起来


```js
const sayHi = (name, age) => {
  console.log(`Hi, my name is ${name}, my age is ${age}.`)
}
let greet = name => console.log(`Hello, ${name}`);
let getTempItem = id => ({ id: id, name: "Temp" });
```

（2）注意点

1. `this` 指向：箭头函数没有自己的 `this`，`this` 指向箭头函数所在的上下文。
   1. 普通函数的 `this` 指向调用该函数的对象。
   2. 箭头函数内部的 `this` 指向是固定的，普通函数的 `this` 指向是可变的。
2. 在箭头函数中，不存在 `arguments` 对象，它继承了所在上下文的 `arguments`。**可以使用剩余参数。**

3. 不可以当作构造函数，不可以对箭头函数使用 `new` 命令。
   1. 构造函数是通过 `new` 关键字来生成对象实例，**生成对象实例的过程也是通过构造函数给实例绑定 `this` 的过程**，而箭头函数没有自己的 `this`。
   2. 创建对象过程，`new` 首先会创建一个空对象，并将这个空对象的 `__proto__` 指向构造函数的 `prototype`，从而继承原型上的方法，但是箭头函数没有 `prototype`。因此不能使用箭头作为构造函数，也就不能通过 `new` 操作符来调用箭头函数。
4. 箭头函数不能用作 `Generator` 函数，不可以使用 `yield` 命令。

5. 适用于回调函数。
