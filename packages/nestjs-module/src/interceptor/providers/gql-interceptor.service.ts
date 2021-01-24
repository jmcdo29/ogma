import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class GqlInterceptorService extends AbstractInterceptorService {
  protected reqName: string;

  protected abstract getContext(context: ExecutionContext): any;
  setRequestId(context: ExecutionContext, requestId: string) {
    const ctx = this.getContext(context).context;
    if (ctx[this.reqName]) {
      ctx[this.reqName].requestId = requestId;
    } else {
      ctx.requestId = requestId;
    }
  }
}
