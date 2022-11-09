---
id: filter
title: Filter Logging Service
layout: ../../../layouts/MainLayout.asrto
---

There may be times where you need to log an exception that happened outside of the interceptor's control, say like in a guard or a middleware. For this purpose, ogma also comes with an `OgmaFilterService` that takes in the exception and the `ArgumentsHost`, and prints out a line just like the interceptor would. The service is also smart, ensuring not to print out another line to the logs if the exception has already been logged by the interceptor.

To make use of this provider, all that's needed is to inject the service into your filter and call `this.service.log(exception, host)`. This way, any custom filter keeps all of the logic in your hands while allowing for logging of the exception.

```ts
import { BaseExceptionFilter, Catch } from '@nestjs/common';
import { OgmaFilterService } from '@ogma/nestjs-module';

@Catch()
export class CustomExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly service: OgmaFilterService) {}

  catch(exception: Error, host: ArgumentsHost) {
    this.service.log(exception, host);
    super.catch(exception, host);
  }
}
```
