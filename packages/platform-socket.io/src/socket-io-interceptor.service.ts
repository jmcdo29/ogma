import { ExecutionContext } from '@nestjs/common';
import { MESSAGE_METADATA } from '@nestjs/websockets/constants';
import { Parser, WebsocketInterceptorService } from '@ogma/nestjs-module';

@Parser('ws')
export class SocketIOParser extends WebsocketInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.reflector.get(MESSAGE_METADATA, context.getHandler());
  }

  getCallerIp(context: ExecutionContext): string[] | string {
    const client = this.getClient(context);
    return client.handshake.address;
  }

  getProtocol(): string {
    return 'WS';
  }

  getMethod(): string {
    return 'socket.io';
  }
}
