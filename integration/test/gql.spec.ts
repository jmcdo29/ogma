import { HttpServer, INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import {
  AbstractInterceptorService,
  OgmaInterceptor,
  Type,
} from '@ogma/nestjs-module';
import { GraphQLParser } from '@ogma/platform-graphql';
import { GqlModule } from '../src/gql/gql.module';
import {
  createTestModule,
  getInterceptor,
  gqlPromise,
  serviceOptionsFactory,
} from './utils';
import { color } from '@ogma/logger';

describe.each`
  adapter                 | server               | parser
  ${new ExpressAdapter()} | ${'GraphQL Express'} | ${GraphQLParser}
`(
  '$server server',
  ({
    adapter,
    server,
    parser,
  }: {
    adapter: HttpServer;
    server: string;
    parser: Type<AbstractInterceptorService>;
  }) => {
    let app: INestApplication;
    let interceptor: OgmaInterceptor;

    beforeAll(async () => {
      const modRef = await createTestModule(GqlModule, {
        service: serviceOptionsFactory(server),
        interceptor: {
          gql: parser,
        },
      });
      app = modRef.createNestApplication(adapter);
      interceptor = getInterceptor(app);
      await app.listen(0);
    });

    afterAll(async () => {
      await app.close();
    });

    it('should be defined', () => {
      expect(app).toBeDefined();
      expect(interceptor).toBeDefined();
    });

    describe('gql calls', () => {
      let logSpy: jest.SpyInstance;
      let baseUrl: string;

      beforeAll(async () => {
        baseUrl = await app.getUrl();
        baseUrl += '/graphql';
      });

      beforeEach(() => {
        logSpy = jest.spyOn(interceptor, 'log');
      });

      afterEach(() => {
        logSpy.mockClear();
      });

      describe.each`
        type          | name             | status
        ${'query'}    | ${'getQuery'}    | ${200}
        ${'query'}    | ${'getError'}    | ${400}
        ${'mutation'} | ${'getMutation'} | ${200}
      `(
        '$type $name',
        ({
          type,
          name,
          status,
        }: {
          type: string;
          name: string;
          status: number;
        }) => {
          it('should log the call', async () => {
            await gqlPromise(baseUrl, {
              query: `${type} ${name}{ ${name}{ hello }}`,
            });
            const logObject = logSpy.mock.calls[0][0];
            expect(logObject).toBeALogObject(
              type,
              '/graphql',
              'HTTP/1.1',
              status === 200 ? color.green(status) : color.yellow(status),
            );
          });
        },
      );
      describe('getSkip', () => {
        it('should make the call but skip the log', async () => {
          await gqlPromise(baseUrl, {
            query: 'query getSkip{ getSkip{ hello } }',
          });
          expect(logSpy).toHaveBeenCalledTimes(0);
        });
      });
    });
  },
);
