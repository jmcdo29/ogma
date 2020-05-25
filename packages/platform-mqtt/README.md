# `@ogma/platform-mqtt`

The `MqttParser` parser for the `OgmaInterceptor`. This plugin class parses MQTT request and response object to be able to successfully log the data about the request. For more information, check out [the @ogma/nestjs-module](../nestjs-module/README.md) documentation.

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

## Important Notes

Because of how MQTT requests are sent and the data available in them, to get the IP address in the request log, an IP property must be sent in the payload. This is the only way to get the IP address. If an IP property is not sent, the interceptor will use an empty string. [You can find more information here](https://stackoverflow.com/questions/45235080/how-to-know-the-ip-address-of-mqtt-client-in-node-js).
