import { Injectable, ExecutionContext, HttpException } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export class GqlInterceptorService extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return 'call point';
  }

  getCallerIp(context: ExecutionContext): string {
    return 'call ip';
  }

  getMethod(context: ExecutionContext): string {
    return 'method';
  }

  getProtocol(context: ExecutionContext): string {
    return 'protocol';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | HttpException,
  ): string {
    return 'status';
  }
}
