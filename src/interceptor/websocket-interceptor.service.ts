import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { OgmaWsClient, WsLike } from '../interfaces/';
import { MESSAGE_METADATA } from '../ogma.constants';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export class WebsocketInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.reflector.get<string>(MESSAGE_METADATA, context.getHandler());
  }

  getCallerIp(context: ExecutionContext): string[] | string {
    const client = this.getClient(context);
    let address: string;
    if (this.isWsClient(client)) {
      address = client._socket.remoteAddress;
    } else {
      address = client.handshake.address;
    }
    return address;
  }

  // printing the ws library in case there is confusion
  getMethod(context: ExecutionContext): string {
    const client = this.getClient(context);
    let method: string;
    if (this.isWsClient(client)) {
      method = 'ws';
    } else {
      method = 'socket.io';
    }
    return method;
  }

  getProtocol(context: ExecutionContext): string {
    return 'WS';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | HttpException,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private getClient(context: ExecutionContext): OgmaWsClient {
    return context.switchToWs().getClient();
  }

  private isWsClient(client: OgmaWsClient): client is WsLike {
    return Object.keys(client).indexOf('_socket') !== -1;
  }
}
