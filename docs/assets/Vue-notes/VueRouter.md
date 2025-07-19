# Vue 路由

## 路由基础

### 单页面应用

#### (1) 客户端路由

在单页应用(SPA)中将浏览器的 URL 和用户看到的内容绑定起来。当用户在应用中浏览不同页面时，URL 会随之更新，但页面不需要从服务器重新加载。

![](.\vue3-images\spaVSmpa.png)

- 单页应用类网站：系统类网站 / 内部网站 / 文档类网站 / 移动端站点
- 多页应用类网站：公司官网 / 电商类网站

#### (2) 客户端 vs. 服务端路由

服务端路由：指的是服务器根据用户访问的 URL 路径返回不同的响应结果。当我们在一个传统的服务端渲染的 web 应用中点击一个链接时，**浏览器会从服务端获得全新的 HTML，然后重新加载整个页面**。

在**单页面应用**中，客户端的 JavaScript 可以拦截页面的跳转请求，动态获取新的数据，然后**在无需重新加载的情况下更新当前页面**。这样通常可以带来更顺滑的用户体验，尤其是在**更偏向应用**的场景下，因为这类场景下用户通常会在很长的一段时间中做出多次交互。

在这类单页应用中，**路由是在客户端执行的**。一个客户端路由器的职责就是利用诸如 `History API` 或是`hashchange` 事件这样的浏览器 API 来管理应用当前应该渲染的视图。

### 创建路由器实例

1. `create-vue` 脚手架工具，自动配置好路由器实例 `router`，并且默认导出。
2. `createRouter()` 函数创建**路由器实例**。
3. 配合路由的组件放在 `@/views/xxx.vue` 或 `@/pages/xxx.vue` 文件夹中。

4. `component`：导入一个个路由组件。
   1. 页面开头路由组件 `import xxx from '@/views/xxx.vue'`；
   2. 箭头函数 `() => import()` 返回 `@/views/xxx.vue` 下面的路由组件。

字段属性：`history,routes,linkActiveClass,linkExactActiveClass,scrollBehavior,sensitive,strict`

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import news from '@/views/news.vue'
import movie from '@/views/movie.vue'
import comic from '@/views/comic.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 配置通用路由
    { path: '*', component: NotFound }
  	{ path: '/news', component:() => import('@/views/news.vue') },
    { path: '/movie', component:() => import('@/views/movie.vue') },
    { path: '/comic', component: () => import('@/views/comic.vue') },
  ]
})

export default router  // 默认导出路由器实例
```

### 注册路由器插件

`main.js` 文件导入 `router`，使用 `app.use()` 将其注册为插件。

和大多数的 Vue 插件一样，`use()` 需要在 `mount()` 之前调用。

插件作用：

1. 全局注册 `RouterView` 和 `RouterLink` 组件。
2. 添加全局 `$router` 和 `$route` 属性。
3. 启用 `useRouter()` 和 `useRoute()` 组合式函数。
   1. `useRouter()`：返回**路由器实例**。相当于在模板中使用 `$router`。
   2. `useRoute()`：返回**当前的路由地址**。相当于在模板中使用 `$route`。
4. 触发路由器解析初始路由。

```js
// main.js
// 导入 router
import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// app.use(createPinia())
app.use(router)

app.mount('#app')
```

### 访问路由器和当前路由

`router`：路由器实例，即由 `createRouter()` 返回的对象。

访问路由器 `router`：

- 在组合式 API 中，通过 `useRouter()` 访问。
- 在选项式 API 中，通过 `this.$router` 访问。

访问当前路由 `route`：

- 在组合式 API 中，通过 `useRoute()` 访问。
- 在选项式 API 中，通过 `this.$route` 访问。

```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
</script>
```

### `<RouterView>`

组件 `RouterView` 和 `RouterLink` 都是全局注册的，因此它们不需要在组件模板中导入。但也支持局部导入。

```js
import { RouterView, RouterLink } from 'vue-router'
```

```vue
<template>
  <div class="app">
    <div class="navigator">
      <RouterLink to="/news" class="news">news</RouterLink>
      <RouterLink to="/movie" class="movie">movie</RouterLink>
      <RouterLink to="/comic" class="comic">comic</RouterLink>
    </div>
    <div class="main-content">
      <RouterView></RouterView>
    </div>
  </div>
</template>
```

### `<RouterLink>`

`<RouterLink>` 组件替换 `<a>` 标签，`<RouterLink>` 在浏览器中就是 `<a>`。

```vue
<RouterLink to="/news" class="news">news</RouterLink>
<!-- 替换 a 标签-->
<!-- <a href="#/news">news</a> -->
```

(1) 能跳转：`to` 替换 `<a>` 标签的 `href`

`to` 的两种写法：① 字符串格式；② 对象格式。

```vue
<RouterLink to="/comic" class="comic">comic</RouterLink>
<RouterLink :to="{path:'/comic'}" class="comic">comic</RouterLink>
```

(2) 能高亮：添加类名 `class="router-link-active router-link-exact-active"`
- `.router-link-active`：模糊匹配
  - 比如 `to="/my"`，能匹配 `"/my"`、`"/my/a"`、`"/my/b"...`
- `.router-link-exact-active`：精确匹配
  - 比如 `to="/my"`，仅能匹配 `"/my"`

(3) 自定义高亮类名

① 全局改变类名：在创建路由器实例时 `@/router/index.js` 文件中，配置 `linkActiveClass` 和 `linkExactActiveClass`。

```js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
  activeClass: 'active',
  linkExactActiveClass: 'exact-active',
})
```

② 局部改变类名

```vue
<RouterLink
  :activeClass="custom-active"
  :exactActiveClass="custom-exact-active"
  ...
>
```

### 命名路由

`src/router/index.js` 配置命名路由，添加 `name:''` 属性。

```js
{name: 'manhua', path: '/comic', component:() => import('@/views/news.vue')}
```

`<RouterLink :to="">` 可以通过 `name` 路由**命名跳转**或者 `path` 路由**路径跳转**。

```js
<RouterLink :to="{name:'manhua'}" class="comic">comic</RouterLink>
<RouterLink :to="{path:'/comic'}" class="comic">comic</RouterLink>
```

所有路由的命名**都必须是唯一的**。如果为多条路由添加相同的命名，路由器只会保留最后那一条。

使用 `name` 优点：

- 没有硬编码的 URL。
- `params` 的自动编码/解码。
- 防止你在 URL 中出现打字错误。
- 绕过路径排序，例如展示一个匹配相同路径但排序较低的路由。

### 命名视图

可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 `<router-view>` 没有设置名字，那么默认为 `default`。

```javascript
<router-view class="view left-sidebar" name="LeftSidebar" />
<router-view class="view main-content" />
<router-view class="view right-sidebar" name="RightSidebar" />
```

对于同个路由，多个视图就需要多个组件，在 `components: {}` 中配置多个组件，与 `<router-view>` 上的 `name` 属性匹配。

```js
// src/router/index.js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        // 它们与 `<router-view>` 上的 `name` 属性匹配
        // LeftSidebar: LeftSidebar 的缩写
        LeftSidebar,
        RightSidebar,
      },
    },
  ],
})
```

### 路由的匹配语法

默认情况下，所有路由是**不区分大小写的**，并且**能匹配带有或不带有尾部斜线**的路由。

比如：路由 `/users` 将匹配 `/users`、`/users/`、甚至 `/Users/`。

这种行为可以通过 `strict` 和 `sensitive` 选项来修改，它们既可以应用在整个全局路由上，又可以应用于当前路由上。

`?`：修饰符，将一个参数标记为可选，表示 `0` 个或  `1` 个。

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 将匹配 /users/posva 而非：
    // - /users/posva/ 当 strict: true
    // - /Users/posva 当 sensitive: true
    { path: '/users/:id', sensitive: true },
    // 将匹配 /users, /Users, 以及 /users/42 而非 /users/ 或 /users/42/
    { path: '/users/:id?' },
  ],
  strict: true, // applies to all routes
})
```

### 嵌套路由

`children` 配置另一个路由数组，就像 `routes` 本身一样，`path: ""` 先不用 `/`，有下一级才 `/`。

```js
children: [{name: '', path: '', component: ''}, {name: '', path: '', component: ''}]
```

**以 `/` 开头的嵌套路径将被视为根路径，利用组件嵌套，而不必使用嵌套的 URL。**

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

嵌套路由的 `path: ""` 为空，可以允许**子路由渲染到父路由的路由出口中**。

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      // 当 /user/:id 匹配成功
      // UserHome 将被渲染到 User 的 <router-view> 内部
      { path: '', component: UserHome },
    ],
  },
]
```

### 不同的历史记录模式⭐

(1) `createWebHistory()` 创建 HTML5 模式。

允许开发者直接更改前端路由，即更新浏览器 URL 地址而不重新发起请求。

- 优点：路径比较正规，没有井号 `#`，漂亮。


- 缺点：兼容性不如 hash，且需要服务端支持，否则一刷新页面就 404 了。

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})
```

(2) `createWebHashHistory()` 创建 `hash` 模式。

把前端路由的路径用井号 `#` 拼接在真实 URL 后面的模式。当井号 `#` 后面的路径发生变化时，浏览器并不会重新发起请求，而是会触发 `hashchange` 事件。

优点：兼容性好。

缺点：① 有井号 `#`，丑；② 不利于 SEO，适合于后台后端开发。

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [],
})
```

### 路由传参❗⭐

#### (1) 查询参数传参 `query` 传参

**① 查询参数传参 2 种格式：Ⅰ字符串拼接；Ⅱ 对象模式。**

```javascript
:to="`/news/detail/?id=${news.id}&title=${news.title}&content=${news.content}`"
:to="{
      path:'/news/detail',
      query: {
        id: news.id,
        title: news.title,
        content: news.content
      }
```

**② 查询传参获取参数**

1. 在 `<script>` 中通过 `route.query.属性名` 获取，还可以解构赋值 `let { query } = toRefs(route)`。

   `{ query: { id, title, content } } = toRefs(route)` 不能生效，只能解构一层。

2. 在 `<template>` 模板中通过 `$route.query.属性名`，比如 `$route.query.id`，`$route.query.title`。

```vue
<!-- news.vue -->
<script setup>
import { reactive} from 'vue'

const newsList = reactive([
  {
    id: 'dfgdfbgffgb001',
    title: '号外号外，金子涨价！',
    content: '涨了45元，要598元了'
  }
])
</script>

<template>
  <div class="news">
    <h1>今日新闻</h1>
    <!-- 字符串模式 -->
    <!-- :to="`/news/detail/?id=${news.id}&title=${news.title}&content=${news.content}`" -->
    <!-- 对象模式 -->
    <router-link 
    v-for="news in newsList" :key="news.id" 
    :to="{
      path:'/news/detail',
      query: {
        id: news.id,
        title: news.title,
        content: news.content
      }
    }"
    >
    {{ news.title }}
  </router-link>
    <RouterView></RouterView>
  </div>
</template>
```

```vue
<!-- detail.vue -->
<!-- 获取上一级路由传递的参数 -->
<script setup>
import { useRoute } from 'vue-router'
import { toRefs } from 'vue'

let route = useRoute()
console.log(route)

// 如果 let { query: { id, title, content } } = toRefs(route) 不能生效
let { query } = toRefs(route)
</script>

<template>
  <div class="detail">
    <h1>新闻详情</h1>
    <h2>标题：{{ query.title }}</h2>
    <p>{{ query.content }}</p>
  </div>
</template>
```

#### (2) 动态路由传参 `params` 传参

**① 改造路由路径**

需要在 `src/router/index.js` 文件中改造路由，在 `path` 属性中占位 `/:key`，可以 `name` 命名路由。

`?` 表示该属性可有可无，`/:key?`。

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {name: 'xinwen', path: '/news', component:() => import('@/views/news.vue'),
  		children: [{
        name: 'xwxiangqing',
       	path:'detail/:id/:title/:content?',
        component:() => import('@/views/detail.vue')
      }
    ]},
    {path: '/movie', component:() => import('@/views/movie.vue')},
    { path: '/comic', component: () => import('@/views/comic.vue') },
  ]
})

export default router
```

**② `params` 传参2种写法：Ⅰ 字符串；Ⅱ 对象式。**

```javascript
:to="`/news/detail/${news.id}/${news.title}/${news.content}`"
:to="{
      name: 'xwxiangqing',
      params: {
        id: news.id,
        title: news.title,
        content: news.content
      }
```

**③ 动态路由传参获取参数**

1. 在 `<script>` 中通过 `route.params.属性名` 获取，还可以解构赋值 `let { params } = toRefs(route)`。
2. 在 `<template>` 模板中通过 `$route.params.属性名`，比如 `$route.params.id`，`$route.params.title`。

```vue
<!-- news.vue -->
<script setup>
import { reactive} from 'vue'

const newsList = reactive([
  {
    id: 'dfgdfbgffgb001',
    title: '号外号外，金子涨价！',
    content: '涨了45元，要598元了'
  }
])
</script>

<template>
  <div class="news">
    <h1>今日新闻</h1>
    <router-link 
    v-for="news in newsList" :key="news.id" 
    :to="{
      name: 'xwxiangqing',
      params: {
        id: news.id,
        title: news.title,
        content: news.content
      }
    }"
    >
    {{ news.title }}
  </router-link>
    <RouterView></RouterView>
  </div>
</template>
```

```vue
<!-- detail.vue -->
<script setup>
import { useRoute } from 'vue-router'
import { toRefs } from 'vue'

let route = useRoute()
console.log(route)

let { params } = toRefs(route)
</script>

<template>
  <div class="detail">
    <h1>新闻详情</h1>
    <h2>标题：{{ params.title }}</h2>
    <p>{{ params.content }}</p>
  </div>
</template>
```

### 路由组件传参 `props`

在 `src/router/index.js` 配置，有三种写法：

1. `props = true` 和 `params` 参数搭配
2. 函数式写法：`props(route) { return route.query }`，如果用 `query` 配置，但是 `params` 也可以
3. 对象写法：`props: { id: 'xxx', title: 'dffdg' }`

```javascript
// /router/index.js
// 配置 route，导出 router
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {name: 'xinwen', path: '/news', component:() => import('@/views/news.vue'), 
     children: [{
      name: 'xwxiangqing',
      path:'detail/:id/:title/:content?',
      component:() => import('@/views/detail.vue'),
     	props: true
      }
    ]},
    {path: '/movie', component:() => import('@/views/movie.vue')},
    { path: '/comic', component: () => import('@/views/comic.vue') },
  ]
})

export default router
```

```vue
<!-- detail.vue -->
<script setup>
import { useRoute } from 'vue-router'

let route = useRoute()
console.log(route)

defineProps(['id', 'title', 'content'])  // 接收参数
</script>
<template>
  <div class="detail">
    <h1>新闻详情</h1>
    <h2>标题：{{ title }}</h2>
    <p>{{ content }}</p>
  </div>
</template>
```

对于有命名视图的路由，必须为每个命名视图定义 `props` 配置。

```javascript
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```

### 编程式导航

除了使用 `<router-link>` 创建 `<a>` 标签来定义导航链接，我们还可以**借助 `router` 的实例方法，通过编写代码来实现**。

#### (1) `router.push()`

`router.push()`：向 `history` 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，会回到之前的 URL。

属性 `to` 与 `router.push` 接受的对象种类相同，所以两者的规则完全相同。

```javascript
// 声明式
<router-link :to="...">
//编程式
router.push(...)

// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

#### (2) `router.replace()`

`router.replace()`：类似于 `router.push`，唯一不同的是，它在导航时不会向 `history` 添加新记录，取代了当前的条目。

```javascript
// 声明式
<RouterLink replace :to="{path:'/comic'}" class="comic">comic</RouterLink>
//编程式
router.replace(...)
```

#### (3) `router.go(n)`

`router.go(n)`：在历史堆栈中前进或后退多少步。

```javascript
// 向前移动一条记录，与 router.forward() 相同
router.go(1)

// 返回一条记录，与 router.back() 相同
router.go(-1)

// 前进 3 条记录
router.go(3)

// 如果没有那么多记录，静默失败
router.go(-100)
router.go(100)
```

#### (4) 示例

```vue
<!-- detail.vue -->
<script setup>
import { reactive} from 'vue'
import { useRouter } from 'vue-router'

const newsList = reactive([])

const router = useRouter()
const onClick = (news) => {
  // to怎么写，push()/replace()方法里面就可以怎么写
  router.push({
    name: 'xwxiangqing',
    params: {
      id: news.id,
      title: news.title,
      content: news.content
    }
  })
}
</script>

<template>
  <div class="news">
    <h1>今日新闻</h1>
    <li v-for="news in newsList" :key="news.id" >
      <button @click="onClick(news)">click</button>
      <router-link
        :to="{
          name: 'xwxiangqing',
          params: {
            id: news.id,
            title: news.title,
            content: news.content
          }
      }"
      >
        {{ news.title }}
      </router-link>
    </li>
    <RouterView></RouterView>
  </div>
</template>
```

### 重定向

```javascript
const routes = [{ path: '/', redirect: '/home' }]
```

## 路由进阶

### 导航守卫❗⭐

导航守卫主要用来通过**跳转或取消**的方式守卫导航。

路由守卫分为三种：

① 全局守卫：对所有路由生效。在 `router/index.js` 中定义，适用于所有路由。

- `beforeEach`：在每次路由跳转前触发
- `beforeResolve`：在导航解析完成后触发（较少用）
- `afterEach`：在路由跳转完成后触发（无 `next` 参数）

② 路由独享守卫：针对特定路由配置。

③ 组件内守卫：在组件内部定义。

应用：

1. 身份验证与权限控制：未登录用户访问有权限页面，通过 `beforeEach` 跳转到登录页 `\login`。
2. 数据加载与异步请求：在路由跳转时，预先获取页面所需的数据，在数据加载完成后再进行路由跳转。
3. 防止表单数据丢失：在页面离开前，使用 `beforeRouteLeave` 弹出确认框，提示保存。

① 身份验证

```js
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login'); // 未登录则重定向到登录页面
  } else {
    next(); // 继续导航
  }
});
```

② 数据加载与异步请求

```js
router.beforeEach((to, from, next) => {
  fetchDataForRoute(to).then(data => {
    to.params.data = data;
    next();
  });
});
```

③ 防止表单数据丢失

```js
beforeRouteLeave(to, from, next) {
  if (this.formHasUnsavedChanges) {
    const answer = window.confirm('您有未保存的更改，是否确认离开？');
    if (!answer) {
      next(false); // 阻止跳转
    } else {
    	next();
  }
}
```

#### (1) 全局前置守卫

`router.beforeEach`：注册一个全局前置守卫。

- `to`：要进入的目标
- `from`：要离开的路由
- `next`：**继续导航**。第三个参数，已被移除，但仍被支持。
  - `next(false)`：取消导航。
  - `next('/path')`：跳转到指定路径。
  - `next(error)`：抛出错误，触发错误处理。
- 返回值
  - `false`：取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
  - 路由地址：通过一个路由地址重定向到一个不同的地址，如同调用 `router.push()`，且可以传入诸如 `replace: true` 或 `name: 'home'` 之类的选项。它会中断当前的导航，同时用相同的 `from` 创建一个新导航。

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

#### (2) 全局解析守卫

`router.beforeResolve`：注册一个全局守卫，这和 `router.beforeEach` 类似，因为它在**每次导航**时都会触发，不同的是，解析守卫刚好会**在导航被确认之前、所有组件内守卫和异步路由组件被解析之后**调用。

#### (3) 全局后置钩子

和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身。

对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。

```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

```js
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
  ]
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token'); // 检查是否登录
  if (to.meta.requiresAuth && !isLoggedIn) {
    // 如果需要认证且未登录，跳转到登录页
    next('/login');
  } else {
    // 允许跳转
    next();
  }
});

// 全局后置守卫
router.afterEach((to, from) => {
  console.log(`从 ${from.path} 跳转到 ${to.path}`);
});

export default router;
```

#### (4) 在守卫内的全局注入

从 Vue 3.3 开始，你可以在导航守卫内使用 `inject()` 方法。在 `app.provide()` 中提供的所有内容都可以在 `router.beforeEach()`、`router.beforeResolve()`、`router.afterEach()` 内获取到。

```ts
// main.ts
const app = createApp(App)
app.provide('global', 'hello injections')

// router.ts or main.ts
router.beforeEach((to, from) => {
  const global = inject('global') // 'hello injections'
  // a pinia store
  const userStore = useAuthStore()
  // ...
})
```

#### (5) 路由独享的守卫

`beforeEnter` 守卫**只在进入路由时触发**，不会在 `params`、`query` 或 `hash` 改变时触发。

比如：从 `/users/2` 进入到 `/users/3` 或者从 `/users/2#info` 进入到 `/users/2#projects`。它们只有在**从一个不同的**路由导航时，才会被触发。

① 直接在路由配置上定义 `beforeEnter` 守卫。

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

② 将一个**函数数组**传递给 `beforeEnter`，这在为不同的路由重用守卫时很有用。

```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

#### (6) 组件内的守卫

- `beforeRouteEnter`：进入组件前触发，无法访问 `this`。
- `beforeRouteUpdate`：路由参数变化时触发（动态路由）。
- `beforeRouteLeave`：离开组件前触发。

```vue
<script>
export default {
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` ！
    // 因为当守卫执行时，组件实例还没被创建！
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
</script>
```

### `onBeforeRouteUpdate`

`onBeforeRouteUpdate` 路由更新前的钩子，是一个路由守卫，适用于组件已经挂载，但路由参数发生变化时的场景。

`onBeforeRouteUpdate`：组合式 API，在 `<script setup>` 或 `setup()` 中使用，Vue 会自动解绑，无需手动处理，组合式函数，由 `vue-router` 提供的组合式 API。

`beforeRouteUpdate`：适用于选项式 API，在组件的 `export default` 中定义，需要手动管理解绑，由 `vue-router` 提供的导航守卫，挂在组件实例上。

```js
export default {
  beforeRouteUpdate(to, from, next) {
    // 当路由参数变化，但该组件被复用时触发
    this.fetchData(to.params.id)
    next()
  }
}
```

```js
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to, from, next) => {
  // `next` 一个函数，必须调用它来继续导航，否则路由会卡住。
  // 可以访问组合式 API 内的数据
  fetchData(to.params.id)
  next()
})
```

**使用场景**：在 Vue3 中，当组件依赖于路由参数时，比如 `id`，路由参数变化不会重新创建组件，而是更新路由参数。此时需要用 `onBeforeRouteUpdate` 来监听路由参数变化，执行一些更新操作。

假设我们有一个博客文章详情组件，根据 `URL` 中的文章 `id` 显示内容。我们使用 `onBeforeRouteUpdate` 监听 `id` 的变化，以便在不重建组件的情况下重新加载文章。s

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute();
const article = ref({});

const fetchArticle = async (id) => {
  // 模拟 API 请求获取文章详情
  article.value = await fetch(`/api/articles/${id}`).then(res => res.json());
};

// 页面首次加载时获取文章数据
onMounted(() => {
  fetchArticle(route.params.id);
});

// 当路由参数变化时重新获取文章数据
onBeforeRouteUpdate((to, from, next) => {
  fetchArticle(to.params.id);  // 使用新参数加载内容
  next();  // 确保调用 next() 来继续导航
});
</script>

<template>
  <div>
    <h1>{{ article.title }}</h1>
    <p>{{ article.content }}</p>
  </div>
</template>
```

### 路由元信息

**(1) 定义 `meta` 字段**

`meta` 字段属性：在路由配置中添加自定义元信息，它可以在路由地址和导航守卫上都被访问到。

```js
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // 只有经过身份验证的用户才能创建帖子
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail
        // 任何人都可以阅读文章
        meta: { requiresAuth: false },
      }
    ]
  }
]
```

**(2) 访问 `meta` 字段**

`routes` 配置中的每个路由对象为 **路由记录**。路由记录可以是嵌套的，因此，当一个路由匹配成功后，它可能匹配多个路由记录。

一个路由匹配到的所有路由记录会暴露为 `route` 对象(还有在导航守卫中的路由对象)的`route.matched` 数组。我们需要遍历这个数组来检查路由记录中的 `meta` 字段。

但是 Vue Router 提供了一个 `route.meta` 方法，它是一个非递归合并**所有 `meta`** 字段（从父字段到子字段）的方法。

```js
router.beforeEach((to, from) => {
  // 而不是去检查每条路由记录
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    }
  }
})
```

### 滚动行为

`scrollBehavior`：当在页面之间导航时控制滚动的功能。可以返回一个 `Promise` 来延迟滚动。

希望在切换路由时，页面自动滚动到特定的位置，比如顶部，或记住上次访问的位置。

```javascript
function scrollBehavior(to, from, savedPosition) {
  // to要导航到的路由地址
  // from要离开的路由地址
  // savedPosition 要保存的页面位置，如果不存在则是 null
}
```

`scrollBehavior` 函数需要返回一个对象，这个对象指定滚动到的位置。以是以下几种情况：

1. `{ left: 0, top: 0 }`：页面会滚动到左上角，适用于每次进入新页面都滚动到顶部。
2. `savedPosition`：如果有保存的位置（例如点击浏览器返回按钮时），会滚动到之前的位置。
3. `{ el: '#elementID' }`：滚动到指定的元素。这里的 `#elementID` 是页面中元素的 ID。

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes: [],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 使用浏览器的前进/后退功能时，返回到上一次的位置
      return savedPosition;
    } else if (to.hash) {
      // 如果路由中有 hash，例如 #section1，则滚动到该元素
      return { el: to.hash };  // 在Vue3中，使用 `el` 属性代替 `selector`
    } else {
      // 否则滚动到顶部
      return { left: 0, top: 0 };  // 使用 `left` 和 `top` 替代Vue2 `x` 和 `y`
    }
  }
});
```

### 路由懒加载

动态导入代替静态导入

```js
// 将 import UserDetails from './views/UserDetails.vue' 替换成：
const UserDetails = () => import('./views/UserDetails.vue')

const router = createRouter({
  // ...
  routes: [
    { path: '/users/:id', component: UserDetails }
    // 或在路由定义里直接使用它
    { path: '/users/:id', component: () => import('./views/UserDetails.vue') },
  ],
})
```

`component` 和 `components` 配置接收一个返回 `Promise` 组件的函数，Vue Router **只会在第一次进入页面时才会获取这个函数**，然后使用缓存数据。这意味着你也可以使用更复杂的函数，只要它们返回一个 `Promise`。

```js
const UserDetails = () =>
  Promise.resolve({
    /* 组件定义 */
  })
```

### 导航故障

当使用 `<router-link>` 组件时，Vue Router 会自动调用 `router.push` 来触发一次导航。大多数链接的预期行为是将用户导航到一个新页面，但也有少数情况下用户将留在同一页面上。

- 用户已经位于他们正在尝试导航到的页面。
- 一个导航守卫通过调用 `return false` 中断了这次导航。
- 当前的导航守卫还没有完成时，一个新的导航守卫会出现了。
- 一个导航守卫通过返回一个新的位置，重定向到其他地方 (例如，`return '/login'`)。
- 一个导航守卫抛出了一个 `Error`。

**导航是异步的**，需要 `await router.push` 返回的 `promise`。

```js
await router.push('/my-profile')
this.isMenuOpen = false
```

#### (1) 检测导航故障

如果导航被阻止，导致用户停留在同一个页面上，由 `router.push` 返回的 `Promise` 的解析值将是 *Navigation Failure*。否则，它将是一个 *falsy* 值(通常是 `undefined`)。这样我们就可以区分我们导航是否离开了当前位置。

```js
const navigationResult = await router.push('/my-profile')

if (navigationResult) {
  // 导航被阻止
} else {
  // 导航成功 (包括重新导航的情况)
  this.isMenuOpen = false
}
```

*Navigation Failure* 是带有一些额外属性的 `Error` 实例，这些属性为我们提供了足够的信息，让我们知道哪些导航被阻止了以及为什么被阻止了。

`isNavigationFailure` 函数检查导航结果的性质。

```js
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// 试图离开未保存的编辑文本界面
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // 给用户显示一个小通知
  showToast('You have unsaved changes, discard and leave anyway?')
}
```

#### (2) 全局导航故障

`router.afterEach` 检测。

```js
router.afterEach((to, from, failure) => {
  if (failure) {
    sendToAnalytics(to, from, failure)
  }
})
```

#### (3) 鉴别导航故障

有不同的情况会导致导航的中止，所有这些情况都会导致不同的 *Navigation Failure*。它们可以用 `isNavigationFailure` 和 `NavigationFailureType` 来区分。总共有三种不同的类型：

1. `aborted`：在导航守卫中返回 `false` 中断了本次导航。
2. `cancelled`： 在当前导航完成之前又有了一个新的导航。比如，在等待导航守卫的过程中又调用了 `router.push`。
3. `duplicated`：导航被阻止，因为我们已经在目标位置了。

#### (4) 导航故障的属性

所有的导航失败都会暴露 `to` 和 `from` 属性，以反映失败导航的当前位置和目标位置。在所有情况下，`to` 和 `from` 都是规范化的路由地址。

```js
// 正在尝试访问 admin 页面
router.push('/admin').then(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

#### (5) 检测重定向

当在导航守卫中返回一个新的位置时，我们会触发一个新的导航，覆盖正在进行的导航。与其他返回值不同的是，重定向不会阻止导航，**而是创建一个新的导航**。因此，通过读取路由地址中的 `redirectedFrom` 属性，对其进行不同的检查。

```js
await router.push('/my-profile')
if (router.currentRoute.value.redirectedFrom) {
  // redirectedFrom 是解析出的路由地址，就像导航守卫中的 to和 from
}
```

### 动态路由

#### (1) 添加路由

`router.addRoute()`：路由名称 `name` 必须唯一，否则会覆盖同名路由。

```js
router.addRoute({ path: '/about', component: About })
// 我们也可以使用 this.$route 或 useRoute()
router.replace(router.currentRoute.value.fullPath)
```

#### (2) 删除路由

① 通过添加一个名称冲突的路由。如果添加与现有途径名称相同的途径，会先删除路由，再添加路由。

```js
router.addRoute({ path: '/about', name: 'about', component: About })
// 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
router.addRoute({ path: '/other', name: 'about', component: Other })
```

② 通过调用 `router.addRoute()` 返回的回调，当路由没有名称时，这很有用。

```js
const removeRoute = router.addRoute(routeRecord)
removeRoute() // 删除路由如果存在的话
```

③ 使用 `router.removeRoute()` 按名称删除路由，当路由被删除时，**所有的别名和子路由也会被同时删除**。避免 `name` 冲突，可以使用 `Symbol`。

```js
router.addRoute({ path: '/about', name: 'about', component: About })
// 删除路由
router.removeRoute('about')
```

#### (3) 添加嵌套路由

要将嵌套路由添加到现有的路由中，可以将路由的 *name* 作为第一个参数传递给 `router.addRoute()`，这将有效地添加路由，就像通过 `children` 添加的一样：

```js
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
router.addRoute('admin', { path: 'settings', component: AdminSettings })
// 这等效于
router.addRoute({
  name: 'admin',
  path: '/admin',
  component: Admin,
  children: [{ path: 'settings', component: AdminSettings }],
})
```

#### (4) 查看现有路由

- `router.hasRoute()`：检查路由是否存在。
- `router.getRoutes()`：获取一个包含所有路由记录的数组。