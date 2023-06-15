import { ExecutionContext, Injectable } from '@nestjs/common';
import { NatsContext } from '@nestjs/microservices';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
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
