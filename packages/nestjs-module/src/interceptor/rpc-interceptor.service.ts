import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { MICROSERVICE_METADATA } from '../ogma.constants';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export class RpcInterceptorService extends AbstractInterceptorService {
  // what pattern/request is being hit
  getCallPoint(context: ExecutionContext): string {
    let pattern: string | object = this.reflector.get<object | string>(
      MICROSERVICE_METADATA,
      context.getHandler(),
    );
    if (typeof pattern === 'object') {
      pattern = JSON.stringify(pattern);
    }
    return pattern;
  }

  // obvious
  getCallerIp(context: ExecutionContext): string[] | string {
    return 'caller ip';
  }

  // not sure on this yet. Need to see what is available
  getMethod(context: ExecutionContext): string {
    return 'method';
  }

  // should probably return something like amqp or kafka, or something similar
  getProtocol(context: ExecutionContext): string {
    return 'protocol';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | HttpException,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private getRpcContext(context: ExecutionContext) {
    return context.switchToRpc().getContext();
  }
}
