<div align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jmcdo29_nestjs-ogma&metric=alert_status)](https://sonarcloud.io/dashboard?id=jmcdo29_ogma) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Actions Status](https://github.com/jmcdo29/nestjs-ogma/workflows/CI/badge.svg)](https://github.com/jmcdo29/nestjs-ogma/workflows/CI/badge.svg) [![Version](https://badgen.net/npm/v/nestjs-ogma)](https://npmjs.com/package/nestjs-ogma) [![Coffee](https://badgen.net/badge/Buy%20Me/A%20Coffee/purple?icon=kofi)](https://www.buymeacoffee.com/jmcdo29)

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
      serivce: {
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
            })
          }
        },
        application: config.getAppName()
      })
    })
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
