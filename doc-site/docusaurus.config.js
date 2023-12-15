/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Greenfield JavaScript SDK',
  tagline: `An easy-to-use tool designed to help developers build decentralized applications (DApps) on the Greenfield blockchain.`,
  favicon: 'img/favicon.ico',
  staticDirectories: ['static'],

  // Set the production url of your site here
  url: 'https://greenfield-js-sdk.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/greenfield-js-sdk/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bnb-chain', // Usually your GitHub org/user name.
  projectName: 'greenfield-js-sdk', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  plugins: [
    '@docusaurus/plugin-ideal-image',
    // {
    //   quality: 70,
    //   max: 1030, // max resized image's size.
    //   min: 640, // min resized image's size. if original is lower, use that size.
    //   steps: 2, // the max number of images generated between min and max (inclusive)
    //   disableInDev: false,
    // },
  ],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/bnb-chain/greenfield-js-sdk/tree/main/doc-site/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Greenfield JavaScript SDK',
        logo: {
          alt: 'Greenfield logo',
          src: 'img/logo.svg',
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'GettingStartSidebar',
          //   position: 'left',
          //   label: 'Getting Started',
          // },
          {
            href: 'https://github.com/bnb-chain/greenfield-js-sdk',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/',
              },
              {
                label: 'Client',
                to: '/category/client',
              },
              {
                label: 'API',
                to: '/category/api',
              },
              {
                label: 'types',
                to: '/category/types',
              },
            ],
          },
          {
            title: 'Github',
            items: [
              {
                label: 'JS SDK',
                href: 'https://github.com/bnb-chain/greenfield-js-sdk',
              },
              {
                label: 'Go SDK',
                href: 'https://github.com/bnb-chain/greenfield-go-sdk',
              },
            ],
          },
          /* {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          }, */
        ],
        copyright: `Copyright © ${new Date().getFullYear()}. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
