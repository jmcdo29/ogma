---
id: redis
title: Platform Redis
layout: ../../../../layouts/MainLayout.astro
---

The `RedisParser` parser for the `OgmaInterceptor`. This plugin class parses Redis request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](../module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-redis` or `yarn add @ogma/platform-redis`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      rpc: RedisParser
    }
  })
)
export class AppModule {}
```
