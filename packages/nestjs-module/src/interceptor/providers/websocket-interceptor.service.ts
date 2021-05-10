import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class WebsocketInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.reflector.get<string>('message', context.getHandler());
  }

  /**
   * A helper method to get the websocket client from the Nest Execution Context
   * @param context execution context from Nest
   * @returns the client object for the websocket adapter
   */
  getClient(context: ExecutionContext) {
    return context.switchToWs().getClient();
  }
}
