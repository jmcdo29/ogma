import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { spy } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';
import { GraphQLParser } from '../src';

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

const GqlParserSuite = suite<{ parser: GraphQLParser }>('GraphQL Parser Suite', {
  parser: undefined,
});
GqlParserSuite.before(async (context) => {
  const mod = await Test.createTestingModule({
    providers: [GraphQLParser],
  }).compile();
  context.parser = mod.get(GraphQLParser);
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
  const gqlCtx = gqlContextMockFactory({ req: reqMock });
  equal(parser.getRequest(gqlCtx), reqMock);
});
GqlParserSuite('getResponse', ({ parser }) => {
  const resMock = { key: 'value' };
  const gqlCtx = gqlContextMockFactory({ res: resMock });
  equal(parser.getResponse(gqlCtx), resMock);
});
GqlParserSuite.run();

/* describe('GraphQLParser', () => {
  let parser: GraphQLParser;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [GraphQLParser],
    }).compile();
    parser = mod.get(GraphQLParser);
  });

  describe('getMethod', () => {
    it('should get the method Query', () => {
      const gqlContext = gqlInfoMockFactory({
        operation: { operation: 'query' },
      });
      expect(parser.getMethod(gqlContext)).toBe('query');
    });
    it('should get the method Mutation', () => {
      const gqlCtx = gqlInfoMockFactory({
        operation: { operation: 'mutation' },
      });
      expect(parser.getMethod(gqlCtx)).toBe('mutation');
    });
  });
  describe('getRequest', () => {
    it('should get the request object', () => {
      const reqMock = createMock<Request>();
      const gqlCtx = gqlContextMockFactory({ req: reqMock });
      expect(parser.getRequest(gqlCtx)).toEqual(reqMock);
    });
  });
  describe('getResponse', () => {
    it('should get the response object', () => {
      const resMock = createMock<Response>();
      const gqlCtx = gqlContextMockFactory({ res: resMock });
      expect(parser.getResponse(gqlCtx)).toEqual(resMock);
    });
  });
}); */
