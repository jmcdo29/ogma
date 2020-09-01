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
import { color } from '@ogma/logger';
import {
  AbstractInterceptorService,
  OgmaInterceptor,
  Type,
} from '@ogma/nestjs-module';
import { MqttParser } from '@ogma/platform-mqtt';
import { NatsParser } from '@ogma/platform-nats';
import { RabbitMqParser } from '@ogma/platform-rabbitmq';
import { RedisParser } from '@ogma/platform-redis';
import { TcpParser } from '@ogma/platform-tcp';
import { RpcClientModule } from '../src/rpc/client/rpc-client.module';
import { RpcServerModule } from '../src/rpc/server/rpc-server.module';
import {
  createTestModule,
  getInterceptor,
  hello,
  httpPromise,
  serviceOptionsFactory,
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

describe.each`
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
      interceptor = getInterceptor(rpcServer);
      await rpcServer.listenAsync();
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
        url         | status              | endpoint
        ${'/'}      | ${color.green(200)} | ${{ cmd: 'message' }}
        ${'/error'} | ${color.red(500)}   | ${{ cmd: 'error' }}
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

          expect(logObject).toBeALogObject(
            server,
            JSON.stringify(endpoint),
            protocol,
            status,
          );
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
);
