import { ArgumentsHost, ContextType, Injectable } from '@nestjs/common';

import { OgmaInterceptorServiceOptions } from '../../interfaces';
import { DelegatorContextReturn, LogObject, MetaLogObject } from '../interfaces/log.interface';
import { GqlInterceptorService } from './gql-interceptor.service';
import { HttpInterceptorService } from './http-interceptor.service';
import { RpcInterceptorService } from './rpc-interceptor.service';
import { WebsocketInterceptorService } from './websocket-interceptor.service';

type Parser = 'httpParser' | 'gqlParser' | 'wsParser' | 'rpcParser';

@Injectable()
export class DelegatorService {
  constructor(
    private readonly httpParser: HttpInterceptorService,
    private readonly wsParser: WebsocketInterceptorService,
    private readonly rpcParser: RpcInterceptorService,
    private readonly gqlParser: GqlInterceptorService,
  ) {}

  setRequestId(context: ArgumentsHost, requestId: string): void {
    const parser: Parser = this.getParser(context.getType());
    this[parser].setRequestId(context, requestId);
  }

  getRequestId(context: ArgumentsHost): any {
    const parser = this.getParser(context.getType());
    return this[parser].getRequestId(context);
  }

  getContextSuccessString(
    data: any,
    context: ArgumentsHost,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): DelegatorContextReturn {
    const parser: Parser = this.getParser(context.getType());
    const { meta, ...logObject } = this.getContextString({
      method: 'getSuccessContext',
      data,
      context,
      startTime,
      options,
      parser,
    });
    return { meta, log: this.getStringOrObject(logObject, { json: options.json }) };
  }

  private getParser(type: ContextType | 'graphql'): Parser {
    let parser: Parser;
    switch (type) {
      case 'http':
        parser = 'httpParser';
        break;
      case 'graphql':
        parser = 'gqlParser';
        break;
      case 'ws':
        parser = 'wsParser';
        break;
      case 'rpc':
        parser = 'rpcParser';
        break;
    }
    return parser;
  }

  getContextErrorString(
    error: any,
    context: ArgumentsHost,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): DelegatorContextReturn {
    const parser = this.getParser(context.getType());
    const { meta, ...logObject } = this.getContextString({
      method: 'getErrorContext',
      data: error,
      context,
      startTime,
      options,
      parser,
    });
    return { meta, log: this.getStringOrObject(logObject, { json: options.json }) };
  }

  private getContextString({
    method,
    data,
    context,
    startTime,
    options,
    parser,
  }: {
    method: 'getErrorContext' | 'getSuccessContext';
    data: any;
    context: ArgumentsHost;
    startTime: number;
    options: OgmaInterceptorServiceOptions;
    parser: Parser;
  }): MetaLogObject {
    return this[parser][method](data, context, startTime, options);
  }

  private getStringOrObject(data: LogObject, options: { json: boolean }): string | LogObject {
    return options.json
      ? data
      : `${data.callerAddress} - ${data.method} ${data.callPoint} ${data.protocol} ${data.status} ${data.responseTime}ms - ${data.contentLength}`;
  }

  getStartTime(host: ArgumentsHost): number {
    const parser = this.getParser(host.getType());
    return this[parser].getStartTime(host);
  }
}
