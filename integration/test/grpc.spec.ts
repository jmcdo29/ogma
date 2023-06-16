import { INestApplication, INestMicroservice } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { OgmaInterceptor, OgmaService } from '@ogma/nestjs-module';
import { GrpcParser } from '@ogma/platform-grpc';
import { style } from '@ogma/styler';
import { Stub, stubMethod } from 'hanbi';
import { request, spec } from 'pactum';
import { join } from 'path';
import { suite } from 'uvu';
import { is } from 'uvu/assert';

import { GrpcClientModule } from '../src/grpc/client/grpc-client.module';
import { GrpcServerModule } from '../src/grpc/server/grpc-server.module';
import {
  createTestModule,
  hello,
  reportValues,
  serviceOptionsFactory,
  toBeALogObject,
} from './utils';

const GrpcParserSuite = suite<{
  logs: Parameters<OgmaInterceptor['log']>[];
  logSpy: Stub<OgmaInterceptor['log']>;
  rpcClient: INestApplication;
  rpcServer: INestMicroservice;
}>('GrpcParserSuite', {
  logs: [],
  logSpy: undefined,
  rpcClient: undefined,
  rpcServer: undefined,
});
GrpcParserSuite.before(async (context) => {
  const modRef = await createTestModule(GrpcServerModule, serviceOptionsFactory('gRPC Server'), [
    GrpcParser,
  ]);
  const rpcServer = modRef.createNestMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '..', 'src', 'grpc', 'hello/hello.proto'),
      package: 'hello',
    },
  });
  const interceptor = rpcServer.get(OgmaInterceptor);
  await rpcServer.listen();
  const clientRef = await Test.createTestingModule({
    imports: [GrpcClientModule],
  }).compile();
  const rpcClient = clientRef.createNestApplication();
  await rpcClient.listen(0);
  const baseUrl = await rpcClient.getUrl();
  request.setBaseUrl(baseUrl.replace('[::1]', 'localhost'));
  context.logSpy = stubMethod(interceptor, 'log');
  context.rpcServer = rpcServer;
  context.rpcClient = rpcClient;
});
GrpcParserSuite.after.each(({ logs, logSpy }) => {
  logSpy.firstCall && logs.push(logSpy.firstCall.args);
  logSpy.reset();
});
GrpcParserSuite.after(async ({ rpcServer, rpcClient, logs }) => {
  const ogma = rpcServer.get(OgmaService);
  await rpcClient.close();
  await rpcServer.close();
  reportValues(ogma, logs);
});

for (const { url, status, endpoint } of [
  {
    url: '/',
    status: style.green.apply(200),
    endpoint: 'SayHello',
  },
  {
    url: '/error',
    status: style.red.apply(500),
    endpoint: 'SayError',
  },
]) {
  GrpcParserSuite(`${url} call`, async ({ logSpy }) => {
    await spec().get(url);
    toBeALogObject(logSpy.firstCall.args[0], 'gRPC', endpoint, 'grpc', status);
    is(logSpy.firstCall.args[2].length, 16);
  });
}

GrpcParserSuite('should skip the log but still go through the server', async ({ logSpy }) => {
  await spec().get('/skip').expectBody(hello);
  is(logSpy.callCount, 0);
});

GrpcParserSuite.run();
