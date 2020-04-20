import { ExecutionContext, Injectable } from '@nestjs/common';
import { TcpContext } from '@nestjs/microservices';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { AbstractInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class TcpParser extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return JSON.stringify(
      this.reflector.get(PATTERN_METADATA, context.getHandler()),
    );
  }

  getCallerIp(context: ExecutionContext): string {
    const client = this.getClient(context);
    const socket = client.getSocketRef().socket;
    return socket.remoteAddress + ':' + socket.remotePort;
  }

  getMethod(): string {
    return 'TCP';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | ExecutionContext,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  getProtocol(context: ExecutionContext): string {
    const client = this.getClient(context);
    return client.getSocketRef().socket.remoteFamily;
  }

  private getClient(context: ExecutionContext): TcpContext {
    return context.switchToRpc().getContext<TcpContext>();
  }
}
