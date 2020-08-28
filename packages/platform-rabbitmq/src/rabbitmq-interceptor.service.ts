import { ExecutionContext, Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { AbstractInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class RabbitMqParser extends AbstractInterceptorService {
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

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | ExecutionContext,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }

  private getClient(context: ExecutionContext): RmqContext {
    return context.switchToRpc().getContext<RmqContext>();
  }

  private getData(context: ExecutionContext) {
    return context.switchToRpc().getData();
  }
}
