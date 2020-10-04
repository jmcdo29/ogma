import { ExecutionContext, Injectable } from '@nestjs/common';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class RabbitMqParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext) {
    return this.getClient(context).getPattern();
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData(context);
    return data.ip || '';
  }

  getMethod() {
    return 'RabbitMQ';
  }

  getProtocol() {
    return 'amqp';
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }
}
