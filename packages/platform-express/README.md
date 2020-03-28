# `@ogma/platform-express`

The `ExpressInterceptorParser` parser for the `OgmaInterceptor`. This plugin class parses Express request and response object to be able to successfully log the data about the request. For more information, check out [the @ogma/nestjs-module](../nestjs-module/README.md) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-express` or `yarn add @ogma/platform-express`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      http: ExpressInterceptorParser
    }
  })
)
export class AppModule {}
```
