import { ExecutionContext, HttpException } from '@nestjs/common';

import { OgmaInterceptorServiceOptions } from '../../interfaces/ogma-options.interface';
import { LogObject } from './log.interface';

export interface InterceptorMeta {
  context: ExecutionContext;
  startTime: number;
  options: OgmaInterceptorServiceOptions;
  correlationId: string;
}

export interface InterceptorService {
  getSuccessContext(
    data: number,
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
