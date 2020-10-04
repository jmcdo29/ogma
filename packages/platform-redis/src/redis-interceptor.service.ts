import { ExecutionContext, Injectable } from '@nestjs/common';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class RedisParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return JSON.stringify(super.getCallPoint(context));
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

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }
}
