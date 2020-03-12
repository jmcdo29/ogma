import { ExecutionContext, Injectable } from '@nestjs/common';
import { OgmaInterceptorServiceOptions } from '../interfaces/ogma-options.interface';
import { HttpInterceptorService } from './http-interceptor.service';
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
  ): string | object {
    switch (context.getType()) {
      case 'http':
        return this.httpParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
      case 'ws':
        return this.wsParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
      case 'rpc':
        return this.rpcParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
    }
  }

  getContextErrorString(
    error: any,
    context: ExecutionContext,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): string | object {
    switch (context.getType()) {
      case 'http':
        return this.httpParser.getErrorContext(
          error,
          context,
          startTime,
          options,
        );
      case 'ws':
        return this.wsParser.getErrorContext(
          error,
          context,
          startTime,
          options,
        );
      case 'rpc':
        return this.rpcParser.getErrorContext(
          error,
          context,
          startTime,
          options,
        );
    }
  }
}
