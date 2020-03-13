import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { OgmaInterceptorServiceOptions } from '../interfaces/ogma-options.interface';
import { InterceptorService } from './interfaces/interceptor-service.interface';
import { LogObject } from './interfaces/log.interface';

@Injectable()
export class RpcInterceptorService implements InterceptorService {
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
      protocol: 'RPC',
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
      status: '200',
      responseTime: 83,
      contentLength: 42,
      protocol: 'RPC',
    };
  }
}
