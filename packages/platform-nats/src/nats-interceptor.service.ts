import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class NatsParser extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext) {
    const client = this.getClient(context);
    return client.getSubject();
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData(context);
    return data.ip || '';
  }

  getMethod() {
    return 'NATS';
  }

  getProtocol() {
    return 'nats';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | ExecutionContext,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private getClient(context: ExecutionContext) {
    return context.switchToRpc().getContext();
  }

  private getData(context: ExecutionContext): any {
    return context.switchToRpc().getData();
  }
}
