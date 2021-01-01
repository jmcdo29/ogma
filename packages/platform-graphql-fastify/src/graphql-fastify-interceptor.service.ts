import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FastifyParser } from '@ogma/platform-fastify';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class GraphQLFastifyParser extends FastifyParser {
  getMethod(context: ExecutionContext): string {
    return this.getContext(context).getInfo().operation.operation;
  }

  private getContext(context: ExecutionContext): GqlExecutionContext {
    return GqlExecutionContext.create(context);
  }

  getRequest(context: ExecutionContext): FastifyRequest {
    return this.getContext(context).getContext().request;
  }

  getResponse(context: ExecutionContext): FastifyReply {
    return this.getContext(context).getContext().reply;
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const ctx = this.getContext(context).getContext();
    if (ctx.request) {
      ctx.request.requestId = requestId;
    } else {
      ctx.requestId = requestId;
    }
  }
}
