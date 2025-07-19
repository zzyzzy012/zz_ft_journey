# Vue3基础知识

## 实例挂载

(1) Vue2

1. 创建实例
   1. 通过 `new Vue(options)` 创建 Vue 实例。这一阶段主要是“准备”实例，尚未进行 DOM 操作。
   2. 调用 `_init` 方法进行初始化：
      - 合并配置项（`options`）；
      - 初始化生命周期、事件、`render`、`inject`、`provide` 等；
      - **初始化响应式系统**（`data`、`props`、`computed`、`watch`）；
      - 设置监听器；
      - 最后判断是否存在 `el`，若存在则自动执行 `$mount`。

2. 挂载实例
   1. 调用 `$mount(el)` 方法，传入挂载的 DOM 元素。

   2. 若未提供 `render` 函数：

      - 优先将 `template` 编译为 `render` 函数；
      - 若 `template` 未指定，则提取 `el` 的 `outerHTML` 并编译为 `render` 函数。
      - 调用 `mountComponent(vm, el)` 完成挂载。


   3. 编译发生在运行时（`runtime-only` 模式不支持 `template` 编译）。

3. 组件挂载（`mountComponent`）
   1. 创建渲染 `Watcher`，内部会调用 `updateComponent` 函数。
   2. 在首次执行前，先触发 `beforeMount` 钩子。
   3. `updateComponent` 执行流程如下：
      1. 调用 `vm._render()` 生成虚拟 DOM；
      2. 调用 `vm._update(vnode)`，将虚拟 DOM 转换为真实 DOM 并挂载。
   4. 渲染完成后触发 `mounted` 钩子。
   5. 注意：
      1. 渲染 `Watcher` 是响应式系统和 DOM 更新的核心连接点；
      2. `_render()` 会调用 `render` 函数生成 `VNode`；
      3. `_update()` 会将 `VNode` 转换为真实 DOM。

4. 响应式更新

   1. 当响应式数据发生变化时，依赖该数据的渲染 `Watcher` 会被触发。
   2. `Watcher` 再次调用 `updateComponent`：
      1. 触发 `beforeUpdate` 钩子；
      2. 执行 `vm._render()` 和 `vm._update()`；
      3. 渲染完成后触发 `updated` 钩子。
   3. 注意：Vue 会通过异步队列和 `nextTick` 进行批处理优化，防止重复渲染。

5. 销毁实例

   1. 调用 `$destroy()` 方法手动销毁 Vue 实例。
   2. 生命周期钩子依次触发：
      1. `beforeDestroy`
      2. 清除 `Watcher`、事件监听器、子组件引用等；
      3. 移除组件 DOM；
      4. 触发 `destroyed` 钩子。

（2）Vue3

1. 创建组件实例（`setup` 阶段）
   1. 调用 `createApp(App)` 创建应用实例。
   2. 在首次渲染时，Vue 会通过 `createComponentInstance` 创建组件实例，初始化属性、插槽、上下文（ctx）等。
   3. 调用 `setup()` 函数：
      - 若返回一个函数，则作为 `render` 函数；
      - 若返回一个对象，则对象中的属性会暴露给模板（即 `template` 中可以直接访问这些响应式变量）。
2. 挂载组件
   1. 执行组件的 `render` 函数，生成虚拟 DOM（`VNode`）结构。
   2. Vue 内部使用 `patch` 函数，将 VNode 转换为真实 DOM 并挂载到页面。
   3. 生命周期钩子执行顺序：`beforeMount - onMounted`
3. 响应式更新（`Proxy + effect`）
   1. Vue 3 使用 `Proxy` 对响应式对象进行代理。
   2. 当在 `render` 或 `effect` 中访问响应式对象属性时，会通过 `track` 进行依赖收集。
   3. 当属性变化时，触发 `trigger`，使相关副作用函数（`effect`）重新执行。
   4. 渲染副作用由 `effect` 包裹，并传入一个调度器（`scheduler`），用于异步批量更新。
   5. 流程如下：响应式数据变化 → trigger → scheduler → effect → render → patch → DOM 更新
   6. 生命周期钩子执行顺序：`beforeUpdate - onUpdated`
4. 卸载与销毁组件
   1. 调用 `unmount()`，组件进入卸载流程。
   2. 销毁副作用（`effect`）、解绑 DOM 事件、清除响应式监听。
   3. 生命周期钩子执行：`beforeUnmount - onUnmounted`

## 生命周期

在Vue中，生命周期指的是Vue实例从创建 → 挂载 → 更新 → 销毁的过程。

### (1) Vue 3 生命周期

在 Vue 3 中，生命周期钩子函数需要在组件的 `setup` 函数中通过 `on` 前缀来注册。

1. `beforeCreate()`：在实例被创建之初。
   1. `new Vue()` 之后触发的第一个钩子，进行**数据观测**。
   2. 无法访问 `data`、`computed`、`methods`、`watch` 等在 `setup` 中定义的响应式数据和方法。
2. `created()`：在实例创建完成后发生。
   1. 完成**数据观测**，属性与方法的运算，`watch`、`event` 事件回调的配置。
   2. 可调用 `methods` 中的方法，访问和修改 `data` 数据，可通过 `computed` 和 `watch` 完成数据计算。
   3. 在这里更改数据不会触发 `updated` 函数。
   4. 可以做一些**初始数据**的获取，在当前阶段无法与 DOM 进行交互，如果非要想，可以通过 `vm.$nextTick` 来访问 DOM。
   5. `vm.$el` 并没有被创建。
3. `beforeMount()`：发生在挂载之前。
   1. 可获取到 `vm.el`，此阶段 `vm.el` 虽已完成 DOM 初始化，但并未挂载在 `el` 选项上。
   2. 在这之前 `template` 模板已导入**渲染函数编译**。而当前阶段**虚拟 DOM** 已经创建完成，即将开始渲染。
   3. 对数据进行更改，不会触发 `updated`。
4. `mounted()`：挂载到 DOM 之后被调用。所有子组件也都将被挂载完成。
   1. **真实 DOM 挂载完毕，数据完成双向绑定**。
   2. 可以访问到 DOM 节点，使用 `$refs` 属性对 DOM 进行操作。
   3. 推荐在 `mounted()` 中**发起请求**。
5. `beforeUpdate()`：发生在更新之前，也就是响应式数据发生更新。
   1. **虚拟 DOM 重新渲染之前被触发**，`view` 视图还未更新。
   2. 在当前阶段进行数据更改，不会造成重渲染。
6. `updated()`：发生在更新完成之后，当前阶段组件 DOM 已完成更新。
   - 避免在此期间更改数据，可能会导致**无限循环**的更新。通常需要使用条件判断来避免这种情况。
7. `beforeUnmount()`：在实例即将被卸载之前被调用。实例仍然完全可用。
   1. 通常用于执行一些清理工作，例如解绑事件监听器 `removeEventListener()`、取消定时器 `clearTimeout`等。
8. `unmounted()`：在组件实例被卸载之后调用。这个时候只剩下了 DOM 空壳。
   - 组件已被拆解，数据绑定和事件监听被移除，子实例也统统被销毁。

![](.\vue3-images\lifecycle_zh-CN.W0MNXI0C.png)

1. `onErrorCaptured(err, instance, info)`：当组件内部或其子组件的渲染过程中抛出一个未捕获的错误时被调用。

   接收三个参数：

   - `err`：错误对象。
   - `instance`：发生错误的组件实例。
   - `info`：一个包含错误来源信息的字符串。
   - 可以用于捕获和处理组件内部的错误，例如上报错误或显示备用内容。


1. `onRenderTracked(e)`：在组件渲染过程中，如果响应式依赖项被“追踪”时调用。
   - 接收一个 `e` 参数，包含有关被追踪的依赖项的信息。
   - 主要用于开发和调试，帮助了解组件的渲染行为。


1. `onRenderTriggered(e)`：在组件渲染过程中，如果响应式依赖项发生改变并触发重新渲染时调用。
   - 接收一个 `e` 参数，包含有关触发重新渲染的依赖项的信息。
   - 同 `onRenderTracked(e)`


1. `onActivated()`：在组件被激活（从缓存中恢复）时调用。仅用于 `<keep-alive>` 组件包裹的动态组件。
2. `onDeactivated()`：在组件被停用（被缓存）时调用。仅用于 `<keep-alive>` 组件包裹的动态组件。

### (2) Vue2生命周期

| Vue 2           | Vue 3 (`setup` 中使用 `on` 前缀) |
| --------------- | -------------------------------- |
| `beforeCreate`  | `onBeforeMount`  (在 `setup` 中) |
| `created`       | `onCreated ` (在 `setup` 中)     |
| `beforeMount`   | `onBeforeMount`                  |
| `mounted`       | `onMounted`                      |
| `beforeUpdate`  | `onBeforeUpdate`                 |
| `updated`       | `onUpdated`                      |
| `beforeDestroy` | `onBeforeUnmount`                |
| `destroyed`     | `onUnmounted`                    |
| `activated`     | `onActivated`                    |
| `deactivated`   | `onDeactivated`                  |
| `errorCaptured` | `onErrorCaptured`                |
| (无对应)        | `onRenderTracked`                |
| (无对应)        | `onRenderTriggered`              |

![](.\vue3-images\lifecycle.png)

### (3) 选项式和组合式生命周期的区别

选项式 API 的生命周期钩子函数定义在组件选项对象的 `methods` 中。

```js
export default {
  methods: {
    created() {
      // do something
    }
  }
}
```

组合式 API 的生命周期钩子函数定义在 `setup` 函数中，需要使用 `import` 从 `vue` 中引入。在组合式 API 中没有 `beforecate` 和 `created` 钩子，因为他们本身被 `setup` 函数替代了，直接把相关逻辑写在 `setup` 中就行了。

```js
import { onMounted } from 'vue';
export default {
  setup() {
    onMounted(() => {
      // do something
    });
  }
}
```

### (4) 父子组件生命周期的执行顺序

**① 初始创建，加载渲染**

父 `beforeCreate`->父 `created`->父 `beforeMount`->子 `beforeCreate`->子 `created`->子 `beforeMount`->子 `mounted`->父 `mounted`

**② 父子组件更新**

1. 父组件 ->`beforeUpdate`
2. 子组件 -> `beforeUpdate`
3. 子组件 -> `updated`
4. 父组件 ->`updated`

**③ 父子组件卸载**

1. 父组件 -> `beforeUnmount`
2. 子组件 -> `beforeUnmount`
3. 子组件 -> `unmounted`
4. 父组件 -> `unmounted`

### `setup`

`<script setup>` 简化 `setup()` 函数中手动暴露大量的状态和方法代码。

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    function increment() {
      // 在 JavaScript 中需要 .value
      count.value++
    }
    // 返回值会暴露给模板和其他的选项式 API 钩子
    // 不要忘记同时暴露 increment 函数
    return {
      count,
      increment
    }
  },
  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

`setup` 函数的第一个参数是组件的 `props`。

如果解构了 `props` 对象，解构出的变量将会**丢失响应性**。推荐通过 `props.xxx` 的形式来使用其中的 `props`。可以使用 `toRefs()` 和 `toRef()` 这两个工具函数解构。

```javascript
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props)
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value)
    // 或者，将 `props` 的单个属性转为一个 ref
    const title = toRef(props, 'title')
  }
}
```

`setup` 函数的第二个参数是一个 **`setup 上下文`**对象。上下文对象暴露了其他一些在 `setup` 中可能会用到的值。

```javascript
export default {
  setup(props, context) {
    // 透传 Attributes（非响应式的对象，等价于 $attrs）
    console.log(context.attrs)
    // 插槽（非响应式的对象，等价于 $slots）
    console.log(context.slots)
    // 触发事件（函数，等价于 $emit）
    console.log(context.emit)
    // 暴露公共属性（函数）
    console.log(context.expose)
  }
}
```

`expose` 函数用于显式地限制该组件暴露出的属性，当父组件通过模板引用访问该组件的实例时，将仅能访问 `expose` 函数暴露出的内容。

```javascript
export default {
  setup(props, { expose }) {
    // 让组件实例处于 “关闭状态”
    // 即不向父组件暴露任何东西
    expose()
    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    expose({ count: publicCount })
  }
}
```

## 模板语法

文本插值：`{{}}` 会将数据解析为纯文本

```vue
<span>Message: {{ msg }}</span>
```

`v-html`：会识别标签，容易造成 XSS 漏洞

```vue
<span v-html="rawHtml"></span></p>
```

`v-text`：不会识别标签

`v-bind` 简写 `:`，响应式绑定 `attribute`

```vue
<button :disabled="isButtonDisabled">Button</button>
```

在 Vue 模板内，JavaScript 表达式可以被使用在如下场景上：

- 在文本插值中 (双大括号)
- 在任何 Vue 指令 (以 `v-` 开头的特殊 `attribute`) `attribute` 的值中


## 计算属性

### (1) 计算属性

对 Vue 实例的数据进行动态计算，且具有**缓存机制**，只有在相关依赖发生改变时才会重新计算。

计算属性是在 Vue 实例的 `computed` 选项中定义的，可以是一个**函数或具有 `get` 和 `set` 方法的对象**。

- 函数形式的计算属性会在**调用**时被执行；
- 对象形式的计算属性则可以提供自定义的 `get` 和 `set`方法。

```js
// vue2
computed: {
  // 函数形式的计算属性
  reversedMessage: function () {
    return this.message.split('').reverse().join('');
  },
  // 对象形式的计算属性
  fullName: {
    get: function () {
      return this.firstName + ' ' + this.lastName;
    },
    set: function (newValue) {
      var names = newValue.split(' ');
      this.firstName = names[0];
      this.lastName = names[names.length - 1];
    }
  }
}
```

```vue
<!-- vue3 -->
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

### (2) 计算属性缓存 vs 方法

- 计算属性默认具有**缓存机制**。只有在相关依赖发生变化时，计算属性才会重新计算。多次访问计算属性时，Vue 会返回之前计算的结果，而不会重新执行计算函数，从而提高性能。
- 方法调用总是会在重渲染发生时再次执行函数。

### (3) `Getter` 和 `Setter`

计算属性默认是**只读的**，提供 `getter` 和 `setter` 方法，可更改但应避免直接修改计算属性值。

`getter` 不应有副作用，**不要改变其他状态、在 `getter` 中做异步请求或者更改 DOM**！

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
fullName.value = 'Jane Smith'
</script>
```

### (4) 应用场景

**① 数据过滤**

如商品列表里，只展示“特价商品”。`特价 = 所有商品中过滤出价格 < 100`

**② 表单验证**

用户输入两次密码是否一致。`密码是否一致 = 密码1 === 密码2`

**③ 数据计算结果**

购物车商品总价。`总价 = 每个商品价格 × 数量的总和`

**④ 数据格式化**

时间戳转换成 `“2025年4月17日”` 这种格式。从后台返回的时间戳，格式化后展示在页面上

## 侦听器⭐

#### (1) `watch`

`watch` 函数：数据变化会产生一些**副作用**，如更改 DOM、执行异步操作。

```javascript
// 第一个参数要监视的数据
// 第二个参数监视的回调
// 第三个参数配置对象
watch(要侦听的对象, () => {}, {
	// 可选
  deep: true, // 耗费性能
  immediate: true, // 获取初始数据，再在相关状态更改时重新请求数据
  once: true,
  flush：'sync' | 'pre' | 'post',  // 调整回调函数的刷新时机
})
```

1. 当 `flush` 为 `sync`，表示它是一个同步 `watcher`，即当数据变化时同步执行回调函数。
2. 当 `flush` 为 `pre`，回调函数通过 `queueJob` 的方式在组件更新之前执行，如果组件还没挂载，则同步执行确保回调函数在组件挂载之前执行。
3. 如果没设置 `flush` 或者 `flush` 为 `post`，回调函数通过 `queuePostRenderEffect` 的方式在组件更新之后执行。

#### (2) `watch` 监视数据源

1. 一个 `ref`
2. 一个 `reactive` 响应式对象
3. 一个计算属性
4. 一个 `getter` 函数（有返回值的函数）
5. 以上类型的值组成的数组

**① `ref()` 对象**
- `ref()` 如果是对象等复杂数据类型，监视的是地址。
- 只改变对象属性值，`newVal` 和 `oldVal` 是同一个值；若想监视，配置 `deep: true`。
- 改变整个对象，`newVal` 和 `oldVal` 才不同。

```vue
<script setup>
import { ref, watch } from 'vue'
let sum = ref(100)
// 监听简单数据类型
const stopWatch = watch(sum, (newVal, oldVal) => {
  console.log(sum, newVal, oldVal)
  // 停止监听
  if (newVal > 1000) {
    stopWatch()
  }
})
</script>

<template>
  <div>
    <p>sum值:{{ sum }}</p>
    <button @click="sum += 100">add sum 100</button>
  </div>
</template>
```

```vue
<script setup>
import { ref, watch } from 'vue'
let user = ref({
  name: '张三',
  age: 20
})
// 监听复杂数据类型
watch(user, (newVal, oldVal) => {
  console.log(user, newVal, oldVal)
})
</script>

<template>
  <div>
    <p>user姓名:{{ user.name }}, user年龄： {{ user.age }}</p>
    <button @click="user.name += '~'">change name</button>
    <button @click="user.age += 1">change age</button>
    <button @click="user = {name: '李四', age: 33}">change user</button>
  </div>
</template>
```

**② `reactive()` 定义的响应式对象**

默认开启深度监视，且无法关闭。

1. 监听整个对象：用函数式 `() => obj`
2. 监听具体属性：用函数式 `() => obj.prop`
3. 监听整个对象内部属性的变化（细枝末节）：加 `deep: true`
4. 不推荐直接监听 `reactive` 对象本身，会得到相同的 `oldVal` 和 `newVal`。

| 监听方式                          | 是否能监听属性变化 | 是否能监听整体变化 | `newVal` 和 `oldVal` 是否不同 | 说明                                         |
| --------------------------------- | ------------------ | ------------------ | ----------------------------- | -------------------------------------------- |
| `watch(obj, ...)`                 | 能❗                | 不能               | `newVal === oldVal`           | 不推荐，仅能监视内部属性，但无法得知变化细节 |
| `watch(() => obj, ...)`           | 不能               | 能                 | `newVal !== oldVal`           | 用来监听整个对象的替换（如赋新对象）         |
| `watch(() => obj.prop, ...)`      | 能                 | 不能               | `newVal !== oldVal`           | 用于监听具体属性（基本类型）                 |
| `watch(obj, ..., { deep: true })` | 能                 | 能                 | `newVal !== oldVal`           | 用于监听对象内部所有属性变化，包括嵌套       |

```js
const state = reactive({ count: 0 })
// newVal === oldVal 它们是同一个 state 对象
watch(state, (newVal, oldVal) => {
  // 打印结果是 newVal === oldVal 都已经是最新的值
  console.log(newVal.count, oldVal.count)
})
```

**③ 数组 `[]`**

```vue
<script setup>
import { ref, watch } from 'vue'
let temp = ref(20)
let height = ref(40)

watch([temp, height], (val) => {
  let [newTemp, newHeight] = val
  console.log(newTemp, newHeight)
})
</script>

<template>
  <div>
    <p>当前水温是:{{ temp }}℃, 当前水位是：{{ height }}cm。</p>
    <button @click="temp += 10">change temp</button>
    <button @click="height += 10">change height</button>
  </div>
</template>
```

#### (3) `watchEffect()`

立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。回调会立即执行，不需要指定 `immediate: true`。

```js
const todoId = ref(1)
const data = ref(null)
// watch
watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
// watchEffect
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

有多个依赖项的侦听器来说，使用 `watchEffect()` 可以消除手动维护依赖列表的负担。

如果你需要侦听一个嵌套数据结构中的几个属性，`watchEffect()` 可能会比深度侦听器更有效，因为它将只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性。

```javascript
<script setup>
import { ref, watchEffect } from 'vue'

let temp = ref(20)
let height = ref(40)

// watch惰性，指明监视谁才会监视
// watch([temp, height], (val) => {
//   let [newTemp, newHeight] = val
//   console.log(newTemp, newHeight)
// })
watchEffect(() => {
  if (temp.value > 50 || height.value > 60) {
    console.log('给服务器发请求')
  }
})
</script>

<template>
  <div>
    <p>当前水温是:{{ temp }}℃, 当前水位是：{{ height }}cm。</p>
    <button @click="temp += 10">change temp</button>
    <button @click="height += 10">change height</button>
  </div>
</template>
```

#### (4) `watchEffect` 与 `watch` 的区别

- 侦听源。`watch` 需要显式指定侦听源；而 `watchEffect` 不需要显式指定侦听源，只需传入一个副作用函数，函数内部访问的任何响应式对象都会被自动追踪。
- 回调函数结构。`watch` 需要一个回调函数，接收新值和旧值（以及可选的清理函数）；`watchEffect` 没有单独的回调函数，副作用函数本身就是逻辑容器，当依赖变化时重新运行整个函数。
- 执行时机。`watch`  默认**在侦听源变化时触发**回调函数，需要配置 `immediate: true`，才会立即执行回调函数；`watchEffect` 在创建好 `watcher` 后，会**立刻执行**它的副作用函数。

## 表单输入绑定⭐

`v-model` 可以用于各种不同类型的输入，`<textarea>`、`<select>` 元素。它会根据所使用的元素自动使用对应的 DOM 属性和事件组合：

- 文本类型的 `<input>` 和 `<textarea>` 元素会绑定 `value` property 并侦听 `input` 事件；
- `<input type="checkbox">` 和 `<input type="radio">` 会绑定 `checked` property 并侦听 `change` 事件；
- `<select>` 会绑定 `value` property 并侦听 `change` 事件。

修饰符：

- `v-model.lazy` 修饰符来改为在每次 `change` 事件后更新数据
- `v-model.number`
- `v-model.trim`

```javascript
<input
  :value="text"
  @input="event => text = event.target.value">
<input v-model="text">
```

```vue
<script setup>
import { ref } from 'vue'

const message = ref('hello Vue3')
const mutipleMessage = ref('hello my baby')

const checked = ref(true)
const checkedNames = ref([])

const picked = ref('One')

const selected = ref('')
</script>

<template>
  <!-- 单行文本 -->
  <input type="text" v-model="message" placeholder="edit me">
  <p>show message:{{ message  }}</p>
  <!-- 多行文本 -->
  <textarea v-model="mutipleMessage" placeholder="edit me[textarea]"></textarea>
  <p>show mutipleMessage:{{ mutipleMessage }}</p>
  <!-- 复选框 -->
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">checkbox</label>
  <span>checked state: {{ checked }}</span>
  <div>Checked names: {{ checkedNames }}</div>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames" />
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
  <label for="mike">Mike</label>
  <!-- 单选框 -->
  <div>Picked: {{ picked }}</div>
  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">One</label>
  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Two</label>
  <!-- 选择器 -->
  <div>Selected: {{ selected }}</div>
  <select v-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</template>
```

## class 与 style 绑定

`:class`

1. 通过对象动态地应用类名，可以根据条件为元素添加或移除特定的类。
2. 通过数组可以同时应用多个类，数组中的每个值代表一个类名，数组中的布尔表达式可以控制多个类的动态添加。

`:style` 通过对象动态地设置元素的内联样式。对象的键是 CSS 属性，值是对应的样式值。也支持 kebab-cased 形式的 CSS 属性 key。

```vue
<script setup>
  const isActive = ref(true)
	const hasError = ref(false)
	const activeColor = ref('red')
	const fontSize = ref(30)
</script>

<template>
	<div
    class="static"
    :class="{ active: isActive, 'text-danger': hasError }"
	></div>
	<!-- fontSize 是 camelCase 的 CSS 属性名 -->
	<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
	<!-- 使用 kebab-case 属性名，需要用字符串引号包裹属性名 -->
	<div :style="{ 'font-size': fontSize + 'px' }"></div>
</template>
```

## 条件渲染

### (1) `v-if`

`v-if` 和 `v-else` 和 `v-else-if`，可以连在一起使用，也都可以用在 `<template>` 上。

**Vue3 中 `v-if` 优先级高于 `v-for`；Vue2 相反。**

```vue
<script setup>
import { ref, reactive } from 'vue'

const weatherOptions = reactive(['sunny', 'rainy', 'cloudy', 'unknown'])
const weather = ref('sunny')

const changeWeather = () => {
  const randomIndex = Math.floor(Math.random() * weatherOptions.length)
  weather.value = weatherOptions[randomIndex]
}
</script>

<template>
  <div>
    <div v-if="weather === 'sunny'">
      <p>今天是晴天，记得带上太阳镜！😎</p>
    </div>
    <div v-else-if="weather === 'rainy'">
      <p>今天下雨，记得带伞哦！🌧️</p>
    </div>
    <div v-else-if="weather === 'cloudy'">
      <p>今天多云，气温适中。⛅</p>
    </div>
    <div v-else>
      <p>天气状况不明，请稍后再试。🤔</p>
    </div>
    <button @click="changeWeather">切换天气</button>
  </div>
</template>
```

### (2) `v-show`

1.  会在 DOM 渲染中保留该元素；`v-show` 仅切换了该元素上名为 `display` 的 CSS 属性。
2.  `v-show` 不支持在 `<template>` 元素上使用，也不能和 `v-else` 搭配使用。


`<template>` 标签中不可以使用 `v-show`。`<template>` 标签是**占位符元素**，它本身在渲染时不会生成任何实际的 DOM 元素，只是为了包裹一些结构或逻辑，帮助开发者更好地组织模板内容。

### (3) `v-if` vs `v-show`

1. 渲染机制不同：

   - `v-if` 是按条件动态创建或销毁 DOM 元素；
   - `v-show` 则是通过切换元素的 CSS `display` 属性控制显示/隐藏，DOM 元素始终存在。

2. 初始渲染差异：

   - `v-if` 在初始条件为 `false` 时不会渲染任何内容（**惰性**）；
   - `v-show` 无论初始条件是否满足，都会渲染元素，只是不显示，有更高的**初始渲染开销**。

3. 切换开销不同：

   - `v-if` 每次切换都会进行 DOM 的添加或删除，伴随子组件销毁/重建，有更高的**切换开销**；
   - `v-show` 只是样式切换，性能更高效，适合频繁切换。
     - 如果在运行时绑定条件很少改变，则 `v-if` 更合适；
     - 如果需要频繁切换，则使用 `v-show` 较好。


4. 生命周期影响不同：

   - `v-if` 的组件在条件变化时会完整执行创建和销毁的生命周期钩子（如 `beforeCreate`、`mounted`、`destroyed`）；
   - `v-show` 不会触发这些生命周期函数。

## 列表渲染

### (1) `v-for`

`v-for="(item, index) in items"`，`index` 参数可选，表示位置索引。

也可用于 `<template>` 渲染一个包含多个元素的块。

```vue
<script setup>
import { reactive } from 'vue'
const fruits = reactive(['apple', 'banna', 'orange', 'pear', 'grape'])
</script>

<template>
  <div>
    <ul>
      <li v-for="item in fruits" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
```

`v-for` 可以直接接受一个整数值，基于 `1...n` 的取值范围重复多次。从 `1` 开始。

```html
<span v-for="n in 10">{{ n }}</span>
```

### (2) `in` 和 `of`

- 当处理**数组、对象、整数**范围时，`in` 是 `Vue.js` 中的默认选择，提供了更广泛的兼容性。
- 当处理**可迭代对象**时，如字符串、`Set` 或 `Map`，使用 `of` 会更加符合标准的 `JavaScript` 迭代行为。

### (3) `v-if` 和 `v-for`

`v-if` 优先级高于 `v-for` 意味着 `v-if` 的条件将无法访问到 `v-for` 作用域内定义的变量别名。可以通过 `v-for` 包装在外部的 `<template>` 解决，但不推荐，因为这样二者的优先级不明显。

```vue
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

### (4) 使用 `key`

`key` 是 Vue 中用于**标识每个元素或组件的唯一标识**。它帮助 Vue 优化虚拟 DOM 的差异计算，避免不必要的重渲染。

通过 `key` 来状态管理，`:key=item.id`。

`key` 绑定的值期望是一个基础类型的值，例如 `string` 或 `number`，不要用对象作为 `key` 值。

```vue
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

**组件上使用 `v-for` 还需要向组件传递数据。**

```vue
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

Vue 默认就地更新 `v-for` 渲染的元素列表，当数据位置发生改变，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素。

- 设置 `key` 以便 Vue 可以跟踪每个节点的标识，从而重用和重新排序现有的元素。


- 如果不设置 `key`，Vue 会基于**顺序**来判断元素的变化，可能会出现性能下降或渲染错误的问题。

场景：

- Vue 会**复用已有 DOM 元素**，因为它默认根据**顺序**来判断哪个元素改变了。
- 结果：**输入框中的值被错误复用**，你会看到：
  - 原来 `Alice` 的输入框中，变成了 `Charlie`
  - 原来 `Bob` 的输入框中，变成了 `Alice`
  - 但其实 `Bob` 应该在第二个位置

```vue
<template>
  <div v-for="user in users" :key="user.id">
    <input v-model="user.name" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
])

// 往数组开头插入一个新用户
users.value.unshift({ id: 3, name: 'Charlie' })
</script>
```

## 事件处理

### (1) 事件处理

**Vue 的事件触发默认为冒泡过程监听。**

使用 `v-on` 绑定事件：`v-on:event="method"`，其中 `event` 是事件类型，`method` 是方法名称。

简写方式：`@event="method"`，等同于 `v-on:event="method"`。

```vue
<button v-on:click="handleClick">Click Me</button>
<button @click="handleClick">Click Me</button>
```

可以传递参数，如果访问DOM事件，还可传入 `event` 变量。

**① 传递参数**

```js
<button @click="handleClick('Hello')">Click Me</button>
methods: {
  handleClick(message) {
    console.log(message);  // 输出 'Hello'
  }
}
```

**② 使用 `$event`**

`$event` 是 Vue 自动传递给事件处理函数的原生事件对象，可以用来访问事件的详细信息。

```js
<button @click="handleClick($event)">Click Me</button>
methods: {
  handleClick(event) {
    console.log(event);  // 输出原生的 JavaScript 事件对象
  }
}
```

### (2) 事件修饰符

① `.capture` 在捕获阶段触发事件。

② `.stop` 阻止事件传递，不仅阻止捕获事件流，也会阻止冒泡事件流（`event.stopPropagation()`）。

③ `.prevent` 阻止默认事件的触发（`event.preventDefault()`）。

> 如 `a[href="#"]`、`button[type="submit"]` 在冒泡结束后会开始执行默认事件。
>
> 注意默认事件虽然是冒泡后开始，但不会因为 `.stop` 事件修饰符阻止事件传递而停止。

④ `.passive` 表示该事件处理函数不会调用 `event.preventDefault()`，可以改善移动端设备的滚屏性能。不要和 `.prevent` 同时使用。

> 不阻止默认事件的触发：浏览器只有等内核线程执行到事件监听器对应的 JavaScript 代码时，才能知道内部是否会调用 `preventDefault` 函数来阻止事件的默认行为，所以浏览器本身是没有办法对这种场景进行优化的。这种场景下，用户的手势事件无法快速产生，会导致页面无法快速执行滑动逻辑，从而让用户感觉到页面卡顿。（通俗点说就是每次事件产生，浏览器都会去查询一下是否有 `preventDefault` 阻止该次事件的默认动作。加上 `passive` 就是为了告诉浏览器，不用查询了，我们没用 `preventDefault` 阻止默认动作。）
>
> 应用场景：一般用在滚动监听 `@scoll`、`@touchmove`，因为滚动监听过程中移动每个像素都会产生一次事件，每次都使用内核线程查询 `prevent` 会使滑动卡顿。我们通过 `passive` 将内核线程查询跳过，可以大大提升滑动的流畅度。

⑤ `.self` 只有点击元素本身的时候才会触发这个元素的事件。

⑥ `.once` 元素的事件只触发一次。

> `.native` 原型绑定，只有使用 Vue 组件才会用到该修饰符。Vue3 弃用了。
>
> `<el-input @click.native="">` 相当于把事件绑定在 `input[class="el-input__inner"]` 上。

### (3) 其他修饰符

- 按键修饰符：`.enter`、`.tab`、`.delete`、`.esc`、`.space`、`.up`、`.down`、`.left`、`.right`
  - `.delete` 捕获 Delete 和 Backspace 两个按键。
- 系统案件修饰符：`.ctrl`、`.alt`、`.shift`、`.meta`
- `.exact` 修饰符允许精确控制触发事件所需的系统修饰符的组合。
- 鼠标按键修饰符：`.left`、`.right`、`.middle`


### (4) 异步操作

Vue 事件处理默认是**同步**的，即所有事件处理函数会**按顺序执行**。如果事件处理涉及异步操作（如 API 请求），则会导致界面延迟更新。

异步操作通常通过 `setTimeout`、`Promise` 或 `async/await` 实现。

## 模板引用

获取 DOM 元素：在 DOM 元素上绑定 `ref` 属性，通过 `useTemplateRef()` 获取。

> `ref` (*reference*) 一个是 *reactive variables*，另一个用途是 *access DOM elements* (*template refs*)。
>

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
// 第一个参数必须与模板中的 ref 值匹配
const input = useTemplateRef('my-input')
onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

对于 `v-for`，`ref` 获取的是数组。

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'
const list = ref([
  'apple',
  'banana',
  'orange'
])
const itemRefs = useTemplateRef('items')
onMounted(() => console.log(itemRefs.value))
</script>
<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

组件上的 `ref`

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value 将持有 <Child /> 的实例
})
</script>

<template>
  <Child ref="child" />
</template>
```

使用了 `<script setup>` 的组件是**默认私有**的，一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显式暴露。

```vue
<script setup>
import { ref } from 'vue'
const a = 1
const b = ref(2)
// 像 defineExpose 这样的编译器宏不需要导入
defineExpose({
  a,
  b
})
</script>
```

## `$refs` 和 `$parent`

`$refs`：一个包含 DOM 元素和组件实例的对象。

先在模板 `<template>` 中绑定方法，传入参数 `$refs` 获取，JS 定义方法，传入参数 `$refs`。

```vue
<!-- parent.vue -->
<script setup>
import { ref } from 'vue'
import ChildComponent from '@/components/ChildComponent.vue'
import ChildComponent2 from '@/components/ChildComponent2.vue'

const childRef1 = ref()
const childRef2 = ref()
const getChildRef = (refs) => {
  for ( let key in refs) {
    console.log(refs[key])
  }
}
</script>

<template>
  <div>
    <ChildComponent ref="childRef1"></ChildComponent>
    <ChildComponent2 ref="childRef2"></ChildComponent2>
    <div @click="getChildRef($refs)">ddd 拿childRef</div>
  </div>
</template>
```

`$parent`：当前组件可能存在的**父组件实例**，如果当前组件是顶层组件，则为 `null`。

要先在模板 `<template>` 中绑定方法，传入参数 `$parent` 获取，JS 定义方法，传入参数 `$parent`。

```vue
<!-- child.vue -->
<script setup>
const getParent = (parent) => {
  console.log(parent)
}
</script>

<template>
  <div>
    <div @click="getParent($parent)">ddd获取parentRef</div>
  </div>
</template>
```

`$refs` 和 `$parent` 都要在 `onmounted()` DOM元素挂载后才能获取。

