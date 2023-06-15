import { ExecutionContext } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Parser, RpcInterceptorService } from '@ogma/nestjs-module';

@Parser('rpc')
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
}
