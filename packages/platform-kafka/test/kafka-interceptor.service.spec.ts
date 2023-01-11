import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy } from 'hanbi';
import { suite } from 'uvu';
import { is } from 'uvu/assert';

import { KafkaParser } from '../src';

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

const KafkaParserSuite = suite<{ parser: KafkaParser }>('Kafka Parser Suite', {
  parser: undefined,
});
KafkaParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [
      KafkaParser,
      {
        provide: Reflector,
        useValue: {
          get: spy().handler,
        },
      },
    ],
  }).compile();
  context.parser = modRef.get(KafkaParser);
});
KafkaParserSuite('it should return the reflected metadata pattern', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getContext: () =>
          ({
            getTopic: () => 'say.hello',
          } as any),
      } as any),
  });
  is(parser.getCallPoint(ctxMock), 'say.hello');
});
KafkaParserSuite('It should get the ip from the data', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () => ({
      getData: () =>
        ({
          value: {
            ip: '127.0.0.1',
          },
        } as any),
      getContext: spy().handler,
    }),
  });
  is(parser.getCallerIp(ctxMock), '127.0.0.1');
});
KafkaParserSuite('It should return an empty string', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () => ({
      getData: () => ({} as any),
      getContext: spy().handler,
    }),
  });
  is(parser.getCallerIp(ctxMock), '');
});
KafkaParserSuite('It should return "Kafka"', ({ parser }) => {
  is(parser.getMethod(), 'Kafka');
});
KafkaParserSuite('It should return a 200', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false), '200');
});
KafkaParserSuite('It should return a 500', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false, new Error()), '500');
});
KafkaParserSuite('It should return a 200 in color', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), true), style.green().apply('200'));
});
KafkaParserSuite('It should return "kafka" for the protocol', ({ parser }) => {
  is(parser.getProtocol(), 'kafka');
});
KafkaParserSuite.run();
