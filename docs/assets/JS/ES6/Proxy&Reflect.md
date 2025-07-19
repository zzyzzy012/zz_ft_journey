# Proxy 和 Reflect

## Proxy

### 概述

Proxy 代理：用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种元编程（*meta programming*），即对编程语言进行编程。

Proxy 可以理解为**在目标对象之前架设一层拦截，外界对该对象的访问，都必须先通过这层拦截**，因此提供了一种机制，**可以对外界的访问进行过滤和改写。**

`Proxy` 构造函数，用来生成 `Proxy` 实例。

```js
var proxy = new Proxy(target, handler);
// target 参数表示所要拦截的目标对象
// handler 参数也是一个对象，用来定制拦截行为。
```

实例方法

1. `get(target, propKey, receiver)`：拦截对象属性的读取。
2. `set(target, propKey, value, receiver)`：拦截对象属性的设置，返回一个布尔值。
3. `has(target, propKey)`：拦截 `HasProperty` 操作，拦截 `in ` 操作符。接受两个参数，分别是目标对象、需查询的属性名。返回一个布尔值。
4. `deleteProperty(target, propKey)`：拦截 `delete` 操作，返回一个布尔值。如果这个方法抛出错误或者返回 `false`，当前属性就无法被 `delete` 命令删除。
5. `defineProperty(target, propKey, propDesc)`：拦截 `Object.defineProperty(）`、`Object.defineProperties()`，返回一个布尔值。
6. `getOwnPropertyDescriptor(target, propKey)`：拦截 `Object.getOwnPropertyDescriptor(proxy, propKey)`，返回一个属性描述对象或者 `undefined`。
7. `getPrototypeOf(target)`：拦截获取对象原型，**返回值必须是对象或者 `null`，否则报错。**如果目标对象不可扩展（*non-extensible*）， `getPrototypeOf()` 方法必须返回目标对象的原型对象。
   - `Object.prototype.__proto__`
   - `Object.prototype.isPrototypeOf()`
   - `Object.getPrototypeOf()`
   - `Reflect.getPrototypeOf()`
   - `instanceof`
8. `ownKeys(target)`：拦截对象自身属性的读取操作，返回一个数组。
   - `Object.getOwnPropertyNames()`
   - `Object.getOwnPropertySymbols()`
   - `Object.keys()` 仅包括目标对象自身的可遍历属性。不包含 `Symbol` 属性，不可遍历（*enumerable*）的属性。
   - `for...in` 循环
9. `preventExtensions(target)`：拦截 `Object.preventExtensions()`，返回一个布尔值。
10. `isExtensible(target)`：拦截 `Object.isExtensible()`，只能返回布尔值。
11. `setPrototypeOf(target, proto)`：拦截 `Object.setPrototypeOf()`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
12. `apply(target, object, args)`：拦截 `Proxy` 实例作为函数调用的操作。
    - `proxy(...args)`
    - `proxy.call(object, ...args)`
    - `proxy.apply(...)`
13. `construct(target, args)`：拦截 `new` 命令，拦截的是构造函数。

### `Proxy` 实例的方法

#### `get()`

`get` 方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 `proxy` 实例本身，最后一个参数可选。

```js
// 实现数组读取负数的索引
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };

  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1] // c
```

#### `set()`

`set(target, propKey, value, receiver)`：用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 `Proxy` 实例本身，其中最后一个参数可选。

`set` 代理应当返回一个布尔值。严格模式下，`set`代理如果没有返回`true`，就会报错。

```js
// 内部属性禁止读写
const handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```

#### `apply()`

`apply` 方法拦截函数的调用、`call` 和 `apply`操作。

`apply` 方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（`this`）和目标对象的参数数组。

```js
var handler = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments);
  }
};
```

```js
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```

#### `has()`

如果某个属性不可配置（或者目标对象不可扩展），则 `has()` 方法就不得隐藏（即返回 `false`）目标对象的该属性。

```js
var obj = { a: 10 };
Object.preventExtensions(obj);

var p = new Proxy(obj, {
  has: function(target, prop) {
    return false;
  }
});

'a' in p // TypeError is thrown
```

`has()` 方法拦截的是 `HasProperty` 操作，而不是 `HasOwnProperty` 操作，即 `has()` 方法不判断一个属性是对象自身的属性，还是继承的属性。

`has()` 拦截只对 `in` 运算符生效，对 `for...in` 循环不生效。

#### `construct()`

`construct()` 方法用于拦截 `new` 命令，拦截的是构造函数。**目标对象必须是函数，返回的必须是一个对象，否则会报错。**

`construct()` 方法中的 `this` 指向的是 `handler`，而不是实例对象。

```js
const handler = {
  construct (target, args, newTarget) {
    return new target(...args);
  }
};

// target：目标对象。
// args：构造函数的参数数组。
// newTarget：创造实例对象时，new 命令作用的构造函数。
```

#### `deleteProperty()`

`deleteProperty(target, propKey)`：拦截 `delete` 操作，返回一个布尔值。如果这个方法抛出错误或者返回 `false`，当前属性就无法被 `delete` 命令删除。

目标对象自身的不可配置（*configurable*）的属性，不能被 `deleteProperty` 方法删除，否则报错。

```js
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    delete target[key];
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop
// Error: Invalid attempt to delete private "_prop" property
```

#### `defineProperty()`

`defineProperty(target, propKey, propDesc)`：拦截 `Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。

`false` 只是用来提示操作失败，本身并不能阻止添加新属性。

如果目标对象不可扩展（*non-extensible*），则 `defineProperty()` 不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（*writable*）或不可配置（*configurable*），则 `defineProperty()`方法不得改变这两个设置。

```js
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' // 不会生效
```

## [Reflect](https://wangdoc.com/es6/reflect)

### 概述

`reflect` 作用

1. 将 `Object` 对象的一些明显属于语言内部的方法（比如 `Object.defineProperty`），放到 `Reflect` 对象上。现阶段，某些方法同时在 `Object` 和 `Reflect` 对象上部署，未来的新方法将只部署在 `Reflect` 对象上。也就是说，从 `Reflect` 对象上可以拿到语言内部的方法。
2. 修改某些 `Object` 方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)` 在无法定义属性时，会抛出一个错误，而 `Reflect.defineProperty(obj, name, desc)` 则会返回 `false`。
3. 让 `Object` 操作都变成函数行为。某些 `Object` 操作是命令式，比如 `name in obj` 和 `delete obj[name]`，而 `Reflect.has(obj, name)` 和 `Reflect.deleteProperty(obj, name)` 让它们变成了函数行为。
4. `Reflect` 对象的方法与 `Proxy` 对象的方法一一对应，只要是 `Proxy` 对象的方法，就能在 `Reflect` 对象上找到对应的方法。这就让 `Proxy` 对象可以方便地调用对应的 `Reflect` 方法，完成默认行为，作为修改行为的基础。也就是说，不管 `Proxy` 怎么修改默认行为，你总可以在 `Reflect` 上获取默认行为。

### 静态方法

1. `Reflect.apply(func, thisArg, args)` 等同于 `Function.prototype.apply.call(func, thisArg, args)`，用于绑定 `this` 对象后执行给定函数。
3. `Reflect.get`
4. `Reflect.set`
5. `Reflect.defineProperty(target, name, desc)` 基本等同于 `Object.defineProperty`，用来为对象定义属性。
5. `Reflect.deleteProperty(target, name)` 等同于 `delete obj[name]`，用于删除对象的属性。
6. `Reflect.getOwnPropertyDescriptor` 基本等同于 `Object.getOwnPropertyDescriptor`，用于得到指定属性的描述对象。
7. `Reflect.has(target, name)` 对应 `name in obj` 里面的 `in` 运算符。
8. `Reflect.ownKeys` 用于返回对象的所有属性，基本等同于 `Object.getOwnPropertyNames` 与 `Object.getOwnPropertySymbols` 之和。
9. `Reflect.construct(func, args)` 方法等同于 `new target(...args)`，这提供了一种不使用 `new`，来调用构造函数的方法。第一个参数必须是函数。
12. `Reflect.getPrototypeOf` 读取对象的 `__proto__` 属性，对应 `Object.getPrototypeOf`。
11. `Reflect.setPrototypeOf(target, prototype)` 设置目标对象的原型，对应 `Object.setPrototypeOf(obj, newProto)` 方法。它返回一个布尔值，表示是否设置成功。
12. `Reflect.isExtensible` 对应 `Object.isExtensible`，返回一个布尔值，表示当前对象是否可扩展。
13. `Reflect.preventExtensions` 对应 `Object.preventExtensions` 方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

#### `Reflect.get()`

`Reflect.get(target, name, receiver)` 方法查找并返回 `target` 对象的 `name` 属性，如果没有该属性，则返回 `undefined`。

如果 `name` 属性部署了读取函数 `getter`，则读取函数的 `this` 绑定 `receiver`。

如果第一个参数不是对象，`Reflect.get` 方法会报错。

```js
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};
// this 绑定 myReceiverObject，读取 myReceiverObject
Reflect.get(myObject, 'baz', myReceiverObject) // 8
```

#### `Reflect.set()`

`Reflect.set(target, name, value, receiver)` 方法设置 `target` 对象的 `name` 属性等于 `value`。

如果 `name` 属性设置了赋值函数，则赋值函数的 `this` 绑定 `receiver`。

```js
var myObject = {
  foo: 4,
  set bar(value) {
    return this.foo = value;
  },
};

var myReceiverObject = {
  foo: 0,
};
// this 绑定 myReceiverObject，设置 myReceiverObject 属性值
Reflect.set(myObject, 'bar', 1, myReceiverObject);
myObject.foo // 4
myReceiverObject.foo // 1
```

#### `Reflect.apply()`

`Reflect.apply(func, thisArg, args)` 等同于 `Function.prototype.apply.call(func, thisArg, args)`，用于绑定 `this` 对象后执行给定函数。

```js
const ages = [11, 33, 12, 54, 18, 96];

// 旧写法
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);

// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
```

#### `Reflect.has()`⭐

`Reflect.has(target, name)`：检查对象 `obj` 是否具有属性 `key`，**包括自有属性和原型链上的属性。**

对应 `name in obj` 里面的 `in` 运算符。

```js
var myObject = {
  foo: 1,
};

// 旧写法
'foo' in myObject // true

// 新写法
Reflect.has(myObject, 'foo') // true
```

区别

1. `Object.hasOwn(obj, prop)`：对象自有属性，如果属性是继承的或不存在的，返回 `flase`，替代 `Object.prototype.hasOwnProperty(prop)`
2. `Object.prototype.hasOwnProperty(prop)`：检查对象是否直接拥有的属性（不检查原型链），返回布尔值
2. `Object.getOwnPropertyNames(obj)`：返回对象 `obj` 的所有**自有属性的字符串键的数组。包括不可枚举属性，不包括 `Symbol` 键，不检查原型链**
3. `Object.getOwnPropertySymbols(obj)`：返回对象 `obj` 的**所有自有属性的 `Symbol` 键的数组。包括可枚举或不可枚举的`Symbol` 键，不包括字符串键。不检查原型链。**
4. `in` 运算符：检查对象是否具有属性 `key`，**包括自有属性和原型链上的属性**。

```js
const obj = { a: 1 };
console.log(obj.hasOwnProperty('a')); // true
console.log(obj.hasOwnProperty('toString')); // false（原型链属性）
console.log(Object.prototype.hasOwnProperty.call(obj, 'a')); // true（安全调用）

const obj = { a: 1, b: 2 };
Object.defineProperty(obj, 'c', { value: 3, enumerable: false });
console.log(Object.getOwnPropertyNames(obj)); // ['a', 'b', 'c']
console.log(Object.getOwnPropertyNames(obj).includes('toString')); // false

const sym = Symbol('key');
const obj = { a: 1, [sym]: 2 };
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(key)]
console.log(Object.getOwnPropertySymbols(obj).length); // 1
```

#### `Reflect.ownKeys ()`⭐

`Reflect.ownKeys(target)` 用于返回对象的所有属性，基本等同于 `Object.getOwnPropertyNames + Object.getOwnPropertySymbols` + 不可枚举属性。

```js
var myObject = {
  foo: 1,
  bar: 2,
  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4,
};

// 旧写法
Object.getOwnPropertyNames(myObject)
// ['foo', 'bar']

Object.getOwnPropertySymbols(myObject)
//[Symbol(baz), Symbol(bing)]

// 新写法
Reflect.ownKeys(myObject)
// ['foo', 'bar', Symbol(baz), Symbol(bing)]
```

#### `Reflect.construct()`

`Reflect.construct(target, args)` 方法等同于 `new target(...args)`，这提供了一种不使用 `new`，来调用构造函数的方法。第一个参数必须是函数。

```js
function Greeting(name) {
  this.name = name;
}

// new 的写法
const instance = new Greeting('张三');

// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三']);
```

#### `Reflect.getPrototypeOf()`

`Reflect.getPrototypeOf(obj)` 读取对象的 `__proto__` 属性，对应 `Object.getPrototypeOf(obj)`。

区别：`Reflect.getPrototypeOf(obj)` 参数不是对象会报错；`Object.getPrototypeOf(obj)` 参数不是对象，会转化为对象再运行。

```js
const myObj = new FancyThing();

// 旧写法
Object.getPrototypeOf(myObj) === FancyThing.prototype;

// 新写法
Reflect.getPrototypeOf(myObj) === FancyThing.prototype;
```

#### `Reflect.setPrototypeOf()`

`Reflect.setPrototypeOf(obj, newProto)` 设置目标对象的原型（*prototype*），对应`Object.setPrototypeOf(obj, newProto)` 方法。它返回一个布尔值，表示是否设置成功。

如果无法设置目标对象的原型（比如，目标对象禁止扩展），`Reflect.setPrototypeOf` 方法返回 `false`。

如果第一个参数不是对象，`Object.setPrototypeOf` 会返回第一个参数本身，而 `Reflect.setPrototypeOf` 会报错。

如果第一个参数是 `undefined` 或 `null`，`Object.setPrototypeOf` 和 `Reflect.setPrototypeOf` 都会报错。

```js
const myObj = {};

// 旧写法
Object.setPrototypeOf(myObj, Array.prototype);

// 新写法
Reflect.setPrototypeOf(myObj, Array.prototype);

myObj.length // 0
```

#### `Reflect.defineProperty()`

`Reflect.defineProperty(target, propertyKey, attributes)` 方法基本等同于 `Object.defineProperty`，用来为对象定义属性。未来，后者会被逐渐废除。

如果 `Reflect.defineProperty` 的第一个参数不是对象，就会抛出错误。

```js
function MyDate() {
  /*…*/
}

// 旧写法
Object.defineProperty(MyDate, 'now', {
  value: () => Date.now()
});

// 新写法
Reflect.defineProperty(MyDate, 'now', {
  value: () => Date.now()
});
```

#### `Reflect.deleteProperty()`

`Reflect.deleteProperty(target, name)` 等同于 `delete obj[name]`，用于删除对象的属性。

该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回 `true`；删除失败，被删除的属性依然存在，返回 `false`。

```js
const myObj = { foo: 'bar' };

// 旧写法
delete myObj.foo;

// 新写法
Reflect.deleteProperty(myObj, 'foo');
```

#### `Reflect.getOwnPropertyDescriptor()`

`Reflect.getOwnPropertyDescriptor(target, name)` 基本等同于 `Object.getOwnPropertyDescriptor`，用于得到指定属性的描述对象，将来会替代掉后者。

`Reflect.getOwnPropertyDescriptor` 和 `Object.getOwnPropertyDescriptor` 的一个区别是，如果第一个参数不是对象，`Object.getOwnPropertyDescriptor(1, 'foo')` 不报错，返回 `undefined`，而 `Reflect.getOwnPropertyDescriptor(1, 'foo')` 会抛出错误，表示参数非法。

```js
var myObject = {};
Object.defineProperty(myObject, 'hidden', {
  value: true,
  enumerable: false,
});

// 旧写法
var theDescriptor = Object.getOwnPropertyDescriptor(myObject, 'hidden');

// 新写法
var theDescriptor = Reflect.getOwnPropertyDescriptor(myObject, 'hidden');
```

#### `Reflect.isExtensible ()`

`Reflect.isExtensible(target)` 对应 `Object.isExtensible`，返回一个布尔值，表示当前对象是否可扩展。

如果参数不是对象，`Object.isExtensible` 会返回 `false`，因为非对象本来就是不可扩展的，而 `Reflect.isExtensible` 会报错。

```js
const myObject = {};

// 旧写法
Object.isExtensible(myObject) // true

// 新写法
Reflect.isExtensible(myObject) // true
```

#### `Reflect.preventExtensions()`

`Reflect.preventExtensions(target)` 对应 `Object.preventExtensions` 方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

```js
var myObject = {};

// 旧写法
Object.preventExtensions(myObject) // Object {}

// 新写法
Reflect.preventExtensions(myObject) // true
```

