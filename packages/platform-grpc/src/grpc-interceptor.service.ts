import { ExecutionContext, Injectable } from '@nestjs/common';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class GrpcParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext) {
    return super.getCallPoint(context).rpc;
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

  setRequestId(context: ExecutionContext, requestId): void {
    const grpcContext = this.getClient(context);
    grpcContext.requestId = requestId;
  }
}
