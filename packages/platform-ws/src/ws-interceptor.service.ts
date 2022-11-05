import { ExecutionContext, Injectable } from '@nestjs/common';
import { WebsocketInterceptorService } from '@ogma/nestjs-module';

@Injectable()
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
