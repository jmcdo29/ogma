import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { color } from 'ogma';
import {
  FastifyLikeRequest,
  FastifyLikeResponse,
} from '../interfaces/fastify-like.interface';
import { OgmaInterceptorServiceOptions } from '../interfaces/ogma-options.interface';
import { OgmaRequest, OgmaResponse } from '../interfaces/ogma-types.interface';
import { InterceptorService } from './interceptor-service.interface';

@Injectable()
export class HttpInterceptorService implements InterceptorService {
  private options!: OgmaInterceptorServiceOptions;

  getSuccessContext(
    data: any,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): string | object {
    this.options = options;
    return 'success string';
  }

  getErrorContext(
    error: Error | HttpException,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): string | object {
    this.options = options;
    return 'error string';
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

  private devContext(
    req: OgmaRequest,
    res: OgmaResponse,
    data: Buffer,
    startTime: number,
  ): string | object {
    const requestTime = Date.now() - startTime + ' ms';
    const contentLength = data.byteLength;
    const status = this.getStatusCode(res);
    const url = this.getUrl(req);
    const method = this.getMethod(req);
    if (this.options.json) {
      return {
        method,
        url,
        status,
        'Content-Length': contentLength,
        'Response-Time': requestTime,
      };
    }
    return `${method} ${url} ${this.statusCodeColor(
      status,
    )} ${requestTime} - ${contentLength}`;
  }

  private prodContext(
    req: OgmaRequest,
    res: OgmaResponse,
    data: Buffer,
    startTime: number,
  ): string | object {
    const requestTime = Date.now() - startTime + ' ms';
    const contentLength = data.byteLength;
    const address = req.ips ?? req.ip;
    const status = this.getStatusCode(res);
    const url = this.getUrl(req);
    const method = this.getMethod(req);
    const httpMajor = this.getHttpMajor(req);
    const httpMinor = this.getHttpMinor(req);
    const httpVersion = `${httpMajor}.${httpMinor}`;
    if (this.options.json) {
      return {
        'Remote-Address': address,
        method,
        url,
        status,
        'Content-Length': contentLength,
        'Response-Time': requestTime,
        httpVersion,
      };
    }
    return `${address} - ${method} ${url} HTTP/${httpVersion} ${this.statusCodeColor(
      status,
    )} ${requestTime} - ${contentLength}`;
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
