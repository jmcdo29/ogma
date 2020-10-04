import { ExecutionContext, Injectable } from '@nestjs/common';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class NatsParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext) {
    const client = this.getClient(context);
    return client.getSubject();
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData(context);
    return data.ip || '';
  }

  getMethod() {
    return 'NATS';
  }

  getProtocol() {
    return 'nats';
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }
}
