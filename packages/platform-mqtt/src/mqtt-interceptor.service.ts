import { ExecutionContext, Injectable } from '@nestjs/common';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class MqttParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return JSON.stringify(super.getCallPoint(context));
  }

  getCallerIp(context: ExecutionContext): string {
    const client = this.getClient(context);
    const packet = client.getPacket();
    const payload = JSON.parse(packet.payload.toString());
    return payload.data?.ip || '';
  }

  getMethod(): string {
    return 'MQTT';
  }

  getProtocol(): string {
    return 'mqtt';
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }
}
