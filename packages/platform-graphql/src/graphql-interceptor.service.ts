import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressParser } from '@ogma/platform-express';
import { Request, Response } from 'express';

@Injectable()
export class GraphQLParser extends ExpressParser {
  protected reqName = 'req';
  getMethod(context: ExecutionContext): string {
    return this.getContext(context).getInfo().operation.operation;
  }

  private getContext(context: ExecutionContext): GqlExecutionContext {
    return GqlExecutionContext.create(context);
  }
  getRequest(context: ExecutionContext): Request {
    // For subscriptions, we need to get the connection from the context, not the req.
    return this.getContext(context).getContext().req || this.getContext(context).getContext().connection;
  }

  getResponse(context: ExecutionContext): Response {
    return this.getContext(context).getContext().res;
  }
}
