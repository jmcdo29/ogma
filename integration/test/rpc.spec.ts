import { INestApplication, INestMicroservice } from '@nestjs/common';
import {
  MicroserviceOptions,
  MqttOptions,
  NatsOptions,
  RedisOptions,
  RmqOptions,
  TcpOptions,
  Transport,
} from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { OgmaInterceptor, OgmaService } from '@ogma/nestjs-module';
import { MqttParser } from '@ogma/platform-mqtt';
import { NatsParser } from '@ogma/platform-nats';
import { RabbitMqParser } from '@ogma/platform-rabbitmq';
import { RedisParser } from '@ogma/platform-redis';
import { TcpParser } from '@ogma/platform-tcp';
import { style } from '@ogma/styler';
import { Stub, stubMethod } from 'hanbi';
import { request, spec } from 'pactum';
import { suite } from 'uvu';
import { is } from 'uvu/assert';

import { RpcClientModule } from '../src/rpc/client/rpc-client.module';
import { RpcServerModule } from '../src/rpc/server/rpc-server.module';
import {
  createTestModule,
  hello,
  reportValues,
  serviceOptionsFactory,
  toBeALogObject,
} from './utils';

const tcpOptions: TcpOptions['options'] = {};
const mqttOptions: MqttOptions['options'] = { url: 'mqtt://localhost:1883' };
const natsOptions: NatsOptions['options'] = { url: 'nats://localhost:4222' };
const rabbitOptions: RmqOptions['options'] = {
  urls: ['amqp://localhost:5672'],
  queue: 'cats_queue',
  queueOptions: {
    durable: false,
  },
  socketOptions: {
    durable: true,
  },
};
const redisOptions: RedisOptions['options'] = { url: 'redis://localhost:6379' };
for (const { server, transport, options, protocol, parser } of [
  {
    server: 'TCP',
    transport: Transport.TCP,
    options: tcpOptions,
    protocol: 'IPv4',
    parser: TcpParser,
  },
  {
    server: 'MQTT',
    transport: Transport.MQTT,
    options: mqttOptions,
    protocol: 'mqtt',
    parser: MqttParser,
  },
  {
    server: 'NATS',
    transport: Transport.NATS,
    options: natsOptions,
    protocol: 'nats',
    parser: NatsParser,
  },
  {
    server: 'RabbitMQ',
    transport: Transport.RMQ,
    options: rabbitOptions,
    protocol: 'amqp',
    parser: RabbitMqParser,
  },
  {
    server: 'REDIS',
    transport: Transport.REDIS,
    optins: redisOptions,
    protocol: 'redis',
    parser: RedisParser,
  },
] as const) {
  const RpcSuite = suite<{
    logSpy: Stub<OgmaInterceptor['log']>;
    logs: Parameters<OgmaInterceptor['log']>[];
    rpcServer: INestMicroservice;
    rpcClient: INestApplication;
  }>(`${server} interceptor suite`, {
    logs: [],
    logSpy: undefined,
    rpcClient: undefined,
    rpcServer: undefined,
  });
  RpcSuite.before(async (context) => {
    const modRef = await createTestModule(RpcServerModule, {
      service: serviceOptionsFactory(server),
      interceptor: {
        rpc: parser,
      },
    });
    const rpcServer = modRef.createNestMicroservice<MicroserviceOptions>({
      transport,
      options,
    } as any);
    const interceptor = rpcServer.get(OgmaInterceptor);
    await rpcServer.listen();
    const clientRef = await Test.createTestingModule({
      imports: [
        RpcClientModule.register({
          transport,
          options,
        } as any),
      ],
    }).compile();
    const rpcClient = clientRef.createNestApplication();
    await rpcClient.listen(0);
    context.logSpy = stubMethod(interceptor, 'log');
    context.rpcClient = rpcClient;
    context.rpcServer = rpcServer;
    const baseUrl = await rpcClient.getUrl();
    request.setBaseUrl(baseUrl.replace('[::1]', 'localhost'));
  });
  RpcSuite.after.each(({ logSpy, logs }) => {
    logSpy.firstCall && logs.push(logSpy.firstCall.args);
    logSpy.reset();
  });
  RpcSuite.after(async ({ logs, rpcClient, rpcServer }) => {
    const ogma = rpcServer.get(OgmaService);
    await rpcClient.close();
    await rpcServer.close();
    reportValues(ogma, logs);
  });
  for (const { url, status, endpoint } of [
    {
      url: '/',
      status: style.green.apply(200),
      endpoint: { cmd: 'message' },
    },
    {
      url: '/error',
      status: style.red.apply(500),
      endpoint: { cmd: 'error' },
    },
  ]) {
    RpcSuite(`${url} call`, async ({ logSpy }) => {
      await spec().get(url);
      is(logSpy.callCount, 1);
      toBeALogObject(logSpy.firstCall.args[0], server, JSON.stringify(endpoint), protocol, status);
      is(logSpy.firstCall.args[2].length, 16);
    });
  }
  RpcSuite('skip log but make the call', async ({ logSpy }) => {
    await spec().get('/skip').expectBody(hello);
    is(logSpy.callCount, 0);
  });
  RpcSuite.run();
}
