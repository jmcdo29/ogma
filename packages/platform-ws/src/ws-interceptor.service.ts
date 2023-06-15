import { ExecutionContext } from '@nestjs/common';
import { Parser, WebsocketInterceptorService } from '@ogma/nestjs-module';

@Parser('ws')
export class WsParser extends WebsocketInterceptorService {
  getCallerIp(context: ExecutionContext): string {
    return (this.getClient(context) as any)._socket.remoteAddress;
  }

  getProtocol(): string {
    return 'WS';
  }

  getMethod(): string {
    return 'websocket';
  }
}
