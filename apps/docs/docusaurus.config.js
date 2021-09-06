module.exports = {
  title: 'Ogma',
  tagline: 'Beautifully simple logging',
  url: 'https://jmcdo29.github.io',
  baseUrl: '/ogma/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'jmcdo29', // Usually your GitHub org/user name.
  projectName: 'ogma', // Usually your repo name.
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'Ogma',
      logo: {
        alt: 'Ogma Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/jmcdo29/ogma',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/ogma',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/7cJqcFncAX',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/jmcdo29',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jay McDoniel. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/jmcdo29/ogma/edit/main/apps/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
