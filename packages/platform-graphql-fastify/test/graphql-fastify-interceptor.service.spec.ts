import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GraphQLFastifyParser } from '../src';

const gqlMockFactory = (context: Record<string, unknown>, info: Record<string, unknown>) =>
  createMock<ExecutionContext>({
    getType: () => 'graphql',
    getHandler: () => 'query',
    getClass: () => 'Test',
    getArgs: () => [{}, {}, context as any, info as any],
  });

const gqlInfoMockFactory = (infoMock: any) => gqlMockFactory({}, infoMock);

describe('GraphQLFastifyParser', () => {
  let parser: GraphQLFastifyParser;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [GraphQLFastifyParser],
    }).compile();
    parser = modRef.get(GraphQLFastifyParser);
  });

  describe('getMethod', () => {
    it.each`
      method
      ${'query'}
      ${'mutation'}
    `('method: $method', ({ method }: { method: string }) => {
      const mockCtx = gqlInfoMockFactory({ operation: { operation: method } });
      expect(parser.getMethod(mockCtx)).toBe(method);
    });
  });
});
