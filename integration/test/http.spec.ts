import { HttpServer, INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import {
  AbstractInterceptorService,
  OgmaInterceptor,
  Type,
} from '@ogma/nestjs-module';
import { color } from '@ogma/logger';
import { ExpressParser } from '@ogma/platform-express';
import { FastifyParser } from '@ogma/platform-fastify';
import { createWriteStream } from 'fs';
import { createTestModule, getInterceptor, httpPromise } from './utils';
import { AppModule } from '../src/http/app.module';

const hello = JSON.stringify({ hello: 'world' });

describe.each`
  adapter                 | server       | parser
  ${new ExpressAdapter()} | ${'Express'} | ${ExpressParser}
  ${new FastifyAdapter()} | ${'Fastify'} | ${FastifyParser}
`(
  '$server Server',
  ({
    adapter,
    server,
    parser,
  }: {
    adapter: HttpServer;
    server: string;
    parser: Type<AbstractInterceptorService>;
  }) => {
    let interceptor: OgmaInterceptor;
    let app: INestApplication;

    beforeAll(async () => {
      const modRef = await createTestModule(AppModule, {
        service: {
          application: server,
          stream: process.env.CI
            ? createWriteStream('/dev/null')
            : process.stdout,
        },
        interceptor: { http: parser },
      });
      app = modRef.createNestApplication(adapter);
      interceptor = modRef.get(getInterceptor(app));
      await app.listen(0);
    });

    afterAll(async () => {
      await app.close();
    });

    describe('endpoints', () => {
      let logSpy: jest.SpyInstance;
      let baseUrl: string;

      beforeAll(async () => {
        baseUrl = await app.getUrl();
      });

      beforeEach(() => {
        logSpy = jest.spyOn(interceptor, 'log');
      });

      afterEach(() => {
        logSpy.mockClear();
      });

      function expectLogObject(
        method: string,
        endpoint: string,
        status: string,
      ) {
        const logObject = logSpy.mock.calls[0][0];
        expect(logObject).toBeALogObject(method, endpoint, 'HTTP/1.1', status);
        expect(logSpy).toHaveBeenCalledTimes(1);
      }

      describe('/', () => {
        it.each`
          method      | status
          ${'GET'}    | ${200}
          ${'POST'}   | ${201}
          ${'PATCH'}  | ${200}
          ${'PUT'}    | ${200}
          ${'DELETE'} | ${200}
        `(`should work for $method`, async ({ method, status }) => {
          const data = await httpPromise(baseUrl, {
            method: method,
          });
          expect(data).toEqual(hello);
          expectLogObject(method, '/', color.green(status));
        });
      });
      describe('/status', () => {
        it('should log a 202 instead of 200', async () => {
          const data = await httpPromise(baseUrl + '/status');
          expect(data).toEqual(hello);
          expectLogObject('GET', '/status', color.green(202));
        });
      });
      describe('/error', () => {
        it('should log a 400', async () => {
          await httpPromise(baseUrl + '/error');
          expectLogObject('GET', '/error', color.yellow(400));
        });
      });
      describe('skip', () => {
        it('should call but not log the request', async () => {
          const data = await httpPromise(baseUrl + '/skip');
          expect(data).toEqual(hello);
          expect(logSpy).toHaveBeenCalledTimes(0);
        });
      });
    });
  },
);
