<div align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jmcdo29_nestjs-ogma&metric=alert_status)](https://sonarcloud.io/dashboard?id=jmcdo29_nestjs-ogma) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Actions Status](https://github.com/jmcdo29/nestjs-ogma/workflows/CI/badge.svg)](https://github.com/jmcdo29/nestjs-ogma/workflows/CI/badge.svg) [![Version](https://badgen.net/npm/v/nestjs-ogma)](https://npmjs.com/package/nestjs-ogma) [![Coffee](https://badgen.net/badge/Buy%20Me/A%20Coffee/purple?icon=kofi)](https://www.buymeacoffee.com/jmcdo29)

</div>

# nestjs-ogma

A [NestJS module](https://docs.nestjs.com) for the [Ogma](https://github.com/jmcdo29/ogma) logging package.

## Usage

The OgmaService class is TRANSIENT scoped, which means that for each time you call `OgmaModule.forFeature()` a new instance of the `OgmaService` is created, and a new context is given to that OgmaService if one is provided. The base Ogma class, will also be created as you are able to pass in options for the ogma class. This allows you to give each of your OgmaService's different logLevel configurations, which can be a big win.

Ogma is a lightweight logger with customization options, that prints your logs in a pretty manner with timestamping, colors, and different levels. See the GitHub repository for Ogma to learn more about configuration and options.

## Configuration

In your root module, import `OgmaModule.forRoot` or `OgmaModule.forRootAsync` to apply application wide settings, such as `color`, `json`, and `application`. You can also set a default context as a fallback if no context is passed in the `forFeature` static method. You can use the standard method of async module configuration meaning `useClass`, `useValue`, and `useFactory` are all available methods to work with.

```ts
@Module({
  imports: [
    OgmaModule.forRoot(OgmaModule, {
      service: {
        color: true,
        json: false,
        application: 'NestJS'
      }
    })
  ]
})
export class AppModule {}
```

or async

```ts
@Module({
  imports: [
    OgmaModule.forRootAsync(OgmaModule, {
      useFactory: (config: ConfigService) => ({
        service: {
          json: config.isProd(),
          stream: {
            write: (message) =>
              appendFile(config.getLogFile(), message, (err) => {
                if (err) {
                  throw err;
                }
              }
            }),
          }
        },
        application: config.getAppName()
      }),
      inject: [ConfigService]
    }),
  ]
})
export class AppModule {}
```

From here in each module you need to add the `OgmaService` you can add `OgmaModule.forFeature(context, option)`, where context is the context you want to add to the log and options are `OgmaOptions` you want to pass to override the originally configured options.

> OgmaModule is required to be the first parameter of `forRoot` and `forRootAsync` because of how the `OgmaModule` makes use of an underlying library for creating [DynamicModules](https://docs.nestjs.com/fundamentals/dynamic-modules). Go check it out at [@golevelup/nestjs-modules](https://github.com/golevelup/nestjs/tree/master/packages/modules).

```ts
@Module({
  imports: [
    OgmaModule.forFeature(MyService.name, {
      service: { color: false }
    })
  ],
  providers: [MyService]
})
export class MyModule {}
```

The above would set up the OgmaService to add the context of `[MyService]` to every log from within the `MyModule` module, and would tell the `Ogma` instance to not use any colors.

## OgmaInterceptor

Ogma also comes with a built in Interceptor for logging requests made to your server. You can decide to turn the interceptor off by passing `{ interceptor: false }` as part of the options to the `OgmaModule`. By default, the interceptor will be in `production` mode and will output a log like

```sh
[ISOString TimeStamp] [Application Name] PID [Context] [LogLevel]| Remote-Address - method URL HTTP/version Status Response-Time ms - Response-Content-Length
```

While the other option, `dev` mode, will print out in

```sh
[ISOString TimeStamp] [Application Name] PID [Context] [LogLevel]| method URL Status Response-Time ms - Response-Content-Length
```

Where `context` in both cases is the class-method combination of the path that was called. This is especially useful for GraphQL logging where all URLs log from the `/graphql` route.

If you would like to skip any request url path, you can pass in a `skip` option that is a function with `req` and `res` parameters that returns a boolean. `true` to skip, `false` to log. Of course, if the JSON option is passed, then the log will be in a JSON format. All route logs are logged at the `INFO`/`LOG` level, for the sake of being visible at the default level.

> In the `dev` format, the HTTP status is colored with 200's as green, 300's as cyan 400's as yellow and 500's as red. All other HTTP status codes are uncolored.

> Note: Be aware that as this is an interceptor, any errors that happen in middleware, such as Passport's serialization/deserialization and authentication methods through the PassportStrategy.

### OgmaInterceptor Configuration Options

All configuration options are just that: options. None of them need to be provided, but it could prove useful to do in certain cases. Find the table of values below to have a better idea of what is necessary to provide the options.

| name | value | default | description |
| --- | --- | --- | --- |
| format | `'dev' | 'prod'` | 'prod' | Determines which format the logs will print in, according to the described formats above. |
| skip | `function(req: Request | FastifyRequest, res: Response | FastifyReply<ServerResponse>): boolean` | N/A | A function to determine if the HTTP request should be logged or not. Useful for ignoring successes or for ignoring specific routes. |
| getRequest | `function(context: ExecutionContext): Request | FastifyRequest` | N/A | Override the standard way of getting the HTTP request object. Useful for things like GraphQL where you need to first convert the context to the GraphQLContext |
| getResponse | `function(context: ExecutionContext): Response | FastifyReply<ServerResponse>` | N/A | Exact same as the `getRequest` method, but for the response object. |

So long as the interceptors portion of the `OgmaModuleOptions` returns `truthy`, the `OgmaInterceptor` will be bound to your application and will start logging HTTP requests.

## Putting it All Together

Okay, so now we're ready to add the `OgmaModule` to our Application. Let's assume we have a `CatsService`, `CatsController` and `CatsModule` and a `ConfigService` and `ConfigModule` in our Application. Let's also assume we want to use a class to asynchronously configure out `OgmaModule`. For now, assume the methods exist on the `ConfigService`. Let's also assume we want to log things in color to our `process.stdout` and that we want the interceptor to skip anything that is not a 400 error or above in production mode.

```ts
@Injectable()
export class OgmaModuleConfig implements ModuleConfigFactory<OgmaModuleOptions> {

  constructor(private readonly configService: ConfigService) {}

  createModuleConfig(): OgmaModuleOptions {
    return {
      service: {
        // returns one of Ogma's log levels, or 'ALL'.
        logLevel: this.configService.getLogLevel()
        color: true,
        // could be something like 'MyAwesomeNestApp'
        application: this.configService.getAppName() ,
      },
      interceptor: {
        skip: (req: Request, res: Response) => this.configService.isProd() && res.statusCode < 400
      }
    }
  }
}
```

The `ModuleConfigFactory` is an interface pulled from the [@golevelup/nestjs-module](https://github.com/golevelup/nestjs/tree/master/packages/modules) library, which was used for creating the dynamic module.

> Note: As the `ModuleConfigFactory` is just an interface, the dependency on the `@golevelup/nestjs-factory` package should just be a dev dependency to ensure the typings are correct. Of course, you can also just use a factory instead if you prefer.

Next, in our `AppModule` we can import the `OgmaModule` like so

```ts
@Module({
  imports: [
    CatsModule,
    ConfigModule,
    OgmaModule.forRootAsync(OgmaModule, {
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
  const logger = await app.resolve<OgmaService>(OgmaService);
  app.useLogger(logger);
  await app.listen(3000);
}

bootstrap();
```

With this, you will lose the initial logs about instantiation of the modules, but you will still get messages about what routes are bootstrapped and when the server is ready.

If we wanted to add the logger to the `CatsService` we can use the module's `forFeature` static method to give the logger service its own context variable.

```ts
@Module({
  // it is possible to override the initial configuration for this instance of the `OgmaService`, but not necessary.
  // this will set the value of context to 'CatsService'
  imports: [OgmaModule.forFeature(CatsService.name)],
  controllers: [CatsController],
  service: [CatsService]
})
export class CatsModule {}
```

And now in the `CatsService` the `OgmaService` can be injected like so:

```ts
@Injectable()
export class CatsService {
  constructor(private readonly logger: OgmaService) {}
}
```

And now `this.logger` is available in your `CatsService` class.

## Get in Touch

If there is something that needs to be addressed in regards to the module, feel free to [make an issue](https://github.com/jmcdo29/nestjs-ogma/issues/new). If you are looking to contact me, you cna either [email me](mailto:me@jaymcdoniel.dev), or [find me on discord](https://discord.com) as `PerfectOrphan31#6003`.

## Contributing

Please make sure that any and all pull requests follow the code standards enforced by the linter and prettier. Otherwise, any and all pull requests are welcomed, though an issue created to first track the PR would be appreciated. Feel free to make suggestions on how the module can improve and what can be done better.

## License

NestJS-Ogma has an [MIT License]('./../LICENSE).
