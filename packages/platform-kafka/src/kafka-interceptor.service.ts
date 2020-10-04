import { ExecutionContext, Injectable } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class KafkaParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext) {
    return this.getClient(context).getTopic();
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData(context);
    return data?.value?.ip || '';
  }

  getMethod() {
    return 'Kafka';
  }

  getProtocol() {
    return 'kafka';
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }

  getClient(context: ExecutionContext): KafkaContext {
    return super.getClient(context);
  }
}
