---
id: socket.io
title: Platform Socket.IO
layout: ../../../../layouts/MainLayout.astro
---

The `SocketIOParser` parser for the `OgmaInterceptor`. This plugin class parses TCP request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](../module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-socket.io` or `yarn add @ogma/platform-socket.io`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      ws: SocketIOParser
    }
  })
)
export class AppModule {}
```

### Note

As the Gateway/Websocket context runs in parallel with the HTTP Context, and as the application configuration is not shared between the two, to bind the `OgmaInterceptor` to the GateWay, you **must** use `@UseInterceptor(OgmaInterceptor)` **and** have `OgmaModule.forFeature()` in the `imports` array of the same module.

The method for the `SocketIOParser` is always `socket.io` and the `protocol` is always `WS`. Until a better method at determining these values is found, this will be a static value.
