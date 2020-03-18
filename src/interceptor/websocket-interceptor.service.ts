import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export class WebsocketInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    console.log(JSON.stringify(context.switchToWs(), null, 2));
    return 'something';
  }

  getCallerIp(context: ExecutionContext): string[] | string {
    return 'something';
  }

  getMethod(context: ExecutionContext): string {
    return 'something';
  }

  getProtocol(context: ExecutionContext): string {
    return 'something';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: HttpException | Error,
  ): string {
    return 'something';
  }
}
