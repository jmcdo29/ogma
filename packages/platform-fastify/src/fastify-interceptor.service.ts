import { ExecutionContext, Injectable } from '@nestjs/common';
import { HttpInterceptorService } from '@ogma/nestjs-module';
import { FastifyRequest } from 'fastify';

@Injectable()
export class FastifyParser extends HttpInterceptorService {
  getCallerIp(context: ExecutionContext): string[] | string {
    const req = this.getRequest(context);
    return req.ips && req.ips.length ? req.ips.join(' ') : req.ip;
  }

  getCallPoint(context: ExecutionContext): string {
    const req = this.getRequest(context);
    return req.raw.url;
  }

  getMethod(context: ExecutionContext): string {
    const req = this.getRequest(context);
    return req.raw.method || 'GET';
  }

  getProtocol(context: ExecutionContext): string {
    const req = this.getRequest(context);
    return `HTTP/${req.raw.httpVersionMajor}.${req.raw.httpVersionMinor}`;
  }

  getRequest(context: ExecutionContext): FastifyRequest {
    return super.getRequest(context);
  }
}
