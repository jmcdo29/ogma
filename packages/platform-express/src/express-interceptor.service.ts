import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { AbstractInterceptorService } from '@ogma/nestjs-module';
import { Request, Response } from 'express';

@Injectable()
export class ExpressParser extends AbstractInterceptorService {
  getCallerIp(context: ExecutionContext): string[] | string {
    const req = this.getRequest(context);
    return req.ips.length ? req.ips.join(' ') : req.ip;
  }

  getCallPoint(context: ExecutionContext): string {
    const req = this.getRequest(context);
    return req.originalUrl;
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | HttpException,
  ): string {
    let status;
    const res = this.getResponse(context);
    status = res.statusCode;
    const reflectStatus = this.reflector.get<number>(
      HTTP_CODE_METADATA,
      context.getHandler(),
    );
    status = reflectStatus || status;
    if (error) {
      status = this.determineStatusCodeFromError(error);
    }
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  getMethod(context: ExecutionContext): string {
    const req = this.getRequest(context);
    const method = req.method;
    return method || 'GET';
  }

  getProtocol(context: ExecutionContext): string {
    const req = this.getRequest(context);
    return `HTTP/${this.getHttpMajor(req)}.${this.getHttpMinor(req)}`;
  }

  getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  getResponse(context: ExecutionContext): Response {
    return context.switchToHttp().getResponse();
  }

  private getHttpMajor(req: Request): number {
    return req.httpVersionMajor;
  }

  private getHttpMinor(req: Request): number {
    return req.httpVersionMinor;
  }

  private determineStatusCodeFromError(error: HttpException | Error): number {
    return (error as HttpException).getStatus() || 500;
  }
}
