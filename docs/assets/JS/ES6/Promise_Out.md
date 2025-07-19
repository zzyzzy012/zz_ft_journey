# Promise代码输出题

## 理论部分

### 事件循环

1. 执行栈中的同步代码，执行栈为空，处理任务队列
2. 任务队列（异步任务），分为宏任务和微任务
3. 清空本次事件循环中的微任务
4. 从宏任务队列取出一个宏任务，放入调用栈执行

**① 同步任务**

- `new Promise((resolve, reject) => {...})`，`resolve` 或 `reject` 调用会触发 `Promise` 状态变化，但不会立即执行 `.then` 等回调
- `console.log` 等

**② 微任务**

- `Promise` 回调：`.then()、.catch()、.finally()`


- `MutationObserver` 回调：监听 DOM 变化的回调
- `process.nextTick`（`Node` 环境）
- `queueMicrotask`：显式将函数放入微任务队列

**③ 宏任务**

1. 整个 `script` 脚本
2. `setTimeout` 和 `setInterval`
3. `setImmediate`（Node 环境）
3. 事件监听回调：如 `onclick`、`onload`
4. I/O 操作：如网络请求、文件读写
5. UI 渲染：如浏览器重绘、重排

⚠️注意：在所有任务开始的时候，由于宏任务中包括了 `script`，所以浏览器会先执行一个宏任务，在这个过程中你看到的延迟任务(例如 `setTimeout` )将被放到下一轮宏任务中来执行。

### `.then()`

`.then()` 返回 `Promise` 对象

**(1) `.then(函数)`**

1. 如果原始 `Promise` 是 `fulfilled`，调用 `onFulfilled`；
2. 如果原始 `Promise` 是 `rejected` 且提供了 `onRejected`，调用 `onRejected`。
3. `.then()` 中，只有你传了第二个参数，它才会处理 `rejected`。否则，`rejected` 的处理必须通过 `.catch()` 来完成。

```js
Promise.reject('boom!')
  .then(res => console.log(res));  // 没有第二个 rejected 回调，必须由 .catch() 处理
// 对于 rejected 的 Promise，就会 Uncaught (in promise) ...[写 reject() 函数的参数]。
// Uncaught (in promise) boom!
```

`throw new Error()`，新 `Promise`状态为 `rejected`，值为抛出的错误对象。

**显示调用 `return`**

**① 返回任意一个非 `Promise` 的值都会调用 `Promise.resolve()` 包装成 `Promise` 对象；没有显式 `return`，值为 `undefined`。**

② `.then` 或 `.catch` 返回的值不能是 `Promise` 本身，否则会造成死循环。

```js
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err)
// 结果报错
```
**(2) `.then(非函数)`**

**如果 `.then()` 的参数不是函数，应该被忽略并透传！新 `Promise` 继承前一个 `Promise` 的状态和值。**

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

1
```

## 代码输出题

### 简单题

`new Promise((resolve, reject) => {})` 立即执行。`resolve()` 和 `reject()` 函数调用也立即执行。

放在 `fn(() => new Promise())` 函数里，要等函数调用才会执行。

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
	console.log(3);  // 没有调用 resolve, reject 回调函数，Promise 状态为 pending，.then 不会处理
});
console.log(4);
1 2 4
```

【第4题】

```js
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);

// 结果
'promise1'
'1' Promise{<resolved>: 'resolve1'}
'2' Promise{<pending>}
'resolve1'
```

【第14题】

`Promise` 状态一经改变就不会再变。

`.catch()` 返回 `Promise` 对象，没有显示返回 `return`，`.then()` 接收的值为 `undefined`。

```js
const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
.then(res => {
    console.log("then1: ", res);
  }).then(res => {
    console.log("then2: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  }).then(res => {
    console.log("then3: ", res);
  })
'catch: error'
'then3: undefined'
```

### 错误处理

1. `.then()` 只能处理上一个 `Promise` 传递的错误，`then()` 里面的错误只能被 `catch` 捕获
2. `then(() =>{})` 里面如果直接报错 `throw new Error()`，没有 `return`，`Promise` 状态为 `rejected`，错误交给 `catch` 处理
3. `then(() => {})` 通过 `return new Error()`，会被包成 `Promise.resolve`
4. `.catch()` 类比为全局错误兜底，`.then()` 处理错误的回调函数处理了，则不会再传入 `.catch`

```js
// 没写 .then 的错误处理
Promise.reject('err!!!')
  .then(res => console.log(res))      // 没有处理错误
  .catch(err => console.log('catch', err)) // ✅ 执行
// 错误在 .then() 的 success 分支中抛出
Promise.resolve()
  .then(() => {
    throw new Error('fail')          // 这里抛出的异常会传给 catch
  })
  .catch(err => console.log('catch', err))
```

【第xx题】

只要抛出错误 `Promise` 状态就变为 `rejected`，并将错误原因传递给 `Promise`。

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')  // ❗❗❗只要抛出错误 Promise 状态就变为 rejected，并将错误原因传递给 Promise
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)

'promise1' Promise{<pending>}
'promise2' Promise{<pending>}
test5.html:102 Uncaught (in promise) Error: error!!! at test.html:102
'promise1' Promise{<resolved>: "success"}
'promise2' Promise{<rejected>: Error: error!!!} 
```

【第18题】

返回任意一个非 `Promise` 的值都会调用 `Promise.resolve()` 包装成 `Promise` 对象。

```js
Promise.resolve().then(() => {
  return new Error('error!!!')  // 被包裹成了 return Promise.resolve(new Error('error!!!'))
}).then(res => {
  console.log("then: ", res)
}).catch(err => {
  console.log("catch: ", err)
})
"then: " "Error: error!!!"
```

【第21题】

`.then` 函数中的两个参数，第一个参数是用来处理成功的函数，第二个则是处理失败的函数。

**`Promise.resolve('xxx')` 的值会进入成功的函数，`Promise.reject('xxx')` 的值会进入失败的函数。**

```js
Promise.reject('err!!!')
  .then((res) => {
    console.log('success', res)
  }, (err) => {
    console.log('error', err)
  }).catch(err => {
    console.log('catch', err)  // .then() 里已经处理了错误，这个错误就不会再传到 .catch() 中了
  })
  
'error' 'err!!!'
```

【第22题】

`Promise` 调用的是 `resolve()`，那么 `.then()` 执行的是 `success()`，而 `success()` 函数抛出一个错误，它会被后面的 `catch()` 捕获到，而不是被 `fail1` 函数捕获。

**`throw new Error('error!!!')` 抛出的是错误对象，打印错误对象，控制台会自动展开 `Error:message(错误信息)`。**

```js
Promise.resolve()
  .then(function success (res) {
    throw new Error('error!!!')
  }, function fail1 (err) {
    console.log('fail1', err)
  }).catch(function fail2 (err) {
    console.log('fail2', err)
  })
  
fail2 Error: error!!!
	at success
```

### `.finally()`

1. `.finally()` 不管 `Promise` 对象最后的状态如何都会执行。
2. `.finally()` 的回调函数不接受任何的参数，也就是说你在 `.finally()` 函数中是没法知道 `Promise` 最终的状态是 `resolved` 还是 `rejected` 的。
3. `.finally()` 最终默认返回上一次的 `Promise` 对象值，如果抛出的是一个异常则返回异常的 `Promise` 对象。
4. `.finally()` 内部是通过 `.then()` 实现的。
5. 不同 `Promise` 实例的 `.finally().then().catch()` 链式调用，`.finally()` 和 `.then().catch()` 是同一轮，等这一轮执行完，才会执行后面的 `.finally().tahn().catch()`（描述还不够准确）

```js
Promise.prototype.then = function(cb) {
  let p = this.constructor
  return p.then(val => Promise.resolve(cb()).then(() => val), 
  err => Promise.resolve(cb()).then(() => { throw err})
  )
}
```

【第23题】

```js
Promise.resolve('1')
  .then(res => {
    console.log(res)  // 第1个微任务
  })
  .finally(() => {
    console.log('finally')  // 第2个微任务
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')  // 第1个微任务
  	return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)  // 第2个微任务
  })
// ❓❓❓ 为什么 'finally2' 在 'finally' 之前 ❓❓❓
'1'
'finally2'
'finally'
'finally2后面的then函数' '2'
```

【第24题】

微任务链式调用是串行的，链式中的下一个 `.finally` 不会提前插队；链式调用中，后续的 `.finally` 是当前 `.then` 的**回调函数执行完之后**才会被调度。

```js
function promise1 () {
  let p = new Promise((resolve) => {
    console.log('promise1');
    resolve('1')
  })
  return p;
}
function promise2 () {
  return new Promise((resolve, reject) => {
    reject('error')
  })
}
promise1()
  .then(res => console.log(res))  // 第1个微任务
  .catch(err => console.log(err))
  .finally(() => console.log('finally1'))  // 第3个微任务 // 代码并不会接着往链式调用的下面走，也就是不会先将 .finally 加入微任务列表，因为 .then 本身就是一个微任务，它链式后面的内容必须得等当前这个微任务执行完才会执行，因此这里我们先不管 .finally

promise2()
  .then(res => console.log(res))
  .catch(err => console.log(err))  // 第2个微任务
  .finally(() => console.log('finally2'))  // 第4个微任务
'promise1'
'1'
'error'
'finally1'
'finally2'
```

【第40题】

- `.finally` 不管 `Promise` 的状态是 `resolved` 还是 `rejected` 都会执行，且它的回调函数是接收不到`Promise` 的结果的，所以 `.finally` 中的 `res` 是一个迷惑项。
- 最后一个定时器打印出的 `p1` 其实是 `.finally` 的返回值，**`.finally` 的返回值如果在没有抛出错误的情况下默认会是上一个 `Promise` 的返回值。**而这道题中 `.finally` 上一个 `Promise` 是 `.then`，但是这个 `.then` 并没有返回值，所以 `p1` 打印出来的 `Promise` 的值会是 `undefined`。

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('resolve3');
    console.log('timer1')
  }, 0)
  resolve('resovle1');
  resolve('resolve2');
}).then(res => {
  console.log(res)
  setTimeout(() => {
    console.log(p1)  // 打印的是 .finally 的 Promise
  }, 1000)
}).finally(res => {
  console.log('finally', res)
})

'resolve1'
'finally' undefined
'timer1'
Promise{<resolved>: undefined}
```

### `Promise.all()`、`Promise.race()`

```js
const p = Promise.all([p1, p2, p3]);
```

`p1,p2,p3` 如果不是 `Promise` 实例，会调用 `Promise.resolve()` 将 `p1,p2,p3` 包装成 `Promise` 实例。

1. 只有 `p1,p2,p3` 的状态都变成 `fulfilled`，`p` 的状态才会变成 `fulfilled`，**此时 `p1,p2,p3` 的返回值组成一个数组，传递给 `p` 的回调函数。**
2. 只要 `p1,p2,p3` 之中有一个被 `rejected`，`p` 的状态就变成 `rejected`，此时**第一个被 `reject` 的实例的返回值，会传递给 `p` 的回调函数。即使 `p` 已经 `rejected`，其他 `p` 仍会继续执行，直到它们各自决议。**

```js
const p = Promise.race([p1, p2, p3, ...])
```

1.  返回一个新的 `Promise`，这个 `Promise` 的状态和值取决于**传入的 `Promise` 数组中第一个决议的 `Promise`**（无论是 `fulfilled` 还是 `rejected`）。
2. 一旦某个 `p` 决议，`Promise.race()` 的结果就确定，后续的 `p2,p3...` 状态变化不会影响 `Promise.race() `的结果。
3. `Promise.race()` 不会取消或阻止其他 `p` 的执行。其他 `p` 仍然会继续运行，直到它们各自决议，只是结果会被抛弃。

【第25题】

`Promise.all([p1, p2, p3...])`的状态全变成 `fulfilled`，`p` 的状态才会变成 `fulfilled`，**此时 `p1,p2,p3` 的返回值组成一个数组，传递给 `p` 的回调函数。**

```js
function runAsync (x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
    return p
}
Promise.all([runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log(res))
1
2
3
[1, 2, 3]
```

【第26题】

`Promise.all([p1,p2,p3...])` 有一个被 `rejected`，返回的 `Promise` 状态则变为 `rejected`，其他 `p2,p3...` 仍会继续执行，直到它们各自决议。

```js
function runAsync (x) {
  const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
  return p
}
function runReject (x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x))
  return p
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then(res => console.log(res))
  .catch(err => console.log(err))

1
3
2
Error: 2
4
```

【第27题】

`Promise.race([p1,p2,p3,...])` 接收一组异步任务，然后并行执行异步任务，**只保留取第一个执行完成的异步操作的结果，其他的方法仍在执行，不过执行结果会被抛弃。**

```js
function runAsync(x) {
  const p = new Promise(r =>
    setTimeout(() => r(x, console.log(x)), 1000)
  );
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) =>
    setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
  );
  return p;
}
Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log("result: ", res))
  .catch(err => console.log(err));
0
'Error: 0'
1
2
3
```

### 结合 `setTimeout()`

【第9题】

宏任务按顺序执行，但要先清空微任务队列。`Promise.resolve().then()` 微任务先执行。**微任务会在本轮事件循环中执行，而不是等所有宏任务执行完。**

```js
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(() => {
    console.log('promise')  // 在本轮事件循环中执行完，所以先于 timer2
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')
'start'
'timer1'
'promise'
'timer2'
```

【第10题】

```js
Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {  // 第2个宏任务
    console.log('timer2')
  }, 0)
});
const timer1 = setTimeout(() => {  // 第1个宏任务
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
console.log('start');
'start'
'promise1'
'timer1'
'promise2'
'timer2'
```

【第17题】

`Promise` 的 `.then` 或者 `.catch` 可以被调用多次，但这里 `Promise` 构造函数只执行一次。或者说 `Promise` 内部状态一经改变，并且有了一个值，那么后续每次调用 `.then` 或者 `.catch` 都会直接拿到该值。

事件循环会一次性清空微任务队列，执行时间差非常小。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('timer')
    resolve('success')
  }, 1000)
})
const start = Date.now();
promise.then(res => {
  console.log(res, Date.now() - start)  // 不是很理解这个的计算
})
promise.then(res => {
  console.log(res, Date.now() - start)
})

'timer'
'success' 1001
'success' 1002
```

### `async` 和 `await`

1. `async` 里面的同步代码同步执行，遇到 `await` 暂停执行后面的代码，将控制权还给主线程，等待异步操作完成再继续执行。
   1. 如果在 `async p1()` 里面有 `await async p2()` 这样的形式，要等 `p2()` 后面的同步代码执行完，才会回头执行 `p1 await` 后面的同步代码。
2. `async` 始终返回一个 `Promise` 对象，如果非 `Promise`，会调用 `Promise.resolve()` 包装。

3. `await` 必须**等待异步操作（通常是 `Promise`）的结果才会继续执行**后面的代码。
4. `await` 不是所有异步操作结果都会执行，如果 `await` 的 `Promise` 是 `rejected`，且没有 `try...catch`，它会直接抛出异常，中断执行！
5. `await` 如果后面跟微任务，微任务的优先级会高于普通的微任务。

```js
async function async1 () {
  console.log('async1 start');
  // await 得不到结果，会一直挂起，后面代码不会执行
  await new Promise(resolve => {  // 只是定义了 resolve 参数，并没有调用它！！！
    console.log('promise1')
    // resolve() 没有被调用！因此 Promise 状态为 pending
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')

'srcipt start'
'async1 start'
'promise1'
'srcipt end'
```

【第29题】

**`await` 执行完成的关键是 `Promise` 是否完成，而不在乎是否等 `setTimeout()` 执行完。**

定时器始终还是最后执行的，它被放到下一条宏任务的延迟队列中。

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  setTimeout(() => {
    console.log('timer')
  }, 0)
  console.log("async2");
}
async1();
console.log("start")
'async1 start'
'async2'
'start'
'async1 end'
'timer'
// 我把 'async1 end' 放到最后了
```

【第30题】

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end"); // 同步代码优先于宏任务
  setTimeout(() => {
    console.log('timer1')  // 宏3
  }, 0)
}
async function async2() {
  setTimeout(() => {
    console.log('timer2')  // 宏1
  }, 0)
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log('timer3')  // 宏2
}, 0)
console.log("start")
'async1 start'
'async2'
'start'
'async1 end'
'timer2'
'timer3'
'timer1'
// 'async1 end' 我写在 timer3 后面了
```

【第34题】

```js
async function async1() {
  console.log("async1 start");
  await async2();  // 后面代码会继续执行
  console.log("async1 end");  // 我以为这段代码不会执行，await async2() 里的 Promise 为 pending
}

async function async2() {
  console.log("async2");  // 里面默认返回 Promise.resolve(undefined)
}

console.log("script start");

setTimeout(function() {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log('script end')

'script start'
'async1 start'
'async2'
'promise1'
'script end'
'async1 end'
'promise2'
'setTimeout'
```

【第35题】

`await` 如果后面跟微任务，微任务的优先级会高于普通的微任务。

所以先执行完 `v1` 并打印 `v1`；进入 `v2` 遇到 `await` 将控制权交还给主线程，运行 `promise.then()`。

```js
async function testSometing() {
  console.log("执行testSometing");
  return "testSometing";
}

async function testAsync() {
  console.log("执行testAsync");
  return Promise.resolve("hello async");
}

async function test() {
  console.log("test start...");
  const v1 = await testSometing();  // 遇到await，执行完同步，将控制权还给主线程
  console.log(v1);  // 类似微1
  const v2 = await testAsync();
  console.log(v2);  // 类似微3
  console.log(v1, v2);
}

test();

var promise = new Promise(resolve => {
  console.log("promise start...");
  resolve("promise");
});
promise.then(val => console.log(val));  // 微2

console.log("test end...");

'test start...'
'执行testSometing'
'promise start...'
'test end...'
'testSometing'
'执行testAsync'
'promise'
'hello async'
'testSometing' 'hello async'
```

【第37题】

`async1()` 同步代码执行，遇到 `await` 会暂停后面代码执行，将控制权还给主线程。

`await Promise.reject('error!!!')` 还是微任务。

```js
async function async1 () {
  try {
    await Promise.reject('error!!!')
  } catch(e) {
    console.log(e)
  }
  console.log('async1');
  return Promise.resolve('async1 success')
}
async1().then(res => console.log(res))
console.log('script start')

'script start'
'error!!!'
'async1'
'async1 success'
```

【第39题】

```js
const async1 = async () => {
  console.log('async1');
  setTimeout(() => {
    console.log('timer1')
  }, 2000)
  await new Promise(resolve => {
    console.log('promise1')  // 没有调用 resolve() Promise 状态为 pending
  })
  // await 状态挂起，后面代码不会执行
  console.log('async1 end')
  return 'async1 success'
} 
console.log('script start');
async1().then(res => console.log(res));  // async1() 函数调用才执行。
console.log('script end');
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(() => {
  console.log('timer2')
}, 1000)

'script start'
'async1'
'promise1'
'script end'
1
'timer2'
'timer1'
```

#### `async` 和 `await` 中的错误

**`await` 不是所有异步操作结果都会执行，如果 `await` 的 `Promise` 是 `rejected`，且没有 `try...catch`，它会直接抛出异常，中断执行！**

`try...catch`：`try` 语句要执行，如果出错会进入 `catch` 执行语句。

【第36题】

对于 `rejected` 的 `Promise`，就会 `Uncaught (in promise) ...[写 reject() 函数的参数]`。

```js
async function async1 () {
  await async2();
  console.log('async1');
  return 'async1 success'
}
async function async2 () {
  return new Promise((resolve, reject) => {
    console.log('async2')
    reject('error')
  })
}
async1().then(res => console.log(res))

// 结果
'async2'
Uncaught (in promise) error
```