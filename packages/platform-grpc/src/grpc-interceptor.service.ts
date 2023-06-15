import { ExecutionContext, Injectable } from '@nestjs/common';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class GrpcParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext) {
    return super.getCallPoint(context).rpc;
  }

  getCallerIp(context: ExecutionContext) {
    const data = this.getData<{ ip?: string }>(context);
    return data?.ip || '';
  }

  getProtocol() {
    return 'grpc';
  }

  getMethod() {
    return 'gRPC';
  }
}
