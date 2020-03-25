import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OgmaOptions } from 'ogma';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OgmaInterceptorOptions } from '../interfaces';
import {
  OGMA_INTERCEPTOR_OPTIONS,
  OGMA_INTERCEPTOR_SKIP,
} from '../ogma.constants';
import { OgmaService } from '../ogma.service';
import { DelegatorService } from './delegator.service';
import { LogObject } from './interfaces/log.interface';
import { TcpContext } from '@nestjs/microservices';

@Injectable()
export class OgmaInterceptor implements NestInterceptor {
  private json: boolean;
  private color: boolean;
  constructor(
    @Inject(OGMA_INTERCEPTOR_OPTIONS)
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
          this.service.log(context.switchToRpc().getContext());
          this.service.log(context.switchToRpc().getContext() instanceof TcpContext)
          if (!this.shouldSkip(context)) {
            logObject = this.delegate.getContextSuccessString(
              data,
              context,
              startTime,
              options,
            );
            this.log(logObject, context);
          }
          return;
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
    return (
      this.reflector.get(OGMA_INTERCEPTOR_SKIP, context.getClass()) ||
      this.reflector.get(OGMA_INTERCEPTOR_SKIP, context.getHandler())
    );
  }

  public log(logObject: string | LogObject, context: ExecutionContext): void {
    this.service.info(
      logObject,
      `${context.getClass().name}#${context.getHandler().name}`,
    );
  }
}
