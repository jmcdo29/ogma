import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { MESSAGE_METADATA } from '@nestjs/websockets/constants';
import { AbstractInterceptorService } from '@ogma/nestjs-module';
import { Socket } from 'socket.io';

@Injectable()
export class SocketioParser extends AbstractInterceptorService {
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

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: HttpException | Error,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private getClient(context: ExecutionContext): Socket {
    return context.switchToWs().getClient<Socket>();
  }
}
