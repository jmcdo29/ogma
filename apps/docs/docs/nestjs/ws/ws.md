---
id: ws
title: Platform WS
---

# @ogma/platform-ws

The `WsParser` parser for the `OgmaInterceptor`. This plugin class parses TCP request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](../module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-ws` or `yarn add @ogma/platform-ws`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      ws: WsParser
    }
  })
)
export class AppModule {}
```

### Note

As the Gateway/Websocket context runs in parallel with the HTTP Context, and as the application configuration is not shared between the two, to bind the `OgmaInterceptor` to the GateWay, you **must** use `@UseInterceptor(OgmaInterceptor)` **and** have `OgmaModule.forFeature()` in the `imports` array of the same module.

The method for the `WsParser` is always `websocket` and the `protocol` is always `WS`. Until a better method at determining these values is found, this will be a static value.
