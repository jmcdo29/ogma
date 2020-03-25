import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import {
  FastifyLikeRequest,
  FastifyLikeResponse,
  OgmaRequest,
  OgmaResponse,
} from '../interfaces';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export class HttpInterceptorService extends AbstractInterceptorService {
  getCallerIp(context: ExecutionContext): string[] | string {
    const req = this.getRequest(context);
    return req.ips.length ? req.ips : req.ip;
  }

  getCallPoint(context: ExecutionContext): string {
    let url: string | undefined;
    const req = this.getRequest(context);
    if (this.isFastifyRequest(req)) {
      url = req.raw.url;
    } else {
      url = req.url;
    }
    return url || '';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error & HttpException,
  ): string {
    let status;
    const res = this.getResponse(context);
    if (this.isFastifyResponse(res)) {
      status = res.res.statusCode;
    } else {
      status = res.statusCode;
    }
    const reflectStatus = this.reflector.get<number>(
      HTTP_CODE_METADATA,
      context.getHandler(),
    );
    status = reflectStatus ?? status;
    if (error) {
      status = this.determineStatusCodeFromError(error);
    }
    this.setStatusCode(res, status);
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  getMethod(context: ExecutionContext): string {
    let method: string | undefined;
    const req = this.getRequest(context);
    if (this.isFastifyRequest(req)) {
      method = req.raw.method;
    } else {
      method = req.method;
    }
    return method ?? 'GET';
  }

  getProtocol(context: ExecutionContext): string {
    const req = this.getRequest(context);
    return `HTTP/${this.getHttpMajor(req)}.${this.getHttpMinor(req)}`;
  }

  private getRequest(context: ExecutionContext): OgmaRequest {
    return context.switchToHttp().getRequest();
  }

  private getResponse(context: ExecutionContext): OgmaResponse {
    return context.switchToHttp().getResponse();
  }

  private isFastifyRequest(req: OgmaRequest): req is FastifyLikeRequest {
    return Object.keys(req).indexOf('raw') !== -1;
  }

  private isFastifyResponse(res: OgmaResponse): res is FastifyLikeResponse {
    return Object.keys(res).indexOf('res') !== -1;
  }

  private setStatusCode(res: OgmaResponse, code: number): void {
    if (this.isFastifyResponse(res)) {
      res.res.statusCode = code;
    } else {
      res.statusCode = code;
    }
    return;
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

  private determineStatusCodeFromError(error: HttpException & Error): number {
    return (error.getStatus && error.getStatus()) || 500;
  }
}
