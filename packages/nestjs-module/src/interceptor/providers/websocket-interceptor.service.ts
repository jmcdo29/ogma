import { ArgumentsHost, Injectable } from '@nestjs/common';

import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class WebsocketInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ArgumentsHost): string {
    return context.switchToWs().getPattern();
  }

  /**
   * A helper method to get the websocket client from the Nest Execution Context
   * @param context execution context from Nest
   * @returns the client object for the websocket adapter
   */
  getClient(context: ArgumentsHost) {
    return context.switchToWs().getClient();
  }

  setRequestId(context: ArgumentsHost, requestId: any) {
    const client = this.getClient(context);
    client.requestId = requestId;
  }

  getRequestId(context: ArgumentsHost): any {
    return this.getClient(context).requestId;
  }
}
