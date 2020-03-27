# `@ogma/platform-fastify`

The `FastifyInterceptorService` parser for the `OgmaInterceptor`. This plugin class parses Fastify request and response object to be able to successfully log the data about the request. For more information, check out [the @ogma/nestjs-module](packages/nestjs-module/README.md) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-fastify` or `yarn add @ogma/platform-fastify`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module(
  OgmaModule.forRoot({
    interceptor: {
      http: FastifyInterceptorService
    }
  })
)
export class AppModule {}
```
