import { ExecutionContext, Injectable } from '@nestjs/common';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { AbstractInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class GrpcParser extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext) {
    return this.reflector.get(PATTERN_METADATA, context.getHandler()).rpc;
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData(context);
    return data?.ip || '';
  }

  getProtocol() {
    return 'grpc';
  }

  getMethod() {
    return 'gRPC';
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | ExecutionContext,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  private getData(context: ExecutionContext) {
    return context.switchToRpc().getData();
  }
}
