import { ExecutionContext, Injectable } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';
import { RpcInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class MqttParser extends RpcInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return this.getClient<MqttContext>(context).getTopic();
  }

  getCallerIp(context: ExecutionContext): string {
    const client = this.getClient<MqttContext>(context);
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
}
