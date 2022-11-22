import { ExecutionContext } from '@nestjs/common';
import { TcpContext } from '@nestjs/microservices';
import { Parser, RpcInterceptorService } from '@ogma/nestjs-module';

@Parser('rpc')
export class TcpParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.getClient(context).getPattern();
  }

  getCallerIp(context: ExecutionContext): string {
    const client = this.getClient(context);
    const socket = client.getSocketRef().socket;
    return socket.remoteAddress + ':' + socket.remotePort;
  }

  getMethod(): string {
    return 'TCP';
  }

  getProtocol(context: ExecutionContext): string {
    const client = this.getClient(context);
    return client.getSocketRef().socket.remoteFamily;
  }

  getClient<T = TcpContext>(context: ExecutionContext): T {
    return super.getClient(context);
  }
}
