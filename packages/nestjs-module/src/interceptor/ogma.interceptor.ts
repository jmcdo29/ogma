import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OgmaOptions } from '@ogma/logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectOgmaInterceptorOptions } from '../decorators';
import { OgmaInterceptorOptions } from '../interfaces';
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
    let logObject: string | LogObject;
    return next.handle().pipe(
      tap(
        (data) => {
          if (!this.shouldSkip(context)) {
            logObject = this.delegate.getContextSuccessString(
              data,
              context,
              startTime,
              options,
            );
            this.log(logObject, context);
          }
        },
        (err) => {
          if (!this.shouldSkip(context)) {
            logObject = this.delegate.getContextErrorString(
              err,
              context,
              startTime,
              options,
            );
            this.log(logObject, context);
          }
        },
      ),
    );
  }

  public shouldSkip(context: ExecutionContext): boolean {
    const decoratorSkip =
      this.reflector.get(OGMA_INTERCEPTOR_SKIP, context.getClass()) ||
      this.reflector.get(OGMA_INTERCEPTOR_SKIP, context.getHandler());
    if (decoratorSkip) {
      return true;
    }
    switch (context.getType()) {
      case 'http':
        if (context.getArgs().length === 3) {
          return !this.options.http;
        }
        return !this.options.gql;
      case 'ws':
        return !this.options.ws;
      case 'rpc':
        return !this.options.rpc;
    }
  }

  public log(logObject: string | LogObject, context: ExecutionContext): void {
    this.service.info(
      logObject,
      `${context.getClass().name}#${context.getHandler().name}`,
    );
  }
}
