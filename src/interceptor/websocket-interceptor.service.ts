import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { OgmaInterceptorServiceOptions } from '../interfaces/ogma-options.interface';
import { InterceptorService } from './interceptor-service.interface';

@Injectable()
export class WebsocketInterceptorService implements InterceptorService {
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
}
