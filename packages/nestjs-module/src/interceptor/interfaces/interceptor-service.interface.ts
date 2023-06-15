import { ArgumentsHost, ExecutionContext, HttpException } from '@nestjs/common';

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
    context: ArgumentsHost,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): LogObject;

  getErrorContext(
    error: Error | HttpException,
    context: ArgumentsHost,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): LogObject;

  getStartTime(host: ArgumentsHost): number;
}
