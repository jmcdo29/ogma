import { ExecutionContext } from '@nestjs/common';
import { RedisContext } from '@nestjs/microservices';
import { Parser, RpcInterceptorService } from '@ogma/nestjs-module';

@Parser('rpc')
export class RedisParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.getClient<RedisContext>(context).getChannel();
  }

  getCallerIp(context: ExecutionContext): any {
    const data = this.getData<{ ip: string }>(context);
    return data?.ip || '';
  }

  getProtocol(): string {
    return 'redis';
  }

  getMethod(): string {
    return 'REDIS';
  }
}
