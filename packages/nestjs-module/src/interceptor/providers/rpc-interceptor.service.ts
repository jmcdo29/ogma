import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class RpcInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): any {
    return this.reflector.get('microservices:pattern', context.getHandler());
  }

  getData(context: ExecutionContext): any {
    return context.switchToRpc().getData();
  }

  getClient(context: ExecutionContext) {
    return context.switchToRpc().getContext();
  }
}
