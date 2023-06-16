import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { MESSAGE_METADATA } from '@nestjs/websockets/constants';
import { style } from '@ogma/styler';
import { spy, Stub } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { WsParser } from '../src';

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

const WsParserSuite = suite<{
  parser: WsParser;
  reflectorGetSpy: Stub<Reflector['get']>;
}>('Ws Parser Suite', {
  parser: undefined,
  reflectorGetSpy: spy(),
});
WsParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [
      WsParser,
      {
        provide: Reflector,
        useValue: {
          get: context.reflectorGetSpy.handler,
        },
      },
    ],
  }).compile();
  context.parser = modRef.get(WsParser);
});
WsParserSuite('it should return the reflected metadata pattern', ({ parser, reflectorGetSpy }) => {
  const funcMock = () => 'string';
  reflectorGetSpy.returns('message');
  const ctxMock = createCtxMock({
    getHandler: () => funcMock,
    switchToWs: () => ({
      getPattern: () => 'message',
      getData: () => <any>{},
      getClient: () => <any>{},
    }),
  });
  is(parser.getCallPoint(ctxMock), 'message');
});
WsParserSuite('It should get the ip from the data', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToWs: () =>
      ({
        getClient: () => ({
          _socket: {
            remoteAddress: '127.0.0.1',
          },
        }),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '127.0.0.1');
});
WsParserSuite('It should return "websocket"', ({ parser }) => {
  is(parser.getMethod(), 'websocket');
});
WsParserSuite('It should return a 200', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false), '200');
});
WsParserSuite('It should return a 500', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false, new Error()), '500');
});
WsParserSuite('It should return a 200 in color', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), true), style.green().apply('200'));
});
WsParserSuite('It should return "WS" for the protocol', ({ parser }) => {
  is(parser.getProtocol(), 'WS');
});
WsParserSuite.run();
