# 手写题

## 数组

### 数组去重

```js
// 数组去重
const unique = (arr) => {
  return [...new Set(arr)]
}
```

```js
const unique = (arr) => {
  // 避免修改原数组 arr
  const sortArr = [...arr].sort((a, b) => a-b)
  if (sortArr.length === 0) return []
  const res = []
  res.push(sortArr[0])
  for (let i =1; i < sortArr.length; i++) {
    if (sortArr[i] !== sortArr[i-1]) {
      res.push(sortArr[i])
    }
  }
  return res
}
```

### 数组扁平化

```js
// 数组扁平化
[1,[2,[3,[4]]]].flat(Infinity)
```

```js
const myFlat = (arr) => {
  const res = []
  for (let i of arr) {
    if (Array.isArray(i)) {
      res.push(...myFlat(i))  // 递归
    } else {
      res.push(i)
    }
  }
  return res
}
```

```js
// 手写实现 flat 函数
const myFlat = (arr, depth = 1) => {
  const res = []
  for (let i of arr) {
    if (Array.isArray(i) && depth > 0) {
      res.push(...myFlat(i, depth - 1))
    } else {
      res.push(i)
    }
  }
  return res
}
```

### 实现数组原型方法

（1）`call`：用于**立即调用函数**并**指定函数执行时的 `this` 上下文**。

```js
function.call(thisArg, arg1, arg2, ...)
// thisArg：指定函数内部的 this 值
// arg1, arg2, ...：传递给函数的参数
// 立即执行：call 会立即调用函数，并返回结果
```

（2）数组中的回调函数 `callback`

```js
callback(element, index, array)
// element：当前元素 array[i]
// index：当前索引 i
// array：原数组 array
```

（3）数组方法允许用户通过第二个参数 `thisArg` 指定回调函数的 `this` 上下文

```js
const obj = { value: 10 };
[1, 2, 3].forEach(function (item) {
  console.log(item + this.value);
}, obj); // thisArg = obj
```

**（4）`callback.call(thisArg, array[i], i, array)`**

1. `callback`：回调函数
2. `thisArg`：用户指定的 `this` 上下文（数组方法的第二个参数），如果未提供，通常是 `undefined`（严格模式）
3. `array[i]`：当前遍历的数组元素，作为回调的第一个参数
4. `i`：当前索引，作为回调的第二个参数
5. `array`：原数组，作为回调的第三个参数

#### `forEach`

1.  `null == undefined` 是 `true`
2. `Object(this)`：强制转换成对象，能安全访问属性，如 `length`
3. `len = O.length >>> 0` 类似于 `len = Math.floor(Number(O.length))`，将 `len`  类型转换为`>= 0` 的正整数，`forEach` 应该只处理有限次的迭代，不能被奇怪的值（如负数、字符串）干扰。
4. `i in O` 兼容稀疏数组，某些位置没有定义，是空位，在 `forEach` 的语义里，它不会跳过“空值”，但会跳过“没有定义的索引”（稀疏位置）。

```js
const arr = [1, , 3];  // arr[1] 是一个“空位”
// 1 in arr 是 false，因为该索引没有实际定义过forEach会跳过
arr.forEach((val, idx) => {
    console.log(idx, val); // 输出：0 1 和 2 3，没有输出 1 undefined
})
```

```js
// thisArg 执行 callbackFn 时用作 this 的值。
Array.prototype.myForEach = (callback, thisArg) => {
  if (typeof callback !== 'function') { throw new TypeError('callback is not a function') }
  if (this == null) { throw new TypeError('this is null or undefined') }
  const O = Object(this) // 强制转换成对象，能安全访问属性，如length
  const len = O.length >>> 0  // 类型转换，把 .length 强制转为一个非负整数
  let i = 0
  while (i < len) {
    // 只调用 callback 于那些确实存在的索引上，跳过稀疏空位
    if (i in O) { callback.call(thisArg, O[i], i, O) }
    i++
  }  
}
```

#### `map`

```js
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== 'function') { throw new TypeError('callback is not a function') }
  if (this == null) { throw new TypeError('this is null or undefined') }
  const O = Object(this)
  const len = O.length >>> 0
  let i = 0
  const res = []
  while (i < len) {
    if (i in O) { res[i] = callback.call(thisArg, O[i], i, O) }
    i++
  }
  return res
};
```

#### `filter`

```js
Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== 'function') { throw new TypeError('callback is not a function') }
  if (this == null) { throw new TypeError('this is null or undefined') }
  const O = Object(this)
  const len = O.length >>> 0
  let i = 0
  const res = []
  while (i < len) {
    if (i in O) {
      if (callback.call(thisArg, O[i], i, O)) { res.push(O[i]) }
    }
    i++
  }
  return res
};
```

#### `some`

```js
Array.prototype.mySome = (callback, thisArg) => {
  if (typeof callback !== 'function') { throw new TypeError('callback is not a function') }
  if (this == null) { throw new TypeError('this is null or undefined') }
  const O = Object(this)
  const len = O.length >>> 0
  let i = 0
  while (i < len) {
    if (i in O) {
      if (callback.call(thisArg, O[i], i, O)) { return true }
    }
    i++
  }
  return false
}
```

#### `every`

```js
Array.prototype.myEvery = function(callback, thisArg) {
  if (typeof callback !== 'function') { throw new TypeError(callback + ' is not a function') }
  if (this == null) { throw new TypeError('this is null or undefined') }

  const O = Object(this)
  const len = O.length >>> 0
  let i = 0

  while (i < len) {
    if (i in O) {
      if (!callback.call(thisArg, O[i], i, O)) {
        return false  // 只要有一个不满足就返回 false
      }
    }
    i++
  }
  return true  // 所有都满足才返回 true
}
```

#### `reduce`

```js
Array.prototype.reduce2 = function(callback, initialValue) {
    if (typeof callback !== "function") { throw new TypeError(callback + ' is not a function') }
    if (this == null) { throw new TypeError('this is null or not defined') }

    const O = Object(this)
    const len = O.length >>> 0
    let k = 0, acc
    
    if (arguments.length > 1) {
        acc = initialValue
    } else {
        // 没传入初始值的时候，取数组中第一个非 empty 的值为初始值
        while (k < len && !(k in O)) { k++ }
        if (k > len) { throw new TypeError( 'Reduce of empty array with no initial value' ) }
        acc = O[k++]
    }
    while (k < len) {
        if (k in O) {
            acc = callback(acc, O[k], k, O)
        }
        k++
    }
    return acc
}
```

## 对象

1. `Reflect.ownKeys(target)`：`Object.getOwnPropertyNames() + Object.getOwnPropertySymbols()`+不可枚举属性
2. `Reflect.has(target, propertyKey)`：包括自由属性和原型链上的属性，等于 `propertyKey in target`
3. `Reflect.defineProperty(target, propertyKey, attributes)`：需要每个属性递归处理
4. `Object.hasOwn()`：对象自有属性，如果是继承的属性或不存在的属性，返回 `false`，替代 `Object.prototype.hasOwnProperty()`

### 对象继承

1. 原型继承：`Child.prototype = new Parent()`
2. 构造函数继承：`Parent.call() / apply()`
3. 组合继承：`Child.prototype = new Parent()`，`Parent.call() / apply()`
4. 寄生组合继承：`Parent.call(this)`，`Child.prototype = Object.create(Parent.prototype)`，`Child.prototype.constructor = Child`
5. `class` 继承：`class Child extends Parent { constructor() { super() }}`

### 深浅拷贝

#### 浅拷贝

1. 如果属性值是**原始类型**，则拷贝其值；
2. 如果属性值是**引用类型**（如嵌套的对象或数组），则拷贝其**内存地址（引用）**。
3. 新旧对象（或数组）的**嵌套对象/数组**实际上指向的是**同一块内存区域**。修改其中一个副本中的嵌套对象/数组会**影响**到另一个副本。

浅拷贝实现方式

1. 赋值 `=`
2. `Object.assign({}, obj)`
3. 展开运算符 `...`、数组的 `slice()`、`concat()`、`Array.from()`

```js
const shallowCopy = (obj) => {
  if (typeof obj !== 'object' || obj === null) { return obj }
  const res = Array.isArray(obj)? [] : {}
  for (let key of Reflect.ownKeys(obj)) {
    res[key] = obj[key]
  }
  return res
}
```

#### 深拷贝

深拷贝就是对目标的完全拷贝，不像浅拷贝那样只是复制了一层引用，就连值也都复制了。

新旧对象（或数组）及其所有嵌套结构都是**完全独立**的，互不影响。修改任何一个副本都不会影响另一个。

深拷贝实现方法

1. 利用 `JSON` 对象中的 `parse` 和 `stringify`，只适用于简单属性，**`undefined`、`function`、`symbol` 会在转换过程中被忽略。**
2. 利用递归来实现每一层都重新创建对象并赋值。
3. 使用第三方库：`Lodash` 的 `_.cloneDeep()` 方法。

```js
// Reflect.ownKeys(obj) 只会返回Symbol或字符串key，而不会返回null
const deepCopy = function(obj) {
  if (typeof obj !== 'object' || obj === null) { return obj }
  const res = Array.isArray(obj) ? [] : {}
  for (let k of Reflect.ownKeys(obj)) {
    res[k] = (typeof obj[k] === 'object' && obj[k] !== null) ? deepCopy(obj[k]) : obj[k] 
  }
  return res
}
```

### 深度冻结对象

`Object.freeze`：只会对对象的直接属性进行冻结（浅冻结），而不会递归冻结嵌套的对象或数组。

1. 不能添加新属性，使对象不可扩展
2. 不能删除或修改属性描述符，使对象的现有属性不可配置
3. 不能修改值，仅限于直接属性，使对象的现有属性值不可写
4. **不影响嵌套对象**：如果对象的某个属性值是对象或数组，`Object.freeze` 不会冻结这些嵌套对象的内部属性

```js
const deepFreeze = obj => {
  if (typeof obj !== 'object' || obj === null) return obj
  for (let k of Reflect.ownKeys(obj)) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      deepFreeze(obj[k])
    }
  }
  return Object.freeze(obj)
}
```

### 对象是否相等

（1）使用递归

1. `Reflect.ownKeys()`：返回对象的所有自有键（包括字符串和 `Symbol`、包括不可枚举的属性）
2. `!Object.prototype.hasOwnProperty()`：对象直接拥有属性，不包括原型链上的属性
3. `Object.hasOwn()`：对象自有属性，如果是继承的属性或不存在的属性，返回 `false`，替代 `Object.prototype.hasOwnProperty()`
3. `Reflect.has(target, propertyKey)`：对象是否有该属性，包括自身属性和原型链上的属性，等价于 `key in obj`。

（2）`JSON.stringify()`：无法处理 `undefined、function、symbol` 等特殊值，且顺序不同的对象属性会导致不同的字符串。

（3）使用第三方库：`Lodash` 的 `_.isEqual()` 方法、`Fast-deep-equal`库 。

```js
const deepCompare = (obj1, obj2) => {
  // 1. 检查引用是否相同
  if (obj1 === obj2) { return true }
	// 2. 检查是否为对象或 null，非对象类型直接比较
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2;
  }
  // 3. 获取属性键并检查数量
  const k1 = Reflect.ownKeys(obj1)
  const k2 = Reflect.ownKeys(obj2)
  if (k1.length !== k2.length) { return false }
  // 4. 比较所有属性值
  for (let key of k1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) { return false }
    if (!deepCompare(obj1[key], obj2[key])) { return false }
  }
  return true
}
```

### 对象静态方法

#### `Object.create`

（1）原生 `Object.create` 用法

`Object.create(proto, [propertiesObject])`：创建一个新对象，并指定其原型对象和可选的属性描述符。

1. `proto`：新对象的原型，可以是对象或 `null`。如果是其他类型（如数字、字符串），抛出 `TypeError`。
2. `propertiesObject`（可选）：一个对象，包含属性描述符，用于定义新对象的属性（类似于 `Object.defineProperties` 的参数）。

```js
const proto = { greeting: 'Hello' };
const obj = Object.create(proto, {
  name: {
    value: 'Alice',
    writable: true,
    enumerable: true,
    configurable: true,
  },
});
console.log(obj.name); // Alice
console.log(obj.greeting); // Hello
console.log(Object.getOwnPropertyDescriptor(obj, 'name')); // { value: 'Alice', writable: true, enumerable: true, configurable: true }
```

（2）实现思路

1. `Reflect.defineProperty(target, propertyKey, attributes)`：需要每个属性递归处理

```js
function objectCreate(proto, propertiesObject) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null');
  }
  const obj = {};
  Reflect.setPrototypeOf(obj, proto);
  // Object.setPrototypeOf(obj, proto);
  // 代替 obj.__proto__ = proto
  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }
  return obj;
}
```

#### `Object.assign`

**（1）原生 `Object.assign` 用法**

`Object.assign(target, ...sources)`：用于将一个或多个源对象的**可枚举自身属性**复制到目标对象。用于对象合并或浅拷贝。

1. `target`：目标对象，属性将被复制到此对象。会被修改并返回。
2. `...sources`：一个或多个源对象，其可枚举自身属性（包括 `Symbol` 属性）会被复制到 `target`。
3. 如果 `target` 是 `null` 或 `undefined`，抛出 `TypeError`；如果 `source` 是 `null` 或 `undefined`，通常跳过该源对象。

```js
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
const result = Object.assign(target, source1, source2);
console.log(result); // { a: 1, b: 2, c: 3 }
console.log(target); // { a: 1, b: 2, c: 3 } （target 被修改）
```

**（2）实现思路**

`Reflect.ownKeys(sObj)`：所有自有属性（包括不可枚举的）和所有 `symbol` 属性，而 `Object.assign()` 只拷贝**可枚举**的属性（`enumerable: true` 的属性）

```js
function objectAssign(target, ...sources) {
  if (target == null) { throw new TypeError('Cannot convert undefined or null to object'); }
  const result = Object(target);
  for (let source of sources) {
    if (source == null) { continue; }
    const sourceObj = Object(source);
    // // 复制普通属性
    // for (const key of Object.getOwnPropertyNames(sourceObj)) {
    //   result[key] = sourceObj[key];
    // }
    // // 复制 Symbol 属性
    // for (const symbol of Object.getOwnPropertySymbols(sourceObj)) {
    //   result[symbol] = sourceObj[symbol];
    // }
    for (let key of Reflect.ownKeys(sourceObj)) {
      const descriptor = Object.getOwnPropertyDescriptor(sourceObj, key);
      if (descriptor.enumerable) {
        result[key] = sourceObj[key];
      }
    }
  }
  return result;
}
```

### `new` 关键字

**（1）`new` 关键字**

1. 建一个新对象
2. 将新对象的原型设置为构造函数的 `prototype`
3. 执行构造函数，绑定 `this` 到新对象
4. 返回新对象或构造函数显式返回的对象

```js
function Person(name) {
  this.name = name;
}
const person = new Person('Alice');
console.log(person.name); // Alice
```

**（2）实现思路**

1. 创建新对象：使用 `{}` 或 `Object.create()` 创建一个空对象，作为实例；
2. 设置原型：将新对象的 `__proto__` 或通过 `Object.setPrototypeOf` 设置为构造函数的 `prototype`，确保实例能访问原型链上的属性和方法；
3. 执行构造函数：使用 `apply` 或 `call` 调用构造函数，绑定 `this` 到新对象，传入参数；
4. 处理返回值：如果构造函数返回一个对象，返回该对象；否则，返回新创建的对象。

```js
function myNew(constructor, ...args) {
  if (typeof constructor !== 'function') { throw new TypeError('Constructor must be a function'); }
  // 创建新对象，设置原型
  // obj.__proto__ = constructor.prototype
  // Reflect.setPrototypeOf(obj, constructor.prototype)
  const obj = Object.create(constructor.prototype);
  // 执行构造函数，绑定 this
  const result = constructor.call(obj, ...args);
  // 返回对象：构造函数返回对象优先，否则返回新对象
  return (typeof result === 'object' && result !== null) ? result : obj;
}
```

## 函数

### 函数柯里化

将使用多个参数的函数转换成一系列使用一个参数的函数的技术。

```js
function curry(fn) {
    let curried = (...args) => {
      	// 如果参数足够，执行原始函数
      	// args.length >= fn.length
        if (args.length == fn.length) { return fn(...args) }
      	// 否则返回新函数，继续收集参数
        return (...nextArgs) => curried(...args, ...nextArgs)
    }
    return curried
}
```

### 函数原型方法

#### `call`

（1）`thisArg = thisArg ?? globalThis;`：处理 `thisArg` 为 `null` 或 `undefined`，将其设置为全局对象。

1. `thisArg` 是 `myCall` 的第一个参数，**指定函数执行时的 `this` 上下文**
2. 原生 `call` 的行为：如果 `thisArg` 是 `null` 或 `undefined`，函数的 `this` 默认绑定到全局对象（浏览器中是 `window`，Node 中是 `global`）
3. `??` 是空值合并运算符，如果 `thisArg` 是 `null` 或 `undefined`，将其赋值为 `globalThis`
4. `globalThis`：统一表示全局对象，兼容浏览器 `window` 和 Node 环境 `global`

（2）`thisArg[key] = this;`：将调用 `myCall` 的函数（`this`）临时绑定到 `thisArg` 作为属性。

1. 通过将函数挂载到 `thisArg` 上，间接实现 `this` 绑定，而无需直接修改函数的上下文。这是模拟 `call` 绑定 `this` 的关键步骤。
2. 我们将 `this` 赋值给 `thisArg[key]`，使函数成为 `thisArg` 的一个方法
3. 这样，调用 `thisArg[key]()` 时，函数的 `this` 上下文会自动绑定到 `thisArg`（函数作为对象方法调用 `this` 指向对象：`obj.method()` 中 `this` 指向 `obj`）

```js
Function.prototype.myCall = function (thisArg, ...args) {
  if (typeof this !== 'function') { throw new TypeError('Caller must be a function'); }
  // 处理 thisArg 为 null/undefined，绑定全局对象
  // ?? 是空值合并运算符，如果 thisArg 是 null 或 undefined，将其赋值为 globalThis
  thisArg = thisArg ?? globalThis;
  // 处理基本类型，包装为对象
  thisArg = Object(thisArg);
  // 使用 Symbol 避免属性冲突
  const key = Symbol('fn');
  thisArg[key] = this;  // 将调用 myCall 的函数绑定到对象属性中，成为对象方法
  const result = thisArg[key](...args);  // 执行函数，传递参数，并保存返回值
  Reflect.deleteProperty(thisArg, key);  // delete thisArg[key]
  return result;
};
```

#### `apply`

```js
Function.prototype.myApply = function (thisArg, argsArray) {
  if (typeof this !== 'function') {
    throw new TypeError('Caller must be a function');
  }
  // 处理 thisArg 为 null/undefined
  thisArg = thisArg ?? globalThis;
  // 处理基本类型
  thisArg = Object(thisArg);
  // 检查 argsArray 是否为数组
  argsArray = argsArray ?? [];
  if (!Array.isArray(argsArray)) {
    throw new TypeError('Arguments must be an array');
  }
  const key = Symbol('fn');
  thisArg[key] = this;
  const result = thisArg[key](...argsArray);
  Reflect.deleteProperty(thisArg, key);
  return result;
};
```

#### `bind`

`bind`：返回一个新函数，绑定 `thisArg` 为函数的 `this`，支持柯里化参数（先传一部分，后面可以再传）。新函数可以作为普通函数调用，也可以作为构造函数（通过 `new`）调用，此时忽略 `thisArg`，并保持原型链一致。

```js
Function.prototype.myBind = function (thisArg, ...presetArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('bind2 must be called on a function')
  }

  const self = this

  function boundFn(...laterArgs) {
    // 如果作为构造函数调用（new boundFn）
    if (this instanceof boundFn) {
      return new self(...presetArgs, ...laterArgs)
    }
    // 否则正常绑定 this
    return self.apply(thisArg, [...presetArgs, ...laterArgs])
  }

  // 保证原型链一致（new 出来的对象继承原函数的 prototype）
  boundFn.prototype = Object.create(self.prototype)

  return boundFn
}
```

### 函数防抖&节流⭐

#### 防抖

防抖 (*Debounce*)：在事件被触发 `n` 秒后再执行回调，如果在这 `n` 秒内又被触发，则重新计时。

- 输入框搜索联想、输入验证（等用户输完再校验）
- 窗口大小 `resize` 事件（只需在用户停止调整大小后计算布局）
- 防止按钮重复提交

```js
// 简单版
function debounce(fn, delay) {
  let timer = null; // 保存定时器
  return function (...args) {
    // 如果有定时器，清除它
    if (timer) {
      clearTimeout(timer);
    }
    // 设置新定时器，延迟执行 fn
    timer = setTimeout(() => {
      // 保存调用时的 this 上下文和参数
      fn.apply(this, args); // 使用 apply 传递 this 和参数
      timer = null; // 执行后清空定时器
    }, delay);
  };
}
```

```js
// 最终版
function debounce(fn, delay, options = {}) {
  const { immediate = false } = options;
  let timer = null; // 保存定时器
  let isFirstCall = true; // 标记是否首次调用

  function debounced(...args) {
    // 清除现有定时器
    if (timer) {
      clearTimeout(timer);  // 清除定时器任务，但不会改变 timer 本身值
      timer = null;
    }

    // 立即执行逻辑
    if (immediate && isFirstCall) {
      fn.apply(this, args);
      isFirstCall = false;  // 防止再次触发
      // 设置定时器以重置 isFirstCall
      timer = setTimeout(() => {
        isFirstCall = true;  // delay时间后再重置，允许下一次的执行
        timer = null;
      }, delay);
      return;
    }

    // 尾部执行逻辑
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
      isFirstCall = true; // 重置首次调用标志
    }, delay);
  }

  // 取消防抖
  debounced.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    isFirstCall = true;
  };

  return debounced;
}
```

#### 节流

节流(*Throttle*)：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

- 页面滚动 `scroll` 事件监听（如懒加载、滚动动画、判断元素是否进入视口，没必要每次滚动1像素都计算）
- 鼠标 `mousemove` 事件（如拖拽时的位置更新）
- DOM 元素拖拽

```js
// 简单版
const throttle(fn, delay) => {
  let lastTime = 0; // 记录上一次执行时间
  return function (...args) {
    const now = Date.now(); // 当前时间
    if (now - lastTime >= delay) {
      fn.apply(this, args); // 执行函数
      lastTime = now; // 更新上次执行时间
    }
  };
}
```

```js
// 最终版
function throttle(fn, delay, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastTime = 0; // 上次执行时间
  let timer = null; // 保存定时器

  function throttled(...args) {
    const now = Date.now();

    // 头部执行：在每个 delay 时间窗口的开始，立即执行一次 fn
    if (leading && now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
      return;
    }

    // 尾部执行：在每个 delay 时间窗口结束时，执行最后一次触发
    if (trailing && !timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, delay - (now - lastTime));  // 计算剩余时间，确保定时器在当前时间窗口结束时触发
    }
  }

  // 取消节流
  throttled.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastTime = 0;
  };

  return throttled;
}
```

## 数据类型判断

### `typeof` 关键字

1. `Object.prototype.toString.call(obj)`：返回某个值的“内部类型标签字符串”，格式是 `[object Type]`
2. `.slice(8, -1)`：从第8位到最后1位 `]`（不包含最后1位）

```js
Object.prototype.toString.call(123)         // [object Number]
Object.prototype.toString.call('abc')       // [object String]
Object.prototype.toString.call([])          // [object Array]
Object.prototype.toString.call(null)        // [object Null]
Object.prototype.toString.call(undefined)   // [object Undefined]
Object.prototype.toString.call(Symbol())    // [object Symbol]
```

```js
function typeOf(obj) {
   return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
```

### `instanceof` 关键字

**（1）`instanceof` 运算符**

`instanceof`：用于检测一个对象是否是某个构造函数的实例，具体是通过**检查对象的原型链是否包含构造函数的 `prototype` 属性**。

```js
function Person(name) {
  this.name = name;
}
const person = new Person('Alice');
console.log(person instanceof Person); // true
console.log(person instanceof Object); // true
```

**（2）实现思路**

1. 获取左操作数（对象）的 `__proto__`
2. 获取右操作数（构造函数）的 `prototype`
3. 沿着对象的原型链（通过 `__proto__`）逐级检查，是否等于构造函数的 `prototype`
4. 如果找到匹配，返回 `true`；如果到达链顶 `null`，返回 `false`

注意

1. `right.prototype`：表示构造函数 `right` 创建出来的实例会继承的原型对象
2. `Object.getPrototypeOf(right)`：是 `right` 本身（函数对象）继承的原型对象

```js
const myInstanceOf = (left, right) => {
  // 右操作数必须是函数，构造函数
  if (typeof right !== 'function') { throw new TypeError('Right operand must be a constructor function'); }
  // 左操作数为 null 或非对象，返回 false
  if (left === null || typeof left !== 'object' || typeof left !== 'function') { return false; }
  // 获取左操作数的 __proto__
  let current = Object.getPrototypeOf(left);  //  let current = left.__proto__;
  while(current !== null){
    // // 不可以 是Object.getPrototypeOf(right)
    if(current === right.prototype){
      return true;
    }
    current = Object.getPrototypeOf(current);
  }
  return false;
}
```

## 事件总线（发布订阅模式）

事件总线是一种**中间人**模式，允许多个对象之间通信而不直接耦合。

1. `.on(name, fn)` 注册监听器（订阅者）
2. `.emit(name, ...args)` 触发事件（发布者）
3. `.off(name, fn)` 移除监听器

```js
class EventBus {
  constructor() {
    this.events = {} // 存储事件与回调
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  // 发布事件
  emit(eventName, ...args) {
    const callbacks = this.events[eventName]
    if (callbacks) {
      callbacks.forEach(fn => fn(...args))
    }
  }

  // 取消订阅
  off(eventName, callback) {
    const callbacks = this.events[eventName]
    if (!callbacks) return

    this.events[eventName] = callbacks.filter(fn => fn !== callback)
  }
}
```

