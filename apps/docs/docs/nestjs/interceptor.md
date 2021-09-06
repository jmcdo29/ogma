---
id: interceptor
title: NestJS Interceptor
---

# @ogma/nestjs-module Interceptor

Now the interceptor is a pretty impressive piece of work with what all it does to gether information. At a very high level, the interceptor will create a unique id for the request based on the current time of the request and `Math.random()`. You can override the `generateRequestId` method to modify this if you would like.

## What the Interceptor Does

The interceptor is designed to be an intelligent request logger that logs the regular metadata Ogma providers along with information about the request such as the caller's IP address, the route hit, how long the request took to get through the interceptor, the protocol used, what request method was used, the status of the request, and the length of the returned content, along with setting the `context` for each log to be the hit route handler class and route handler method. That's a lot of information to throw at you in words, so for an example, you may see something like

```
[2021-09-06T18:50:22.767Z] [INFO]  [computer-name] [application] [138639] [1630954222762841] [HttpController#getHello] ::1 - GET / HTTP/1.1 200 3ms - 17
```

:::note

Be aware that as this is an interceptor, any errors that happen in middleware, such as Passport's serialization/deserialization and authentication methods through the PassportStrategy will not be logged in the library. You can use an [ExceptionFilter](https://docs.nestjs.com/exception-filters) to manage that. The same goes for guards due to the [request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)

:::

## Binding the Interceptor

While `@ogma/nestjs-module` has the interceptor, it's still up to the developer to bind the interceptor to the server, so it can log the metadata about these requests. This can either be done using `@UseInterceptors()` or `app.useGlobalInterceptors`, but the most reliable method, due to all of the injected dependencies for the interceptor, would be to use a [custom provider](https://docs.nestjs.com/fundamentals/custom-providers) and the `APP_INTERCEPTOR` like follows:

```ts
@Module({
  imports: [OgmaModule.forRoot(ogmaModuleOptions)],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: OgmaInterceptor
    }
  ]
})
export class AppModule {}
```

## Interceptor Design Decisions

Due to the incredible complex nature of Nest and its DI system, there needed to be some sort of way to tell users at bootstrap that if the interceptor is to be used, which should be the default behavior, then it should have one of the `@ogma/platform-*` packages installed, **or** a custom parser should be provided. **Every** custom parser should `extend` the `AbstractInterceptorService` to ensure that A) Typescript doesn't complain about mismatched types, and B) the `DelegatorService` which handles the calls to each parser, can be sure it is getting back what it expects. If you are really, _really_ sure about what you are doing, you can always override the setting with `as any` to remove the Typescript warnings, but use that at your own risk.

The interceptor was designed to be adaptable, and to be able to work with any context thrown at it, but only if the parser for that context type is installed. The most common parser would be [`@ogma/platform-express`](./http/platform-express), which will work for HTTP requests with the Express server running under the hood (Nest's default). All other parsers provided by the `@ogma` namespace follow a similar naming scheme, and are provided for what Nest can use out of the box (including microservices named in the [microservices chapter](https://docs.nestjs.com/microservices/basics) of the Nest docs.)

Now, for the reasoning that all parsers are defaulted to false is to A) ensure that the developer does not expect the interceptor to work out of the box, B) ensure that the developer is aware of what parser is being used, and C) ensure that the parser(s) being used are installed without being blindly used (this means Typescript will complain if the class doesn't exist, whereas with JavaScript it _may_ be okay if a linter is not installed).

:::info

For more notes on extending the pre-built parsers, or for how to create your own parser, please view the [custom parser](./custom) section of the docs.

:::

## Demo

Below is what the `OgmaInterceptor` _can_ do. These are the logs I usually see during the integration testing, and show off just what is capable in terms of the metadata captured on requests.

<div align="center">
  <img src="https://ogma-docs-images.s3-us-west-2.amazonaws.com/ogma-interceptor.gif" alt="Ogma Interceptor Gif" width="1200"/>
</div>
