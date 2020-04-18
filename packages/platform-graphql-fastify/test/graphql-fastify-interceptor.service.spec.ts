import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GraphQLFastifyParser } from '../src';
import { color } from '@ogma/logger';

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

describe('GraphQLFastifyParser', () => {
  let parser: GraphQLFastifyParser;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [GraphQLFastifyParser],
    }).compile();
    parser = modRef.get(GraphQLFastifyParser);
  });

  describe('getCallerIp', () => {
    it('should get the IP for a single IP', () => {
      const mockCtx = gqlContextMockFactory({
        req: {
          ip: '127.0.0.1',
        },
      });
      expect(parser.getCallerIp(mockCtx)).toBe('127.0.0.1');
    });
    it('should get the ips for multiple ips', () => {
      const mockCtx = gqlContextMockFactory({
        req: {
          ips: ['0.0.0.0', '127.0.0.1'],
        },
      });
      expect(parser.getCallerIp(mockCtx)).toBe('0.0.0.0 127.0.0.1');
    });
  });
  describe('getCallPoint', () => {
    it('should get the call Point', () => {
      const mockContext = gqlContextMockFactory({ req: { url: '/graphql' } });
      expect(parser.getCallPoint(mockContext)).toBe('/graphql');
    });
  });
  describe('getProtocol', () => {
    it('should get the protocol', () => {
      const mockCtx = gqlContextMockFactory({
        req: {
          httpVersionMajor: 1,
          httpVersionMinor: 1,
        },
      });
      expect(parser.getProtocol(mockCtx)).toBe('HTTP/1.1');
    });
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
  describe('getStatus', () => {
    describe.each`
      inColor
      ${true}
      ${false}
    `('color: $inColor', ({ inColor }: { inColor: boolean }) => {
      it.each`
        error                        | status
        ${undefined}                 | ${inColor ? color.green(200) : '200'}
        ${new BadRequestException()} | ${inColor ? color.yellow(400) : '400'}
        ${new Error()}               | ${inColor ? color.red(500) : '500'}
      `('error: $error, status: $status', ({ error, status }) => {
        expect(
          parser.getStatus(createMock<ExecutionContext>(), inColor, error),
        ).toEqual(status);
      });
    });
  });
});
