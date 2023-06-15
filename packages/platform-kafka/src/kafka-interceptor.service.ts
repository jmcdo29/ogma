import { ExecutionContext, Injectable } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
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
