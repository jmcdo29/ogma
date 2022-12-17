---
id: rabbitmq
title: Platform RabbitMQ
layout: ../../../../layouts/MainLayout.astro
---

The `RabbitMqParser` parser for the `OgmaInterceptor`. This plugin class parses RabbitMQ request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](/en/nestjs/module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-rabbitmq` or `yarn add @ogma/platform-rabbitmq`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      rpc: RabbitMqParser
    }
  })
)
export class AppModule {}
```
