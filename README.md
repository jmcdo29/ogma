<div align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jmcdo29_nestjs-ogma&metric=alert_status)](https://sonarcloud.io/dashboard?id=jmcdo29_ogma) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Actions Status](https://github.com/jmcdo29/nestjs-ogma/workflows/CI/badge.svg)](https://github.com/jmcdo29/nestjs-ogma/workflows/CI/badge.svg)

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
    OgmaModule.forRoot({
      color: true,
      json: false,
      application: 'NestJS'
    })
  ]
})
export class AppModule {}
```

or async

```ts
@Module({
  imports: [
    OgmaModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        json: config.isProd(),
        stream: {
          write: (message) =>
            appendFile(config.getLogFile(), message, (err) => {
              if (err) {
                throw err;
              }
            })
        },
        application: config.getAppName()
      })
    })
  ]
})
export class AppModule {}
```

From here in each module you need to add the `OgmaService` you can add `OgmaModule.forFeature(context, option)`, where context is the context you want to add to the log and options are `OgmaOptions` you want to pass to override the originally configured options.

```ts
@Module({
  imports: [OgmaModule.forFeature(MyService.name, { color: false })],
  providers: [MyService]
})
export class MyModule {}
```

The above would set up the OgmaService to add the context of `[MyService]` to every log from within the `MyModule` module, and would tell the `Ogma` instance to not use any colors.
