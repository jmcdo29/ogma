---
id: tcp
title: Platform TCP
layout: ../../../../layouts/MainLayout.astro
---

The `TcpParser` parser for the `OgmaInterceptor`. This plugin class parses TCP request and response object to be able to successfully log the data about the request. For more information, check out the [@ogma/nestjs-module](/en/nestjs/module) documentation.

## Installation

Nothing special, standard `npm i @ogma/platform-tcp` or `yarn add @ogma/platform-tcp`

## Usage

This plugin is to be used in the `OgmaInterceptorOptions` portion of the `OgmaModule` during `forRoot` or `forRootAsync` registration. It can be used like so:

```ts
@Module({
  imports: [OgmaModule.forRoot({})],
  providers: [TcpParser]
})
export class AppModule {}
```
