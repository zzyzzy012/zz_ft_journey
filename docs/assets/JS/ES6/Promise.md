# Promise

## Promise前置知识

### (1) 含义

`Promise` 是一个对象，从它可以获取异步操作的消息。`Promise` 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

简单来说 `Promise` 是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果，优于回调函数。

**① `Promise` 对象特点**

1. 对象的状态不受外界影响。`Promise` 对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）。**只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。**
2. **一旦状态改变，就不会再变，任何时候都可以得到这个结果。**`Promise` 对象的状态改变，只有两种可能：从`pending` 变为 `fulfilled` 和从 `pending` 变为 `rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 `resolved`（已定型）。

**② `Promise` 对象缺点**

1. 无法取消 `Promise`，**一旦新建它就会立即执行**，无法中途取消。
2. 如果不设置回调函数，`Promise` 内部抛出的错误，不会反应到外部。
3. 当处于 `pending` 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### (2) 基本用法

`Promise` 对象是一个构造函数，用来生成 `Promise` 实例。该函数的两个参数分别是 `resolve` 和 `reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

- `resolve` 函数：将 `Promise` 对象的状态从 `pending` 变为 `resolved`，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
- `reject`：将 `Promise` 对象的状态从 `pending` 变为 `rejected`，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

`Promise` 实例生成以后，可以用 `then` 方法分别指定 `resolved` 状态和 `rejected` 状态的回调函数。

`then` 方法可以接受**两个回调函数作为参数**。

1. 第一个回调函数是 `Promise` 对象的状态变为 `resolved` 时调用；
2. 第二个回调函数是 `Promise` 对象的状态变为 `rejected` 时调用。
3. 这两个函数都是**可选的**，不一定要提供。它们都接受 `Promise` 对象传出的值作为参数。

```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

**`Promise` 新建后就会立即执行。**

```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

```js
// Promise 新建后就会立即执行。
// 执行同步任务 console.log('Hi!')
// 执行异步任务 promise.then
```

### (3) `then()`

`then` 方法的第一个参数是 `resolved` 状态的回调函数，第二个参数是 `rejected` 状态的回调函数，它们都是可选的。

`then ` 方法返回的是一个**新的 `Promise` 实例**（不是原来那个 `Promise` 实例）。因此可以采用**链式写法**。

```js
getJSON("/post/1.json").then(
  post => getJSON(post.commentURL)
).then(
  comments => console.log("resolved: ", comments),
  err => console.log("rejected: ", err)
);
```

> 第一个 `then` 方法指定的回调函数，返回的是另一个 `Promise` 对象。
>
> 第二个 `then` 方法指定的回调函数，就会等待这个新的 `Promise` 对象状态发生变化。
>
> - 如果变为 `resolved`，就调用第一个回调函数；
> - 如果状态变为 `rejected`，就调用第二个回调函数。

### (4) `catch()`

`catch()` 方法是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名，用于**指定发生错误时的回调函数。返回的还是一个 `Promise` 对象，因此后面还可以接着调用 `then()` 方法。**

**`then()` 方法指定的回调函数，如果运行中抛出错误，也会被 `catch()` 方法捕获。**

```js
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```

> 返回的 `Promise` 对象状态是 `resolved`，调用 `then` 指定的回调函数；
>
> 状态是 `rejected`，调用 `catch` 指定的回调函数。
>

`Promise` 对象的错误具有**冒泡性质**，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 `catch` 语句捕获。

```js
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

> `getJSON()` 产生一个 `Promise` 对象
>
> 两个 `then` 分别产生 一个 `Promise`

### (5) `finally()`

`finally` 方法用于指定**不管 `Promise` 对象最后状态如何，都会执行的操作**。

`finally` 方法的**回调函数不接受任何参数**，这意味着没有办法知道，前面的 `Promise` 状态到底是 `fulfilled` 还是 `rejected`。这表明，`finally` 方法里面的操作，应该是与状态无关的，不依赖于 `Promise` 的执行结果。

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

实现 `finally` 方法。

```js
Promise.prototype.finally = function (callback) {
  // let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

`finally` 方法总是会**返回原来的值**。

```js
// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {})
// resolve 的值是 2
Promise.resolve(2).finally(() => {})
// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {})
// reject 的值是 3
Promise.reject(3).finally(() => {})
```

### (6) `Promise.all()`

`Promise.all()` 方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

`Promise.all()` 方法的参数可以不是数组，但**必须具有 Iterator 接口，且返回的每个成员都是 `Promise` 实例**。

```js
const p = Promise.all([p1, p2, p3]);
```

`p1`、`p2`、`p3` 如果不是 `Promise` 实例，会调用 `Promise.resolve()` 将 `p1`、`p2`、`p3` 包装成 `Promise` 实例。

1. 只有 `p1`、`p2`、`p3` 的状态都变成 `fulfilled`，`p` 的状态才会变成 `fulfilled`，**此时 `p1`、`p2`、`p3`的返回值组成一个数组，传递给 `p` 的回调函数。**
2. 只要 `p1`、`p2`、`p3` 之中有一个被 `rejected`，`p` 的状态就变成 `rejected`，此时**第一个被 `reject` 的实例的返回值，会传递给 `p` 的回调函数。**即使 `p` 已经 `rejected`，其他 `p` 仍会继续执行，直到它们各自决议。

如果作为参数的 `Promise` 实例，自己定义了 `catch` 方法，那么它一旦被 `rejected`，并不会触发`Promise.all()` 的 `catch` 方法。

```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);
// catch 回调返回 e（即 Error: 报错了）
// 因此这个新 Promise 是 resolved 状态，值为 Error: 报错了。

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]
```

> `p1` 会 `resolved`；
>
> `p2` 首先会 `rejected`，但是 `p2` 有自己的 `catch` 方法，该方法返回的是一个新的 `Promise` 实例，`p2` 指向的实际上是这个实例。该实例执行完 `catch` 方法后，也会变成 `resolved`。
>
> `Promise.all()` 方法参数里面的两个实例都会 `resolved`，因此会调用 `then` 方法指定的回调函数，而不会调用 `catch` 方法指定的回调函数。

### (7) `Promise.race()`

`Promise.race()` 将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

`Promise.race()` 方法的参数与 `Promise.all()` 方法一样，如果不是 `Promise` 实例，就会先调用 `Promise.resolve()` 方法，将参数转为 `Promise` 实例，再进一步处理。

```js
const p = Promise.race([p1, p2, p3]);
```

> 1. 只要 `p1`、`p2`、`p3` 之中有一个实例率先改变状态，`p` 的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给 `p` 的回调函数。
> 2. 后续的 `p` 依旧会执行，只不过结果会被抛弃。

### (8) `Promise.allSettled()`

`Promise.all()` 方法只适合所有异步操作都成功的情况，**如果有一个操作失败，就无法满足要求**。

`Promise.allSettled()` 方法，用来确定一组异步操作是否都结束了（不管成功或失败）。所以，它的名字叫做 `Settled`，包含了 `fulfilled` 和 `rejected` 两种情况。

`Promise.allSettled()` 方法接受一个数组作为参数，数组的每个成员都是一个 `Promise` 对象，并返回一个新的 `Promise` 对象。只有等到参数数组的所有 `Promise` 对象都发生状态变更（不管是 `fulfilled` 还是 `rejected`），返回的 `Promise` 对象才会发生状态变更。

**该方法返回的新的 `Promise` 实例，一旦发生状态变更，状态总是 `fulfilled`，不会变成 `rejected`。**状态变成 `fulfilled` 后，它的回调函数会接收到**一个数组**作为参数，该数组的每个成员**对应前面数组的每个 `Promise` 对象**。

> `Promise.allSettled()` 设计目的是等所有 `Promise` 实例都完成，不管状态如何，不像 `Promise.all()` 会因为 一个 `Promise` 实例的状态为 `rejected` 而失败，短路。
>
> `Promise.allSettled()` 返回的 `Promise` **总是 `fulfilled`**，其值是一个数组，数组元素记录了每个输入 `Promise` 的最终状态（`fulfilled` 或 `rejected`）和对应的值或原因。

```js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

`results` 的每个成员是一个对象，对象的格式是固定的，对应异步操作的结果。

- 成员对象的 `status` 属性的值只可能是字符串 `fulfilled` 或字符串 `rejected`，用来区分异步操作是成功还是失败。
- 如果是成功 `fulfilled`，对象会有 `value` 属性；
- 如果是失败 `rejected`，会有 `reason` 属性，对应两种状态时前面异步操作的返回值。

```js
// 异步操作成功时
{status: 'fulfilled', value: value}

// 异步操作失败时
{status: 'rejected', reason: reason}
```

### (9) `Promise.any()`

`Promise.any()` 接受一组 `Promise` 实例作为参数，包装成一个新的 `Promise` 实例返回。

- 只要参数实例有一个变成 `fulfilled` 状态，包装实例就会变成 `fulfilled` 状态；
- 如果所有参数实例都变成 `rejected` 状态，包装实例就会变成 `rejected` 状态。

`Promise.any()` 跟 `Promise.race()` 方法很像，只有一点不同，就是 `Promise.any()` 不会因为某个 `Promise` 变成 `rejected` 状态而结束，必须等到所有参数 `Promise` 变成 `rejected` 状态才会结束。

```js
var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  console.log(result); // 42
});

Promise.any([rejected, alsoRejected]).catch(function (results) {
  console.log(results instanceof AggregateError); // true
  console.log(results.errors); // [-1, Infinity]
});
```

### (10) `Promise.resolve()`

`Promise.resolve()` 将现有对象转为 `Promise` 对象。

1. `p` 本身是一个 `Promise`，`Promise.resolve(p)` 会直接返回原始 `Promise` 的“镜像”，不会改变其状态或结果
   1. `p` 是 `fulfilled`，则返回的 `Promise` 也 `fulfilled`
   2. `p` 是 `rejected`，则返回的 `Promise` 也 `rejected`
2. `p` 是非 `Promise` 值（如字符串、数字、对象），状态变成 `fulfilled`，值为该原始值

`Promise.resolve()` 方法的参数分成四种情况。

**① 参数是一个 `Promise` 实例**：`Promise.resolve` 将不做任何修改、**原封不动地返回这个实例**。

**② 参数是一个 `thenable` 对象**：`Promise.resolve()` 方法会将这个对象转为 `Promise` 对象，然后就立即执行`thenable` 对象的 `then()` 方法。

`thenable` 对象指的是具有 `then` 方法的对象。

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function (value) {
  console.log(value);  // 42
});
```

**③ 参数不是具有 `then()` 方法的对象，或根本就不是对象**：如果参数是一个原始值，或者是一个不具有 `then()` 方法的对象，则 `Promise.resolve()` 方法返回一个新的 `Promise` 对象，状态为 `resolved`。

```js
const p = Promise.resolve('Hello');

p.then(function (s) {
  console.log(s)
});
// Hello
```

**④ 不带有任何参数**：`Promise.resolve()` 方法允许调用时不带参数，直接返回一个 `resolved` 状态的 `Promise` 对象。

```js
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```

### (11) `Promise.reject()`

`Promise.reject(reason)` 方法也会返回一个新的 `Promise` 实例，该实例的状态为 `rejected`。

`Promise.reject()` 方法的参数，会原封不动地作为 `reject` 的理由，变成后续方法的参数。

```js
Promise.reject('出错了')
.catch(e => {
  console.log(e === '出错了')
})
// true
```

### (12) 应用

#### ① 实现图片加载

```js
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```

## Promise手写

### `Promise`

```js
// MyPromise.js

// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 存储成功回调函数
  onFulfilledCallbacks = [];
  // 存储失败回调函数
  onRejectedCallbacks = [];

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () =>  {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = realOnFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        })  
      }

      const rejectedMicrotask = () => { 
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = realOnRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      }
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask() 
      } else if (this.status === REJECTED) { 
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    }) 
    
    return promise2;
  }

  // resolve 静态方法
  static resolve (parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise;
```

### `finally`

```js
Promise.prototype.finally = function (callback) {
  return this.then(
    value  => Promise.resolve(callback()).then(() => value),
    reason => Promise.resolve(callback()).then(() => { throw reason })
  );
};
```

### `Promise.all`

```js
Promise.all = function (iterable) {
  return new Promise((resolve, reject) => {
    // 处理非可迭代对象
    if (iterable == null) { return reject(new TypeError('Iterable is not iterable')); }

    // 将可迭代对象转换为数组
    const promises = Array.from(iterable);
    const results = new Array(promises.length);
    let resolvedCount = 0;

    // 处理空数组
    if (promises.length === 0) { return resolve([]); }

    promises.forEach((p, index) => {
      // 确保每个元素都通过 Promise.resolve 转换为 Promise
      Promise.resolve(p).then(value => {
          results[index] = value;
          resolvedCount++;
          if (resolvedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reason => reject(reason));
    });
  });
};
```

### `Promise.race`

```js
Promise.race = function (iterable) {
  return new Promise((resolve, reject) => {
    // 检查输入是否可迭代
    if (iterable == null) {
      return reject(new TypeError('Iterable is not iterable'));
    }

    // 将可迭代对象转换为数组
    const promises = Array.from(iterable);

    // 遍历并将每个元素转换为 Promise
    for (const p of promises) {
      Promise.resolve(p)
        .then(resolve)
        .catch(reject);
    }
  });
};
```

### `Promise.allSettled`

```js
function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    // 结果数组
    const results = [];
    let completedCount = 0;

    // 遍历每个 Promise
    promises.forEach((p, index) => {
      // 确保 promise 是一个 Promise 对象
      Promise.resolve(p).then(
        (value) => {
          results[index] = { status: 'fulfilled', value };
        },
        (reason) => {
          results[index] = { status: 'rejected', reason };
        }
      ).finally(() => {
        // 记录已完成的 Promise 数量
        completedCount++;
        // 如果所有 Promise 都完成了
        if (completedCount === promises.length) {
          resolve(results);
        }
      });
    });
  });
}
```

### `Promise.any`

```js
function any(iterable) {
  return new Promise((resolve, reject) => {
    // 检查输入是否可迭代
    if (iterable == null) {
      return reject(new TypeError('Iterable is not iterable'));
    }

    // 将可迭代对象转换为数组
    const promises = Array.from(iterable);
    const errors = new Array(promises.length);
    let rejectionCount = 0;

    // 处理空可迭代对象
    if (promises.length === 0) {
      return reject(new AggregateError([], 'All promises were rejected'));
    }

    // 遍历并将每个元素转换为 Promise
    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(value => {
          resolve(value); // 第一个成功的 Promise 决议值
        })
        .catch(err => {
          errors[index] = err; // 收集错误
          rejectionCount++;
          if (rejectionCount === promises.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    });
  });
}
```

### `Promise.resolve`

```js
Promise.resolve = function(value) {
    // 如果是 Promsie，则直接输出它
    if(value instanceof Promise) { return value }
    return new Promise(resolve => resolve(value))
}
```

### `Promise.reject`

```js
Promise.reject = function(reason) {
    return new Promise((resolve, reject) => reject(reason))
}
```

## Generator

### 概述

#### 简介

语法上，`Generator` 函数是一个状态机，封装了多个内部状态。

执行 `Generator` 函数会返回一个遍历器对象，是一个**遍历器对象生成函数**。返回的遍历器对象，可以依次遍历 `Generator` 函数内部的每一个状态。

形式上，`Generator` 函数是一个普通函数，但是有两个特征。一是，`function` 关键字与函数名之间有一个星号；二是，函数体内部使用 `yield`（产出）表达式，定义不同的内部状态。

调用 `Generator` 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象。必须调用遍历器对象的 `next` 方法，使得指针移向下一个状态。

**`Generator` 函数是分段执行的，`yield` 表达式是暂停执行的标记，而 `next` 方法可以恢复执行。**

调用 `Generator` 函数，返回一个遍历器对象，代表 `Generator` 函数的内部指针。以后，每次调用遍历器对象的 `next` 方法，就会返回一个有着 `value` 和 `done` 两个属性的对象。

- **`value` 属性表示当前的内部状态的值，是 `yield` 表达式后面那个表达式的值；**
- `done` 属性是一个布尔值，表示是否遍历结束。

#### `yield` 表达式

**（1）遍历器对象的 `next` 方法的运行逻辑**

1. 遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield` 后面的那个表达式的值，作为返回的对象的 `value` 属性值。
2. 下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式。
3. 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值。
4. 如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`。

`yield` 表达式后面的表达式，只有当调用 `next` 方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了**手动的惰性求值（*Lazy Evaluation*）**的语法功能。

**（2）`yield` 与 `return` 表达式区别**

1. `yield` 表达式具备记忆功能，暂缓执行，下次从该位置继续执行；在 `Generator` 函数体中可以执行多次。
2. `return` 不具备记忆功能，只能出现一次。

**（3）`yield` 出现位置**

只能用在 Generator 函数中，不能用在如 `forEach` 等其他函数体内，但可用在 `for` 循环中。

#### 与 Iterator 接口的关系

任意一个对象的 `Symbol.iterator` 方法，等于该对象的**遍历器生成函数**，调用该函数会返回该对象的一个遍历器对象。

由于 `Generator` 函数就是遍历器生成函数，因此可以把 `Generator` 赋值给对象的 `Symbol.iterator` 属性，从而使得该对象具有 `Iterator` 接口。

### `next` 方法的参数

`yield` 表达式本身没有返回值，或者说总是返回 `undefined`。**`next` 方法可以带一个参数，该参数就会被当作上一个 `yield` 表达式的返回值。**

**在第一次使用 `next` 方法时，传递参数是无效的。**第一个 `next` 方法用来启动遍历器对象，所以不用带有参数。

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
// yield 表达式返回 undefiend，2 * undefiend 也就是 NaN
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
// yield 12，y = 2 * 12，yield 24 / 3 = 8
b.next(13) // { value:42, done:true }
```

### `for...of` 循环

`for...of` 循环可以自动遍历 `Generator` 函数运行时生成的 `Iterator` 对象，且此时不再需要调用 `next` 方法。

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
// ⚠️ return 语句不在 for...of 循环内
```

遍历对象。原生 `Object` 没有遍历器接口，通过 `Generator` 函数生成。

```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

// 另一种写法
jane[Symbol.iterator] = objectEntries;
for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
```

解构赋值、扩展运算符 `...`、`Array.from` 方法内部调用的、`for...of` 循环，都是遍历器接口。它们都可以将 `Generator` 函数返回的 `Iterator` 对象，作为参数。

```js
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

### `throw`

`Generator.prototype.throw()` 可以在函数体外抛出错误，然后在 `Generator` 函数体内捕获。只能捕获一个，其他错误会在外部的 `catch` 语句被捕获。

`throw` 方法抛出的错误要被内部捕获，前提是必须至少执行过一次 `next` 方法，否则直接被外部函数捕获。

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');  // 在函数体内捕获过，不会再捕获第二个错误
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);  // 第二个错误在函数体外捕获
}
// 内部捕获 a
// 外部捕获 b
```

`throw` 方法可以接受一个参数，该参数会被 `catch` 语句接收，建议抛出 `Error` 对象的实例。

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

var i = g();
i.next();
i.throw(new Error('出错了！'));
// Error: 出错了！(…)
```

如果 `Generator` 函数内部没有部署 `try...catch` 代码块，那么 `throw` 方法抛出的错误，将被外部 `try...catch` 代码块捕获。

```js
var g = function* () {
  while (true) {
    yield;
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 a
```

如果 `Generator` 函数内部和外部，都没有部署 `try...catch` 代码块，那么程序将报错，直接中断执行。

```js
var gen = function* gen(){
  yield console.log('hello');
  yield console.log('world');
}

var g = gen();
g.next();
g.throw();
// hello
// Uncaught undefined
```

`throw` 方法被内部捕获以后，会附带执行到下一条 `yield` 表达式，这种情况下等同于执行一次 `next` 方法。

只要 `Generator` 函数内部部署了 `try...catch` 代码块，那么遍历器的 `throw` 方法抛出的错误，不影响下一次遍历。

```js
var gen = function* gen(){
  try {
    yield 1;
  } catch (e) {
    yield 2;
  }
  yield 3;
}

var g = gen();
g.next() // { value:1, done:false }
g.throw() // { value:2, done:false }
g.next() // { value:3, done:false }
g.next() // { value:undefined, done:true }
```

`throw` 命令与 `g.throw` 方法是无关的，两者互不影响。

```js
var gen = function* gen(){
  yield console.log('hello');
  yield console.log('world');
}

var g = gen();
g.next();

try {
  throw new Error();
} catch (e) {
  g.next();
}
// hello
// world
```

### `return`

`return()` 方法，返回给定的值，并且终结遍历 `Generator` 函数。

如果 `return()` 方法调用时，不提供参数，则返回值的 `value` 属性为 `undefined`。

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
// return 已终结，后面再调用 next 方法，done 属性总是返回 true
g.next()        // { value: undefined, done: true }
```

如果 `Generator` 函数内部有 `try...finally` 代码块，且正在执行 `try` 代码块，那么 `return()` 方法会导致立刻进入 `finally` 代码块，执行完以后，整个函数才会结束。

```js
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

### `next`、`throw`、`return` 的共同点

`next()`、`throw()`、`return()` 这三个方法本质上是同一件事，它们的作用都是**让 `Generator` 函数恢复执行**，并且使用不同的语句替换 `yield` 表达式。

### `yield*` 表达式

`yield*` 表达式，用来在一个 `Generator` 函数里面执行另一个 `Generator` 函数。

如果 `yield` 表达式后面跟的是一个遍历器对象，需要在 `yield` 表达式后面加上星号，表明它返回的是一个遍历器对象。这被称为 `yield*` 表达式。

`yield*` 后面的 `Generator` 函数（没有 `return` 语句时），等同于在 `Generator` 函数内部，部署一个 `for...of` 循环。

任何数据结构只要有 `Iterator` 接口，就可以被 `yield*` 遍历。

```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

`yield*` 可以完全替代 `for...of` 循环。在其他数据结构的应用。

```js
// 数组
function* gen(){
  yield* ["a", "b", "c"];
}

gen().next() // { value:"a", done:false }

// 字符串
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value // "hello"
read.next().value // "h"

// ❗❗❗数组扁平化
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}
// a
// b
// c
// d
// e

// 扩展运算符
[...iterTree(tree)] // ["a", "b", "c", "d", "e"]
```

### 作为对象属性的 `Generator` 函数

```js
let obj = {
  * myGeneratorMethod() {
    ···
  }
// 等同于
  myGeneratorMethod: function* () {
    // ···
  }
};
```

### 应用

`Generator` 可以暂停函数执行，返回任意表达式的值。

#### 部署 Iterator 接口

```js
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

## async

### (1) 含义

`async` 是 `Generator` 函数的语法糖。`async` 函数就是将 `Generator` 函数的星号 `*` 替换成 `async`，将 `yield` 替换成 `await`。

`async` 函数对 `Generator` 函数的改进。

（1）内置执行器。

`Generator` 函数的执行必须靠执行器，所以才有了 `co` 模块，而 `async` 函数自带执行器。也就是说，`async` 函数的执行，与普通函数一模一样，只要一行。

（2）更好的语义。

`async` 和 `await`，比起星号和 `yield`，语义更清楚了。**`async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果。**

（3）更广的适用性。

`co` 模块约定，`yield` 命令后面只能是 `Thunk` 函数或 `Promise` 对象，而 `async` 函数的 `await` 命令后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）。

（4）返回值是 `Promise`。

**`async` 函数的返回值是 `Promise` 对象**，比 `Generator` 函数的返回值是 `Iterator` 对象方便多了。可以用 `then` 方法指定下一步的操作。

**`async` 函数完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而 `await` 命令就是内部 `then` 命令的语法糖。**

### (2) 基本用法

`async` 函数返回一个 `Promise` 对象，可以使用 `then` 方法添加回调函数。当函数执行的时候，一旦遇到 `await` 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

`async` 使用形式。

```js
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
```

### (3) 语法

#### ① 返回 `Promise` 对象

`async` 函数返回一个 `Promise` 对象。`return` 语句返回的值，会成为 `then` 方法回调函数的参数。

**`async` 函数内部抛出错误，会导致返回的 `Promise` 对象变为 `reject` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到。**

```js
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log('resolve', v),
  e => console.log('reject', e)
)
//reject Error: 出错了
```

#### ② `Promise` 对象的状态变化

`async` 函数返回的 `Promise` 对象，必须等到内部所有 `await` 命令后面的 `Promise` 对象执行完，才会发生状态改变，除非遇到 `return` 语句或者抛出错误。也就是说，只有 `async` 函数内部的异步操作执行完，才会执行 `then` 方法指定的回调函数。

#### ③ `await` 命令

正常情况下，`await` 命令后面是一个 `Promise` 对象，返回该对象的结果。如果不是 `Promise` 对象，就直接返回对应的值。

```js
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123
```

`await` 命令后面是一个 `thenable` 对象（即定义了 `then` 方法的对象），那么 `await` 会将其等同于 `Promise`  对象。

`await` 命令后面的 `Promise` 对象如果变为 `reject` 状态，则 `reject` 的参数会被 `catch` 方法的回调函数接收到。

任何一个 `await` 语句后面的 `Promise` 对象变为 `reject` 状态，那么整个 `async` 函数都会中断执行。

```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world');  // 不会执行
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```

**不希望错误中断执行。**

**① 放在 `try...catch` 代码块中。**

```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```

**② `await` 后面的 `Promise` 对象再跟一个 `catch` 方法，处理前面可能出现的错误。**

```js
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```

#### ④ 错误处理

如果 `await` 后面的异步操作出错，那么等同于 `async` 函数返回的 `Promise` 对象被 `reject`。

防止出错的方法，将其放在 `try...catch` 代码块之中。如果有多个 `await` 命令，可以统一放在 `try...catch` 结构中。

```js
async function main() {
  try {
    const val1 = await firstStep();
    const val2 = await secondStep(val1);
    const val3 = await thirdStep(val1, val2);

    console.log('Final: ', val3);
  }
  catch (err) {
    console.error(err);
  }
}
```

#### ⑤ 使用注意点

(1) `await` 命令后面的 `Promise` 对象，运行结果可能是 `rejected`，所以最好把 `await` 命令放在 `try...catch` 代码块中。

```js
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法

async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  });
}
```

(2) 多个 `await` 命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。

```js
let foo = await getFoo();
let bar = await getBar();
// 耗时，只有等 getFoo 完成以后，才会执行 getBar

// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

(3) `await` 命令只能用在 `async` 函数之中，如果用在普通函数，就会报错。

不能用数组的 `forEach` 方法，可以用 `for` 循环，数组的 `reduce` 方法。

(4) `async` 函数可以保留运行堆栈。

### (4) `async` 函数的实现原理

`async` 函数的实现原理，就是**将 `Generator` 函数和自动执行器，包装在一个函数里。**

```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

所有的 `async` 函数都可以写成上面的第二种形式，其中的 `spawn` 函数就是自动执行器。

下面给出 `spawn` 函数的实现，基本就是前文自动执行器的翻版。

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

### (5) 与其他异步处理方法的比较

1. `Promise` 的写法优于回调地狱，但是代码完全都是 `Promise` 的 API（`then`、`catch` 等等）。
2. `Generator` 函数必须有一个任务运行器，自动执行 `Generator` 函数。
3. `Async` 函数的实现最简洁，最符合语义，几乎没有语义不相关的代码。它将 `Generator` 写法中的自动执行器，改在语言层面提供，不暴露给用户，因此代码量最少。如果使用 `Generator` 写法，自动执行器需要用户自己提供。

### (6) 顶层 `await`

允许在模块的顶层独立使用 `await` 命令，主要目的是使用 `await` 解决模块异步加载的问题。保证只有异步操作完成，模块才会输出值。

顶层 `await` 只能用在 ES6 模块，不能用在 `CommonJS` 模块。因为 `CommonJS` 模块的 `require()` 是同步加载，如果有顶层 `await`，就没法处理加载了。

**顶层的 `await` 命令有点像，交出代码的执行权给其他的模块加载，等异步操作完成后，再拿回执行权，继续向下执行。**





















