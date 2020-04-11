import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { color } from '@ogma/logger';
import { Request, Response } from 'express';
import { GraphQLParser } from '../src';

const gqlMockFactory = (context: object, info: object) =>
  createMock<ExecutionContext>({
    getType: () => 'graphql',
    getHandler: () => 'query',
    getClass: () => 'Test',
    getArgs: () => [{}, {}, context, info],
  });

const gqlContextMockFactory = (contextMock: any) =>
  gqlMockFactory(contextMock, {});

const gqlInfoMockFactory = (infoMock: any) => gqlMockFactory({}, infoMock);

describe('GraphQLParser', () => {
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
  describe('getStatus', () => {
    it('should get a 200', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), false)).toBe(
        '200',
      );
    });
    it('should get a 500', () => {
      expect(
        parser.getStatus(createMock<ExecutionContext>(), false, new Error()),
      ).toBe('500');
    });
    it('should get a 400', () => {
      expect(
        parser.getStatus(
          createMock<ExecutionContext>(),
          false,
          new BadRequestException(),
        ),
      ).toBe('400');
    });
    it('should get 400 after a serialized error', () => {
      const err: any = {
        status: 400,
        getStatus: () => err.status,
      };
      expect(parser.getStatus(createMock<ExecutionContext>(), false, err)).toBe(
        '400',
      );
    });
    it('should get a colored 200', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), true)).toBe(
        color.green(200),
      );
    });
  });
});
