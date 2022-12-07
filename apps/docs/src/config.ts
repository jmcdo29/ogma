export const SITE = {
  title: 'Ogma',
  description: 'Beautiful Simple Logging',
  defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
  image: {
    src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
    alt:
      'astro logo on a starry expanse of space,' +
      ' with a purple saturn-like planet floating in the right foreground',
  },
  twitter: 'jmcdo29',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: 'ltr' | 'rtl';
  ogLocale?: string;
  lang?: string;
};

export const KNOWN_LANGUAGES = {
  English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/jmcdo29/ogma/tree/main/apps/docs`;

export const COMMUNITY_INVITE_URL = `https://discord.gg/7cJqcFncAX`;

export const GITHUB_DISCUSSIONS_URL = `https://github.com/jmcdo29/ogma/discussions`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'ogma',
  appId: 'U5N45YQUS6',
  apiKey: 'dad79a1521426f184d0fac2ce3575149',
};

type Transport = 'http' | 'graphql' | 'ws' | 'rpc';

const nestPlatform = (type: Transport, name: string): string =>
  `en/nestjs/${type}/platform-${name}`;

const nestRpc = (name: string): string => `en/nestjs/rpc/${name}`;

const nestOverview = (type: Transport): string => `en/nestjs/${type}/overview`;

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  en: {
    '@ogma/logger': [
      { text: 'Introduction', link: 'en/introduction' },
      { text: 'Logger', link: 'en/logger' },
    ],
    '@ogma/nestjs-module': [
      { text: 'Module', link: 'en/nestjs/module' },
      {
        text: 'Service',
        link: 'en/nestjs/service',
      },
      {
        text: 'Interceptor',
        link: 'en/nestjs/interceptor',
      },
      {
        text: 'Configured Example',
        link: 'en/nestjs/example',
      },
    ],
    '@ogma/platform-* packages': [
      {
        text: 'HTTP',
        link: nestOverview('http'),
      },
      {
        text: 'Express',
        link: nestPlatform('http', 'express'),
      },
      {
        text: 'Fastify',
        link: nestPlatform('http', 'fastify'),
      },
      {
        text: 'GraphQL',
        link: nestOverview('graphql'),
      },
      {
        text: 'GraphQL Express',
        link: nestPlatform('graphql', 'graphql'),
      },
      {
        text: 'GraphQL Fastify',
        link: nestPlatform('graphql', 'graphql-fastify'),
      },
      {
        text: 'RPC',
        link: nestOverview('rpc'),
      },
      {
        text: 'gRPC',
        link: nestRpc('grpc'),
      },
      {
        text: 'Kafka',
        link: nestRpc('kafka'),
      },
      {
        text: 'MQTT',
        link: nestRpc('mqtt'),
      },
      {
        text: 'NATS',
        link: nestRpc('nats'),
      },
      {
        text: 'RabbitMQ',
        link: nestRpc('rabbitmq'),
      },
      {
        text: 'Redis',
        link: nestRpc('redis'),
      },
      {
        text: 'TCP',
        link: nestRpc('tcp'),
      },
      {
        text: 'WebSockets',
        link: nestOverview('ws'),
      },
      {
        text: 'Socket.io',
        link: 'en/nestjs/ws/socket.io',
      },
      {
        text: 'WS',
        link: 'en/nestjs/ws/ws',
      },
      {
        text: 'Custom',
        link: 'en/nestjs/custom',
      },
    ],
    '@ogma/styler': [
      {
        text: 'Overview',
        link: 'en/styler',
      },
    ],
    '@ogma/cli': [
      {
        text: 'Overview',
        link: 'en/cli',
      },
    ],
  },
};
