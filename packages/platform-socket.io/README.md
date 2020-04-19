# `@ogma/platform-socket.io`

The `SocketIOParser` parser for the `OgmaInterceptor`. This plugin class parses TCP request and response object to be able to successfully log the data about the request. For more information, check out [the @ogma/nestjs-module](../nestjs-module/README.md) documentation.

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
