import { INestApplication, INestMicroservice } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { color } from '@ogma/logger';
import {
  AbstractInterceptorService,
  OgmaInterceptor,
  Type,
} from '@ogma/nestjs-module';
import { MqttParser } from '@ogma/platform-mqtt';
import { NatsParser } from '@ogma/platform-nats';
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

describe.each`
  server    | transport         | options                             | protocol  | parser
  ${'TCP'}  | ${Transport.TCP}  | ${{}}                               | ${'IPv4'} | ${TcpParser}
  ${'MQTT'} | ${Transport.MQTT} | ${{ url: 'mqtt://localhost:1883' }} | ${'mqtt'} | ${MqttParser}
  ${'NATS'} | ${Transport.NATS} | ${{ url: 'nats://localhost:4222' }} | ${'nats'} | ${NatsParser}
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
          expect(logObject).toBeALogObject(
            server,
            JSON.stringify(endpoint),
            protocol,
            status,
          );
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
