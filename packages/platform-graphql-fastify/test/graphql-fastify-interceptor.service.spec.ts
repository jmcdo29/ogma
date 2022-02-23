import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { spy } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { GraphQLFastifyParser } from '../src';

const gqlMockFactory = (
  context: Record<string, any>,
  info: Record<string, any>,
): ExecutionContext =>
  ({
    getType: () => 'graphql',
    getHandler: () => 'query',
    getClass: () => 'Test',
    getArgs: () => [{}, {}, context, info],
    getArgByIndex: spy().handler,
    switchToHttp: () => spy().handler,
    switchToRpc: () => spy().handler,
    switchToWs: () => spy().handler,
  } as any);

const gqlContextMockFactory = (contextMock: any) => gqlMockFactory(contextMock, {});

const gqlInfoMockFactory = (infoMock: any) => gqlMockFactory({}, infoMock);

const GqlParserSuite = suite<{ parser: GraphQLFastifyParser }>('GraphQL Parser Suite', {
  parser: undefined,
});
GqlParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [GraphQLFastifyParser],
  }).compile();
  context.parser = modRef.get(GraphQLFastifyParser);
});
for (const op in ['query', 'mutation']) {
  GqlParserSuite(`getMethod ${op}`, ({ parser }) => {
    const gqlContext = gqlInfoMockFactory({
      operation: { operation: op },
    });
    is(parser.getMethod(gqlContext), op);
  });
}
GqlParserSuite('getRequest', ({ parser }) => {
  const reqMock = { key: 'value' };
  const gqlCtx = gqlContextMockFactory({ request: reqMock });
  equal(parser.getRequest(gqlCtx), reqMock);
});
GqlParserSuite('getResponse', ({ parser }) => {
  const resMock = { key: 'value' };
  const gqlCtx = gqlContextMockFactory({ reply: resMock });
  equal(parser.getResponse(gqlCtx), resMock);
});
GqlParserSuite.run();
