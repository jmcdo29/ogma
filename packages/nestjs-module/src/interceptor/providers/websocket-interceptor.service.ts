import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class WebsocketInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.reflector.get<string>('message', context.getHandler());
  }

  getClient(context: ExecutionContext) {
    return context.switchToWs().getClient();
  }
}
