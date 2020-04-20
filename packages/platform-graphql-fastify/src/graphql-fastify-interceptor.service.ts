import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AbstractInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class GraphQLFastifyParser extends AbstractInterceptorService {
  getCallerIp(context: ExecutionContext) {
    const req = this.getRequest(context);
    return req.ips && req.ips.length ? req.ips.join(' ') : req.ip;
  }

  getCallPoint(context: ExecutionContext) {
    const req = this.getRequest(context);
    return req.url;
  }

  getMethod(context: ExecutionContext) {
    return this.getContext(context).getInfo().operation.operation;
  }

  getProtocol(context: ExecutionContext) {
    const req = this.getRequest(context);
    return `HTTP/${req.httpVersionMajor}.${req.httpVersionMinor}`;
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | HttpException,
  ) {
    const status = error ? this.determineStatusFromError(error) : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private determineStatusFromError(error: Error | HttpException) {
    try {
      return (error as HttpException).getStatus();
    } catch (err) {
      return 500;
    }
  }

  private getContext(context: ExecutionContext): GqlExecutionContext {
    return GqlExecutionContext.create(context);
  }

  private getRequest(context: ExecutionContext) {
    return this.getContext(context).getContext().req;
  }
}
