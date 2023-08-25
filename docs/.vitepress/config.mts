import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'MiniQuest',
  titleTemplate: ':title | MiniQuest',
  description: 'axios API 风格的小程序请求库',

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
        text: '起步',
        items: [
          {
            link: '/guide/',
            text: '简介',
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/inottn/miniquest' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023 inottn',
    },

    outlineTitle: '本页内容',
  },
});
