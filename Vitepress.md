# Vitepress

设置背景图

```markdown
// index.md
image:
    src: ./images/dog2.svg
    alt: dog
```

创建logo

```js
themeConfig: {
    logo: './images/book-open-solid.svg',
```

设置导航栏多级列表

```js
nav: [
      // 三边栏
      { text: 'Home', items: [
        { text: 'Home1', link: '/' },
        { text: 'Home2', link: '/' }
      ] },
      // { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],
```

设置右边侧边栏 `aside` 目录标题、显示目录标题级别深度

```js
		// 右侧侧边栏标题
    outlineTitle: '目录',
    // 右边侧边栏导航显示标题深度
    outline: [2, 5],
```

关闭左右侧边栏

```js
// sidebar: false,
// aside: false,
```

设置icon

```js
    head: [['link', {rel:'icon', href:'./images/book-open-solid.svg'}]],
```

设置搜索框

```js
search: {
      provider: 'local'
    }
```

## 部署

1. 资源推送道远程仓库，注意配置 `.gitignore`
2. 配置 `.nojekyll`，空文件，让 `GitPages` 识别样式
3. 根据仓库名，配置 `base`，设为自己的仓库名