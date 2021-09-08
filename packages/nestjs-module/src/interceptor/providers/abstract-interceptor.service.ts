import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { style } from '@ogma/styler';
import { OgmaInterceptorServiceOptions } from '../../interfaces/ogma-options.interface';
import { InterceptorService } from '../interfaces/interceptor-service.interface';
import { MetaLogObject } from '../interfaces/log.interface';

@Injectable()
export abstract class AbstractInterceptorService implements InterceptorService {
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
    options: OgmaInterceptorServiceOptions,
  ): MetaLogObject {
    return {
      callerAddress: this.getCallerIp(context),
      method: this.getMethod(context),
      callPoint: this.getCallPoint(context),
      responseTime: this.getResponseTime(startTime),
      contentLength: dataLength,
      protocol: this.getProtocol(context),
      status: this.getStatus(context, options.color && !options.json),
      meta: this.getMeta(context),
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
    options: OgmaInterceptorServiceOptions,
  ): MetaLogObject {
    return {
      callerAddress: this.getCallerIp(context),
      method: this.getMethod(context),
      callPoint: this.getCallPoint(context),
      status: this.getStatus(context, options.color && !options.json, error),
      responseTime: this.getResponseTime(startTime),
      contentLength: Buffer.from(JSON.stringify(error.message)).byteLength,
      protocol: this.getProtocol(context),
      meta: this.getMeta(context),
    };
  }

  /**
   * A helper method to get the status based on if the request was an error or success
   * @param context the execution context
   * @param inColor if the status should be in color
   * @param error if it was an error
   * @returns a string representing the status
   */
  getStatus(_context: ExecutionContext, inColor: boolean, error?: HttpException | Error): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  /**
   * A helper method to allow devs the ability to pass in extra metadata when it comes to the interceptor
   * @param context The ExecutionContext
   * @returns whatever metadata you want to add in on a second log line. This can be a string, an object, anything
   */
  getMeta(_context: ExecutionContext): unknown {
    return;
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
   * Websockets: unknown at moment
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
  abstract setRequestId(context: ExecutionContext, requestId: string): void;

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

  protected isBetween(comparator: number, bottom: number, top: number): boolean {
    return comparator >= bottom && comparator < top;
  }
}
