import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { color } from 'ogma';
import {
  FastifyLikeRequest,
  FastifyLikeResponse,
} from '../interfaces/fastify-like.interface';
import { OgmaInterceptorServiceOptions } from '../interfaces/ogma-options.interface';
import { OgmaRequest, OgmaResponse } from '../interfaces/ogma-types.interface';
import { InterceptorService } from './interfaces/interceptor-service.interface';
import { LogObject } from './interfaces/log.interface';

@Injectable()
export class HttpInterceptorService implements InterceptorService {
  private options!: OgmaInterceptorServiceOptions;

  getSuccessContext(
    data: any,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): LogObject {
    this.options = options;
    return {
      callerAddress: '127.0.0.1',
      method: 'GET',
      callPoint: '/',
      status: '200',
      responseTime: 83,
      contentLength: 42,
      protocol: 'HTTP/1.1',
    };
  }

  getErrorContext(
    error: Error | HttpException,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): LogObject {
    this.options = options;
    return {
      callerAddress: '127.0.0.1',
      method: 'GET',
      callPoint: '/',
      status: '500',
      responseTime: 83,
      contentLength: 42,
      protocol: 'HTTP/1.1',
    };
  }

  private getRequest(context: ExecutionContext): OgmaRequest {
    if (this.options.getRequest) {
      return this.options.getRequest(context);
    }
    return context.switchToHttp().getRequest();
  }

  private getResponse(context: ExecutionContext): OgmaResponse {
    if (this.options.getResponse) {
      return this.options.getResponse(context);
    }
    return context.switchToHttp().getResponse();
  }

  private isFastifyRequest(req: OgmaRequest): req is FastifyLikeRequest {
    return Object.keys(req).indexOf('raw') !== -1;
  }

  private isFastifyResponse(res: OgmaResponse): res is FastifyLikeResponse {
    return Object.keys(res).indexOf('res') !== -1;
  }

  private getStatusCode(res: OgmaResponse): number {
    if (this.isFastifyResponse(res)) {
      return res.res.statusCode;
    }
    return res.statusCode;
  }

  private setStatusCode(res: OgmaResponse, code: number): void {
    if (this.isFastifyResponse(res)) {
      res.res.statusCode = code;
    } else {
      res.statusCode = code;
    }
    return;
  }

  private getUrl(req: OgmaRequest): string | undefined {
    if (this.isFastifyRequest(req)) {
      return req.raw.url;
    }
    return req.url;
  }

  private getMethod(req: OgmaRequest): string | undefined {
    if (this.isFastifyRequest(req)) {
      return req.raw.method;
    }
    return req.method;
  }

  private getHttpMajor(req: OgmaRequest): number {
    if (this.isFastifyRequest(req)) {
      return req.raw.httpVersionMajor;
    }
    return req.httpVersionMajor;
  }

  private getHttpMinor(req: OgmaRequest): number {
    if (this.isFastifyRequest(req)) {
      return req.raw.httpVersionMinor;
    }
    return req.httpVersionMinor;
  }

  private determineStatusCodeFromError(error: HttpException): number {
    return (error.getStatus && error.getStatus()) || 500;
  }

  private statusCodeColor(statusCode: number): string {
    if (this.options.color) {
      const numericVal = statusCode;
      if (this.isBetween(numericVal, 0, 200)) {
        return statusCode.toString();
      } else if (this.isBetween(numericVal, 200, 300)) {
        return color.green(statusCode);
      } else if (this.isBetween(numericVal, 300, 400)) {
        return color.cyan(statusCode);
      } else if (this.isBetween(numericVal, 400, 500)) {
        return color.yellow(statusCode);
      } else {
        return color.red(statusCode);
      }
    } else {
      return statusCode.toString();
    }
  }

  private isBetween(num: number, min: number, max: number): boolean {
    return num >= min && num < max;
  }
}
