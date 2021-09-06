---
id: custom
title: Custom Parsers
---

To create a custom parser, you can either `extend` an existing parser and override any of the methods, such as the `getCallerIp()` if you need to get a value other than `req.ip` in the [`@ogma/platform-express`](./http/platform-express) parser, or you can create your own class that `extends AbstractInterceptorService` or `implements InterceptorService`. All of the methods of these classes and interfaces have appropriate typings and doc strings to help with creating your own parser if you want to work with a system that is not directly yet supported.

```ts
interface InterceptorService {
  getSuccessContext(
    data: number,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions
  ): LogObject;

  getErrorContext(
    error: Error | HttpException,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions
  ): LogObject;
}
```

```ts
abstract class AbstractInterceptorService
  implements InterceptorService
{
  constructor(protected readonly reflector: Reflector) {}

  /**
   * A method to transform the incoming execution context into metadata that the OgmaInterceptor will then log.
   * This method handles the success cases
   * @param dataLength the buffer length of the data
   * @param context the execution context from Nest
   * @param startTime when the request started
   * @param options the options passed to the interceptor
   * @returns an object that represents what should be logged
   */
  getSuccessContext(
    dataLength: number,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions
  ): LogObject {
    return {
      callerAddress: this.getCallerIp(context),
      method: this.getMethod(context),
      callPoint: this.getCallPoint(context),
      responseTime: this.getResponseTime(startTime),
      contentLength: dataLength,
      protocol: this.getProtocol(context),
      status: this.getStatus(context, options.color && !options.json)
    };
  }

  /**
   * A method to transform the incoming execution context into metadata that the OgmaInterceptor will then log.
   * This method handles the error cases
   * @param error the error that happened
   * @param context the execution context from Nest
   * @param startTime when the request started
   * @param options the options passed to the interceptor
   * @returns an object that represents what should be logged
   */
  getErrorContext(
    error: Error | HttpException,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions
  ): LogObject {
    return {
      callerAddress: this.getCallerIp(context),
      method: this.getMethod(context),
      callPoint: this.getCallPoint(context),
      status: this.getStatus(
        context,
        options.color && !options.json,
        error
      ),
      responseTime: this.getResponseTime(startTime),
      contentLength: Buffer.from(JSON.stringify(error.message))
        .byteLength,
      protocol: this.getProtocol(context)
    };
  }

  /**
   * A helper method to get the status based on if the request was an error or success
   * @param context the execution context
   * @param inColor if the status should be in color
   * @param error if it was an error
   * @returns a string representing the status
   */
  getStatus(
    _context: ExecutionContext,
    inColor: boolean,
    error?: HttpException | Error
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  /**
   * A helper method to get the Ip of the calling client
   * @param context the execution context
   */
  abstract getCallerIp(context: ExecutionContext): string[] | string;

  /**
   * A helper method to get the method type of the request
   *
   * REST: an HTTP Verb (GET, POST, PATCH, etc)
   *
   * GraphQL: Query, Mutation, or Subscription
   *
   * Microservice: Request or Reply
   *
   * Websockets: unknown at momentHTTP: HTTP Verb
   *
   * @param context the execution context
   */
  abstract getMethod(context: ExecutionContext): string;

  private getResponseTime(startTime: number): number {
    return Date.now() - startTime;
  }

  /**
   * A helper method to get the protocol of the request
   * @param context execution context from Nest
   */
  abstract getProtocol(context: ExecutionContext): string;

  /**
   * A helper method to get what was called
   *
   * REST: endpoint
   *
   * GraphQL: Query or Mutation name
   *
   * Microservice: Message Topic
   *
   * WebSockets: Subscription Event name
   * @param context execution context from Nest
   */
  abstract getCallPoint(context: ExecutionContext): string;

  /**
   * A helper method for setting the correlationId to later be retrieved when logging
   * @param context the execution context
   * @param requestId the correlationId to set
   */
  abstract setRequestId(
    context: ExecutionContext,
    requestId: string
  ): void;

  protected wrapInColor(status: number): string {
    let statusString: string;
    if (this.isBetween(status, 100, 300)) {
      statusString = style.green.apply(status);
    } else if (this.isBetween(status, 300, 400)) {
      statusString = style.cyan.apply(status);
    } else if (this.isBetween(status, 400, 500)) {
      statusString = style.yellow.apply(status);
    } else if (this.isBetween(status, 500, 600)) {
      statusString = style.red.apply(status);
    } else {
      statusString = style.white.apply(status);
    }
    return statusString;
  }

  protected isBetween(
    comparator: number,
    bottom: number,
    top: number
  ): boolean {
    return comparator >= bottom && comparator < top;
  }
}
```

## Other Abstract Classes

There are also abstract classes already created for each transport type, `HTTP`, `GQL`, `WS`, and `RPC`. Each of which can be used instead of extending from the base `AbstractInterceptorService` class if you so choose. This helps with needing to implement the minimum amount of logic for the parser.
