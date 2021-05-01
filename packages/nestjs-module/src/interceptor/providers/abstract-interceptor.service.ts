import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { style } from '@ogma/styler';
import { OgmaInterceptorServiceOptions } from '../../interfaces/ogma-options.interface';
import { InterceptorService } from '../interfaces/interceptor-service.interface';
import { LogObject } from '../interfaces/log.interface';

@Injectable()
export abstract class AbstractInterceptorService implements InterceptorService {
  constructor(protected readonly reflector: Reflector) {}

  getSuccessContext(
    dataLength: number,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): LogObject {
    return {
      callerAddress: this.getCallerIp(context),
      method: this.getMethod(context),
      callPoint: this.getCallPoint(context),
      responseTime: this.getResponseTime(startTime),
      contentLength: dataLength,
      protocol: this.getProtocol(context),
      status: this.getStatus(context, options.color && !options.json),
    };
  }

  getErrorContext(
    error: Error | HttpException,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): LogObject {
    return {
      callerAddress: this.getCallerIp(context),
      method: this.getMethod(context),
      callPoint: this.getCallPoint(context),
      status: this.getStatus(context, options.color && !options.json, error),
      responseTime: this.getResponseTime(startTime),
      contentLength: Buffer.from(JSON.stringify(error.message)).byteLength,
      protocol: this.getProtocol(context),
    };
  }

  getStatus(context: ExecutionContext, inColor: boolean, error?: HttpException | Error): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  abstract getCallerIp(context: ExecutionContext): string[] | string;

  abstract getMethod(context: ExecutionContext): string;

  private getResponseTime(startTime: number): number {
    return Date.now() - startTime;
  }

  abstract getProtocol(context: ExecutionContext): string;

  abstract getCallPoint(context: ExecutionContext): string;

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
