# `@ogma/platform-kafka`

The `KafkaParser` parser for the `OgmaInterceptor`. This plugin class parses Kafka request and response object to be able to successfully log the data about the request. For more information, check out [the @ogma/nestjs-module](../nestjs-module/README.md) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-kafka` or `yarn add @ogma/platform-kafka` or `pnpm add @ogma/platform-kafka`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module({
  imports: [OgmaModule.forRoot({})],
  providers: [KafkaParser]
})
export class AppModule {}
```

## Important Notes

Because of how Kafka requests are sent and the data available in them, to get the IP address in the request log, an IP property must be sent in the payload. This is the only way to get the IP address. If an IP property is not sent, the interceptor will use an empty string. [You can find more information here](https://stackoverflow.com/questions/45235080/how-to-know-the-ip-address-of-mqtt-client-in-node-js).
