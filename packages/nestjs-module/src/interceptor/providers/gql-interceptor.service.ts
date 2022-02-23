import { ExecutionContext, Injectable } from '@nestjs/common';

import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export abstract class GqlInterceptorService extends AbstractInterceptorService {
  protected reqName: string;

  /**
   * A helper method to get the graphql context from the execution context
   *
   * Note: The only reason this method is not already written, is to keep `@nestjs/graphql` out of the `@ogma/nestjs-module` package
   *
   * this method _should_ look something like this
   * ```ts
   * getContext(context: ExecutionContext) {
   *   const gql = GqlExecutionContext.create(context);
   *   return gql.getContext();
   * }
   * ```
   * @param context execution context from Nest
   */
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
