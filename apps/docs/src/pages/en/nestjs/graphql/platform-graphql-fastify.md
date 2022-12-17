---
id: platform-graphql-fastify
title: Platform GraphQL Fastify
layout: ../../../../layouts/MainLayout.astro
---

:::info

If you are using `@nestjs/apollo` make sure you are using fastify v3 and `@nestjs/common` version 8. If you are using`@nestjs/mercurius`you may use fastify v4 and`@nestjs/common` version 9.

:::

The `GraphQLFastifyParser` parser for the `OgmaInterceptor`. This plugin class parses GraphQL request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](/en/nestjs/module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-graphql-fastify` or `yarn add @ogma/platform-graphql-fastify`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      gql: GraphQLFastifyParser
    }
  })
)
export class AppModule {}
```

:::note

Due to the nature of subscriptions and the data available from the base ones, it is not possible at this time to log what subscriptions are made in the Ogma fashion.

:::

Because the interceptor needs access to the request and response objects, when configuring the `GraphqlModule` from Nest, you need to add the `request` and `reply` to the GraphQL context. to do this, while configuring the `GraphqlModule`, set the `context` property as such:

```ts
GraphqlModule.forRoot({
  context: ({ request, reply }) => ({ request, reply })
});
```
