import { ExecutionContext, Injectable } from '@nestjs/common';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { AbstractInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class RedisParser extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return JSON.stringify(
      this.reflector.get(PATTERN_METADATA, context.getHandler()),
    );
  }

  getCallerIp(context: ExecutionContext): any {
    const data = this.getData(context);
    return data?.ip || '';
  }

  getProtocol(): string {
    return 'redis';
  }

  getMethod(): string {
    return 'REDIS';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | ExecutionContext,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private getData(context: ExecutionContext): any {
    return context.switchToRpc().getData();
  }
}
