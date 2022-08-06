import { ExecutionContext, Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class RabbitMqParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext) {
    return this.getClient<RmqContext>(context).getPattern();
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData<{ ip: string }>(context);
    return data.ip || '';
  }

  getMethod() {
    return 'RabbitMQ';
  }

  getProtocol() {
    return 'amqp';
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient<RmqContext & { requestId: string }>(context);
    client.requestId = requestId;
  }
}
