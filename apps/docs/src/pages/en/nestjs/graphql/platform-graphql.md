---
id: platform-graphql
title: Platform GraphQL
layout: ../../../../layouts/MainLayout.astro
---

The `GraphQLParser` parser for the `OgmaInterceptor`. This plugin class parses GraphQL request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](../module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-graphql` or `yarn add @ogma/platform-graphql`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      gql: GraphQLParser
    }
  })
)
export class AppModule {}
```

:::note

Due to the nature of subscriptions and the data available from the base ones, it is not possible at this time to log what subscriptions are made in the Ogma fashion.

:::

Because the interceptor needs access to the request and response objects, when configuring the `GraphqlModule` from Nest, you need to add the `req` and `res` to the GraphQL context. to do this, while configuring the `GraphqlModule`, set the `context` property as such:

```ts
GraphqlModule.forRoot({
  context: ({ req, res }) => ({ req, res })
});
```
