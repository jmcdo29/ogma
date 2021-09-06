---
id: mqtt
title: Platform MQTT
---

# @ogma/platform-mqtt

The `MqttParser` parser for the `OgmaInterceptor`. This plugin class parses MQTT request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](../module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-mqtt` or `yarn add @ogma/platform-mqtt`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      rpc: MqttParser
    }
  })
)
export class AppModule {}
```
