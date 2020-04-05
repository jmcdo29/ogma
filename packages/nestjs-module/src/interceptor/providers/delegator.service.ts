import { ExecutionContext, Injectable } from '@nestjs/common';
import { OgmaInterceptorServiceOptions } from '../../interfaces';
import { LogObject } from '../interfaces/log.interface';
import { HttpInterceptorService } from './http-interceptor.service';
import { GqlInterceptorService } from './gql-interceptor.service';
import { WebsocketInterceptorService } from './websocket-interceptor.service';
import { RpcInterceptorService } from './rpc-interceptor.service';

@Injectable()
export class DelegatorService {
  constructor(
    private readonly httpParser: HttpInterceptorService,
    private readonly wsParser: WebsocketInterceptorService,
    private readonly rpcParser: RpcInterceptorService,
    private readonly gqlParser: GqlInterceptorService,
  ) {}

  getContextSuccessString(
    data: any,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): string | LogObject {
    data = data ? JSON.stringify(data) : '';
    data = Buffer.from(data).byteLength;
    let logObject: LogObject = {} as any;
    switch (context.getType()) {
      case 'http':
        // hack to handle graphql context properly
        if (context.getArgs().length === 3) {
          logObject = this.httpParser.getSuccessContext(
            data,
            context,
            startTime,
            options,
          );
        } else {
          logObject = this.gqlParser.getSuccessContext(
            data,
            context,
            startTime,
            options,
          );
        }
        break;
      case 'ws':
        logObject = this.wsParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
        break;
      case 'rpc':
        logObject = this.rpcParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
        break;
    }
    return this.getStringOrObject(logObject, { json: options.json });
  }

  getContextErrorString(
    error: any,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): string | LogObject {
    let logObject: LogObject = {} as any;
    switch (context.getType()) {
      case 'http':
        // hack to handle graphql context properly
        if (context.getArgs().length === 3) {
          logObject = this.httpParser.getErrorContext(
            error,
            context,
            startTime,
            options,
          );
        } else {
          logObject = this.gqlParser.getErrorContext(
            error,
            context,
            startTime,
            options,
          );
        }
        break;
      case 'ws':
        logObject = this.wsParser.getErrorContext(
          error,
          context,
          startTime,
          options,
        );
        break;
      case 'rpc':
        logObject = this.rpcParser.getErrorContext(
          error,
          context,
          startTime,
          options,
        );
        break;
    }
    return this.getStringOrObject(logObject, { json: options.json });
  }

  private getStringOrObject(
    data: LogObject,
    options: { json: boolean },
  ): string | LogObject {
    return options.json
      ? data
      : `${data.callerAddress} - ${data.method} ${data.callPoint} ${data.protocol} ${data.status} ${data.responseTime}ms - ${data.contentLength}`;
  }
}
