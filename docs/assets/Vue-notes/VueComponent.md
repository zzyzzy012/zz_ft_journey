# Vue3 组件与内置组件

## 组件

### 注册

**(1) 全局注册**

缺点：

1. 全局注册，但并没有被使用的组件无法在生产打包时被自动移除 (也叫*tree-shaking*)。如果你全局注册了一个组件，即使它并没有被实际使用，它仍然会出现在打包后的 JS 文件中。
2. 全局注册在大型项目中使项目的依赖关系变得不那么明确。在父组件中使用子组件时，不太容易定位子组件的实现。和使用过多的全局变量一样，这可能会影响应用长期的可维护性。

```javascript
// 全局注册
// 1.导入组件
import MyComponent from '@/components/MyComponent.vue'
// 2.全局注册
app.component('MyComponent', MyComponent)
// 支持链式调用
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

**(2) 局部注册**

依赖关系更加明确，对 *tree-shaking* 更加友好。**局部注册的组件在后代组件中不可用。**

```vue
<script setup>
// 局部注册
// 1.导入注册，直接使用
import ComponentA from './ComponentA.vue'
</script>

<template>
	<!-- 2.使用 -->
  <ComponentA />
</template>
```

如果没有使用 `<script setup>`，则需要使用 `components` 选项来显式注册。

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

**(3) 定义全局注册的插件**

```js
// @/components/index.vue
import ImgView from './ImgView.vue'
import GoodsSku from './GoodsSku/index.vue'

export const componentPlugin = {
  install (app) {
      app.component('ImgView', ImgView)
      app.component('GoodsSku', GoodsSku)
  }
}

```

```js
// main.js
import { componentPlugin } from '@/components/index'
app.use(componentPlugin)
```

**(4) 组件名格式**

- 在模板中推荐写 `<PascalCase />` ，与原生HTML标签区分。
- DOM内模板不支持 `<PascalCase />`，在模板中可以使用 `<MyComponent>` 或 `<my-component>` 引用。

### Props⭐

**(1) `props` 声明**

父传子：`:prop`

```vue
<!-- Parent.vue -->
<script setup>
import Child from './Child.vue'
</script>

<template>
  <Child msg="Hello" :count="100" />
</template>
```

子接收父传递的数据：`defineProps()`

```vue
<!-- Child.vue -->
<script setup lang="ts">
defineProps<{
  msg: string
  count: number
}>()
</script>

<template>
  <div>{{ msg }} - {{ count }}</div>
</template>
```

没有使用 `<script setup>` 的组件中，`props` 可以使用 `setup(props)` 选项来声明。

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() 接收 props 作为第一个参数
    console.log(props.foo)
  }
}
```

**(2) 响应式解构**

```js
const props = defineProps(['foo'])
// 下面这种会失去响应性
const { foo } = defineProps(['foo'])
// 监听响应式数据，使用get
watch(() => foo, /* ... */)
```

**(3) 传递 `Prop` 的细节**

① `{{}}` 内应使用 *camelCase* 形式，*HTML attribute* 通常为 *kebab-case* 形式。

```vue
defineProps({
  greetingMessage: String
})

<span>{{ greetingMessage }}</span>
<MyComponent greeting-message="hello" />
```

② 静态/动态 `props`

```vue
<!-- 静态 -->
<BlogPost title="My journey with Vue" />
<!-- 动态v-bind简写 -->
<BlogPost :title="post.title" />
```

③ 传递不同的值

Ⅰ `Number`：`<BlogPost :likes="42" />` 加 `:` 会被识别表达式而不是字符串。

Ⅱ `Boolean`

```vue
<!-- 仅写上 prop 但不传值，会隐式转换为 `true` -->
<BlogPost is-published />

<!-- 虽然 `false` 是静态的值，我们还是需要使用 v-bind -->
<!-- 因为这是一个 JavaScript 表达式而不是一个字符串 -->
<BlogPost :is-published="false" />

<!-- 根据一个变量的值动态传入 -->
<BlogPost :is-published="post.isPublished" />
```
Ⅲ `Array`、`Object` 传递给 `prop` 为字面量也需要 `:`。

```vue
<!-- 数组字面量 -->
<BlogPost :comment-ids="[234, 266, 273]" />
<!-- 对象字面量 -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />
```
**④ 使用一个对象绑定多个值**

```vue
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
<BlogPost v-bind="post" />
<!-- 等价于下面 -->
<BlogPost :id="post.id" :title="post.title" />
```

**(4) 单向数据流动**

所有 `props` 都遵循单向数据流动，因此不应该在子组件中修改 `props`。

**(5) `prop` 校验**

- 校验选项中的 `type` 可以是下列这些原生构造函数：`String`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`、`Error`。
- `type` 也可以是自定义的类或构造函数，Vue 通过 `instanceof` 来检查是否匹配。

```javascript
defineProps({
  // 基础类型检查
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // Number 类型的默认值
  propE: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propF: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propG: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  }
})
```

(6) `withDefaults(defineProps<T>(), {})` 为 `defineProps()` 设置默认值。

### 事件⭐

**(1) 触发与监听事件**

子组件使用 `defineEmits()` 来定义和发射事件

- 在子组件中，使用 `defineEmits()` 来声明可以触发的事件。
- 通过 `emits('事件名', 参数)` 将该事件发射数据到父组件。

```javascript
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['increment'])
const emitIncrement = (n) => {
  emits('increment', n)
}
</script>

<template>
  <div>
    {{ props.title }}
    <button @click="emitIncrement(5)">click me increment count: {{ count }}</button>
  </div>
</template>
```

父组件通过 `@事件名` 来监听子组件发射的事件。

```javascript
<script setup>
import { ref } from 'vue'
import ChildComponent from '@/components/ChildComponent.vue'

const title = ref('hello vue3')
const count = ref(0)

const onIncrement = (n) => {
  // count.value++
  count.value += 5
}
</script>

<template>
  <div>
    <ChildComponent :title="title" :count="count" @increment="onIncrement"></ChildComponent>
  </div>
</template>
```

事件名格式同 `Props` 一样，在 JS 中推荐 `camelCase` 形式，在模板中推荐 `kebab-case` 形式。

**(2) 声明触发的事件**

在模板中，子组件可以通过 `$emit` 自定义事件。

```vue
<!-- MyComponent -->
<button @click="$emit('someEvent')">Click Me</button>
<!-- 父组件通过@事件名 监听事件 -->
<MyComponent @some-event="callback" />
```

在 `<script setup>` 中，通过 `defineEmits()` 定义事件。

如果你显式地使用了 `setup` 函数而不是 `<script setup>`，则事件需要通过 `emits` 选项来定义，`emit` 函数也被暴露在 `setup()` 的上下文对象上，可以安全解构 `emit`。

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
  // 安全解构
  setup(props, { emit }) {
    emit('submit')
  }
}
```

### 组件 `V-model`❗⭐

#### (1) 基本用法

`defineModel()` 在子组件上定义，可以修改父组件中传递过来的数据。

`defineModel()` 返回的值是一个 `ref`。它可以像其他 `ref` 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用：

- 它的 `.value` 和父组件的 `v-model` 的值同步；
- 当它被子组件变更了，会触发父组件绑定的值一起更新。

`defineModel` 是一个便利宏。编译器将其展开为以下内容：

- 一个名为 `modelValue` 的 `prop`，本地 `ref` 的值与其同步；
- 一个名为 `update:modelValue` 的事件，当本地 `ref` 的值发生变更时触发。

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>
```

`v-model` 在父组件的子组件上绑定，实现数据的双向绑定。

```vue
<!-- Parent.vue -->
<Child v-model="countModel" />
```

#### (2) 底层机制

- vue2中，`v-model` 是 `:value` 和 `@input` 的简写。
- vue3中，`v-model` 是 `:modelValue=username` 和 `@update:modelValue="$event => (username = $event)"` 的简写。
  - 如果是 `input` 元素，可以简写 `:value="username"` 和 ` @input="$event => (username = $event)"`。
  - 在组件中通过 `v-model` 简写，需要用 `defineProps` 接收数据和 `defineEmits` 发送事件。

```vue
<!-- Parent.vue -->
<!-- 1.原生HTML元素 -->
<!-- <input v-model="username" />  // 简写 -->
<input
  :value="username"
  @input="username = $event.target.value"
/>
<!-- 2.用在组件上 -->
<!-- <Child v-model="username" />  // 简写 -->
<Child :modelValue="username" @update:modelValue="$event => (username = $event)" />
```

```vue
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
<!-- 因为是input元素，可以用:value和@input简写，其他元素需要写:value=modelValue和@update:modelValue -->
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

#### (3) 实战案例

`ChannelSelect.vue`，在子组件中通过 `defineModel()` 绑定父组件传递的数据，`v-model` 也可以直接绑定。

```vue
<script setup>
import { useArticleStore } from '@/stores/index'
import { onMounted } from 'vue'

const articleStore = useArticleStore()
onMounted(() => articleStore.getChannelList())
const channelList = articleStore.channelList

// defineProps({
//   modelValue: {
//     type: [Number, String]
//   }
// })
// defineEmits(['update:modelValue'])
// 是defineProps() 和 defineEmits() 的遍历宏
const model = defineModel({
  name: 'modelValue',
  type: [Number, String],
})
</script>

<template>
  <!-- :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" -->
  <div class="channel-select" style="width: 100%;">
    <el-select
    placeholder="请选择"
    style="width: 100%;"
    v-model="model"
    >
      <!-- label为显示的文字，value为选中的值，一般是id -->
      <el-option v-for="channel in channelList" :key="channel.id" :label="channel.cate_name" :value="channel.id"></el-option>
    </el-select>
  </div>
</template>
```

在父组件中通过 `v-model` 绑定。

```vue
<!-- vue2中，v-model是:value和@input的简写 -->
<!-- vue3中，v-model是:modelValue=""和@update:modelValue的简写 -->
<!-- 运用到子组件的V-model绑定数据 -->
<Channel-select v-model="params.cate_id"></Channel-select>
```

### 透传 Attributes

#### (1) Attributes继承

`透传 *attribute`：指的是传递给一个组件，却没有被该组件声明为 `props` 或 `emits` 的 `attribute` 或者 `v-on` 事件监听器。

> 如 `class`、`style` 和 `id`。

单一根节点组件，`$attrs` 中的所有属性都是直接自动继承自组件的根元素。多根节点组件则不会如此，需要显示绑定 `$attrs` 。

> 如果一个子组件的根元素已经有了 `class | style attribute`，它会和从父组件上继承的值合并。同样的规则也适用于 `v-on` 事件监听器。

访问 `attrs`

1. 在模板中通过 `$attrs`

```html
<span>Fallthrough attribute: {{ $attrs }}</span>
```

1. 在 JS 中通过
   1. `<script setup>` 中使用 `useAttrs()`
   2. 没有使用 `<script setup>`，`attrs` 会作为 `setup(props,context)` 上下文对象的一个属性暴露

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<script>
  export default {
    setup(props, ctx) {
      // 透传 attribute 被暴露为 ctx.attrs
      console.log(ctx.attrs)
    }
  }
</script>
```

- 和 `props` 有所不同，`透传 attributes` 在 JS 中保留了它们原始的大小写，如像 `foo-bar`  的`attribute` 需要通过 `$attrs['foo-bar']` 访问。
- 像 `@click` 的 `v-on` 事件监听器通过 `$attrs.onClick` 访问。

#### (2) 禁用 Attributes 继承

`inheritAttrs: false`：禁止组件继承。

> 场景：`attrs` 需要应用在根节点以外的其他元素上。
>

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
</script>
```

#### (3) 多根节点的 Attributes 继承

单根节点能自动透传 `attrs`，多根节点需要显示绑定 `attrs`，否则会抛出一个运行时警告。

```vue
<!-- 显式绑定 $attrs -->
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

#### (4) 祖孙通信

父组件定义数据和接受子组件数据的方法，通过 `v-bind` 传递给子组件，子组件不通过 `defineProps` 接收，通过 `v-bind="$attrs"` 传递给孙组件，孙组件通过 `defineProps` 接收。

```vue
<!-- parent.vue -->
<script setup>
import { ref } from 'vue'
import ChildComponent from '@/components/ChildComponent'  
  
const a = ref('a')
const b = ref('b')
const c = ref('c')

const receivedData = ref('')
const receiveGrandData = (value) => {
  receivedData.value = value
}
</script>

<template>
  <div>
    <p>父组件数据展示：a:{{ a }}, b:{{ b }}, c: {{ c }}</p>
    <!-- v-bind="{}"可以更对象格式 -->
    <!-- 表示:a="a" :b="b" :c="c" -->
    <ChildComponent v-bind="{a: a, b: b, c: c, receiveGrandData: receiveGrandData}"></ChildComponent>
  </div>
</template>
```

子组件没有用 `defineProps()` 接收，则都在 `$attrs` 上，通过 `v-bind="$attrs"` 传递给孙组件。

```vue
<script setup>
import GrandChildComponent from './GrandChildComponent.vue'
</script>

<template>
  <div>
    <GrandChildComponent v-bind="$attrs"></GrandChildComponent>
  </div>
</template>
```

在孙组件上通过 `defineProps()` 接收子组件的 `$attrs`。

```vue
<script setup>
import { ref } from 'vue'

defineProps(['a', 'b', 'c', 'receiveGrandData'])
const d = ref('d')
</script>

<template>
  <div>
    <span>{{ a }}</span>
    <span>{{ b }}</span>
    <span>{{ c }}</span>
    <span>孙组件数据： {{ d }}</span>
    <button @click="receiveGrandData(d)">click me send d to parent.vue</button>
  </div>
</template>
```

### 依赖注入⭐

避免 `prop` 的逐级透传问题。

`provide` 和 `inject`：一个父组件相对于其所有的后代组件，会作为**依赖提供者**。任何后代的组件树，无论层级有多深，都可以**注入**由父组件提供给整条链路的依赖。

![](.\vue3-images\provide-inject.C0gAIfVn.png)



#### (1) `provide()`

`provide()` 为组件后代提供数据。接受两个参数：分别是注入名和是要提供的值。

```js
provide(key,value)
// key 可以是 String | Symbol
```

```vue
<script setup>
import { ref, provide } from 'vue'
import { countSymbol } from './injectionSymbols'

// 提供静态值
provide('path', '/project/')

// 提供响应式的值
const count = ref(0)
provide('count', count)

// 提供时将 Symbol 作为 key
provide(countSymbol, count)
</script>
```

应用层 `app.provide()`：在该应用中的所有组件都可以注入。

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

#### (2) `inject()`

`inject()` 注入一个由祖先组件或整个应用 `app.provide()` 提供的值。

1. 第一个参数是注入的 `key`。
2. 第二个参数是可选的，即在没有匹配到 `key` 时使用的默认值。第二个参数也可以是一个工厂函数，用来返回某些创建起来比较复杂的值。在这种情况下，你必须将 `true` 作为第三个参数传入，表明这个函数将作为工厂函数使用，而非值本身。

```vue
<script setup>
import { inject } from 'vue'
import { countSymbol } from './injectionSymbols'

// 注入不含默认值的静态值
const path = inject('path')

// 注入响应式的值
const count = inject('count')

// 通过 Symbol 类型的 key 注入
const count2 = inject(countSymbol)

// 注入一个值，若为空则使用提供的默认值
const bar = inject('path', '/default-path')

// 注入一个值，若为空则使用提供的函数类型的默认值
const fn = inject('function', () => {})

// 注入一个值，若为空则使用提供的工厂函数
const baz = inject('factory', () => new ExpensiveObject(), true)
</script>
```

#### (3) 和响应式数据配合使用

如果提供的值是一个 `ref`，**不会自动解包为其内部的值**。

> 这使得注入方组件能够通过 `ref` 对象保持了和供给方的响应性链接。

当提供 / 注入响应式的数据时，**建议响应式数据和更改数据的方法函数都保持在供给方组件中**。

> 这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。

```vue
<!-- 在供给方组件内 -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue
<!-- 在注入方组件 -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

如果希望传递的数据不被修改，可以使用 `readonly()` 函数包装传递的值。

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

`InjectionKey<T>` 是 `Symbol` 类型的 `key`，带有类型信息

用它当作 `provide/inject` 的 `key` 时，`inject()` 会自动推导出类型

```js
provide('collapseKey', value)
inject('collapseKey')
```

问题：

1. 类型不确定：`inject` 时不知道返回的数据类型
2. 容易冲突：字符串可能在多个地方被重复使用

### 插槽Slots⭐

#### (1) 插槽内容与出口

> 场景：为子组件传递模板片段，让子组件在它们的组件中渲染这些片段。让组件在不同的地方可以渲染不同但格式相似的内容。
>

**`<slot>` 元素是一个插槽出口（*slot outlet*），标示了父元素提供的插槽内容（*slot content*）将在哪里被渲染。**

`<slot>` 用在子元素中，因为不确定内容，但确定结构；在父元素中通过 `<template>`，在里面写内容。

如果是具名插槽 `<slot name="header">`，则在 `<template v-slot:header>` 或 `<template #header>` 中写内容。

![](.\vue3-images\slots.CKcE8XYd.png)

#### (2) 渲染作用域

插槽内容**可以访问**到父组件的数据作用域，因为插槽内容本身是在父组件模板中定义的。

插槽内容**无法访问**子组件的数据。**Vue 模板中的表达式只能访问其定义时所处的作用域**，这和 JavaScript 的词法作用域规则是一致的。**父组件模板中的表达式只能访问父组件的作用域；子组件模板中的表达式只能访问子组件的作用域。**

#### (3) 默认内容

在子组件的 `<slot></slot>` 内部定义默认内容即可。

```vue
<button type="submit">
  <slot>
    <!-- 默认内容 -->
    Submit
  </slot>
</button>
```

#### (4) 具名插槽

**具名插槽（*named slots*）**：带 `name` 的插槽。没有提供 `name` 的 `<slot>` 出口会隐式地命名为 `default`。

```vue
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

要为具名插槽传入内容，使用一个含 `v-slot` 指令的 `<template>` 元素，并将目标插槽的名字传给该指令，可以简写为 `#`。`#default` 是默认插槽，可以省略不写。

```vue
<BaseLayout>
  <!-- <template v-slot:header> 可以简写为 <template #header> -->
  <template v-slot:header>
    <!-- header 插槽的内容放这里 -->
  </template>
</BaseLayout>
```

![](.\vue3-images\named-slots.CCIb9Mo_.png)

```vue
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>
  
	<!-- 默认插槽 -->
  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>
  <!-- 隐式的默认插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

#### (5) 条件插槽

结合 `$slots` 和 `v-if` 实现。

`header`、`footer` 和 `default` 插槽内容存在，才会渲染。

```vue
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

#### (6) 作用域插槽

> 在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。需要一种方法来让子组件在渲染时将一部分数据提供给插槽。
>

可以像对组件传递 `props` 那样，向一个插槽的出口上传递 `attributes`。

```vue
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

当需要接收插槽 `props` 时，默认插槽和具名插槽的使用方式有一些小区别。

① 默认插槽通过子组件 `<template>` 标签上的 `v-slot="slotProps"` 接收 `props`。

`slotProps` 是一个对象，包括子组件向父组件传递的所有 `props` 数据。

```vue
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>

<!-- 对象解构 -->
<MyComponent v-slot="{text, count}">
  {{ text }} {{ count }}
</MyComponent>
```

![](.\vue3-images\slotProps.svg)

②具名作用域插槽通过子组件 `<template>` 标签的 `v-slot:name="slotProps"` 或者 `#name="slotProps"` 接收 `props`。

```vue
<!-- Game.vue 的模板 -->
<template>
  <div class="game">
    <slot name = "game" :game="games" :title="title">游戏</slot>
  </div>
</template>
```

```vue
<Game>
  <template v-solt:game="gameProps">
    {{ gameProps }}
  </template>
</Game>
```

③如果同时使用了具名插槽与默认插槽，则需要**为默认插槽使用显式的 `<template>` 标签**。

```vue
<!-- <MyComponent> template -->
<div>
  <slot :message="hello"></slot>
  <slot name="footer" />
</div>
```

```vue
<MyComponent>
  <!-- 使用显式的默认插槽 -->
  <template #default="{ message }">
    <p>{{ message }}</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</MyComponent>
```

### 异步组件

#### (1) 基本使用

`defineAsyncComponent`：在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载相关组件。可以传递两种类型的参数，分别是**函数类型和对象类型**。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 `AsyncComp`
```

可以用来导入 Vue 单文件组件。最后得到的 `AsyncComp` 是一个外层包装过的组件，**仅在页面需要它渲染时才会调用加载内部实际组件的函数。**它会将接收到的 `props` 和插槽传给内部组件，所以你可以使用这个异步的包装组件无缝地替换原始组件，同时实现**延迟加载**。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

接收一个对象作为参数，该对象中有如下几个参数：

- `loader`：同工厂函数；
- `loadingComponent`：加载异步组件时展示的组件；
- `errorComponent`：加载组件失败时展示的组件；
- `delay`：显示 `loadingComponent` 之前的延迟时间，单位毫秒，默认200毫秒；
- `timeout`：如果提供了 `timeout`，并且加载组件的时间超过了设定值，将显示错误组件，默认值为`Infinity`（单位毫秒）；
- `suspensible`：异步组件可以退出 `<Suspense>` 控制，并始终控制自己的加载状态。
- `onError`：一个函数，该函数包含4个参数，分别是 `error`、`retry`、`fail` 和 `attempts`，这4个参数分别是错误对象、重新加载的函数、加载程序结束的函数、已经重试的次数。

```vue
<template>
  <logo-img />
  <hello-world msg="Welcome to Your Vue.js App" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import LogoImg from './components/LogoImg.vue'
import LoadingComponent from './components/loading.vue'
import ErrorComponent from './components/error.vue'

// 定义一个耗时执行的函数，t 表示延迟的时间， callback 表示需要执行的函数，可选
const time = (t, callback = () => {}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      callback()
      resolve()
    }, t)
  })
}
// 记录加载次数
let count = 0
const HelloWorld = defineAsyncComponent({
  // 工厂函数
  loader: () => {
    return new Promise((resolve, reject) => {
      ;(async function () {
        await time(300)
        const res = await import('./components/HelloWorld.vue')
        if (++count < 3) {
          // 前两次加载手动设置加载失败
          reject(res)
        } else {
          // 大于3次成功
          resolve(res)
        }
      })()
    })
  },
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 0,
  timeout: 1000,
  suspensible: false,
  onError(error, retry, fail, attempts) {
    // 注意，retry/fail 就像 promise 的 resolve/reject 一样：
    // 必须调用其中一个才能继续错误处理。
    if (attempts < 3) {
      // 请求发生错误时重试，最多可尝试 3 次
      console.log(attempts)
      retry()
    } else {
      fail()
    }
  },
})
</script>
```

与普通组件一样，异步组件可以使用 `app.component()` 全局注册。

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

局部注册：在父组件中直接定义。

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

#### (2) 加载与错误状态

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

#### (3) 惰性激活

场景：使用服务器端渲染。

在 Vue 3.5+ 中，**异步组件可以通过提供激活策略来控制何时进行激活。**

- Vue 提供了一些内置的激活策略。这些内置策略需要分别导入，以便在未使用时进行 tree-shake。
- 该设计有意保持在底层，以确保灵活性。将来可以在此基础上构建编译器语法糖，无论是在核心还是更上层的解决方案 (如 Nuxt) 中实现。

**① 在空闲时进行激活**

通过 `requestIdleCallback` 进行激活。

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* 传递可选的最大超时 */)
})
```

**② 在可见时激活**

通过 `IntersectionObserver` 在元素变为可见时进行激活。

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

可以选择传递一个侦听器的选项对象值：

```js
hydrateOnVisible({ rootMargin: '100px' })
```

**③ 当指定的媒体查询匹配时进行激活**

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

**④ 交互时激活**

当组件元素上触发指定事件时进行激活。完成激活后，触发激活的事件也将被重放。

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

也可以是多个事件类型的列表：

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

**⑤ 自定义策略**

```js
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement 是一个遍历组件未激活的 DOM 中所有根元素的辅助函数，
  // 因为根元素可能是一个片段而非单个元素
  forEachElement(el => {
    // ...
  })
  // 准备好时调用 `hydrate`
  hydrate()
  return () => {
    // 如必要，返回一个销毁函数
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

### mitt

[mitt官网](https://github.com/developit/mitt)

创建 `utils/emitter.js`

```js
import mitt from 'mitt'
const emiiter = mitt()
export default emiiter
```

在 `main.js` 中导入

```js
import emiter from '@/utils/emitter'
app.use(emiter)
```

基本语法

```js
import mitt from 'mitt'

const emitter = mitt()

// listen to an event
emitter.on('foo', e => console.log('foo', e) )

// listen to all events
emitter.on('*', (type, e) => console.log(type, e) )

// fire an event
emitter.emit('foo', { a: 'b' })

// clearing all events
emitter.all.clear()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```

# 内置组件

## `<Transition>`

### (1) 基本使用

它可以将进入和离开动画应用到通过默认插槽传递给它的元素或组件上。进入或离开可以由以下的条件之一触发：

- 由 `v-if | v-show` 所触发的切换
- 由特殊元素 `<component>` 切换的动态组件
- 改变特殊的 `key` 属性

当一个 `<Transition>` 组件中的元素被插入或移除时，会发生下面这些事情：

1. Vue 会自动检测目标元素是否应用了 CSS 过渡或动画。如果是，则一些 CSS 过渡 class 会在适当的时机被添加和移除。
2. 如果有作为监听器的 JavaScript 钩子，这些钩子函数会在适当时机被调用。
3. 如果没有探测到 CSS 过渡或动画、也没有提供 JavaScript 钩子，那么 DOM 的插入、删除操作将在浏览器的下一个动画帧后执行。

```vue
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css
/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

### (2) 基于 CSS 的过渡效果

**① CSS 过渡 `class`**

一共有 6 个应用于进入与离开过渡效果的 `CSS class`。

1. `v-enter-from | v-enter-active | v-enter-to`
2. `v-leave-from | v-leave-active | v-leave-to`

![](.\vue3-images\transition-classes.DYG5-69l.png)

**② 为过渡效果命名**

可以给 `<Transition>` 组件传一个 `name prop` 来声明一个**过渡效果名**。过渡 `class` 会以 `name- ` 作为前缀，而不是 `v-`。

```vue
<Transition name="fade">
  ...
</Transition>
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

**③ 原生 `CSS transition`**

`<Transition>` 一般都会搭配**原生 `CSS transition`**一起使用。

```vue
<Transition name="slide-fade">
  <p v-if="show">hello</p>
</Transition>
```

```css
/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

**④ 原生 `CSS animation`**

原生 `CSS animation` 和 `CSS transition` 的应用方式基本相同。

只有一点不同，`*-enter-from` 不是在元素插入后立即移除，而是在一个 `animationend` 事件触发时被移除。

对于大多数的 CSS 动画，可以简单地在 `*-enter-active` 和 `*-leave-active` 声明它们。

```vue
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Hello here is some bouncy text!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

### (3) JavaScript 钩子

可以通过监听 `<Transition>` 组件事件的方式在过渡过程中挂上钩子函数。这些钩子可以与 CSS 过渡或动画结合使用，也可以单独使用。

```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

```js
// 在元素被插入到 DOM 之前被调用
// 用这个来设置元素的 "enter-from" 状态
function onBeforeEnter(el) {}

// 在元素被插入到 DOM 之后的下一帧被调用
// 用这个来开始进入动画
function onEnter(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 当进入过渡完成时调用。
function onAfterEnter(el) {}

// 当进入过渡在完成之前被取消时调用
function onEnterCancelled(el) {}

// 在 leave 钩子之前调用
// 大多数时候，你应该只会用到 leave 钩子
function onBeforeLeave(el) {}

// 在离开过渡开始时调用
// 用这个来开始离开动画
function onLeave(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 在离开过渡完成、
// 且元素已从 DOM 中移除时调用
function onAfterLeave(el) {}

// 仅在 v-show 过渡中可用
function onLeaveCancelled(el) {}
```

在使用仅由 JavaScript 执行的动画时，最好是添加一个 `:css="false"` `prop`。这显式地向 Vue 表明可以跳过对 CSS 过渡的自动探测。除了性能稍好一些之外，还可以防止 CSS 规则意外地干扰过渡效果。

```vue
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

### (4) 何时过渡

**① 出现时过渡**

如果你想在某个节点初次渲染时应用一个过渡效果，你可以添加 `appear` `prop`。

```vue
<Transition appear>
  ...
</Transition>
```

**② 元素间过渡**

除了通过 `v-if | v-show` 切换一个元素，我们也可以通过 `v-if | v-else | v-else-if` 在几个组件间进行切换，只要确保任一时刻只会有一个元素被渲染即可：

```vue
<Transition>
  <button v-if="docState === 'saved'">Edit</button>
  <button v-else-if="docState === 'edited'">Save</button>
  <button v-else-if="docState === 'editing'">Cancel</button>
</Transition>
```

**③ 过渡模式**

```vue
<Transition mode="out-in">
  ...
</Transition>
```

**④ 使用 Key Attribute 过渡**

如果不使用 `key` `attribute`，则只有文本节点会被更新，因此不会发生过渡。但是，有了 `key` 属性，Vue 就知道在 `count` 改变时创建一个新的 `span` 元素，因此 `Transition` 组件有两个不同的元素在它们之间进行过渡。

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);

setInterval(() => count.value++, 1000);
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

## `<keepAlive>`

`<KeepAlive>` 是一个内置组件，它的功能是**在多个组件间动态切换时缓存被移除的组件实例**。

### (1) 基本使用

默认情况下，一个组件实例在被替换掉后会被销毁。这会导致它丢失其中所有已变化的状态——当这个组件再一次被显示时，会创建一个只带有初始状态的新实例。

想要组件能在被“切走”的时候保留它们的状态，可以用 `<KeepAlive>` 内置组件将这些动态组件包装起来。

```vue
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

### (2) 包含/排除

`<KeepAlive>` 默认会缓存内部的所有组件实例，但我们可以通过 `include` 和 `exclude` prop 来定制该行为。这两个 prop 的值都可以是一个以英文逗号分隔的字符串、一个正则表达式，或是包含这两种类型的一个数组：

```vue
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

它会根据组件的 `name` 选项进行匹配，所以组件如果想要条件性地被 `KeepAlive` 缓存，就必须显式声明一个 `name` 选项。

```javascript
<script setup>
defineOptions({
  name: 'MyComponent' // 显式声明组件的 name
})
// 相当于传统的 export default
export default {
  name: 'ComponentA', // 显式声明 name 选项
};
</script>
```

### (3) 最大缓存实例数

可以通过传入 `max` prop 来限制可被缓存的最大组件实例数。`<KeepAlive>` 的行为在指定了 `max` 后类似一个 [LRU 缓存](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))：如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

```vue
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

### (4) 缓存实例的生命周期

当一个组件实例从 DOM 上移除但因为被 `<KeepAlive>` 缓存而仍作为组件树的一部分时，它将变为**不活跃**状态而不是被卸载。当一个组件实例作为缓存树的一部分插入到 DOM 中时，它将重新**被激活**。

一个持续存在的组件可以通过 `onActivated(() => {})`和 `onDeactivated(() => {})` 注册相应的两个状态的生命周期钩子。

- `onActivated` 在组件挂载时也会调用，并且 `onDeactivated` 在组件卸载时也会调用。
- 这两个钩子不仅适用于 `<KeepAlive>` 缓存的根组件，也适用于缓存树中的后代组件。

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
</script>
```

