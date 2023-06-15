import { ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { MercuriusDriver } from '@nestjs/mercurius';
import { ExpressAdapter } from '@nestjs/platform-express';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { OgmaFilterService, OgmaInterceptor, OgmaService } from '@ogma/nestjs-module';
import { GraphQLParser } from '@ogma/platform-graphql';
import { GraphQLFastifyParser } from '@ogma/platform-graphql-fastify';
import { style } from '@ogma/styler';
import { Stub, stubMethod } from 'hanbi';
import { request, spec } from 'pactum';
import { suite } from 'uvu';
import { is } from 'uvu/assert';

import { GqlModule } from '../src/gql/gql.module';
import { createTestModule, reportValues, serviceOptionsFactory, toBeALogObject } from './utils';

for (const { adapter, server, parser, driver } of [
  {
    adapter: new ExpressAdapter(),
    server: 'Express',
    parser: GraphQLParser,
    driver: ApolloDriver,
  },
  // fastify v4 is incompatible with apollo-server at this time
  /* {
    adapter: new FastifyAdapter(),
    server: 'Fastify',
    parser: GraphQLFastifyParser,
    driver: ApolloDriver,
  }, */
  {
    adapter: new FastifyAdapter(),
    server: 'Fastify Mercurius',
    parser: GraphQLFastifyParser,
    driver: MercuriusDriver,
  },
]) {
  const GqlParserSuite = suite<{
    app: INestApplication;
    logSpy: Stub<OgmaInterceptor['log']>;
    logs: Parameters<OgmaInterceptor['log'] | OgmaFilterService['doLog']>[];
    filterSpy: Stub<OgmaFilterService['doLog']>;
  }>(`${server} GraphQL server`, {
    app: undefined,
    logSpy: undefined,
    logs: [],
    filterSpy: undefined,
  });
  GqlParserSuite.before(async (context) => {
    const modRef = await createTestModule(GqlModule.forFeature(driver), {
      service: serviceOptionsFactory(`GraphQL ${server}`),
      interceptor: {
        gql: parser,
      },
    });
    context.app = modRef.createNestApplication(adapter);
    const interceptor = context.app.get(OgmaInterceptor);
    const filterService = context.app.get(OgmaFilterService);
    await context.app.listen(0);
    const baseUrl = await context.app.getUrl();
    request.setBaseUrl(baseUrl.replace('[::1]', 'localhost'));
    context.logSpy = stubMethod(interceptor, 'log');
    context.filterSpy = stubMethod(filterService as any, 'doLog');
  });
  GqlParserSuite.after.each(({ logSpy, logs, filterSpy }) => {
    logSpy.firstCall && logs.push(logSpy.firstCall.args);
    logSpy.reset();
    filterSpy.firstCall && logs.push(filterSpy.firstCall.args);
    filterSpy.reset();
  });
  GqlParserSuite.after(async ({ app, logs }) => {
    const ogma = app.get(OgmaService);
    await app.close();
    reportValues(ogma, logs);
  });
  for (const { type, name, status } of [
    {
      type: 'query',
      name: 'getQuery',
      status: style.green.apply(200),
    },
    {
      type: 'query',
      name: 'getError',
      status: style.yellow.apply(400),
    },
    {
      type: 'mutation',
      name: 'getMutation',
      status: style.green.apply(200),
    },
  ]) {
    GqlParserSuite(`${type} ${name} call`, async ({ logSpy }) => {
      await spec().post('/graphql').withGraphQLQuery(`${type} ${name}{ ${name}{ hello }}`).toss();
      toBeALogObject(logSpy.firstCall.args[0], type, '/graphql', 'HTTP/1.1', status);
      const reqId = logSpy.firstCall.args[2];
      is(typeof reqId, 'string');
      is(reqId.length, 16);
    });
  }
  GqlParserSuite('should skip the log but make the call', async ({ logSpy }) => {
    await spec().post('/graphql').withGraphQLQuery('query getSkip{ getSkip{ hello }}').toss();
    is(logSpy.callCount, 0);
  });
  GqlParserSuite('it should error at the guard and still log a line', async ({ filterSpy }) => {
    await spec().post('/graphql').withGraphQLQuery('query failGuard { failGuard { hello }}').toss();
    toBeALogObject(
      filterSpy.firstCall.args[0],
      'query',
      '/graphql',
      'HTTP/1.1',
      style.yellow.apply(403),
    );
  });
  GqlParserSuite.run();
}
