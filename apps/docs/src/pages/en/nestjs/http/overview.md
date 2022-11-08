---
id: overview
title: HTTP Overview
layout: ../../../../layouts/MainLayout.astro
---

Ogma has two primary parsers for HTTP request logging, depending on the underlying HTTP adapter you're using, [`@ogma/platform-express`](./platform-express) and [`@ogma/platform-fastify`](./platform-fastify). These packages are almost identical, with the only differences being some of the underlying types, to have stronger typing to match with the adapter. Either of these, or a [custom adapter](../custom) are available to pass to the `interceptor.http` option for the `OgmaModuleOptions` object.

```
[2021-09-06T18:50:22.767Z] [INFO]  [jay-pop] [Express] [138639] [1630954222762841] [HttpController#getHello] ::1 - GET / HTTP/1.1 200 3ms - 17
```
