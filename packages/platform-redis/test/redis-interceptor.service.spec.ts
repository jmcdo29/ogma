import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy, Stub } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';
import { RedisParser } from '../src';

const createCtxMock = (partial: Partial<ExecutionContext> = {}): ExecutionContext => ({
  getArgByIndex: spy().handler,
  getArgs: spy().handler,
  getClass: spy().handler,
  getHandler: spy().handler,
  getType: spy().handler,
  switchToHttp: spy().handler,
  switchToRpc: spy().handler,
  switchToWs: spy().handler,
  ...partial,
});

const RedisParserSuite = suite<{ parser: RedisParser; reflectorGetSpy: Stub<Reflector['get']> }>(
  'Redis Parser Suite',
  {
    parser: undefined,
    reflectorGetSpy: spy(),
  },
);
RedisParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [
      RedisParser,
      {
        provide: Reflector,
        useValue: {
          get: context.reflectorGetSpy.handler,
        },
      },
    ],
  }).compile();
  context.parser = modRef.get(RedisParser);
});
RedisParserSuite(
  'it should return the reflected metadata pattern',
  ({ parser, reflectorGetSpy }) => {
    const funcMock = () => 'string';
    reflectorGetSpy.returns('message');
    const ctxMock = createCtxMock({
      getHandler: () => funcMock,
    });
    is(parser.getCallPoint(ctxMock), JSON.stringify('message'));
    equal(reflectorGetSpy.firstCall.args, [PATTERN_METADATA, funcMock]);
  },
);
RedisParserSuite('It should return an empty string', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getData: () => ({}),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '');
});
RedisParserSuite('It should get the ip from the data', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getData: () => ({
          ip: '127.0.0.1',
        }),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '127.0.0.1');
});
RedisParserSuite('It should return "REDIS"', ({ parser }) => {
  is(parser.getMethod(), 'REDIS');
});
RedisParserSuite('It should return a 200', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false), '200');
});
RedisParserSuite('It should return a 500', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false, new Error()), '500');
});
RedisParserSuite('It should return a 200 in color', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), true), style.green.apply('200'));
});
RedisParserSuite('It should return "redis" for the protocol', ({ parser }) => {
  is(parser.getProtocol(), 'redis');
});
RedisParserSuite.run();
