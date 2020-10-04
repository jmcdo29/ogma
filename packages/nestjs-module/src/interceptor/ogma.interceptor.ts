import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OgmaOptions } from '@ogma/logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectOgmaInterceptorOptions } from '../decorators';
import {
  OgmaInterceptorOptions,
  OgmaInterceptorServiceOptions,
} from '../interfaces';
import { OGMA_INTERCEPTOR_SKIP } from '../ogma.constants';
import { OgmaService } from '../ogma.service';
import { LogObject } from './interfaces/log.interface';
import { DelegatorService } from './providers';

@Injectable()
export class OgmaInterceptor implements NestInterceptor {
  private json: boolean;
  private color: boolean;

  constructor(
    @InjectOgmaInterceptorOptions()
    private readonly options: OgmaInterceptorOptions,
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
    const options = { ...this.options, json: this.json, color: this.color };
    const requestId = this.generateRequestId();
    this.delegate.setRequestId(context, requestId);
    return next.handle().pipe(
      tap(
        (data) => {
          this.shouldLogAndDoIt('getContextSuccessString', {
            data,
            context,
            startTime,
            options,
            requestId,
          });
        },
        (err) => {
          this.shouldLogAndDoIt('getContextErrorString', {
            data: err,
            context,
            startTime,
            options,
            requestId,
          });
        },
      ),
    );
  }

  public shouldLogAndDoIt(
    method: 'getContextErrorString' | 'getContextSuccessString',
    {
      context,
      startTime,
      data,
      requestId,
      options,
    }: {
      context: ExecutionContext;
      startTime: number;
      data: any;
      requestId: string;
      options: OgmaInterceptorServiceOptions;
    },
  ): void {
    if (!this.shouldSkip(context)) {
      const logObject = this.delegate[method](
        data,
        context,
        startTime,
        options,
      );
      this.log(logObject, context, requestId);
    }
  }

  public shouldSkip(context: ExecutionContext): boolean {
    const decoratorSkip =
      this.reflector.get(OGMA_INTERCEPTOR_SKIP, context.getClass()) ||
      this.reflector.get(OGMA_INTERCEPTOR_SKIP, context.getHandler());
    if (decoratorSkip) {
      return true;
    }
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http':
        return !this.options.http;
      case 'graphql':
        return (
          !this.options.gql ||
          context.getArgByIndex(3)?.operation?.operation === 'subscription'
        );
      case 'ws':
        return !this.options.ws;
      case 'rpc':
        return !this.options.rpc;
    }
  }

  public log(
    logObject: string | LogObject,
    context: ExecutionContext,
    requestId?: string,
  ): void {
    this.service.info(
      logObject,
      `${context.getClass().name}#${context.getHandler().name}`,
      requestId,
    );
  }

  public generateRequestId(): string {
    const time = Date.now().toString();
    const randomNumbers = Math.floor(Math.random() * (1000 - 100) + 100);
    return time + randomNumbers.toString();
  }
}
