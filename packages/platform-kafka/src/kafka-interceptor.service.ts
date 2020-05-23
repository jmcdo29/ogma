import { ExecutionContext, Injectable } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { AbstractInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class KafkaParser extends AbstractInterceptorService {
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

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | ExecutionContext,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private getClient(context: ExecutionContext): KafkaContext {
    return context.switchToRpc().getContext<KafkaContext>();
  }

  private getData(context: ExecutionContext): any {
    return context.switchToRpc().getData();
  }
}
