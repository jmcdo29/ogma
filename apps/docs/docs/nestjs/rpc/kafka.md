---
id: kafka
title: Platform Kafka
---

# @ogma/platform-kafka

The `KafkaParser` parser for the `OgmaInterceptor`. This plugin class parses Kafka request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](../module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-kafka` or `yarn add @ogma/platform-kafka`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      rpc: KafkaParser
  })
)
export class AppModule {}
```
