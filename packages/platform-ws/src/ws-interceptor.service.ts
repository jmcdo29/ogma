import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { MESSAGE_METADATA } from '@nestjs/websockets/constants';
import { AbstractInterceptorService } from '@ogma/nestjs-module';
import WebSocket = require('ws');

@Injectable()
export class WsParser extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.reflector.get<string>(MESSAGE_METADATA, context.getHandler());
  }

  getCallerIp(context: ExecutionContext): string {
    return (this.getClient(context) as any)._socket.remoteAddress;
  }

  getProtocol(): string {
    return 'WS';
  }

  getMethod(): string {
    return 'websocket';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: HttpException | Error,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }

  private getClient(context: ExecutionContext): WebSocket {
    return context.switchToWs().getClient<WebSocket>();
  }
}
