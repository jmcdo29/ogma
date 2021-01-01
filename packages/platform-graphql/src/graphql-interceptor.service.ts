import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressParser } from '@ogma/platform-express';
import { Request, Response } from 'express';

@Injectable()
export class GraphQLParser extends ExpressParser {
  getMethod(context: ExecutionContext): string {
    return this.getContext(context).getInfo().operation.operation;
  }

  private getContext(context: ExecutionContext): GqlExecutionContext {
    return GqlExecutionContext.create(context);
  }
  getRequest(context: ExecutionContext): Request {
    return this.getContext(context).getContext().req;
  }

  getResponse(context: ExecutionContext): Response {
    return this.getContext(context).getContext().res;
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const ctx = this.getContext(context).getContext();
    if (ctx.req) {
      ctx.req.requestId = requestId;
    } else {
      ctx.requestId = requestId;
    }
  }
}
