# Vue 进阶

## Vue 理解

Vue 是一套用于构建用户界面的**渐进式MVVM框架**，是一个开源的 JavaScript 框架，也是一个创建单页应用的 Web 应用框架。

> 渐进式的含义：没有多做职责之外的事，只做了自己该做的事，没有做不该做的事。

Vue 包含了声明式渲染、组件化系统、客户端路由、大规模状态管理、数据持久化、构建工具、跨平台支持等，但在实际开发中，并没有强制要求开发者使用某一特定功能，而是根据需求逐渐扩展。

Vue所关注的核心是 MVC 模式中的视图层，同时，它也能方便地获取数据更新，并通过组件内部特定的方法实现视图与模型的交互。

Vue 的核心库只关心视图渲染，且由于渐进式的特性，Vue 便于与第三方库或既有项目整合。

1. Vue 实现了一套声明式渲染引擎，并在 runtime 或者预编译时将声明式的模板编译成渲染函数，挂载在观察者 Watcher 中；
2. 在渲染函数中（touch），响应式系统使用响应式数据的 getter 方法对观察者进行依赖收集（*Collect as Dependency*）；
3. 使用响应式数据的 setter 方法通知（notify）所有观察者进行更新，此时观察者 Watcher 会触发组件的渲染函数（*Trigger re-render*）；
4. 组件执行的 render 函数，生成一个新的 *Virtual DOM Tree*；
5. 此时 Vue 会对新老 *Virtual DOM Tree* 进行 Diff，查找出需要操作的真实 DOM 并对其进行更新。

## Vue2 和 Vue3 区别

1. 响应式系统（*Reactivity System*）
2. `Composition API`，**使用函数**而不是对象
3. 性能优化：  
   1. 虚拟 DOM 的优化：diff 算法优化、静态节点提升、*Patch Flag* 减少虚拟 DOM 对比开销
      1. 静态提升（*Static Hoisting*）：对不参与更新的元素，只会被创建一次，在渲染时直接复用
   2. 事件监听缓存
   3. 更好的 TypeScript 支持
   4. 新编译器
4. 更小的包体积：`Tree Shaking`

### Composition API 和 Options API

(1) 组合式 API 定义

组合式 API (*Composition API*) 是一系列 API 的集合，使我们可以**使用函数而不是声明选项的方式**书写 Vue 组件。

> 是一个概括性的术语，涵盖以下 API：响应式 API、生命周期钩子、依赖注入。
>

(2) 组合式 API 好处

1. 更优的逻辑复用和代码组织。如组合式函数优于  `Mixins`，因为 `Mixins` 存在命名冲突和数据来源不清晰的问题。
2. 更好的类型推导。选项式 API 的类型推导在处理 `mixins` 和依赖注入类型时不够理想。
3. 更小的生产体积。
   1. 对 `tree-shaking` 友好，代码也更容易压缩。
   2. 不需要 `this` 使用，减少 `this` 指向不明的情况。不像选项式 API 需要依赖 `this` 上下文对象访问属性。

### Tree Shaking

`TreeShaking`（专业术语叫 *Dead code elimination*）是一种通过清除多余代码方式来优化项目打包体积的技术。

（1）演变

在 Vue2 中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是 Vue 实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到。

Vue3 中引入 `tree shaking` 特性，将全局 API 进行分块。如果不使用其某些功能，它们将不会包含在基础包中。

（2）实现

基于 ES6 模块语法（`import` 与 `export`），借助 ES6 模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输入和输出的变量。

1. 编译阶段利用 ES6 Module 判断哪些模块已经加载；
2. 判断哪些模块和变量未被使用或者引用，进而删除对应代码。

## 虚拟DOM❗⭐

### (1) 概念

虚拟 DOM（*virtual Dom*）是一个 JavaScript 对象，它是对真实 DOM 的抽象表示。每个虚拟节点 `VNode` 描述了一个真实 DOM 节点的结构、属性、事件等信息。至少包含标签名 `tag`、属性 `attrs`、子元素对象 `children` 三个属性。

真实 DOM 的属性很多，操作代价昂贵；虚拟 DOM 只是普通 JavaScript 对象，描述属性并不需要很多，创建开销很小。

### (2) 工作原理

1. **模板编译为 render 函数**：Vue 会将组件模板（如 `<div>{{ msg }}</div>`）编译成 `render` 函数，内部通过 `h` 函数创建虚拟 DOM 节点：

   ```js
   <div>{{ msg }}</div>
   return h('div', {}, [msg]);  // h 函数是 Vue 提供的创建虚拟节点的方法
   ```

2. **生成虚拟 DOM 树**：`render` 函数执行时，会返回一个虚拟 DOM 树，它是 JavaScript 对象形式的 DOM 描述。

3. **响应式驱动更新**：当组件状态（如响应式数据 `msg`）发生变化时，Vue 会重新执行 `render` 函数，生成新的虚拟 DOM 树。

4. **Diff 算法对比新旧虚拟 DOM**：Diff 算法（基于同层比较、key 优化等）找出新旧虚拟 DOM 之间的差异（最小修改集）。

5. **Patch 更新真实 DOM**：最后，Vue 会将这些变化应用到真实 DOM 上，完成视图的高效更新。

> 1. `h()` 创建虚拟 DOM 节点 `VNode`
> 2. `render()` 渲染 | 挂载 `VNode` 到真实 DOM

### `h` 和 `render` 函数 

`h()` 函数（`hyperscript`，能生成 HTML 的 JavaScript）用于创建虚拟 DOM 节点 `VNode` 的工厂函数。

> 在 Vue3 中，`h` 是 `createVNode()` 的别名。

```js
h(type, props, children)
```

- `type`：字符串或组件对象，表示要创建的 HTML 标签或组件。
- `props`：可选的属性对象，包含要传递给组件或元素的属性。
- `children`：可选的子节点，可以是字符串、虚拟 DOM 节点数组或嵌套的 `h` 函数调用。

```js
// 示例
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

`render()` 将 `VNode` 转换为真实 DOM，并挂载到指定的容器中。

```js
import { render, h } from 'vue'
const vnode = h('div', 'Hello World')
const container = document.getElementById('app')

render(vnode, container)
```

## Diff 算法❗⭐

Vue 通过 Virtual DOM 和 Patch 算法，实现对视图的高效更新。其核心是基于**同层级对比的 Diff 算法**，避免跨层级比较，最大限度减少真实 DOM 操作。

### （1）核心原则

1. 同层比较：Diff 算法只在相同层级节点中进行，不做跨层级对比，避免性能损耗。
2. 双端比较优化：通过双指针从头尾同时进行比较，提高效率。
3. 节点复用 + 最小移动：通过 key 来复用节点，并借助最长递增子序列（LIS）优化 DOM 的移动次数。

### （2）核心函数

① `patch(n1, n2, container)` 负责对新旧虚拟节点进行比较与处理

1. 若类型不同（如标签名、`VNode` 类型），则直接卸载旧节点，挂载新节点
2. 若类型相同，根据 `shapeFlag` 区分节点种类，分流处理
   1. 元素节点：调用 `patchElement`
   2. 组件节点：调用 `processComponent`
   3. 文本节点：更新文本内容
   4. Fragment：进入子节点比较（`patchChildren`）

> `shapeFlag`：`VNode` 上的位运算标志位，用于快速识别节点类型。

② `patchChildren()` 对新旧 `VNode` 的子节点进行对比与处理

1. 文本子节点：新子节点为文本，直接用 `setElementText` 更新文本
2. 数组子节点：新旧都是数组，调用 `patchKeyedChildren`
3. 空子节点：新为 `null`，卸载旧子节点；反之则挂载

③ `patchKeyedChildren(c1, c2, container)`

这是 Diff 核心函数，使用**双端 Diff 算法**（双指针 + `keyMap` + LIS）处理新旧子节点数组，执行精细的更新。

1. 头尾比较（*Head-to-head / Tail-to-tail*）：利用双指针 `i` 和 `e1/e2` 从两端向中间比较，节点类型相同则递归 `patch`。


2. 新旧长度不一致处理
   1. 若旧节点处理完，剩下的是新增节点 → `mount` 新节点；
   2. 若新节点处理完，旧的多了 → `unmount` 多余节点。
3. 中间乱序部分处理
   1. 构建 `keyToNewIndexMap`：快速查找新节点在新数组中的位置；
   2. 遍历旧节点，找出是否可复用（通过 `isSameVNodeType` 判断）；
   3. 找不到对应的新节点 → 卸载；
   4. 找到 → `patch` 并记录位置关系用于移动优化。
4. LIS 优化节点移动
   1. 计算数组的最长递增子序列，用于确定新节点中哪些节点可以保持原位，减少移动操作。
   2. LIS 算法将节点移动的复杂度从 `O(n²)` 降低到 `O(n log n)`，显著提高性能。

`key`：`VNode` 中用于标识节点身份的字段，是 Diff 是否能复用节点的关键依据。

`isSameVNodeType(n1, n2)`：判断两个虚拟节点是否“相同”，通常通过 `type` 和 `key` 决定。

## 响应式原理

[Vue2 和 Vue3 的响应式原理](https://juejin.cn/post/7124351370521477128?searchId=20250429095943CA4362490822A8E8C5CD#heading-1)

Vue2 通过 `Object.defineProperty`，Vue3 通过 `Proxy` 来实现数据响应式。

1. 数据绑定：视图与数据的同步更新，避免了手动操作 DOM 的繁琐和易出错性。
2. 依赖追踪：当数据变化时，自动更新依赖的组件或者计算属性。

Vue2

1. 对对象进行**递归遍历**，使用 `Object.defineProperty` 劫持每个属性的 `getter` 和 `setter`。
2. 当属性被读取时（`getter` 触发），Vue 会**收集依赖**，把当前的副作用函数（比如渲染函数）存入依赖收集器（`Dep`）。
3. 当属性发生变化（`setter` 触发）时，会通过 `Dep` 通知所有的依赖，**触发更新**。

Vue3

1. 使用 `Proxy` 创建响应式对象，对 `get` 和 `set` 操作进行统一拦截。
2. 读取属性时触发 `get`，Vue 会调用 `track` 函数进行**依赖收集**，记录当前活跃的副作用函数（effect）。
3. 修改属性时触发 `set`，Vue 会调用 `trigger` 函数，通知所有依赖进行**重新执行**，完成更新。
4. 所有副作用函数由 `effect` 包装，并通过调度器（scheduler）进行优化批处理，避免重复执行。

### Vue2 的响应式原理

`Object.defineProperty` 为对象中的每个属性都定义 `getter` 和 `setter`。

- `getter`：当某个响应式属性的值被读取时触发，用于**收集依赖（`Watcher`）**
- `setter`：当属性值被修改时触发，**通知依赖更新（触发视图更新）**

```js
/**
* 这里的函数 defineReactive 用来对 Object.defineProperty 进行封装。
**/
function defineReactive(data, key, val) {
   // 依赖存储的地方
   const dep = new Dep()
   Object.defineProperty(data, key, {
       enumerable: true,
       configurable: true,
       get: function () {
           // 在 getter 中收集依赖
           dep.depend()
           return val
       },
       set: function(newVal) {
           val = newVal
           // 在 setter 中触发依赖
           dep.notify()
       }
   }) 
}
```

`Watcher` 就是依赖，也就是要用到 `getter` 属性的地方。哪个 `Watcher` 触发 `getter`，才会被收集依赖，存储到 `Dep`。

```js
/**
* 我们所讲的依赖其实就是 Watcher，我们要通知用到数据的地方，而使用这个数据的地方有很多，类型也不一样，有* 可能是组件的，有可能是用户写的 watch，我们就需要抽象出一个能集中处理这些情况的类。
**/
class Watcher {
    constructor(vm, exp, cb) {
        this.vm = vm
        this.getter = exp
        this.cb = cb
        this.value = this.get()
    }

    get() {
        Dep.target = this
        let value = this.getter.call(this.vm, this.vm)
        Dep.target = undefined
        return value
    }

    update() {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
}
```

`Dep`：每个响应式属性都有一个对应的 `Dep` 实例，`Dep` 负责存储所有依赖这个属性的 `Watcher` 列表。

> 充当数据和 `Watcher` 之间的桥梁，完成 `getter` 和 `Watcher` 多对多的映射关系。

- 一个响应式数据可能被多个 `Watcher` 依赖
- 一个 `Watcher` 可能依赖多个响应式数据

```js
class Dep {
    constructor() {
        this.subs = []
    }
    
    addSub(sub) {
        this.subs.push(sub)
    }
    
    removeSub(sub) {
        remove(this.subs, sub)
    }

    depend() {
        if(Dep.target){
            this.addSub(Dep.target)
        }
    }

    notify() {
        const subs = this.subs.slice()
        for(let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

// 删除依赖
function remove(arr, item) {
    if(arr.length) {
        const index = arr.indexOf(item)
        if(index > -1){
            return arr.splice(index, 1)
        } 
    }
}
```

（1）为什么 Vue2 新增响应式属性要通过额外的 API

`Object.defineProperty` 只会对属性进行监测，而不会对对象进行监测，为了可以监测对象 Vue2 创建了一个 `Observer` 类。

`Observer ` 类的作用就是**把一个对象全部转换成响应式对象**，包括子属性数据，当对象新增或删除属性的时候负债通知对应的 `Watcher` 进行更新操作。

> `Observer` 类就是给一个对象也进行一个监测，因为 `Object.defineProperty` 是无法实现对对象的监测的，但这个监测是手动，不是自动的。

```js
// 定义一个属性
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

class Observer {
    constructor(value) {
        this.value = value
        // 添加一个对象依赖收集的选项
        this.dep = new Dep()
        // 给响应式对象添加 __ob__ 属性，表明这是一个响应式对象
        def(value, '__ob__', this)
        if(Array.isArray(value)) {
           
        } else {
            this.walk(value)
        }
    }
    
    walk(obj) {
        const keys = Object.keys(obj)
        // 遍历对象的属性进行响应式设置
        for(let i = 0; i < keys.length; i ++) {
            defineReactive(obj, keys[i], obj[keys[i]])
        }
    }
}
```

`vm.$set` 和 `vm.$delete` 的实现原理

```js
function set(target, key, val) {
    const ob = target.__ob__
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}

function del(target, key) {
    const ob = target.__ob__
    delete target[key]
    ob.dep.notify()
}
```

（2）`Object.defineProperty` 真的不能监听数组的变化吗？

可以监听数组变化，因为数组是特殊的对象，数组下标就是 `key`。

为了性能考虑，Vue2 放弃用该方法监听数组。无法通过索引下标、修改长度 `length` 来监听数组变化。

```js
const arr = [1, 2, 3]
arr.forEach((val, index) => {
  Object.defineProperty(arr, index, {
    get() {
      console.log('监听到了')
      return val
    },
    set(newVal) {
      console.log('变化了：', val, newVal)
      val = newVal
    }
  })
})
```

（3）Vue2 中是怎么监测数组的变化的？

使用拦截器覆盖 `Array.prototype`，之后再去使用 `Array ` 原型上的方法的时候，其实使用的是拦截器提供的方法，在拦截器里面才真正使用原生 `Array` 原型上的方法去操作数组。

重写数组原型方法 `push/pop/shift/unshift/splice/sort/reverse`。

```js
// 拦截器其实就是一个和 Array.prototype 一样的对象。
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function (method) {
    // 缓存原始方法
    const original = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {
        value: function mutator(...args) {
            // 最终还是使用原生的 Array 原型方法去操作数组
            const result = original.apply(this, args)
            // 获取 Observer 对象实例
            const ob = this.__ob__
            // 通过 Observer 对象实例上 Dep 实例对象去通知依赖进行更新
            ob.dep.notify()
        },
        eumerable: false,
        writable: false,
        configurable: true
    })
})
```

### Vue3 的响应式原理

通过 `Proxy` 对数据实现 `getter/setter` 代理，从而实现响应式数据。然后在副作用函数 `effect` 中读取响应式数据的时候，就会触发 `Proxy` 的 `getter`，在 `getter` 中会触发依赖收集，把当前的副作用函数添加到依赖列表中；响应式数据变化时，在 `setter` 中触发对应的副作用函数，从而实现自动更新。

（1）为什么需要 `ref`？

`Proxy` 无法代理原始类型，Vue 使用 `ref` 对原始值进行包装，变成一个带有 `.value` 的响应式对象。

原始值：`Number`、`BigInt`、`String`、`Symbol`、 `Boolean`、`undefined` 和 `null` 等类型的值。

（2）Vue3 中是怎么监测数组的变化？

通过 `Proxy` 统一拦截对象所有操作（包括数组索引、`length`、方法调用等）。

数组也是通过 `Proxy` 进行代理，因此可以直接监听数组的索引修改、`length` 变化、方法调用等。但也需要像 Vue2 那样对一些数组原型上方法进行重写。

### `Object.defineProperty()` 和 `Proxy`

（1）`Object.defineProperty()`

`Object.defineProperty()` 用于定义或修改对象的属性，包括属性的值、可写性、可枚举性、可配置性等。

1. 主要用于对**单个属性**进行细粒度的控制。需要**针对每个属性**分别进行定义，无法一次性处理多个属性。
2. 不能拦截对**对象整体**的访问或操作。
3. **数组变更检测弱**，不能监听索引、长度变化，只能重写数组变异方法，如 `push/pop/shift/unshift/splice/sort/reverse`。
4. 只能劫持**已有属性**，新增属性需用 `Vue.set | this.$set`。
5. 需**递归遍历每个属性**做劫持，性能较差。

```js
const obj = {};
Object.defineProperty(obj, 'name', {
  value: 'Alice',
  writable: true,
  enumerable: true,
  configurable: true,
});

console.log(obj.name); // Alice

Object.defineProperty(obj, 'name', {
  get() {
    return 'Bob';
  }
});

console.log(obj.name); // Bob
```

（2）`Proxy`

`Proxy` 创建一个代理对象，该对象可以拦截并自定义对目标对象的基本操作。

1. 支持拦截整个对象：可一次性拦截整个对象，无需逐个属性递归。
2. 全面拦截能力：提供了更多的拦截方法，支持 `get`、`set`、`deleteProperty` 等操作。
3. 支持属性新增与删除，无需 `Vue.set() | this.$set()`。
4. 数组变化检测：能监听索引变化、长度变化。
5. 自动递归嵌套对象，无需手动递归。
6. 更强的错误提示：如访问或修改不存在属性，会直接抛出错误，更易调试。

```js
const target = {
  name: 'Alice'
};

const handler = {
  get(target, property) {
    return property in target ? target[property] : 'Default';
  },
  set(target, property, value) {
    target[property] = value.toUpperCase();
    return true;
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // Alice
proxy.name = 'Bob';
console.log(proxy.name); // BOB
console.log(proxy.age); // Default
```

### 相关问题

（1）Vue 中，假设 `data` 中有一个数组对象，修改数组元素时，是否会触发视图更新？

会触发视图更新，但前提是使用响应式方法修改数组。

数组的 `push/pop/shift/unshift/splice/sort/reverse` Vue 对这些方法做了响应式拦截，修改后会自动更新视图。

```js
this.list[index] = newValue;  // Vue 3 是响应式的
this.list.splice(index, 1, newValue);  // Vue 2 中推荐这样
this.$set(this.list, index, newValue);
```

1. Vue 2 的响应式系统使用 `Object.defineProperty`，无法追踪数组索引变化和数组长度变化。

```js
this.list[0] = newValue;  // ❌ Vue2无法检测到
```

2. Vue3 通过 `Proxy` 能够更全面地拦截数组的变化，包括通过索引直接设置元素的操作。

（2）Vue2 动态给 `data` 添加一个新的属性时会发生什么？

控制台可以打印新属性，但是页面视图不更新。

```vue
<template>
  <p v-for="(value, key) in item" :key="key">{{ value }}</p>
  <button @click="addProperty">动态添加新属性</button>
</template>

<script>
new Vue({
  el: "#app",
  data() {
    return {
      item: {
        oldProperty: "旧属性"
      }
    }
  },
  methods: {
    addProperty() {
      this.item.newProperty = "新属性";  // ❌ 不会触发视图更新
      console.log(this.item);  // 控制台可以打印新属性，但是页面视图不更新。
    }
  }
})
</script>
```

Vue2 使用 `Object.defineProperty()` 实现响应式，**它只能对已存在的属性进行劫持**。如果在运行时向对象添加新的属性，该属性**不是响应式的**，视图不会更新。

```js
this.item.newProperty = '新属性';  // ❌ 页面不会更新
// 解决方式：
this.$set(this.item, 'newProperty', '新属性');
Vue.set(this.item, 'newProperty', '新属性');
```

Vue 3 改用 `Proxy` 实现响应式，**可以自动追踪新增属性**。

```js
this.item.newProperty = '新属性';  // ✅ 在 Vue 3 中页面会正常更新
```

（3）`data` 属性是一个函数而不是一个对象

如果是对象，使用同一个内存地址；采用函数返回对象的形式，函数返回的对象内存地址不同，避免多个实例共享同⼀数据引用。

## 响应式函数

### `ref` 和 `reactive`

（1）`ref`

`ref()` 用于创建一个**响应式的引用对象**。它可以是基本类型或复杂数据类型。返回一个包含 `.value` 属性的对象，通过该属性访问和修改其值。

`ref()` 会使它的值具备深层响应性，即嵌套多层对象、数组，变化也能被检测到。可以通过 `shallowRef` 来放弃深层性能响应。

**为什么使用 `ref.value`？**

Vue 的响应式系统的工作：在标准的 JavaScript 中，检测普通变量的访问或修改是行不通的。

可以通过 `getter` 和 `setter` 方法来拦截对象属性的 `get` 和 `set` 操作。`.value` 属性给予了 Vue 一个机会来检测 `ref` 何时被访问或修改。

```js
// 伪代码，不是真正的实现
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

（2）`reactive`

`reactive()`：用于对象、数组等复杂数据类型。`reactive()` 不需要 `.value`，它会将整个对象转化为响应式对象。

`reactive()` 深层嵌套依旧具备响应性，不等同于原始对象。`shallowReactive` 可以退出深层响应。

`ref` 和 `reactive` 在模板引用时不需要 `.value`，可以直接引用。

`reactive()` 有局限性，推荐用 `ref()`

- 有限值类型：适用于对象类型（对象、数组、map、set），不能用于原始类型
- 不能替换整个对象：会失去响应性
- 解构操作不友好：会失去响应性

```js
import { ref, reactive } from 'vue'

const count = ref(0)
const obj = reactive({ count: 1 })
const increment = () => {
  count.value++
  obj.count++
}
```

### `toRef` 和 `toRefs`

`toRef()`：将**响应式对象中的某个属性转换为一个响应式引用**。它适用于在 `setup` 函数中解构响应式对象时，保持响应性。

```
toRef(reactive响应式对象, 属性)
```

```js
import { ref, reactive, toRef } from 'vue';

const state = reactive({ count: 0 });
const countRef = toRef(state, 'count'); // 转换为响应式引用
countRef.value++; // 修改值
```

`toRefs()`：将一个**响应式对象的所有属性转换为响应式引用**，返回一个新对象。

```js
import { reactive, toRefs } from 'vue';

const state = reactive({ count: 0, name: 'Vue' });
const { count, name } = toRefs(state); // 解构为响应式引用
count.value++; // 修改 count
```

### `shallowRef` 和 `shallowReactive`

`shallowRef`：只改变第一层数据或整个数据。

`shallowReactive`：只改变第一层对象或整个对象。

场景：只需要整体改变而不关注内部深层属性的单一变化，可以使用。常常用于对大型数据结构的性能优化或是与外部的状态管理系统集成。

### `readonly` 和 `shallowreadonly`

只能传入响应式数据，也就是由 `ref()` 和 `reactive()` 定义的数据，不能直接传入数字、字符串等。

`shallowReadonly()` 只有根层级的属性变为了只读，第二层及后面层数据可以修改。

### `toRaw` 和 `markRaw`

`toRaw()` 可以返回由 `reactive()`、`shallowReactive()`、`readonly()`、`shallowReadonly()` 创建的代理对应的原始对象。`toRaw()` 返回的对象不是响应式的，不会引起视图的更新。

场景：用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。

`markRaw()` 将一个对象标记为不可被转为代理。返回该对象本身。也就是用 `reactive()` 等转换为响应式数据不奏效。

### `customRef`

`customRef()` 预期接收一个工厂函数作为参数，这个工厂函数接受 `track` 和 `trigger` 两个函数作为参数，并返回一个带有 `get` 和 `set` 方法的对象。

`track()` 依赖追踪。当调用 `get()` 时，Vue 会记录当前属性的访问情况，并将依赖它的组件或计算属性记录下来。

`trigger()` 负责触发更新。当调用 `set()` 时，属性的值发生改变，Vue会通知所有依赖这个属性的组件或计算属性，重新执行或重新渲染，以确保视图和数据同步。

```javascript
let initvalue = ''
let msg = customRef((track, trigger) => {
  	// 返回的是一个对象，里面包含get()和set()
    return {
      get() {
        track()
        return initValue  // 定义好初始值
      },
      set(value) {
        initValue = value
        trigger()
      }
    }
  }
```

## MVVM

（1）MVVM（`Model-View-ViewModel`）

- `Model`：数据层，代表应用的状态。
- `View`：视图层，用户界面部分，展示数据。
- `ViewModel`：中介层，负责处理视图与模型之间的绑定和交互。

（2）实现 MVVM

1. 数据绑定：响应式数据 `ref | reactive`；双向数据绑定 `v-model`；计算属性、侦听属性
2. 数据与视图的绑定：模板语法 `{{}}`
3. 视图模型(`ViewModel`)：Vue 实例，它将数据 `Model` 和视图 `View` 结合在一起
4. 更新机制：虚拟 DOM 和 Diff 算法

（3）双向绑定

1. `new Vue()` 首先执行初始化，对 `data` 执行响应化处理，这个过程发生 `Observe` 中
2. 对模板执行编译，找到其中动态绑定的数据，从 `data` 中获取并初始化视图，这个过程发生在 `Compile` 中
3. 定义⼀个更新函数和 `Watcher`，将来对应数据变化时 `Watcher` 会调用更新函数
4. 由于 `data` 的某个 `key` 在⼀个视图中可能出现多次，所以每个 `key` 都需要⼀个管家 `Dep` 来管理多个 `Watcher`
5. 将来 `data` 中数据⼀旦发生变化，会首先找到对应的 `Dep`，通知所有 `Watcher` 执行更新函数

![](.\vue2-images\双向绑定.jpg)

（4）单项数据流

数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的数据，只能请求父组件对原始数据进行修改。

> 可以防止从子组件意外改变父级组件的状态。
