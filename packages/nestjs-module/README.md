# `@ogma/nestjs-module`

A [NestJS module](https://docs.nestjs.com) for the [Ogma](https://github.com/jmcdo29/ogma) logging package.

## Installation

Installation is pretty simple, just `npm i @ogma/nestjs-module` or `yarn add @ogma/nestjs-module`

## Usage

The OgmaService is a SINGLETON scoped service class in NestJS. That being said, if you want a new instance for each service, you can use the `OgmaModule.forFeature()` method and the `@OgmaLogger()` decorator. When working with `OgmaModule.forFeature()` you can pass an object as the second parameter to determine if you want the logger to be [request scoped](https://docs.nestjs.com/fundamentals/injection-scopes#injection-scopes) or not. This object looks like `{ addRequestId: true|false }`.

Ogma is a lightweight logger with customization options, that prints your logs in a pretty manner with timestamping, colors, and different levels. See the [GitHub repository for Ogma](../logger/README.md) to learn more about configuration and options.

## Configuration

In your root module, import `OgmaModule.forRoot` or `OgmaModule.forRootAsync` to apply application wide settings, such as `color`, `json`, and `application`. You can also set a default context as a fallback if no context is passed in the `forFeature` static method. You can use the standard method of async module configuration meaning `useClass`, `useValue`, and `useFactory` are all available methods to work with.

### Synchronous configuration

```ts
import { OgmaModule } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';

@Module({
  imports: [
    OgmaModule.forRoot({
      service: {
        color: true,
        json: false,
        application: 'NestJS'
      },
      interceptor: {
        http: ExpressParser,
        ws: false,
        gql: false,
        rpc: false
      }
    })
  ]
})
export class AppModule {}
```

### Asynchronous configuration

```ts
import { OgmaModule } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';

@Module({
  imports: [
    OgmaModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        service: {
          json: config.isProd(),
          stream: {
            write: (message) =>
              appendFile(config.getLogFile(), message, (err) => {
                if (err) {
                  throw err;
                }
                return true;
              })
          },
          application: config.getAppName()
        },
        interceptor: {
          http: ExpressParser,
          ws: false,
          gql: false,
          rpc: false
        }
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
```

From here in each module you need to add the `OgmaService` you can add `OgmaModule.forFeature(context)`, where context is the context you want to add to the log. This `context` can be either a class object (not an instance) or a string.

```ts
@Module({
  imports: [OgmaModule.forFeature(MyService)], // or OgmaModule.forFeature(MyService.name)
  providers: [MyService]
})
export class MyModule {}
```

```ts
@Injectable()
export class MyService {
  constructor(
    @OgmaLogger(MyService) private readonly logger: OgmaService // or @OgmaLogger(MyService.name)
  ) {}
  // ...
}
```

The above would set up the OgmaService to add the context of `[MyService]` to every log from within the `MyModule` module.

### Request Scoping the Logger

As mentioned above, you can pass a second parameter to the `forFeature` method to tell `Ogma` that you want this logger to be request scoped and add a request Id to the logs. This request Id is generated **in the interceptor** which is important to note in the case of a request that fails at the Guard or Middleware level, as they will not yet have this ID. You can choose to add your own middleware to create an id if you so choose and retrieve it later. There's also a new decorator for request scoped loggers `@OgmaLoggerRequestScoped()`. This decorator acts **exactly** like the `@OgmaLogger()` decorator, with the same parameters and all, it just uses a different injection token with the form of `OGMA_REQUEST_SCOPED_SERVICE:<Service_Name>`.

> **Warning**: **_[Please make sure you understand the implications of using a request scoped service!](https://docs.nestjs.com/fundamentals/injection-scopes#injection-scopes)_**

```ts
@Module({
  imports: [OgmaModule.forFeature(MyService, { addRequestId: true })],
  providers: [MyService]
})
export class MyModule {}
```

```ts
@Injectable()
export class MyService {
  constructor(
    @OgmaLoggerRequestScoped(MyService)
    private readonly logger: OgmaService
  ) {}
  // ...
}
```

### forFeature/forFeatures

As of version 0.3.1 there is a `OgmaModule.forFeatures()` method that can accept an array of contexts. This can be a mixed array of classes, strings, and objects, where the objects have a shape of `{ contexts: string | (() => any) | Type<any>, options: OgmaProviderOptions }`. This is useful for when you want to register multiple `OgmaService`s in the same module, such as one logger for the Service and one for the Controller, or for a Service and a Filter.

## OgmaInterceptor

Ogma also comes with a built in Interceptor for logging requests made to your server. You can decide to turn the interceptor off by passing `{ interceptor: false }` as part of the options to the `OgmaModule`. The interceptor will need to be told what parsers it should be using for each type of request that can be intercepted. By default, all of these values are set to `false`, but the interceptor will still attempt to bind to the server, which will result in an error. If you would like to not use the interceptor's logging abilities, simple pass `false` to the `interceptor` key in the `OgmaModule.forRoot/Async()` method. If you'd like to know more about _why_ this is the default behavior, please look at the [interceptor design decisions](#interceptor-design-decisions) part of the docs. Below is the general form that the interceptor logs will take:

```sh
[ISOString TimeStamp] [Application Name] PID RequestID [Context] [LogLevel]| Remote-Address - method URL protocol Status Response-Time ms - Response-Content-Length
```

This request ID is generated inside the `OgmaInterceptor` currently by using `Math.random()`. You may extend the logger and modify the `generateRequestId` method to change to it be however you like though.

Where `Context` is the class-method combination of the path that was called. This is especially useful for GraphQL logging where all URLs log from the `/graphql` route.

If you would like to skip any request url path, you can pass in a decorator either an entire class or just a route handler with the `@OgmaSkip()` decorator.

> Note: As of version 0.3.0 the `OgmaInterceptor` is not bound by default, it is still necessary to pass **all** of the expected configuration options due to the way that the dependencies are built. If you would like to bind the interceptor globally, you can still do so using `APP_INTERCEPTOR` in a custom provider. The interceptor is not bound by default anymore to allow for more customization when it comes to the generation of request IDs.

> Note: Be aware that as this is an interceptor, any errors that happen in middleware, such as Passport's serialization/deserialization and authentication methods through the PassportStrategy will not be logged in the library. You can use an [ExceptionFilter](https://docs.nestjs.com/exception-filters) to manage that. The same goes for guards due to the [request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)

### OgmaInterceptor Configuration Options

All configuration options are just that: options. None of them need to be provided, but it could prove useful to do in certain cases. Find the table of values below to have a better idea of what is necessary to provide the options.

| name | value | default | description |
| --- | --- | --- | --- |
| gql | false or AbstractInterceptorService | false | The GraphQL parser for the OgmaInterceptor |
| http | false or AbstractInterceptorService | false | The HTTP parser for the OgmaInterceptor |
| rpc | false or AbstractInterceptorService | false | The Microservice parser for the OgmaInterceptor |
| ws | false or AbstractInterceptorService | false | The Websocket parser for the OgmaInterceptor |

Each of the above options, as mentioned, is false meaning that the requests for that type would not be parsed by the `OgmaInterceptor` and the request would flow as normal.

> Note: The `AbstractInterceptorService` is the class that all `OgmaInterceptorService` parsers should extend, in order to adhere to the call scheme of the built in `DelegatorService`. This allows for easy extension and overwriting of the parsers.

### Interceptor Design Decisions

Due to the incredible complex nature of Nest and its DI system, there needed to be some sort of way to tell users at bootstrap that if the interceptor is to be used, which should be the default behavior, then it should have one of the `@ogma/platform-*` packages installed, **or** a custom parser should be provided. **Every** custom parser should `extend` the `AbstractInterceptorService` to ensure that A) Typescript doesn't complain about mismatched types, and B) the `DelegatorService` which handles the calls to each parser, can be sure it is getting back what it expects. If you are really, _really_ sure about what you are doing, you can always override the setting with `as any` to remove the Typescript warnings, but use that at your own risk.

The interceptor was designed to be adaptable, and to be able to work with any context thrown at it, but only if the parser for that context type is installed. The most common parser would be `@ogma/platform-express`, which will work for HTTP requests with the Express server running under the hood (Nest's default). All other parsers provided by the `@ogma` namespace follow a similar naming scheme, and are provided for what Nest can use out of the box (including microservices named in the [microservices chapter](https://docs.nestjs.com/microservices/basics) of the Nest docs.)

Now, for the reasoning that all parsers are defaulted to false, but the module throws an error if all the options are false, is to A) ensure that the developer does not expect the interceptor to work out of the box, B) ensure that the developer is aware of what parser is being used, and C) ensure that the parser(s) being used are installed without being blindly used (this means Typescript will complain if the class doesn't exist, whereas with JavaScript it _may_ be okay if a linter is not installed).

### Extending Pre-Built Parsers

As the pre-built parsers are built around Object Oriented Typescript, if you want to change the functionality of one of the pre-built parsers, you can always create a new class that extends the class, change the specific method(s) you want, and then provide that as your parser. All the other methods should still come from the base class and not be affected.

## Putting it All Together

Okay, so now we're ready to add the `OgmaModule` to our Application. Let's assume we have a `CatsService`, `CatsController` and `CatsModule` and a `ConfigService` and `ConfigModule` in our Application. Let's also assume we want to use a class to asynchronously configure out `OgmaModule`. For now, assume the methods exist on the `ConfigService`. Let's also assume we want to log things in color to our `process.stdout`.

```ts
import { FastifyParser } from '@ogma/platform-fastify';

@Injectable()
export class OgmaModuleConfig implements ModuleConfigFactory<OgmaModuleOptions> {

  constructor(private readonly configService: ConfigService) {}

  createModuleConfig(): OgmaModuleOptions {
    return {
      service: {
        // returns one of Ogma's log levels, or 'ALL'.
        logLevel: this.configService.getLogLevel(),
        color: true,
        // could be something like 'MyAwesomeNestApp'
        application: this.configService.getAppName(),
      },
      interceptor: {
        http: FastifyParser
      }
    }
  }
}
```

The `ModuleConfigFactory` is an interface pulled from the [@golevelup/nestjs-modules](https://github.com/golevelup/nestjs/tree/master/packages/modules) library, which was used for creating the dynamic module.

> Note: As the `ModuleConfigFactory` is just an interface, the dependency on the `@golevelup/nestjs-module` package should just be a dev dependency to ensure the typings are correct. Of course, you can also just use a factory instead if you prefer.

Next, in our `AppModule` we can import the `OgmaModule` like so

```ts
@Module({
  imports: [
    CatsModule,
    ConfigModule,
    OgmaModule.forRootAsync({
      // configuration class we created above
      useClass: OgmaModuleConfig,
      imports: [ConfigModule]
    })
  ]
})
export class AppModule {}
```

And now we have the interceptor bound and an `OgmaService` instance created for the application. If we want to add the `OgmaService` as the general logger for Nest we can do the following in our `main.ts`

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const logger = app.get<OgmaService>(OgmaService);
  app.useLogger(logger);
  await app.listen(3000);
}

bootstrap();
```

With this, you will lose the initial logs about instantiation of the modules, but you will still get messages about what routes are bootstrapped and when the server is ready.

If we wanted to add the logger to the `CatsService` we can use the module's `forFeature` static method to give the logger service its own context variable.

```ts
@Module({
  imports: [OgmaModule.forFeature(CatsService)],
  controllers: [CatsController],
  service: [CatsService]
})
export class CatsModule {}
```

And now in the `CatsService` the `OgmaService` can be injected like so:

```ts
@Injectable()
export class CatsService {
  constructor(
    @OgmaLogger(CatService) private readonly logger: OgmaService
  ) {}
}
```

And now `this.logger` is available in your `CatsService` class.

## Get in Touch

If there is something that needs to be addressed in regards to the module, feel free to [make an issue](https://github.com/jmcdo29/ogma/issues/new). If you are looking to contact me, you can either [email me](mailto:me@jaymcdoniel.dev), or [find me on discord](https://discord.com) as `PerfectOrphan31#6003`.

## Contributing

Please make sure that any and all pull requests follow the code standards enforced by the linter and prettier. Otherwise, any and all pull requests are welcomed, though an issue created to first track the PR would be appreciated. Feel free to make suggestions on how the module can improve and what can be done better.

## License

NestJS-Ogma has an [MIT License]('./../LICENSE).
