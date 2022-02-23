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
import { style } from '@ogma/styler';
import { OgmaInterceptor, OgmaService } from '@ogma/nestjs-module';
import { MqttParser } from '@ogma/platform-mqtt';
import { NatsParser } from '@ogma/platform-nats';
import { RabbitMqParser } from '@ogma/platform-rabbitmq';
import { RedisParser } from '@ogma/platform-redis';
import { TcpParser } from '@ogma/platform-tcp';
import { Stub, stubMethod } from 'hanbi';
import { request, spec } from 'pactum';
import { suite } from 'uvu';
import { RpcClientModule } from '../src/rpc/client/rpc-client.module';
import { RpcServerModule } from '../src/rpc/server/rpc-server.module';
import {
  createTestModule,
  hello,
  reportValues,
  serviceOptionsFactory,
  toBeALogObject,
} from './utils';
import { is } from 'uvu/assert';

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
/* describe.each`
  server        | transport          | options          | protocol   | parser
  ${'TCP'}      | ${Transport.TCP}   | ${tcpOptions}    | ${'IPv4'}  | ${TcpParser}
  ${'MQTT'}     | ${Transport.MQTT}  | ${mqttOptions}   | ${'mqtt'}  | ${MqttParser}
  ${'NATS'}     | ${Transport.NATS}  | ${natsOptions}   | ${'nats'}  | ${NatsParser}
  ${'RabbitMQ'} | ${Transport.RMQ}   | ${rabbitOptions} | ${'amqp'}  | ${RabbitMqParser}
  ${'REDIS'}    | ${Transport.REDIS} | ${redisOptions}  | ${'redis'} | ${RedisParser}
`(
  '$server server',
  ({
    server,
    transport,
    options,
    protocol,
    parser,
  }: {
    server: string;
    transport: number;
    options: any;
    protocol: string;
    parser: Type<AbstractInterceptorService>;
  }) => {
    let rpcServer: INestMicroservice;
    let rpcClient: INestApplication;
    let interceptor: OgmaInterceptor;
    beforeAll(async () => {
      const modRef = await createTestModule(RpcServerModule, {
        service: serviceOptionsFactory(server),
        interceptor: {
          rpc: parser,
        },
      });
      rpcServer = modRef.createNestMicroservice<MicroserviceOptions>({
        transport,
        options,
      });
      interceptor = rpcServer.get(OgmaInterceptor);
      await rpcServer.listen();
      const clientRef = await Test.createTestingModule({
        imports: [
          RpcClientModule.register({
            transport,
            options,
          }),
        ],
      }).compile();
      rpcClient = clientRef.createNestApplication();
      await rpcClient.listen(0);
    });

    afterAll(async () => {
      await rpcClient.close();
      await rpcServer.close();
    });

    describe('server calls', () => {
      let logSpy: jest.SpyInstance;
      let baseUrl: string;

      beforeAll(async () => {
        baseUrl = await rpcClient.getUrl();
      });

      beforeEach(() => {
        logSpy = jest.spyOn(interceptor, 'log');
      });

      afterEach(() => {
        logSpy.mockClear();
      });

      it.each`
        url         | status                    | endpoint
        ${'/'}      | ${style.green.apply(200)} | ${{ cmd: 'message' }}
        ${'/error'} | ${style.red.apply(500)}   | ${{ cmd: 'error' }}
      `(
        '$url call',
        async ({
          url,
          status,
          endpoint,
        }: {
          url: string;
          status: string;
          endpoint: { cmd: string };
        }) => {
          await httpPromise(baseUrl + url);
          expect(logSpy).toBeCalledTimes(1);
          const logObject = logSpy.mock.calls[0][0];
          const requestId = logSpy.mock.calls[0][2];

          expect(logObject).toBeALogObject(server, JSON.stringify(endpoint), protocol, status);
          expect(typeof requestId).toBe('string');
          expect(requestId).toHaveLength(16);
        },
      );

      it('should call the skip but not log it', async () => {
        const data = await httpPromise(baseUrl + '/skip');
        expect(logSpy).toHaveBeenCalledTimes(0);
        expect(data).toEqual(hello);
      });
    });
  },
); */
