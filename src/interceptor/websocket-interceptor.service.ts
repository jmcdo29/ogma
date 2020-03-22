import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { MESSAGE_METADATA } from '@nestjs/websockets/constants';
import { OgmaClient } from '../interfaces/ogma-types.interface';
import { WsLike } from '../interfaces/ws-like.interface';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export class WebsocketInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.reflector.get<string>(MESSAGE_METADATA, context.getHandler());
  }

  getCallerIp(context: ExecutionContext): string[] | string {
    const client = this.getClient(context);
    if (this.isWsClient(client)) {
      return client._socket.remoteAddress;
    }
    return client.handshake.address;
  }

  getMethod(context: ExecutionContext): string {
    return 'websocket';
  }

  getProtocol(context: ExecutionContext): string {
    return 'WS';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: HttpException | Error,
  ): string {
    return error ? '500' : '200';
  }

  private getClient(context: ExecutionContext): OgmaClient {
    return context.switchToWs().getClient();
  }

  private isWsClient(client: OgmaClient): client is WsLike {
    return Object.keys(client).indexOf('_socket') !== -1;
  }
}
