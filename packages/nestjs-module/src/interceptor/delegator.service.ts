import { ExecutionContext, Injectable } from '@nestjs/common';
import { interceptorErrorMessage } from '../helpers';
import { OgmaInterceptorServiceOptions } from '../interfaces';
import { HttpInterceptorService } from './http-interceptor.service';
import { LogObject } from './interfaces/log.interface';
import { RpcInterceptorService } from './rpc-interceptor.service';
import { WebsocketInterceptorService } from './websocket-interceptor.service';
import { GqlInterceptorService } from './gql-interceptor.service';

@Injectable()
export class DelegatorService {
  private httpErrorLogged = false;
  private wsErrorLogged = false;
  private rpcErrorLogged = false;
  private gqlErrorLogged = false;

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
          if (!options.http && !this.httpErrorLogged) {
            return interceptorErrorMessage(
              '@nestjs/platorm-express or @nestjs/platform-fastify',
              'http',
            );
          }
          logObject = this.httpParser.getSuccessContext(
            data,
            context,
            startTime,
            options,
          );
        } else {
          if (!options.gql && !this.gqlErrorLogged) {
            return interceptorErrorMessage('@nestjs/graphql', 'gql');
          }
          logObject = this.gqlParser.getSuccessContext(
            data,
            context,
            startTime,
            options,
          );
        }
        break;
      case 'ws':
        if (!options.ws && !this.wsErrorLogged) {
          return interceptorErrorMessage('@nestjs/websockets', 'ws');
        }
        logObject = this.wsParser.getSuccessContext(
          data,
          context,
          startTime,
          options,
        );
        break;
      case 'rpc':
        if (!options.rpc && !this.rpcErrorLogged) {
          return interceptorErrorMessage('@nestjs/microservices', 'rpc');
        }
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
          if (!options.http && !this.httpErrorLogged) {
            return interceptorErrorMessage(
              '@nestjs/platorm-express or @nestjs/platform-fastify',
              'http',
            );
          }
          if (!options.gql && !this.gqlErrorLogged) {
            return interceptorErrorMessage('@nestjs/graphql', 'gql');
          }
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
        if (!options.ws && !this.wsErrorLogged) {
          return interceptorErrorMessage('@nestjs/websockets', 'ws');
        }
        logObject = this.wsParser.getErrorContext(
          error,
          context,
          startTime,
          options,
        );
        break;
      case 'rpc':
        if (!options.rpc && !this.rpcErrorLogged) {
          return interceptorErrorMessage('@nestjs/microservices', 'rpc');
        }
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
