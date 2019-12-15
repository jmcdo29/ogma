<div align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jmcdo29_nestjs-ogma&metric=alert_status)](https://sonarcloud.io/dashboard?id=jmcdo29_ogma) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Actions Status](https://github.com/jmcdo29/nestjs-ogma/workflows/CI/badge.svg)](https://github.com/jmcdo29/nestjs-ogma/workflows/CI/badge.svg)

</div>

# nestjs-ogma

A [NestJS module](https://docs.nestjs.com) for the [Ogma](https://github.com/jmcdo29/ogma) logging package.

## Usage

The OgmaService class is TRANSIENT scoped, which means that for each time you call `OgmaModule.forFeature()` a new instance of the `OgmaService` is created, and a new context is given to that OgmaService if one is provided. The base Ogma class, will also be created as you are able to pass in options for the ogma class. This allows you to give each of your OgmaService's different logLevel configurations, which can be a big win.

Ogma is a lightweight logger with customization options, that prints your logs in a pretty manner with timestamping, colors, and different levels. See the GitHub repository for Ogma to learn more about configuration and options.

## Configuration

Currently, configuration is only done in the `forFeature` static method of the module. The method takes in a single object that is an intersection of the context key, and the `OgmaOptions` from the `Ogma` package. You could configured your OgmaModule like so

```ts
@Module({
  imports: [
    OgmaModule.forFeature({ context: MyService.name, color: false })
  ],
  providers: [MyService]
})
export class MyModule {}
```

The above will turn colors off for MyModule's related service's logs, and will create a context for the logs called 'MyService`.
