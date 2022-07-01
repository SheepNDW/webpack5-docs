const { copyCode } = require('vuepress-plugin-copy-code2');

module.exports = {
  // 站點配置
  base: '/webpack5-docs/',
  lang: 'zh-Hant-TW',
  head: [['link', { rel: 'icon', href: '/imgs/favicon.ico' }]],
  title: '尚硅谷 Web 前端之 Webpack5 教學',
  description: 'Webpack5從小白到大神',
  // 主題和其它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/imgs/logo.svg',
    lastUpdated: false,
    navbar: [
      {
        text: '課程介紹',
        link: '/intro/',
      },
      {
        text: '基礎',
        link: '/base/',
      },
      {
        text: '高級',
        link: '/senior/',
      },
      {
        text: '專案',
        link: '/project/',
      },
      {
        text: '原理',
        link: '/origin/',
      },
    ],
    sidebar: {
      '/intro/': [
        {
          text: '課程介紹',
          children: [
            '/intro/README.md',
            '/intro/pre.md',
            '/intro/group.md',
            '/intro/learn.md',
            '/intro/asset.md',
          ],
        },
      ],
      '/base/': [
        {
          text: '基礎配置',
          children: [
            '/base/README.md',
            '/base/base.md',
            '/base/config.md',
            '/base/development.md',
            '/base/css.md',
            '/base/image.md',
            '/base/output.md',
            '/base/clean.md',
            '/base/font.md',
            '/base/other.md',
            '/base/javascript.md',
            '/base/html.md',
            '/base/server.md',
            '/base/production.md',
            '/base/optimizeCss.md',
            '/base/minifyHtml.md',
            '/base/summary.md',
          ],
        },
      ],
      '/senior/': [
        {
          text: '高級優化',
          children: [
            '/senior/README.md',
            '/senior/enhanceExperience.md',
            '/senior/liftingSpeed.md',
            '/senior/reduceVolume.md',
            '/senior/optimizePerformance.md',
            '/senior/summary.md',
          ],
        },
      ],
      '/project/': [
        {
          text: '專案配置',
          children: [
            '/project/README.md',
            '/project/react-cli.md',
            '/project/vue-cli.md',
            '/project/summary.md',
          ],
        },
      ],
      '/origin/': [
        {
          text: '原理分析',
          children: [
            '/origin/README.md',
            '/origin/loader.md',
            '/origin/plugin.md',
            '/origin/summary.md',
          ],
        },
      ],
    },
  },
  plugins: [
    // https://vuepress-theme-hope.github.io/v2/copy-code/zh/
    copyCode({
      // 插件選項
      pure: true,
      locales: {
        ['/']: {
          hint: '複製程式碼',
        },
      },
    }),
    [
      '@vuepress/plugin-external-link-icon',
      {
        locales: {
          '/': {
            openInNewWindow: 'open in new window',
          },
          '/zh-Hant-TW/': {
            openInNewWindow: '在新視窗打開',
          },
        },
      },
    ],
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: 'Search',
          },
          '/zh-Hant-TW/': {
            placeholder: '搜尋',
          },
        },
      },
    ],
  ],
};
