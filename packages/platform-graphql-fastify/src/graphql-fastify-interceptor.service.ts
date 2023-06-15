import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Parser } from '@ogma/nestjs-module';
import { FastifyParser } from '@ogma/platform-fastify';
import { FastifyReply, FastifyRequest } from 'fastify';

@Parser('graphql')
export class GraphQLFastifyParser extends FastifyParser {
  protected reqName = 'request';
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
}
