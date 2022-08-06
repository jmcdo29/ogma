import { ExecutionContext, Injectable } from '@nestjs/common';
import { RedisContext } from '@nestjs/microservices';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
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

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient<RedisContext & { requestId: string }>(context);
    client.requestId = requestId;
  }
}
