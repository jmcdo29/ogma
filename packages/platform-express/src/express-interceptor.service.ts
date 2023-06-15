import { ExecutionContext, Injectable } from '@nestjs/common';
import { HttpInterceptorService } from '@ogma/nestjs-module';
import { Request } from 'express';

@Injectable()
export class ExpressParser extends HttpInterceptorService {
  getCallerIp(context: ExecutionContext): string[] | string {
    const req = this.getRequest(context);
    return req.ips.length ? req.ips.join(' ') : req.ip;
  }

  getCallPoint(context: ExecutionContext): string {
    const req = this.getRequest(context);
    return req.originalUrl;
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

  private getHttpMajor(req: Request): number {
    return req.httpVersionMajor;
  }

  private getHttpMinor(req: Request): number {
    return req.httpVersionMinor;
  }

  getRequest(context: ExecutionContext): Request {
    return super.getRequest(context);
  }
}
