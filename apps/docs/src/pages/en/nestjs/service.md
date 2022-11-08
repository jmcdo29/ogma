---
id: service
title: OgmaService
layout: ../../../layouts/MainLayout.astro
---

The `@ogma/nestjs-module` comes with its own decorator to be used with `OgmaModule.forFeature()`, very similar to `@nestjs/typeorm` and `@nestjs/mongoose`. To inject an `OgmaService`, simply use the `@OgmaLogger()` decorator and provide the context for the injection. E.g.

```ts
@Module({
  imports: [OgmaModule.forFeature(FooService)],
  providers: [FooService]
})
export class FooModule {}
```

```ts
@Injectable()
export class FooService {
  constructor(
    @OgmaLogger(FooService) private readonly logger: OgmaService
  ) {}
}
```

And as `OgmaService` implements Nest's `LoggerService` you can simply use the `LoggerService` type instead in case you want to easily be able to swap out loggers in the future.

## Request Scoped Logger

If you are using a request scoped logger, denoted by adding `{ addRequestId: true }` in the `OgmaModule.forFeature()`, then you'll need to use `@OgmaLoggerRequestScoped()` instead of `@OgmaLogger()`. This is to keep the injection tokens easily separated under the hood.

:::warning

**_[Please make sure you understand the implications of using a request scoped service!](https://docs.nestjs.com/fundamentals/injection-scopes#injection-scopes)_**

:::

## Methods

For the most part, all of the methods for the `OgmaService` are the same as using `Ogma` directly, with the exception of being able to pass `application` to the optional `meta` parameter.

### Meta

The `meta` parameter for all of the logging methods (`info`, `verbose`, `debug`, `warn`, `fatal`, `silly`, and `error`) is an optional parameter where you can pass either a string for a separate context in the log, or an object with additional data defined in any way you would please. This is great for use with log aggregators like [DataDog](https://www.datadoghq.com/) or [LogDNA](https://www.logdna.com/).

### Printing Multiple Values

To get `ogma` to automatically print multiple values for you, rather than having to call `ogma.log` on each value, you can pass an array of value and the `{ each: true }` option to `ogma`. This will cause `ogma` to print each value of the array as if you had called `ogma.log` on each one.

:::info

Ogma ill **not** recursively print arrays of arrays. `[ ['Hello', 'World'], ['Foo', 'Bar', 'Baz']` will print two arrays across two lines, not five strings across five lines.

:::

:::info

This option is available in `@ogma/nestjs-module@^4.1.0`

:::

### error

You'll also notice that `error` has a slightly different signature than the other logging methods. This is due to keeping in line with Nest's `LoggerService` interface. You can decide to pass a `trace` as a second parameter and a `meta` object as the third, or just pass the `meta` object as the second parameter and Ogma will pass the information on as necessary to the appropriate methods.

## Testing

If you end up using the `@OgmaLogger()` decorators and dependency injection, then you'll undoubtedly run into the need to mock out the logger during tests. For this, `@ogma/nestjs-module` provides the two token creation methods for you, so all you need to do is provide a mock custom provider like so:

```ts
const modRef = await Test.createTestingModule({
  providers: [
    FooService,
    {
      provide: createProviderToken(FooService.name),
      useValue: {
        log: jest.fn()
        // other logger methods that are used
      }
    }
  ]
}).compile();
```

## Replacing Nest's Logger

As Nest provides developers the ability to call `app.useLogger()` it's only fair to show how to get the root `OgmaService` instance out of the Nest container so it can be set for the entire application. Just like any other DI component, you can use `app.get()` to get the root service and pass it to Nest for general use

```ts
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const ogma = app.get(OgmaService, { strict: false });
  app.useLogger(ogma);
  await app.listen(3000);
};
```

:::info

`{ bufferLogs: true }` was added in Nest v8. For before v8, you can either pass `{logger: false}` or no options object

:::

## Log and LogAll Decorators

As of 3.2.0, `@ogma/nestjs-module` has two new decorators on the scene: `@Log()` and `@LogAll()`. This decorator will automatically add a method start and method end log to your class methods and add how long the method took to the end message. There is one limitation that should bne kept in mind: these decorators **do not** work on controller methods, because of how Nest creates the route handlers via a proxy. This should not be too big of a deal however, because the interceptor essentially acts to add the same data, just without the "start" log.

By default, the added code will assume you have a `logger` property as a part of the class, however, if you'd like to use a different property you can pass it to the `@Log()` decorator.

As it can get tedious to add the decorator to every method, there's also the `@LogAll()` decorator which will find your class's methods and apply the `@Log()` decorator for you. You can customize the logger property the same way with this decorator too.

Lastly, the added code by default will log at the `fine` level as this will end up adding a lot of data to your logs and can be considered noisy, but is also useful for tracing down time sinks. If you want to log at a higher level, you can pass a different level to the `traceMethod` option in your `OgmaModule.forRoot()` configuration.
