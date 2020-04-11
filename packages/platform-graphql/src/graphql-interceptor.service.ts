import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressParser } from '@ogma/platform-express';
import { Request, Response } from 'express';

@Injectable()
export class GraphQLParser extends ExpressParser {
  getMethod(context: ExecutionContext): string {
    const ctx = this.getContext(context);
    return ctx.getInfo().operation.operation;
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

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | HttpException,
  ) {
    const status = !error
      ? 200
      : this.isHttpException(error)
      ? error.getStatus()
      : 500;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private isHttpException(
    error: Error | HttpException,
  ): error is HttpException {
    return (
      error instanceof HttpException || Object.keys(error).includes('status')
    );
  }
}
