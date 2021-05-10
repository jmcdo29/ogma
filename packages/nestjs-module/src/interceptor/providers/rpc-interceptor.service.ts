import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class RpcInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): any {
    return this.reflector.get('microservices:pattern', context.getHandler());
  }

  /**
   * A helper method to get the appropriate data object for the adapter
   * @param context execution context from Nest
   * @returns The data object for the RPC adapter
   */
  getData(context: ExecutionContext): any {
    return context.switchToRpc().getData();
  }

  /**
   * A helper method to get the RPC client from the execution context
   * @param context execution context from Nest
   * @returns The client object for the RPC adapter
   */
  getClient(context: ExecutionContext) {
    return context.switchToRpc().getContext();
  }
}
