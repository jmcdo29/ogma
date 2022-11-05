import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { OgmaFilterLogger, OgmaInterceptor, OgmaService } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';
import { FastifyParser } from '@ogma/platform-fastify';
import { style } from '@ogma/styler';
import { Stub, stubMethod } from 'hanbi';
import { request, spec } from 'pactum';
import { suite } from 'uvu';
import { is } from 'uvu/assert';

import { HttpServerModule } from '../src/http/http-server.module';
import {
  createTestModule,
  hello,
  reportValues,
  serviceOptionsFactory,
  toBeALogObject,
} from './utils';

const expectRequestId = (spy: Stub<OgmaInterceptor['log']> | Stub<OgmaFilterLogger['doLog']>) => {
  is(typeof spy.firstCall.args[2], 'string');
  is(spy.firstCall.args[2].length, 16);
};

const expectLogObject = (
  spy: Stub<OgmaInterceptor['log']> | Stub<OgmaFilterLogger['doLog']>,
  method: string,
  endpoint: string,
  status: string,
) => {
  toBeALogObject(spy.firstCall.args[0], method, endpoint, 'HTTP/1.1', status);
  is(spy.callCount, 1);
};

for (const { adapter, server, parser } of [
  {
    adapter: new ExpressAdapter(),
    server: 'Express',
    parser: ExpressParser,
  },
  {
    adapter: new FastifyAdapter(),
    server: 'Fastify',
    parser: FastifyParser,
  },
]) {
  const HttpSuite = suite<{
    app: INestApplication;
    logSpy: Stub<OgmaInterceptor['log']>;
    logs: Parameters<OgmaInterceptor['log'] | OgmaFilterLogger['doLog']>[];
    filterSpy: Stub<OgmaFilterLogger['doLog']>;
  }>(`${server} HTTP Log Suite`, {
    app: undefined,
    logSpy: undefined,
    logs: [],
    filterSpy: undefined,
  });
  HttpSuite.before(async (context) => {
    const modRef = await createTestModule(HttpServerModule, {
      service: serviceOptionsFactory(server),
      interceptor: { http: parser },
    });
    context.app = modRef.createNestApplication(adapter);
    const interceptor = context.app.get(OgmaInterceptor);
    const filterService = context.app.get(OgmaFilterLogger);
    await context.app.listen(0);
    request.setBaseUrl((await context.app.getUrl()).replace('[::1]', 'localhost'));
    context.logSpy = stubMethod(interceptor, 'log');
    context.filterSpy = stubMethod(filterService as any, 'doLog');
  });
  HttpSuite.after(async ({ app, logs }) => {
    const ogma = app.get(OgmaService);
    await app.close();
    reportValues(ogma, logs);
  });
  HttpSuite.after.each(({ logSpy, logs, filterSpy }) => {
    logSpy.firstCall && logs.push(logSpy.firstCall.args);
    logSpy.reset();
    filterSpy.firstCall && logs.push(filterSpy.firstCall.args);
    filterSpy.reset();
  });
  for (const { method, status } of [
    {
      method: 'GET',
      status: 200,
    },
    {
      method: 'POST',
      status: 201,
    },
    { method: 'PATCH', status: 200 },
    { method: 'PUT', status: 200 },
    { method: 'DELETE', status: 200 },
  ]) {
    HttpSuite(`should log ${status} from ${method} request`, async ({ logSpy }) => {
      await spec()[method.toLowerCase()]('/').expectStatus(status).expectBody(hello);
      is(logSpy.callCount, 1);
      expectLogObject(logSpy, method, '/', style.green.apply(status));
    });
  }
  HttpSuite('it should log a 202 instead of 200', async ({ logSpy }) => {
    await spec().get('/status').expectBody(hello).expectStatus(202);
    expectLogObject(logSpy, 'GET', '/status', style.green.apply(202));
    expectRequestId(logSpy);
  });
  HttpSuite('It should log a 400', async ({ logSpy }) => {
    await spec().get('/error').expectStatus(400);
    expectLogObject(logSpy, 'GET', '/error', style.yellow.apply(400));
    expectRequestId(logSpy);
  });
  HttpSuite('It should skip the log but return data', async ({ logSpy }) => {
    await spec().get('/skip').expectBody(hello).expectStatus(200);
    is(logSpy.callCount, 0);
  });
  HttpSuite('It should get caught by a guard but still be able to log', async ({ filterSpy }) => {
    await spec().get('/fail-guard').expectStatus(403);
    expectLogObject(filterSpy, 'GET', '/fail-guard', style.yellow.apply(403));
  });
  HttpSuite.run();
}
