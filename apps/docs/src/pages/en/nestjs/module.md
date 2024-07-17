---
id: module
title: OgmaModule
layout: ../../../layouts/MainLayout.astro
---

:::info

For all of the `@ogma/nestjs-module` parts, make sure that the `@ogma/nestjs-module` package is installed using whatever package manger you are using for your project.

:::

With that out of the way, the package comes with a [Dynamic Nest Module](https://docs.nestjs.com/fundamentals/dynamic-modules) ready for use so you can just configure it and go.

## Root Configuration

First, we have the root configuration for the package, which should be called once, usually in your `AppModule` or whatever else you end up calling the `RootModule`, which will be imported and used with `NestFactory.create`. Like most Nest packages nowadays, there's both synchronous and async configurations that can be made use of.

### Synchronous Configuration

```ts
OgmaModule.forRoot(ogmaOptions);
```

### Asynchronous Configuration

```ts
OgmaModule.forRootAsync({
  useClass: OgmaConfigService
});
```

or

```ts
OgmaModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config) => ogmaOptionsFromConfig(config)
});
```

### forRoot Options

The options that are required for the above methods can be found in the tables below

#### OgmaModuleOptions

The options that this module takes are the same as those from the `@ogma/logger` package plus an optional `traceMethod` property that tells the `@Log()` decorator what level to log at.

## Feature Configuration

Along with root level configuration, the `OgmaModule` also allows for feature level configuration for setting up [`OgmaServices`](/en/nestjs/service) with specified contexts. These contexts will be added to the logs automatically.

```ts
OgmaModule.forFeature(FooService);
```

You can also use `forFeatures` to register multiple contexts at once

```ts
OgmaModule.forFeatures([FooService, BarService, FooBarService]);
```

And lastly, if you wish to make the injected services request scoped you can pass on the options for that like so

```ts
OgmaModule.forFeature(FooService, { addRequestId: true });
```

or for multiple registrations

```ts
OgmaModule.forFeatures([
  {
    context: FooService,
    options: { addRequestId: true }
  },
  BarService
]);
```
