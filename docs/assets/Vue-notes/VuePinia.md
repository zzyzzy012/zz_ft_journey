# Vue 状态管理

## Pinia🍍

### 开始

#### (1) 使用 Pinia

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

#### (2) Store

Store (如 Pinia) 是一个**保存状态和业务逻辑**的实体，它并不与你的组件树绑定。换句话说，**它承载着全局状态**。它有点像一个永远存在的组件，每个组件都可以读取和写入它。它有**三个概念**，`state`、`getter` 和 `action`，我们可以假设这些概念相当于组件中的 `data`、 `computed` 和 `methods`。

### 定义 Store

`defineStore()` 定义 Store，它的第一个参数要求是一个**独一无二的**名字。

1. 这个**名字** ，也被用作 *id* ，是必须传入的， Pinia 将用它来连接 store 和 devtools。为了养成习惯性的用法，将返回的函数命名为 `use...` 是一个符合组合式函数风格的约定。
2. 第二个参数可接受两类值：Setup 函数或 Option 对象。

定义 store 的命名格式推荐：以 `use` 开头且以 `Store` 结尾，比如 `useUserStore`，`useCartStore`，`useProductStore`。

```js
import { defineStore } from 'pinia'

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useAlertsStore = defineStore('alerts', {
  // 其他配置...
})
```

#### (1) *Option Store*

与 Vue 的选项式 API 类似，可以传入一个带有 `state`、`actions` 与 `getters` 属性的 Option 对象。

- `state` 是 store 的数据 `data`
- `getters` 是 store 的计算属性 `computed`
- `actions` 是 store 的方法 `methods`

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

#### (2) *Setup Store*

与 Vue 组合式 API 的 `setup` 函数相似，我们可以传入一个函数，该函数定义了一些**响应式属性和方法**，并且**返回一个带有我们想暴露出去的属性和方法的对象**。

**必须**在 *setup store* 中返回 **`state` 的所有属性**，不能在 store 中使用**私有属性**。

- `ref()` 就是 `state` 属性
- `computed()` 就是 `getters`
- `function()` 就是 `actions`

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

#### (3) 使用 Store

```javascript
<script setup>
import { useCounterStore } from '@/stores/counter'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore()
</script>
```

#### (4) 从 Store 解构

`Store` 是一个用 `reactive` 包装的对象，这意味着不需要在 `getters` 后面写 `.value`。就像 `setup` 中的 `props` 一样，**我们不能对它进行解构**。

为了从 `Store` 中提取属性时保持其响应性，推荐使用 `storeToRefs()`。它将为每一个响应式属性创建引用。

如果只使用 `Store` 的状态而不调用任何 `action` 时，它也会非常有用。可以直接从 `Store` 中解构 `action`，因为它们也被绑定到 `Store` 上。

- `storeToRefs()` 只关注 store 里面的数据而不关注方法；
- `toRefs()` 则不管数据和方法都统一包装成 `ref` 数据。

```vue
<script setup>
import { storeToRefs } from 'pinia'
const store = useCounterStore()
// `name` 和 `doubleCount` 是响应式的 ref
// 同时通过插件添加的属性也会被提取为 ref
// 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
const { name, doubleCount } = storeToRefs(store)
// 作为 action 的 increment 可以直接解构
const { increment } = store
</script>
```

**(・∀・(・∀・(・∀・) 解构问题 (・∀・(・∀・(・∀・)**

1. `ref`：`ref` 是一个独立的响应式对象，它的值存储在 `.value` 属性中，响应性是通过对 `.value` 的 getter 和 setter 拦截实现的。

   `ref` 的解构不需要特别处理，因为仍然可以访问 `.value`，因此可以保持响应性。

2. `reactive`：`reactive` 对象的响应性依赖于 Proxy 代理的整体对象结构。解构后，属性不再是 Proxy 的一部分，因此失去响应性。

   `reactive` 的解构需要借助 `toRefs` 或 `storeToRefs`，将属性转换为 `ref`，以保持响应性。

   `props` 和 Pinia 的 `state` 都是 `reactive` 对象，对其解构需要处理。

3. 严格来说，不是 `ref` 能解构而 `reactive` 不能解构，而是 `reactive` 的解构需要额外处理，否则会丢失响应性。

### State

#### (1) 访问 state

直接进行读写。

新的属性**如果没有在 `state()` 中被定义**，则不能被添加。它必须包含初始状态。

```js
const countStore = useCountStore()
countStore.sum
countStore.$state.sum
```

#### (2) 重置 state

选项式API：通过调用 `store` 的 `$reset()` 方法将 `state` 重置为初始值。在 `$reset()` 内部，**会调用 `state()` 函数来创建一个新的状态对象，并用它替换当前状态。**

```js
const store = useStore()

store.$reset()
```

在 *Setup Store* 中，需要创建自己的 `$reset()` 方法。

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function $reset() {
    count.value = 0
  }

  return { count, $reset }
})
```

#### (3) 变更 state

1. 直接读写。

2. 调用 `$patch` 方法。它允许你用一个 `state` 的补丁对象在同一时间更改多个属性。

   用这种语法的话，有些变更很难实现或者很耗时：**任何集合的修改**（例如，向数组中添加、移除一个元素或是做 `splice` 操作）都需要你创建一个新的集合。因此，`$patch` 方法也**接受一个函数**来组合这种难以用补丁对象实现的变更。

3. 调用 `store` 里面自己定义的 `actions` 方法修改 `state`。

```js
import { useCountStore } from '@/store/Count.vue'

const countStore = useCountStore()

// 1.直接修改
countStore.sum = 100
// 2.使用$patch，批量修改
countStore.$patch({
  sum: 200,
  name: '李四',
  age: '30岁'
})

// 如果修改数组或者对象，可以传入一个函数进行修改
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

```javascript
// 3.在Count.js的 actions 里面修改
import { defineStore } from 'pinia'
export const useCountStore = defineStore('count', {
  actions: {
    increment(value) {
      // this指向当前的Store实例
      this.sum += value
    }
  },
  state() {
    return {
      sum: 100,
      name: '张三',
      age: '18岁'
    }
  }
})

// 在Count.vue组件里调用
countStore.increment(n.value)
```

#### (4) 替换 state

**不能完全替换掉** `store` 的 `state`，因为那样会破坏其响应性。但是，你可以 `patch` 它。

```js
// 这实际上并没有替换`$state`
store.$state = { count: 24 }
// 在它内部调用 `$patch()`：
store.$patch({ count: 24 })
```

#### (5) 订阅 state

通过 `store` 的 `$subscribe()` 方法侦听 `state` 及其变化。比起普通的 `watch()`，使用 `$subscribe()` 的好处是 `subscriptions` 在 `patch` 后只触发一次。

`mutation` 原来的数据，`state` 变化的数据。在数据发生改变时调用。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 和 cartStore.$id 一样
  mutation.storeId // 'cart'
  // 只有 mutation.type === 'patch object'的情况下才可用
  mutation.payload // 传递给 cartStore.$patch() 的补丁对象。

  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('cart', JSON.stringify(state))
})
```

#### (6) 选项式 API 的用法

使用 `mapState()` 辅助函数将 `state` 属性映射为只读的计算属性。

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 可以访问组件中的 this.count
    // 与从 store.count 中读取的数据相同
    ...mapState(useCounterStore, ['count'])
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'count',
      // 你也可以写一个函数来获得对 store 的访问权
      double: store => store.count * 2,
      // 它可以访问 `this`，但它没有标注类型...
      magicValue(store) {
        return store.someGetter + this.count + this.double
      },
    }),
  },
}
```

### Getter

Getter 完全等同于 `store` 的 `state` 的计算值。通过 `defineStore()` 中的 `getters` 属性来定义它们。

**推荐**使用箭头函数，并且它将接收 `state` 作为第一个参数。

#### (1) 访问其他 getter

如果用到其他 `getter`，通过 **`this` 访问整个 `store` 实例**，从而访问其他 `getter`，**需要为这个 `getter` 指定一个返回值的类型**。

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 自动推断出返回类型是一个 number
    doubleCount(state) {
      return state.count * 2
    },
    // 返回类型**必须**明确设置
    doublePlusOne(): number {
      // 整个 store 的 自动补全和类型标注 ✨
      return this.doubleCount + 1
    },
  },
})
```

```vue
<script setup>
import { useCounterStore } from './counterStore'

const store = useCounterStore()
</script>

<template>
  <!-- 直接访问 -->
  <p>Double count is {{ store.doubleCount }}</p>
</template>
```

#### (2) 向 getter 传递参数

`getter` 只是计算属性，理论上不可以传递参数，但可以通过**从 `getter` 返回一个函数**，传递参数。

```js
export const useUserListStore = defineStore('userList', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

```vue
<script setup>
import { useUserListStore } from './store'
const userList = useUserListStore()
const { getUserById } = storeToRefs(userList)
// 请注意，你需要使用 `getUserById.value` 来访问
// <script setup> 中的函数
</script>

<template>
	<!-- getter 传递参数 -->
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

**`getter` 将不再被缓存。它们只是一个被你调用的函数。**可以在 `getter` 本身中缓存一些结果，虽然这种做法并不常见，但有证明表明它的性能会更好。

```js
export const useUserListStore = defineStore('userList', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```

#### (3) 访问其他 store 的 getter

直接导入其他 `store`，直接访问这个外部 `store` 的 `getter`。

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

#### (4) 使用选项式 API 的方法

```js
// 示例文件路径：
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount(state) {
      return state.count * 2
    },
  },
})
```

① 使用 `setup()` 钩子。导入 `store`，并 `return` 出去，在 `computed` 中通过 `this` 访问整个 `store` 实例。

```js
<script>
import { useCounterStore } from '../stores/counter'

export default defineComponent({
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    quadrupleCounter() {
      return this.counterStore.doubleCount * 2
    },
  },
})
</script>
```

② 不使用 `setup()` 钩子。使用 `mapState()` 函数来将其映射为 `getters`。

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 允许在组件中访问 this.doubleCount
    // 与从 store.doubleCount 中读取的相同
    ...mapState(useCounterStore, ['doubleCount']),
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCount',
      // 你也可以写一个函数来获得对 store 的访问权
      double: (store) => store.doubleCount,
    }),
  },
}
```

### Action

Action 相当于组件中的 `method`。通过 `defineStore()` 中的 `actions` 属性来定义，**并且它们也是定义业务逻辑的完美选择。**

类似 ` getters`，`action` 也可通过 `this` 访问**整个 `store` 实例**，并支持**完整的类型标注(以及自动补全)**。**不同的是，`action` 可以是异步的**，你可以在它们里面 `await` 调用任何 API，以及其他 `action`！

```js
export const useCounterStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
    randomizeCounter() {
      this.count = Math.round(100 * Math.random())
    },
  },
})
```

Action 可以像函数或者通常意义上的方法一样被调用。

```vue
<script setup>
const store = useCounterStore()
// 将 action 作为 store 的方法进行调用
store.randomizeCounter()
</script>
<template>
  <!-- 即使在模板中也可以 -->
  <button @click="store.randomizeCounter()">Randomize</button>
</template>
```

#### (1) 访问其他 store 的 action

导入其他 `store`，直接调用 `action` 方法。

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

#### (2) 使用选项式 API 的方法

① 使用 `setup()` 钩子。

```js
<script>
import { useCounterStore } from '../stores/counter'
export default defineComponent({
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('New Count:', this.counterStore.count)
    },
  },
})
</script>
```

② 不使用 `setup()` 钩子，可以使用 `mapActions()` 辅助函数将 `action` 属性映射为你组件中的方法。

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  methods: {
    // 访问组件内的 this.increment()
    // 与从 store.increment() 调用相同
    ...mapActions(useCounterStore, ['increment'])
    // 与上述相同，但将其注册为this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'increment' }),
  },
}
```

#### (3) 订阅 action

通过 `store.$onAction()` 来监听 `action` 和它们的结果。传递给它的回调函数会在 `action` 本身之前执行。`after` 表示在 `promise` 解决之后，允许你在 `action` 解决后执行一个回调函数。同样地，`onError` 允许你在 `action` 抛出错误或 `reject` 时执行一个回调函数。这些函数对于追踪运行时错误非常有用。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```

默认情况下，`action` 订阅器会被绑定到添加它们的组件上(如果 `store` 在组件的 `setup()` 内)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 `true` 作为第二个参数传递给 `action` 订阅器，以便将其从当前组件中分离。

```js
<script setup>
const someStore = useSomeStore()
// 此订阅器即便在组件卸载之后仍会被保留
someStore.$onAction(callback, true)
</script>
```

## 数据持久化存储

### [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)

#### (1) 安装

```
pnpm add pinia-plugin-persistedstate
```

将插件添加到 `pinia` 实例上。

```js
// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

#### (2) 使用

在创建 store 时，设置 `persist: true`。

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore(
  'main',
  () => {
    const someState = ref('hello pinia')
    return { someState }
  },
  {
    persist: true,
  },
)
```

#### (3) 配置 `persist`

`persist` 可以接收一个对象。

- `key`： 用于引用 `storage` 中的数据，默认使用 `store` 中的 ID。
- `storage`：数据存储位置，默认 `localStorage`，可以改为 `sessionStorage`。
- `paths`：指定 `state` 中哪些数据需要持久化。
- `serializer`：指定持久化时所使用的**序列化方法**，以及恢复 `store` 时的**反序列化方法**。
- `beforeRestore`：该 `hook` 将在从 `storage` 中恢复数据之前触发，并且它可以访问整个 `PiniaPluginContext`，这可用于在恢复数据之前强制地执行特定的操作。
- `afterRestore`：该 `hook` 将在从 `storage` 中恢复数据之后触发，并且它可以访问整个 `PiniaPluginContext`，这可用于在恢复数据之后强制地执行特定的操作。

```js
export const userUsersStore = defineStore('users', {
  state: () => {
    return {
      name: 'inkun',
      current: 1
    }
  },

  persist: {
    key: 'my-custom-key',
    storage: sessionStorage,
    paths: ['current'],
    serializer: {
      deserialize: parse,
      serialize: stringify,
    },
    beforeRestore: (ctx) => {
      console.log(`即将恢复 '${ctx.store.$id}'`)
    },
     afterRestore: (ctx) => {
      console.log(`刚刚恢复完 '${ctx.store.$id}'`)
    },
  }
})
```

多个持久化配置：通过数组的形式，为每个元素对象配置属性。

```js
import { defineStore } from 'pinia'

defineStore('store', {
  state: () => ({
    toLocal: '',
    toSession: '',
    toNowhere: '',
  }),
  persist: [
    {
      paths: ['toLocal'],
      storage: localStorage,
    },
    {
      paths: ['toSession'],
      storage: sessionStorage,
    },
  ],
})
```

#### (4) 全局配置

使用全局配置，就不用单独在每个 `store` 里面做配置，在使用 `pinia.use()` 的时候就可以通过 `createPersistedState` 函数设置。

`createPersistedState` 里的配置会将每个申明 `persist: true` 的 `store` 添加上配置，但是**每个单独 `store` 里的配置将会覆盖调全局声明中的对应项**。

全局配置支持以下属性：`storage`、`serializer`、`beforeRestore`、`afterRestore`。

```ts
// main.ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(
  createPersistedState({
    storage: sessionStorage,
    paths: ['current'],
  })
)
```

#### (5) 启用所有 Store 默认持久化

该配置将会使所有 `store` 持久化存储，且必须配置 `persist: false` 显式禁用持久化。

```js
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(
  createPersistedState({
    auto: true,
  })
)
```

### 强制恢复数据

每个 store 都有 `$hydrate` 方法来手动触发数据恢复。默认情况下，调用此方法还将触发 `beforeRestore` 和 `afterRestore` 钩子。但是可以通过配置方法来避免这两个钩子触发。

```js
const store = useStore()
// 从 storage 中获取数据并用它替换当前的 state
store.$hydrate({ runHooks: false })  // beforeRestore 和 afterRestore 钩子函数不会被触发
```

### 强制持久化

除了通过 `persist` 方式设置持久化，每个 `store` 都有 `$persist` 方法来手动触发持久化，这会强制将 `store state` 保存在已配置的 `storage` 中。

```js
import { defineStore } from 'pinia'

const useStore = defineStore('store', {
  state: () => ({
    someData: '你好 Pinia',
  }),
})

// App.vue
const store = useStore()

store.$persist()
```

### Vuex 页面刷新数据丢失怎么解决

数据持久化：使用 `vuex-persist` 插件。不需要你手动存取 `storage`，而是直接将状态保存至 `cookie` 或者 `localStorage` 中。

## Vuex

### 开始

1. Vuex 的状态存储是响应式的。当 Vue 组件从 `store` 中读取状态的时候，若 `store` 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
2. 你不能直接改变 `store` 中的状态。改变 `store` 中的状态的唯一途径就是显式地**提交（commit）mutation**。

```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* 根组件 */ })

// 将 store 实例作为插件安装
app.use(store)
```

通过 `store.state` 来获取状态对象，并通过 `store.commit` 方法触发状态变更。

```js
store.commit('increment')

console.log(store.state.count) // -> 1
```

在 Vue 组件中， 可以通过 `this.$store` 访问 `store` 实例。

```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

### State

Vuex 使用**单一状态树**，每个应用将仅仅包含一个 `store `实例。

在 Vue 组件中最好在计算属性中返回某个状态。

```js
// 创建一个 Counter 组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      // 在模块化中，需频繁导入
      return store.state.count
      return this.$store.state.count
    }
  }
}
```

组件中使用 `state`。

可以使用 `mapState` 辅助函数帮助我们生成计算属性。

当**映射的计算属性的名称与 `state` 的子节点名称相同**时，也可以给 `mapState` 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

### Getter

`getters` 对应 `store` 中的计算属性 `computed`。

接受 `state` 作为其第一个参数，接受**其他 `getter`** 作为第二个参数。

Getter 会暴露为 `store.getters` 对象，以属性的形式访问这些值。

```js
getters: {
  // ...
  doneTodosCount (state, getters) {
    return getters.doneTodos.length
  }
}
```

```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

可以通过让 `getter` 返回一个函数，来实现给 `getter` 传参。在你对 `store` 里的**数组进行查询**时非常有用。

`getter` 在通过方法访问时，每次都会去进行调用，而不会缓存结果。

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

```js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

`mapGetters` 辅助函数仅仅是将 `store` 中的 `getter` 映射到局部计算属性。

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

```js
// 如果你想将一个 getter 属性另取一个名字，使用对象形式
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

### Mutation

#### (1) 注册提交 `mutation`

**更改 Vuex 的 `store` 中的状态的唯一方法是提交 `mutation`。`mutation` 必须是同步函数。**

Vuex 中的 `mutation` 非常类似于事件：每个 `mutation` 都有一个字符串的**事件类型 (type)和一个回调函数 (handler)**。

这个回调函数就是我们实际**进行状态更改的地方**，接受 `state` 作为第一个参数。

```js
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```

需要以相应的 ` type` 调用 `store.commit` 方法，唤醒一个 `mutation` 处理函数。

不能直接调用一个 `mutation` 处理函数。这个更像是**事件注册：“当触发一个类型为 `increment` 的 `mutation` 时，调用此函数。”**

```js
store.commit('increment')
```

#### (2) 载荷

`mutation` **载荷（payload）**：可以向 `store.commit` 传入额外的参数。在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 `mutation` 会更易读。

```js
// 1. 传入额外参数
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

```js
store.commit('increment', 10)
```

```js
// 2. 传入载荷对象
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

```js
store.commit('increment', {
  amount: 10
})
```

#### (3) 对象风格的提交方式

直接使用包含 `type` 属性的对象，提交 `mutation`。

```js
store.commit({
  type: 'increment',
  amount: 10
})
```

当使用对象风格的提交方式，整个对象都作为载荷传给 `mutation` 函数，因此处理函数保持不变。

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

#### (4) 组件中提交 `mutation`

1. `this.$store.commit('xxx')` 提交 `mutation`
2. `mapMutations` 辅助函数将组件中的 `methods` 映射为 `store.commit` 调用（需要在根节点注入 `store`）

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

### Action

#### (1) 基本使用

Action 类似于 `mutation`，**提交的是 `mutation`，而不是直接变更状态。**可以包含任意**异步**操作。

Action 函数接受一个与 `store` 实例具有相同方法和属性的 `context` 对象。

- 因此可以调用 `context.commit` 提交一个 `mutation`；
- 或者通过 `context.state` 和 `context.getters` 来获取 `state` 和 `getters`；
- 还可以对 `context` 进行解构。

```js
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
    // 解构 context 对象
    increment ({ commit }) {
    commit('increment')
  }
  }
})
```

#### (2) 分发 `action`

`store.dispatch` 方法分发 `action`，支持异步，支持同样的**载荷方式和对象方式**进行分发。

```js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

```js
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

#### (3) 在组件中分发 `action`

1. `this.$store.dispatch('xxx')` 分发 `action`
2. `mapActions` 辅助函数将组件的 `methods` 映射为 `store.dispatch` 调用（需要先在根节点注入 `store`）

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

### `mapXXX`

#### (1) `mapState()`

`mapState()`：映射 `state` 中的数据为计算属性。

```js
// 1. 对象写法
mapState({count: 'count', name: 'name'})  // 省略了键的引号 ''
// 不能使用对象简写形式 mapState({count, name})
// 展开后，键没问题，值有问题，值是变量，而不是字符串
// 而 mapState 要求值是 store 状态的字段名（字符串）

// 2. 数组写法
mapState(['count', 'name'])

// 3. 模块化
// 自己手写
count() { 
	return this.$store.state.userStore.count
}
// 借助 mapState() 函数，第一个参数跟的是模块化名
mapState('userStore', ['count', 'name'])
```

#### (2) `mapGetters()`

`mapGetters()`：映射 `getters` 中的数据为计算属性。

```js
// 1. 对象写法
mapGetters({bigCount: 'bigCount')
// 2. 数组写法
mapGetters(['bigCount'])
// 3. 采取模块化
// 自己手写
bigCount() { 
	return this.$store.getters['userstore/bigCount'] 
}
// 借助 mapGetters() 函数，第一个参数跟的是模块化名
mapGetters('userStore', ['bigCount'])
```

#### (3) `mapMutations()`

`mapMutations()`：生成与 `mutations` 对应的方法，包含 `$store.commit()` 函数。

```js
// 1. 对象写法
mapMutations({increment: 'INCREMENT')
// 2. 数组写法
mapMutations(['INCREMENT'])
// 3. 采取模块化
// 自己手写
function increment() {
	this.$store.commit('userStore/INCREMENT', this.n)
	}
// 借助 mapMutations() 函数，第一个参数跟的是模块化名
mapMutations('userStore', {increment: 'INCREMENT'})
```

#### (4) `mapActions()`

`mapActions()`：生成与 `actions` 对应的方法，包含 `$store.dispatch()` 函数。

```js
// 1. 对象写法
mapActions({incrementOdd: 'incrementOdd', incrementWait: 'incrementWait')
// 2. 数组写法
mapActions(['incrementOdd', 'incrementWait'])
//3. 采取模块化
// 自己手写
function incrementOdd() {
	this.$store.dispatch('userStore/incrementOdd', this.n)
	}
// 借助mapActions()函数，第一个参数跟的是模块化名
mapActions('userStore', ['incrementOdd', 'incrementWait'])
```

```javascript
computed: {
	...mapState(['count', 'name']),  // 展开对象，将里面的 key:value 赋给计算属性
  ...mapGetters(['bigCount'])
}

methods: {
  ...mapMutations({increment: 'INCREMENT'),
  ...mapActions(['incrementOdd', 'incrementWait'])                 
  }
```

### 模块化❗⭐

将 `store` 分割成**模块（module）**。每个模块拥有自己的 `state、mutation、action、getter`、甚至是嵌套子模块——从上至下进行同样方式的分割。

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

#### (1) 模块的局部状态

对于模块内部的 `mutation` 和 `getter`，接收的第一个参数是**模块的局部状态对象**。

```js
const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  },
  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

对于模块内部的 `action`，局部状态通过 `context.state` 暴露出来，根节点状态则为 `context.rootState`。

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

对于模块内部的 `getter`，根节点状态会作为第三个参数暴露出来。

```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

#### (2) 命名空间

`namespaced: true`：使模块成为带命名空间的模块。当模块被注册后，它的所有 `getter、mutation、action` 都会自动根据模块注册的路径调整命名。

**带命名空间的绑定函数**

使用 `mapState`、`mapGetters`、`mapMutations` 和 `mapActions` 这些函数来绑定带命名空间的模块时，写起来可能比较繁琐。可以将**模块的空间名称字符串**作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。

```js
// 简写
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  }),
  ...mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

## Pinia 和 Vuex 区别

| 区别            | Pinia🍍                                                       | Vuex                                                         |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 模块化          | 没有嵌套模块的概念，推荐按功能模块划分 Store，每个 Store 都是独立的。模块之间通过 Store 引用即可，逻辑清晰。 | 通过嵌套的 `modules` 管理状态，每个模块有自己的 `state`、`mutations`、`actions`，适合大型项目，但可能出现层级过深的问题。 |
| 状态定义 & 修改 | 可以直接修改状态。                                           | ① 严格按模块化，`state`、 `mutations`、`actions` 等分离定义。② 通过 `store.commit` 或 `store.dispatch` 修改状态。 |
| TS 支持         | 好                                                           | 弱                                                           |
| 开发体验        | 对 *Option Store & Composition Store* 都支持                 | *Option Store*                                               |

