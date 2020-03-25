import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { MICROSERVICE_METADATA } from '../ogma.constants';
import { AbstractInterceptorService } from './abstract-interceptor.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RpcInterceptorService extends AbstractInterceptorService {

  private TcpContext: any;
  private KafkaContext: any;
  private MqttContext: any;
  private NatsContext: any;
  private RedisContext: any;
  private RmqContext: any;

  constructor(protected readonly reflector: Reflector) {
    super(reflector);
    this.init();
  }

  private init() {
    const { TcpContext, KafkaContext, MqttContext, NatsContext, RedisContext, RmqContext } = require('@nestjs/microservices');
    this.TcpContext = TcpContext;
    this.KafkaContext = KafkaContext;
    this.MqttContext = MqttContext;
    this.NatsContext = NatsContext;
    this.RedisContext = RedisContext;
    this.RmqContext = RmqContext;
  }

  // what pattern/request is being hit
  getCallPoint(context: ExecutionContext): string {
    let pattern: string | object = this.reflector.get<object | string>(MICROSERVICE_METADATA, context.getHandler());
    if (typeof pattern === 'object') {
      pattern = JSON.stringify(pattern);
    }
    return pattern;
  }

  // obvious
  getCallerIp(context: ExecutionContext): string[] | string {
    return 'caller ip';
  }

  // not sure on this yet. Need to see what is available
  getMethod(context: ExecutionContext): string {
    return 'method';
  }

  // should probably return something like amqp or kafka, or something similar
  getProtocol(context: ExecutionContext): string {
    const client = this.getRpcContext(context);
    let protocol: string;
    if (client instanceof this.TcpContext) {
      protocol = 'ws';
    } else if (client instanceof this.KafkaContext) {
      protocol = 'kafka';
    } else if (client instanceof this.MqttContext) {
      protocol = 'mqtt';
    } else if (client instanceof this.NatsContext) {
      protocol = 'nats';
    } else if (client instanceof this.RedisContext) {
      protocol = 'redis';
    } else if (client instanceof this.RmqContext) {
      protocol = 'rmq';
    } else {
      protocol = 'unknown';
    }
    return protocol;
  }

  getStatus(
    context: ExecutionContext,
    inColor: boolean,
    error?: Error | HttpException,
  ): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }


  private getRpcContext(context: ExecutionContext) {
    return context.switchToRpc().getContext();
  }
}
