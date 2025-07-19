# Iterator 和 for...of 循环

## Iterator（遍历器）

### 遍历器概念

遍历器 `Iterator`：它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 `Iterator` 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

`Iterator` 的作用

1. 为各种数据结构，提供一个统一的访问接口
2. 使得数据结构的成员能够按某种次序排列
3. `Iterator` 接口主要供 `for...of` 消费

`Iterator` 的遍历过程

1. **创建一个指针对象，指向当前数据结构的起始位置。遍历器对象本质上是一个指针对象。**
2. 第一次调用指针对象的 `next` 方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用 `next`，指针指向数据结构的第二个成员。
4. 不断调用指针对象的 `next`，直到它指向数据结构的结束位置。

**每一次调用 `next` 方法，都会返回数据结构的当前成员的信息。**具体来说，就是**返回一个包含 `value` 和 `done` 两个属性的对象。**

- `value` 属性是当前成员的值，
- `done` 属性是一个布尔值，表示遍历是否结束。

```js
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```

### 默认 Iterator 接口

默认的 `Iterator` 接口部署在数据结构的 `Symbol.iterator` 属性，有该属性，认为是可遍历的（*iterable*）。**`Symbol.iterator` 属性是一个函数，是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。**

`Symbol.iterator` 是一个表达式，返回 `Symbol` 对象的 `iterator` 属性，这是一个预定义好的、类型为 `Symbol` 的特殊值，放在方括号内。

原生具备 `Iterator` 接口的数据结构：`Array`、`Map`、`Set`、`String`、`TypedArray`、函数的 `arguments` 对象、DOM `NodeList` 对象。

### 使用场景

（1）解构赋值

```js
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

（2）扩展运算符：只要某个数据结构部署了 `Iterator` 接口，就可以对它使用扩展运算符，将其转为数组。

```js
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']

// 转化为数组
let arr = [...iterable];
```

（3）`yield*` 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```js
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

（4）其他。**由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。**

- `for...of`
- `Array.from()`
- `Map(), Set(), WeakMap(), WeakSet()`，比如`new Map([['a',1],['b',2]])`
- `Promise.all()`、`Promise.race()`

### 遍历器对象的 `return()`，`throw()`

遍历器对象的 `next()` 方法必须部署，`return()`，`throw()` 方法可选。

`return()` 方法的使用场合是，如果 `for...of` 循环提前退出（通常是因为出错，或者有 `break` 语句），就会调用 `return()` 方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署 `return()` 方法。

## `for...of` 循环

一个数据结构只要部署了 `Symbol.iterator` 属性，就被视为具有 `iterator` 接口，就可以用 `for...of` 循环遍历它的成员。

适用范围：`Array`、`Set` 和 `Map` 结构、`String`、某些类似数组的对象，如 `arguments` 对象、DOM `NodeList` 对象、 `Generator` 对象。

### 数组

`for...of` 循环可代替数组的 `forEach()` 方法。

`for...in` 循环只能获取键名，而 `for...of` 循环能获取键值。

```js
var arr = ['a', 'b', 'c', 'd'];

for (let a in arr) {
  console.log(a); // 0 1 2 3
}

for (let a of arr) {
  console.log(a); // a b c d
}
```

`for...of` 循环调用遍历器接口，**数组的遍历器接口只返回具有数字索引的属性。**这一点跟 `for...in` 循环也不一样。

```js
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
```

### 计算生成的数据结构

1. `entries()` 返回一个遍历器对象，用来遍历 `[键名, 键值]` 组成的数组。
   1. 对于数组，键名就是索引值；
   2. 对于 `Set`，键名与键值相同。
   3. `Map` 结构的 `Iterator` 接口，默认调用 `entries` 方法。
2. `keys()` 返回一个遍历器对象，用来遍历所有的键名。
3. `values()` 返回一个遍历器对象，用来遍历所有的键值。

```js
let map = new Map().set('a', 1).set('b', 2);
for (let pair of map) {
  console.log(pair);
}
// ['a', 1]
// ['b', 2]
```

### 类似数组的对象

并不是所有类似数组的对象都具有 `Iterator` 接口。解决方法：使用 `Array.from` 方法将其转为数组。

```js
let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```

### 对象

不能直接使用 `for...of` 循环，没有 `Symbol.iterator` 接口，使用 `Generator` 包装成可遍历的。

```js
const obj = { a: 1, b: 2, c: 3 }

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, '->', value);
}
// a -> 1
// b -> 2
// c -> 3
```

## 不同循环的比较

**（1）`for` 循环**

`for` 循环：需要初始化变量、设置循环条件和更新变量。可以用于遍历可迭代对象，也适用于遍历对象的属性，但需要额外处理。

**（2）`forEach`**

数组提供的内置方法 `forEach`：无法中途跳出 `forEach` 循环，`break` 命令或 `return` 命令都不能奏效。

`for` 循环的性能高于 `forEach`：`forEach` 会调用回调函数，涉及闭包，会产生额外的性能开销和内存开销。

**（3）`for...in` 循环**

`for...in` 循环：**遍历对象的可枚举属性，包括继承的属性，不包括 `Symbol` 属性。**

`for...in` 循环主要是为**遍历对象**而设计的，**不适用于遍历数组**。

- `for...in` 循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
- 某些情况下，`for...in` 循环会以任意顺序遍历键名。

**（4）`for...of` 循环**

`for...of` 循环：遍历可迭代对象的元素。

- 有着同 `for...in` 一样的简洁语法，但是没有 `for...in` 那些缺点。
- 不同于 `forEach` 方法，它可以与 `break`、`continue`、`return` 配合使用。
- 提供了遍历所有数据结构的统一操作接口。