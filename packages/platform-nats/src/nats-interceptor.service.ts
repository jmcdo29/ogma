import { ExecutionContext } from '@nestjs/common';
import { NatsContext } from '@nestjs/microservices';
import { Parser, RpcInterceptorService } from '@ogma/nestjs-module';

@Parser('rpc')
export class NatsParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext) {
    const client = this.getClient<NatsContext>(context);
    return client.getSubject();
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData<{ ip: string }>(context);
    return data.ip || '';
  }

  getMethod() {
    return 'NATS';
  }

  getProtocol() {
    return 'nats';
  }
}
