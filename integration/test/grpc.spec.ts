import { INestApplication, INestMicroservice } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { GrpcParser } from '@ogma/platform-grpc';
import { OgmaInterceptor } from '@ogma/nestjs-module';
import { join } from 'path';
import { GrpcServerModule } from '../src/grpc/server/grpc-server.module';
import { GrpcClientModule } from '../src/grpc/client/grpc-client.module';
import { createTestModule, hello, httpPromise, serviceOptionsFactory } from './utils';

describe('GrpcParser', () => {
  let rpcServer: INestMicroservice;
  let rpcClient: INestApplication;
  let interceptor: OgmaInterceptor;
  beforeAll(async () => {
    const modRef = await createTestModule(GrpcServerModule, {
      service: serviceOptionsFactory('gRPC Server'),
      interceptor: {
        rpc: GrpcParser,
      },
    });
    rpcServer = modRef.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '..', 'src', 'grpc', 'hello/hello.proto'),
        package: 'hello',
      },
    });
    interceptor = rpcServer.get(OgmaInterceptor);
    await rpcServer.listen();
    const clientRef = await Test.createTestingModule({
      imports: [GrpcClientModule],
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
      ${'/'}      | ${style.green.apply(200)} | ${'SayHello'}
      ${'/error'} | ${style.red.apply(500)}   | ${'SayError'}
    `(
      '$url call',
      async ({ url, status, endpoint }: { url: string; status: string; endpoint: string }) => {
        await httpPromise(baseUrl + url);
        expect(logSpy).toBeCalledTimes(1);
        const logObject = logSpy.mock.calls[0][0];
        const requestId = logSpy.mock.calls[0][2];

        expect(logObject).toBeALogObject('gRPC', endpoint, 'grpc', status);
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
});
