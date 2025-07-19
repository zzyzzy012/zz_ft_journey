# Vue3逻辑复用

## 组合式函数

Vue 中重用代码的方式：**组件和组合式函数**，组件是主要的**构建模块**，而组合式函数则侧重于**有状态的逻辑**。

### (1) 概念

组合式函数(*Composables*) 是一个利用 Vue 的组合式 API 来封装和复用**有状态逻辑**的函数。

可以嵌套多个组合式函数：一个组合式函数可以调用一个或多个其他的组合式函数。这使得我们可以像使用多个组件组合成整个应用一样，用多个较小且逻辑独立的单元来组合形成复杂的逻辑。

**① 命名**

约定用驼峰命名法命名，并以 `use` 作为开头，如 `useMouse`。

**② 输入参数**

即便不依赖于 `ref` 或 `getter` 的响应性，组合式函数也可以接收它们作为参数。如果你正在编写一个可能被其他开发者使用的组合式函数，最好处理一下**输入参数是 `ref` 或 `getter` 而非原始值的情况**。可以利用 `toValue()` 工具函数来实现。

如果你的组合式函数在输入参数是 `ref` 或 `getter` 的情况下创建了响应式 `effect`，为了让它能够被正确追踪，请确保要么使用 `watch()` 显式地监视 `ref` 或 `getter`，要么在 `watchEffect()` 中调用 `toValue()`。

**③ 返回值**

在组合式函数中返回值对象推荐使用 `ref()` 而不是 `reactive()`，这样该对象在组件中被解构为 `ref` 之后仍可以保持响应性。

### (2) 鼠标跟踪器示例

场景：希望实现鼠标跟踪功能，并且在多个组件中复用这个逻辑。

```js
// 将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

在组件中复用。

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

### (3) 异步状态示例

在做异步数据请求时，我们常常需要处理不同的状态：加载中、加载成功和加载失败。

`useFetch()` 接收一个静态 URL 字符串作为输入——因此它只会执行一次 `fetch` 并且就此结束。如果我们想要在 URL 改变时重新 `fetch` 呢？为了实现这一点，我们需要将**响应式状态**传入组合式函数，并让它基于传入的状态来创建执行操作的侦听器。

1. 可以接收 `ref`
2. `get` 函数
3. `watchEffect()` 和 `toValue()`

`toValue()`：将 `ref` 或 `getter` 规范化为值。

- 如果参数是 `ref`，它会返回 `ref` 的值；
- 如果参数是函数，它会调用函数并返回其返回值。否则，它会原样返回参数。它的工作方式类似于 `unref()`，但对函数有特殊处理。

注意 `toValue(url)` 是在 `watchEffect` 回调函数的**内部**调用的。这确保了在 `toValue()` 规范化期间访问的任何响应式依赖项都会被侦听器跟踪。

这个版本的 `useFetch()` 现在能接收静态 URL 字符串、`ref` 和 `getter`，使其更加灵活。`watchEffect` 会立即运行，并且会跟踪 `toValue(url)` 期间访问的任何依赖项。如果没有跟踪到依赖项 (例如 `url` 已经是字符串)，则 `effect` 只会运行一次；否则，它将在跟踪到的任何依赖项更改时重新运行。

```js
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // reset state before fetching..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### (4) 和其他模式的比较

**① Vue2 `mixin`**

1. **不清晰的数据来源**：当使用了多个 `mixin` 时，实例上的数据属性来自哪个 `mixin` 变得不清晰，这使追溯实现和理解组件行为变得困难。这也是我们推荐在组合式函数中使用 `ref` + 解构模式的理由：让属性的来源在消费组件时一目了然。
2. **命名空间冲突**：多个来自不同作者的 `mixin` 可能会注册相同的属性名，造成命名冲突。若使用组合式函数，你可以通过在解构变量时对变量进行重命名来避免相同的键名。
3. **隐式的跨 `mixin` 交流**：多个 `mixin` 需要依赖共享的属性名来进行相互作用，这使得它们隐性地耦合在一起。而一个组合式函数的返回值可以作为另一个组合式函数的参数被传入，像普通函数那样。

**② 和无渲染组件的对比**

- 组合式函数不会产生额外的组件实例开销。当在整个应用中使用时，由无渲染组件产生的额外组件实例会带来无法忽视的性能开销。
- 推荐在纯逻辑复用时使用组合式函数，在需要同时复用逻辑和视图布局时使用无渲染组件。

## Vue2 `mixin`

### (1) 基本使用

混入 (*mixin*) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

**`Mixin` 和 Vuex 的区别**

- Vuex 公共状态管理，如果在一个组件中更改了 Vuex 中的某个数据，那么其它所有引用了 Vuex 中该数据的组件也会跟着变化。
- `Mixin` 中的数据和方法都是独立的，组件之间使用后是互相不影响的。

```js
// src/mixin/index.js
export const mixins = {
  data() {
    return {
      msg: "我是小猪课堂",
    };
  },
  computed: {},
  created() {
    console.log("我是mixin中的created生命周期函数");
  },
  mounted() {
    console.log("我是mixin中的mounted生命周期函数");
  },
  methods: {
    clickMe() {
      console.log("我是mixin中的点击事件");
    },
  },
};
```

### (2) 局部混入 & 全局混入

- `mixin` 中的生命周期函数会和组件的生命周期函数一起合并执行。
- `mixin` 中的 `data` 数据在组件中也可以使用。
- `mixin` 中的方法在组件内部可以直接调用。
- 生命周期函数合并后执行顺序：先执行 `mixin` 中的，后执行组件的。

```vue
<!-- 局部混入 -->
<!-- src/App.vue -->
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <button @click="clickMe">点击我</button>
  </div>
</template>

<script>
import { mixins } from "./mixin/index";
export default {
  name: "App",
  mixins: [mixins],  // 局部混入
  components: {},
  created(){
    console.log("组件调用minxi数据",this.msg);
  },
  mounted(){
    console.log("我是组件的mounted生命周期函数")
  }
};
</script>
```

```js
// 全局混入
import Vue from "vue";
import App from "./App.vue";
import { mixins } from "./mixin/index";
Vue.mixin(mixins);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

```vue
<!-- 全局混入，直接使用 -->
<script>
// import { mixins } from "./mixin/index";
import demo from "./components/demo.vue";
export default {
  name: "App",
  // mixins: [mixins],
  components: { demo },
  created() {
    console.log("组件调用minxi数据", this.msg);
  },
  mounted() {
    console.log("我是组件的mounted生命周期函数");
  },
  methods: {
    changeMsg() {
      this.msg = "我是变异的小猪课堂";
      console.log("更改后的msg:", this.msg);
    },
  },
};
</script>
```

### (3) 选项合并

1. 生命周期函数：先执行 `mixin` 中生命周期函数中的代码，然后在执行组件内部的代码。
2. `data` 数据 & 方法冲突：组件中的 `data` 数据 & 方法 会覆盖 `mixin` 中数据 & 方法。

### (4) `mixin` 优缺点

优点：

- 提高代码复用性
- 无需传递状态
- 维护方便，只需要修改一个地方即可

缺点：

- 命名冲突
- 不清晰的数据来源

## 自定义指令

### (1) 基本使用

自定义指令主要是为了**重用涉及普通元素的底层 DOM 访问的逻辑**。

一个自定义指令由一个包含**类似组件生命周期钩子的对象**来定义。钩子函数会接收到**指令所绑定元素作为其参数**。

在 `<script setup>` 中，任何**以 `v` 开头的驼峰式命名的变量**都可以当作自定义指令使用。

下面是一个自定义指令的例子，当 Vue 将元素插入到 DOM 中后，该指令会将一个 class 添加到元素中：

```vue
<script setup>
// 在模板中启用 v-highlight
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>This sentence is important!</p>
</template>
```

在不使用 `<script setup>` 的情况下，自定义指令需要通过 `directives` 选项注册。

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-highlight
    highlight: {
      /* ... */
    }
  }
}
```

将一个自定义指令**全局注册到应用层级**。

```js
const app = createApp({})

// 使 v-highlight 在所有组件中都可用
app.directive('highlight', {
  /* ... */
})
```

### (2) 自定义指令的使用时机

只有当所需功能只能通过**直接的 DOM 操作来实现**时，才应该使用自定义指令。

建议尽可能使用 `v-bind` 等**内置指令声明模板**，因为它们更高效，对服务端渲染也更友好。

常见例子使元素获取焦点的 `v-focus` 指令。

该指令**比 `autofocus` 属性更有用**，因为它不仅在**页面加载**时有效，而且在 Vue **动态插入元素**时也有效！

```vue
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

### (3) 指令钩子

```javascript
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```

钩子参数

- `el`：指令绑定到的元素。这可以用于直接操作 DOM。
- `binding`：一个对象，包含以下属性。
  - `value`：传递给指令的值。例如在 `v-my-directive="1 + 1"` 中，值是 `2`。
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
  - `arg`：传递给指令的参数 (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 `"foo"`。
  - `modifiers`：一个包含修饰符的对象 (如果有的话)。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。
  - `instance`：使用该指令的组件实例。
  - `dir`：指令的定义对象。
- `vnode`：代表绑定元素的底层 `VNode`。
- `prevVnode`：代表之前的渲染中指令所绑定元素的 `VNode`。仅在 `beforeUpdate` 和 `updated` 钩子中可用。

示例：像下面这样使用指令

```vue
<div v-example:foo.bar="baz">
```

`binding` 参数会是一个这样的对象：

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
}
```

### (4) 简化形式

仅仅需要在 `mounted` 和 `updated` 上实现相同的行为，除此之外并不需要其他钩子。

```vue
<div v-color="color"></div>
```

```javascript
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

如果你的指令需要多个值，你可以向它传递一个 JavaScript **对象字面量**。

```vue
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## Vue2自定义指令

`Vue.directive()` 新建一个全局指令，指令使用在 HTML 元素属性上。

`Vue.directive('focus')` 第一个参数 `focus` 是指令名，指令名在声明的时候，不需要加 `v-`。

在使用指令的 HTML 元素上,需要加上 `v-`。

### (1) 指令钩子

- `bind`：只调用一次，指令第一次绑定到元素时调用。进行一次性的初始化设置。
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- `update`：所在组件的 `VNode` 更新时调用，但是可能发生在其子 `VNode` 更新之前。指令的值可能发生了改变，也可能没有。
- `componentUpdated`：指令所在组件的 `VNode` 及其子 `VNode` 全部更新后调用。
- `unbind`：只调用一次，指令与元素解绑时调用。

```js
Vue.directive('gqs',{
    bind() {
      console.log('bind triggerd')
    },
    inserted() {
      console.log('inserted triggerd')
    },
    updated() {
      console.log('updated triggerd')
    },
    componentUpdated() {
      console.log('componentUpdated triggerd')
      
    },
    unbind() {
      console.log('unbind triggerd')
    }
  })
```

### (2) 指令钩子参数

- `el`：指令所绑定的元素，可以用来直接操作 DOM。
- `binding` 一个对象，包含以下属性：
  - `name`：指令名，不包括 `v-` 前缀。
  - `value`：指令的绑定值。
    - 如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
  - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。
    - 如：`v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  - `arg`：传给指令的参数，可选。
    - 如：`v-my-directive:foo` 中，参数为 `"foo"`。
  - `modifiers`：一个包含修饰符的对象。
    - 如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
- `vnode`：Vue 编译生成的虚拟节点。
- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 `dataset` 来进行。

### (3) 指令简写

当元素状态发生改变，利用指令的 `update` 钩子函数监控元素变化。

```js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

### (4) 示例：自动获取焦点

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

## 插件

插件 (*Plugins*) 是一种能为 Vue 添加全局功能的工具代码。

### (1) 基本使用

编写插件，一个插件可以是一个拥有 `install()` 方法的对象，也可以直接是一个安装函数本身。安装函数会接收到安装它的应用实例和传递给 `app.use()` 的额外选项作为参数。

```js
const myPlugin = {
  install(app, options) {
    // 在这里编写插件代码
  }
}
```

在 `main.js` 中导入插件，`app.use()` 使用插件。

```js
import { createApp } from 'vue'
const app = createApp({})
app.use(myPlugin, {
  /* 可选的选项 */
})
```

适用场景：

1. 通过 `app.component()` 和 `app.directive()` 注册一到多个全局组件或自定义指令。
2. 通过 `app.provide()` 使一个资源可被注入进整个应用。
3. 向 `app.config.globalProperties` 中添加一些全局实例属性或方法。

### (2) 编写插件

以一个简单的 `i18n` ( *Internationalization*，国际化的缩写)  插件为例。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // 注入一个全局可用的 $translate() 方法
    app.config.globalProperties.$translate = (key) => {
      // 获取 `options` 对象的深层属性
      // 使用 `key` 作为索引
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

```js
import i18nPlugin from './plugins/i18n'
app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

```html
<!-- 使用方式 -->
<h1>{{ $translate('greetings.hello') }}</h1>
```

## 设置全局变量和方法

Vue2：`Vue.prototype.$xxxx=xxx` ，通过 `this.$xxx` 来获取挂载到全局的变量或者方法。

Vue3：`config.globalProperties`，这些 `properties` 将被复制到应用中作为实例化组件的一部分。

```js
// Vue2
// 定义全局变量
Vue.prototype.$http = () => {}
// 定义全局方法
Vue.prototype.$myGlobalMethod = function () {
  console.log('这是一个全局方法');
};

// Vue3
const app = createApp({})
// 定义全局变量
app.config.globalProperties.$http = () => {}
// 定义全局方法
app.config.globalProperties.$myGlobalMethod = function () {
  console.log('这是一个全局方法');
};
```

## 工具函数

(1) `Vue.util`

`Vue.util`：是 Vue 内部的一个工具函数集合（非公开，不稳定）。

- `Vue.util.extend`：将一个或多个对象的属性混合到目标对象中，用于对象的深拷贝。
- `Vue.util.merge`：合并对象。

(2) `Vue.set`

`Vue.set`：用于向响应式对象添加一个新的属性，并确保该属性是响应式的。

```js
Vue.set(obj, props, value);
this.$set(obj, props, value);
Vue.set(obj1, 'newProperty', 'Hello, Vue!');
```

(3) `Vue.delete`

`Vue.delete`：删除响应式对象的属性，不能用于普通的 JavaScript 对象。

删除数组元素，优先使用 Vue 重写的方法 `pop/push/shift/unshift/splice/sort/reverse`

```js
Vue.delete(obj, props);
Vue.delete(obj1, 'deleteProperty');
```

(4) `Vue.nextTick`

`Vue.nextTick`：是一个异步队列，用于在 DOM 更新后执行回调函数。

## `nextTick`

`nextTick`：用于在下次 DOM 更新时执行回调，提供了一种在 DOM 更新后执行操作的方式。

> 其本质是对 JavaScript 执行 *Event Loop* 的一种应用。

（1）工作原理

1. Vue 中数据变化不会触发视图更新（立即更新 DOM），而是**异步批量更新**，将 DOM 更新操作放入队列。
2. `nextTick` 会将回调加入一个队列，在**下次 DOM 更新完成后执行**，确保你能拿到最新的 DOM。
3. 多个 `nextTick` 会被推入同一个队列，**按顺序依次执行（微任务）**。

（2）实现机制

核心是利用 JS 原生的异步任务机制（如 `Promise`、`MutationObserver`、`setTimeout` 等）模拟微任务/宏任务，实现 Vue 的异步更新队列。

(3) 异步更新

Vue 会在同一个更新周期内缓冲多次状态修改，只更新一次 DOM。

> 避免频繁、重复 DOM 操作，提升性能。

（4）使用场景

需要在数据变化后立即访问更新后的 DOM，应使用 `nextTick` 或 `$nextTick`。

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // 现在 DOM 已经更新了
}
```

```js
this.someData = 'new data';
this.$nextTick(() => {
  console.log(this.$refs.someElement); // 确保获取到最新的 DOM
});
```

(5) 运用在生命周期钩子

`nextTick`：在一些视图更新相关的生命周期钩子（如 `mounted`、`updated`）中非常有用。

- `mounted`：组件挂载后使用 `$nextTick`，确保操作的是初始渲染后的 DOM。
- `updated`：数据更新后使用 `$nextTick`，确保操作的是更新后的 DOM。

```js
mounted() {
  this.$nextTick(() => {
    console.log('DOM has been mounted');
  });
}
```

# Vue3 应用规模化

## 单文件组件

`.vue` 文件：包含 `HTML | JS | CSS` 代码的文件，将组件的模板、逻辑、样式封装在一个文件中。

Vue 的单文件组件是框架指定的文件格式，浏览器不认识，需要编译器编译为 JS 和 CSS。

## `<style scoped>` 样式隔离

1. 生成唯一类名：Vue 编译器为组件中的每个元素生成一个唯一类名（作用域标识符-`hash` 值），保证样式只作用于当前组件。
2. CSS样式的自动作用域绑定：Vue 编译器会遍历 ` <style scoped>` 中所有的 CSS 选择器，并通过新增的动态属性，确保样式只在当前组件生效。

**生成唯一的作用域标识符**：**根据当前组件的 ID 或文件名生成一个唯一的哈希值**，并附加到样式选择器和元素的 `class` 属性中。

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

```vue
<!-- 转换为 -->
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

## 服务端渲染 (SSR)

(1) 相关概念

1. SSR（*Server Side Rendering*，服务器端渲染）在服务器生成 HTML 文件返回给浏览器，浏览器将静态的 HTML 文件激活（*Hydrate*）为能够交互的客户端应用。
2. CSR（*Client Side Rendering*，客户端渲染）浏览器会下载一个包含 JavaScript 代码的文件，并在客户端执行该代码来构建和呈现页面。这意味着页面初始加载时只是一个空壳，页面内容需要在浏览器中通过 JavaScript 进行渲染。

> Vue 默认情况下在客户端渲染，在浏览器中生成和操作 DOM。

3. SSG（*Static-Site Generation*，静态站点生成，也被称为预渲染）是一种构建快速网站的技术。如果用服务端渲染一个页面所需的数据对每个用户来说都是相同的，可以只渲染一次，提前在构建过程中完成，而不是每次请求进来都重新渲染页面。预渲染的页面生成后作为静态 HTML 文件被服务器托管。

> 相比 SSR 的优势：更快的首屏加载，更小的花销，更容易部署。因为它输出的是静态 HTML 和资源文件。
>
> SSG 仅可以用于提供静态数据的页面，即数据在构建期间就是已知的，并且在多次请求之间不能被改变。**每当数据变化时，都需要重新部署。**

(2) SSR 优势

1. 更快的首屏加载：完整 HTML，无需下载执行 JS。
2. 更好的用户体验：减少了白屏时间和加载等待。
3. 更好的搜索引擎优化（SEO）：搜索引擎爬虫能够抓取到完整的 HTML 页面，并且页面内容可直接被搜索引擎索引。

