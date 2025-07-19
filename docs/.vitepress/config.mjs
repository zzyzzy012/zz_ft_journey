import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/zz_ft_journey/',
  title: "ZZ_FT_Site",
  description: "My front-end learning journey.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    head: [['link', {rel:'icon', href:'./images/cat_help.svg'}]],
    logo: './images/cat_help.svg',
    // 右侧侧边栏标题
    outlineTitle: '目录',
    // 右边侧边栏导航显示标题深度
    outline: [2, 5],
    nav: [
      // 三边栏
      { text: 'Home', items: [
        { text: 'Home1', link: '/' },
        { text: 'Home2', link: '/' }
      ] },
      // { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],
    sidebar,
    // sidebar: false,
    // aside: false,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    search: {
      provider: 'local'
    },
    
  }
})
