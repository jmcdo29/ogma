import { ExecutionContext, HttpException } from '@nestjs/common';
import { OgmaInterceptorServiceOptions } from 'src/interfaces/ogma-options.interface';
import { LogObject } from './log.interface';

export interface InterceptorService {
  getSuccessContext(
    data: any,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): LogObject;

  getErrorContext(
    error: Error | HttpException,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): LogObject;
}
