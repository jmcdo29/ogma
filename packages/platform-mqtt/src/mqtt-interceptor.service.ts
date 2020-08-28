import { ExecutionContext, Injectable } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { AbstractInterceptorService } from '@ogma/nestjs-module';

@Injectable()
export class MqttParser extends AbstractInterceptorService {
  getCallPoint(context: ExecutionContext): string {
    return JSON.stringify(
      this.reflector.get(PATTERN_METADATA, context.getHandler()),
    );
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

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | ExecutionContext,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  getProtocol(): string {
    return 'mqtt';
  }

  setRequestId(context: ExecutionContext, requestId: string): void {
    const client = this.getClient(context) as any;
    client.requestId = requestId;
  }

  private getClient(context: ExecutionContext): MqttContext {
    return context.switchToRpc().getContext<MqttContext>();
  }
}
