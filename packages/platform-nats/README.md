# `@ogma/platform-nats`

The `NatsParser` parser for the `OgmaInterceptor`. This plugin class parses NATS request and response object to be able to successfully log the data about the request. For more information, check out [the @ogma/nestjs-module](../nestjs-module/README.md) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-nats` or `yarn add @ogma/platform-nats` or `pnpm add @ogma/platform-nats`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module({
  imports: [OgmaModule.forRoot({})],
  providers: [NatsParser]
})
export class AppModule {}
```

## Important Notes

Because of how NATS requests are sent and the data available in them, to get the IP address in the request log, an IP property must be sent in the payload. This is the only way to get the IP address. If an IP property is not sent, the interceptor will use an empty string. This is for the same reason as in the [@ogma/platform-mqtt](../platform-mqtt) docs.
