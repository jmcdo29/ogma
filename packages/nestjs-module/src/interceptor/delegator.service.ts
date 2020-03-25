import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { interceptorErrorMessage, optionalRequire } from '../helpers';
import {
  OgmaInterceptorError,
  OgmaInterceptorServiceOptions,
} from '../interfaces';
import { HttpInterceptorService } from './http-interceptor.service';
import { LogObject } from './interfaces/log.interface';
import { RpcInterceptorService } from './rpc-interceptor.service';
import { WebsocketInterceptorService } from './websocket-interceptor.service';

const HttpModule =
  optionalRequire('@nestjs/platform-express') ||
  optionalRequire('@nestjs/platform-fastify');
const SocketModule = optionalRequire('@nestjs/websockets');
const RpcModule = optionalRequire('@nestjs/microservices');

@Injectable()
export class DelegatorService {
  private httpParser: HttpInterceptorService;
  private wsParser: WebsocketInterceptorService;
  private rpcParser: RpcInterceptorService;

  constructor(reflector: Reflector) {
    if (HttpModule) {
      this.httpParser = new HttpInterceptorService(reflector);
    }
    if (SocketModule) {
      this.wsParser = new WebsocketInterceptorService(reflector);
    }
    if (RpcModule) {
      this.rpcParser = new RpcInterceptorService(reflector);
    }
  }

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
        }
        break;
      case 'ws':
        if (!this.wsParser) {
          throw new OgmaInterceptorError(
            interceptorErrorMessage('@nestjs/websockets', 'websocket'),
          );
        }
        logObject = this.wsParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
        break;
      case 'rpc':
        if (!this.rpcParser) {
          throw new OgmaInterceptorError(
            interceptorErrorMessage('@nestjs/microservices', 'microservice'),
          );
        }
        logObject = this.rpcParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
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
