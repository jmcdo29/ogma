/**
 *
 * @param {string} prefix
 * @param {string[]} docs
 * @returns {string[]}
 */
const setPrefix = (prefix, docs) => {
  return docs.map((doc) => `${prefix}/${doc}`);
};

module.exports = {
  mySidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: setPrefix('introduction', ['motivation', 'installation']),
    },
    {
      type: 'category',
      label: 'Logger',
      items: setPrefix('logger', ['package']),
    },
    {
      label: 'NestJS',
      type: 'category',
      items: [
        {
          type: 'category',
          label: 'Module',
          items: setPrefix('nestjs', ['module', 'service', 'interceptor']),
        },
        {
          type: 'category',
          label: 'HTTP',
          items: setPrefix('nestjs/http', ['overview', 'platform-express', 'platform-fastify']),
        },
        {
          type: 'category',
          label: 'GraphQL',
          items: setPrefix('nestjs/graphql', [
            'overview',
            'platform-graphql',
            'platform-graphql-fastify',
          ]),
        },
        {
          type: 'category',
          label: 'Microservices',
          items: setPrefix('nestjs/rpc', ['overview']),
        },
        {
          type: 'category',
          label: 'Websockets',
          items: setPrefix('nestjs/ws', ['overview']),
        },
        {
          type: 'category',
          label: 'Custom',
          items: setPrefix('nestjs/custom', ['custom']),
        },
      ],
    },
    {
      type: 'doc',
      id: 'cli',
      label: 'CLI',
    },
    {
      type: 'doc',
      label: 'Styler',
      id: 'styler',
    },
  ],
};
