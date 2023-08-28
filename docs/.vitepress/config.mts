import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/miniquest/',
  lang: 'zh-CN',
  title: 'MiniQuest',
  titleTemplate: ':title | MiniQuest',
  description: 'Axios API 风格的小程序 HTTP 请求库',
  cleanUrls: true,

  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://fastly.jsdelivr.net/npm/@inottn/assets/miniquest/favicon.svg',
      },
    ],
    [
      'meta',
      {
        name: 'author',
        content: 'inottn',
      },
    ],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://fastly.jsdelivr.net/npm/@inottn/assets/miniquest/favicon.svg',

    nav: [{ text: '指南', link: '/guide/' }],

    sidebar: [
      {
        base: '/guide',
        text: '起步',
        items: [
          {
            link: '/',
            text: '快速上手',
          },
          {
            link: '/base-case',
            text: '基本用例',
          },
          {
            link: '/base-api',
            text: '基本 API',
          },
          {
            link: '/request-config',
            text: '请求配置',
          },
          {
            link: '/response-schema',
            text: '响应结构',
          },
          {
            link: '/validate-status',
            text: '校验状态码',
          },
          {
            link: '/interceptors',
            text: '拦截器',
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/inottn/miniquest' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2023 <a href="https://github.com/inottn">inottn</a>',
    },

    outlineTitle: '本页内容',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },
});
