import { ExecutionContext, Injectable } from '@nestjs/common';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class TcpParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return JSON.stringify(super.getCallPoint(context));
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

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }
}
