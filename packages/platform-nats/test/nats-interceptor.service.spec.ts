import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy } from 'hanbi';
import { suite } from 'uvu';
import { is } from 'uvu/assert';

import { NatsParser } from '../src';

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

const NatsParserSuite = suite<{ parser: NatsParser }>('Nats Parser Suite', {
  parser: undefined,
});
NatsParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [
      NatsParser,
      {
        provide: Reflector,
        useValue: {
          get: spy().handler,
        },
      },
    ],
  }).compile();
  context.parser = modRef.get(NatsParser);
});
NatsParserSuite('it should return the reflected metadata pattern', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getContext: () => ({
          getSubject: () => JSON.stringify({ cmd: 'message' }),
        }),
      } as any),
  });
  is(parser.getCallPoint(ctxMock), JSON.stringify({ cmd: 'message' }));
});
NatsParserSuite('It should get the ip from the data', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getData: () =>
          ({
            ip: '127.0.0.1',
          } as any),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '127.0.0.1');
});
NatsParserSuite('It should return an empty string', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getData: () =>
          ({
            hello: 'world',
          } as any),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '');
});
NatsParserSuite('It should return "NATS"', ({ parser }) => {
  is(parser.getMethod(), 'NATS');
});
NatsParserSuite('It should return a 200', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false), '200');
});
NatsParserSuite('It should return a 500', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false, new Error()), '500');
});
NatsParserSuite('It should return a 200 in color', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), true), style.green.apply('200'));
});
NatsParserSuite('It should return "nats" for the protocol', ({ parser }) => {
  is(parser.getProtocol(), 'nats');
});
NatsParserSuite.run();
