# 场景题

## 实现表单全选

1. 点击全选，下面每一项自动全选或全不选
2. 下面每一项全选，全选才自动全选

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const lists = ref([
  {name: '选项1', checked: false},
  {name: '选项2', checked: false},
  {name: '选项3', checked: false},
  {name: '选项4', checked: false},
])
// 全选状态
const allChecked = ref(false)
// 1.点击全选框 = 选中所有项或全部取消选中
// 监听全选框 → 控制每一项
watch(allChecked, (val) => {
  lists.value.forEach(item => item.checked = val)
})
// 2.所有子项都选中时，全选框也自动变为选中，反之取消选中；
// 监听子项变化 → 计算是否全选
watch(
  lists,
  (newList) => {
    allChecked.value = newList.every(item => item.checked)
  },
  { deep: true }
)
// 3.选中数量变化时，更新已选中数量
// 选中数量
const selectedCount = computed(() =>
  lists.value.filter(item => item.checked).length
)
// 4.反选
const reverseChecked = () => {
  // 1.通过全选框
  // allChecked.value = !allChecked.value
  // 2.通过每一项
  lists.value.forEach(item => {
    item.checked = !item.checked
  })
}
</script>

<template>
  <div class="app">
    <form class="checkbox-form">
      <div class="all-checkbox">
        <!-- 全选 checkbox -->
        <input type="checkbox" v-model="allChecked" id="all-checked" />
        <label for="all-checked">是否全选</label>
      </div>
      <!-- 每项 checkbox -->
      <div class="checkbox-group" v-for="(item, index) in lists" :key="index">
        <input
          type="checkbox"
          v-model="item.checked"
          :id="`checkbox-${index}`"
        />
        <label :for="`checkbox-${index}`">{{ item.name }}</label>
      </div>
    </form>
    <!-- 3.选中数量 -->
    <div>已选中 {{ selectedCount }} 项</div>
    <!-- 4.按钮实现反选 -->
    <div>
      <button @click="reverseChecked">按钮实现反选</button>
    </div>
  </div>
</template>
```

## 增删改查CRUD功能

```vue
<template>
  <div class="app">
    <h1>文章管理</h1>

    <!-- 搜索框 -->
    <input v-model="searchKeyword" placeholder="搜索文章标题" />

    <!-- 新增文章 -->
    <div class="add-form">
      <input v-model="newTitle" placeholder="请输入标题" />
      <input v-model="newContent" placeholder="请输入内容" />
      <button @click="addArticle">新增</button>
    </div>

    <!-- 文章列表 -->
    <ul>
      <li v-for="(article, index) in filteredArticles" :key="article.id">
        <div v-if="editingId !== article.id">
          <h3>{{ article.title }}</h3>
          <p>{{ article.content }}</p>
          <button @click="editArticle(article)">编辑</button>
          <button @click="deleteArticle(article.id)">删除</button>
        </div>

        <!-- 编辑模式 -->
        <div v-else>
          <input v-model="editTitle" />
          <input v-model="editContent" />
          <button @click="saveEdit(article.id)">保存</button>
          <button @click="cancelEdit">取消</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Article {
  id: number
  title: string
  content: string
}

// 模拟数据
const articles = ref<Article[]>([
  { id: 1, title: 'Vue 入门', content: '这是 Vue 的入门教程。' },
  { id: 2, title: 'React 学习', content: '这是 React 的学习笔记。' },
])

// 搜索关键字
const searchKeyword = ref('')

// 新增文章字段
const newTitle = ref('')
const newContent = ref('')

// 编辑文章字段
const editingId = ref<number | null>(null)
const editTitle = ref('')
const editContent = ref('')

// 过滤后的文章
const filteredArticles = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return articles.value
  return articles.value.filter(article =>
    article.title.toLowerCase().includes(keyword)
  )
})

// 新增文章
const addArticle = () => {
  if (!newTitle.value.trim()) return alert('标题不能为空')
  const newArticle: Article = {
    id: Date.now(),
    title: newTitle.value,
    content: newContent.value,
  }
  articles.value.push(newArticle)
  newTitle.value = ''
  newContent.value = ''
}

// 删除文章
const deleteArticle = (id: number) => {
  articles.value = articles.value.filter(article => article.id !== id)
}

// 开始编辑
const editArticle = (article: Article) => {
  editingId.value = article.id
  editTitle.value = article.title
  editContent.value = article.content
}

// 保存编辑
const saveEdit = (id: number) => {
  const index = articles.value.findIndex(article => article.id === id)
  if (index !== -1) {
    articles.value[index].title = editTitle.value
    articles.value[index].content = editContent.value
  }
  editingId.value = null
}

// 取消编辑
const cancelEdit = () => {
  editingId.value = null
}
</script>

<style scoped>
.app {
  padding: 20px;
  max-width: 600px;
  margin: auto;
  font-family: sans-serif;
}

input {
  margin: 5px;
  padding: 5px;
}

.add-form {
  margin-top: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 6px;
}
</style>
```

