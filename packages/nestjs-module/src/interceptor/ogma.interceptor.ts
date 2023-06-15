import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OgmaOptions } from '@ogma/logger';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OGMA_INTERCEPTOR_SKIP } from '../ogma.constants';
import { OgmaService } from '../ogma.service';
import { InterceptorMeta } from './interfaces/interceptor-service.interface';
import { LogObject } from './interfaces/log.interface';
import { DelegatorService } from './providers';

/**
 * An interceptor to handle logging for just about any kind of request that Nest can handle
 */
@Injectable()
export class OgmaInterceptor implements NestInterceptor {
  private json: boolean;
  private color: boolean;

  constructor(
    private readonly service: OgmaService,
    private readonly delegate: DelegatorService,
    private readonly reflector: Reflector,
  ) {
    const ogmaOptions: OgmaOptions = (this.service as any).ogma.options;
    this.json = ogmaOptions.json;
    this.color = ogmaOptions.color;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const options = { json: this.json, color: this.color };
    const correlationId = this.generateRequestId(context);
    this.delegate.setRequestId(context, correlationId);
    return next.handle().pipe(this.rxJsLogTap({ context, startTime, options, correlationId }));
  }

  public rxJsLogTap(meta: InterceptorMeta): MonoTypeOperatorFunction<void> {
    return tap({
      next: (data) => {
        const info = { ...meta, data };
        this.shouldLogAndDoIt('Success', info);
      },
      error: (err) => {
        const info = { ...meta, data: err };
        this.shouldLogAndDoIt('Error', info);
      },
    });
  }

  public shouldLogAndDoIt(
    method: 'Error' | 'Success',
    { context, startTime, data, correlationId, options }: InterceptorMeta & { data: any },
  ): void {
    const callMethod = `getContext${method}String`;
    if (!this.shouldSkip(context)) {
      const { meta, log: logObject } = this.delegate[callMethod](data, context, startTime, options);
      this.log(logObject, context, correlationId);
      if (meta) {
        this.log(meta, context, correlationId);
      }
    }
  }

  /**
   * A method to determine if a request should be logged or not. This is determined by several factors:
   * 1) If `@OgmaSkip()` decorator is present on the class or the handler, the request should not be logged
   * 2) If the request is from a GQL subscription, it should not be logged
   * 3) if the request is for a contextType that does not have a parser installed and passed in the options, it should not be logged
   * @param context the execution context
   * @returns a boolean on if the request should not be logged
   */
  public shouldSkip(context: ExecutionContext): boolean {
    const decoratorSkip =
      this.reflector.get(OGMA_INTERCEPTOR_SKIP, context.getClass()) ||
      this.reflector.get(OGMA_INTERCEPTOR_SKIP, context.getHandler());
    if (decoratorSkip) {
      return true;
    }
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      return context.getArgByIndex(3)?.operation?.operation === 'subscription';
    }
  }

  public log(
    logObject: string | LogObject,
    context: ExecutionContext,
    correlationId?: string,
  ): void {
    this.service.info(logObject, {
      context: `${context.getClass().name}#${context.getHandler().name}`,
      correlationId,
    });
  }

  /**
   * A method to generate a new correlationId on each request
   * @param _context The execution context object
   * @returns a string that represents the correlationId
   */
  public generateRequestId(_context?: ExecutionContext): string {
    const time = Date.now().toString();
    const randomNumbers = Math.floor(Math.random() * (1000 - 100) + 100);
    return time + randomNumbers.toString();
  }
}
