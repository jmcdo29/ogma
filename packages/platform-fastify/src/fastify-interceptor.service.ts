import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { AbstractInterceptorService } from '@ogma/nestjs-module';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';

@Injectable()
export class FastifyParser extends AbstractInterceptorService {
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

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | HttpException,
  ): string {
    let status;
    const res = this.getResponse(context);
    status = res.res.statusCode;
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

  private getRequest(context: ExecutionContext): FastifyRequest {
    return context.switchToHttp().getRequest<FastifyRequest>();
  }

  private getResponse(context: ExecutionContext): FastifyReply<ServerResponse> {
    return context.switchToHttp().getResponse<FastifyReply<ServerResponse>>();
  }

  private determineStatusCodeFromError(error: HttpException | Error): number {
    return error instanceof HttpException ? error.getStatus() : 500;
  }
}
