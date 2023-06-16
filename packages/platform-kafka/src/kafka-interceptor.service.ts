import { ExecutionContext } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { Parser, RpcInterceptorService } from '@ogma/nestjs-module';

@Parser('rpc')
export class KafkaParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext) {
    return this.getClient<KafkaContext>(context).getTopic();
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData<{ value?: { ip?: string } }>(context);
    return data?.value?.ip || '';
  }

  getMethod() {
    return 'Kafka';
  }

  getProtocol() {
    return 'kafka';
  }
}
