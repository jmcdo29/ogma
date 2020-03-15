import { ExecutionContext, Injectable } from '@nestjs/common';
import { OgmaInterceptorServiceOptions } from '../interfaces/ogma-options.interface';
import { HttpInterceptorService } from './http-interceptor.service';
import { LogObject } from './interfaces/log.interface';
import { RpcInterceptorService } from './rpc-interceptor.service';
import { WebsocketInterceptorService } from './websocket-interceptor.service';

@Injectable()
export class DelegatorService {
  constructor(
    private readonly httpParser: HttpInterceptorService,
    private readonly wsParser: WebsocketInterceptorService,
    private readonly rpcParser: RpcInterceptorService,
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
        logObject = this.httpParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
        break;
      /* case 'ws':
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
        ); */
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
        logObject = this.httpParser.getErrorContext(
          error,
          context,
          startTime,
          options,
        );
        break;
      /* case 'ws':
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
        ); */
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
