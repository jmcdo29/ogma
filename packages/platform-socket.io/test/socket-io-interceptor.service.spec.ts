import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { MESSAGE_METADATA } from '@nestjs/websockets/constants';
import { style } from '@ogma/styler';
import { spy, Stub } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';
import { SocketIOParser } from '../src';

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

const SocketIOParserSuite = suite<{
  parser: SocketIOParser;
  reflectorGetSpy: Stub<Reflector['get']>;
}>('SocketIO Parser Suite', {
  parser: undefined,
  reflectorGetSpy: spy(),
});
SocketIOParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [
      SocketIOParser,
      {
        provide: Reflector,
        useValue: {
          get: context.reflectorGetSpy.handler,
        },
      },
    ],
  }).compile();
  context.parser = modRef.get(SocketIOParser);
});
SocketIOParserSuite(
  'it should return the reflected metadata pattern',
  ({ parser, reflectorGetSpy }) => {
    const funcMock = () => 'string';
    reflectorGetSpy.returns('message');
    const ctxMock = createCtxMock({
      getHandler: () => funcMock,
    });
    is(parser.getCallPoint(ctxMock), 'message');
    equal(reflectorGetSpy.firstCall.args, [MESSAGE_METADATA, funcMock]);
  },
);
SocketIOParserSuite('It should get the ip from the data', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToWs: () =>
      ({
        getClient: () => ({
          handshake: {
            address: '::1',
          },
        }),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '::1');
});
SocketIOParserSuite('It should return "socket.io"', ({ parser }) => {
  is(parser.getMethod(), 'socket.io');
});
SocketIOParserSuite('It should return a 200', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false), '200');
});
SocketIOParserSuite('It should return a 500', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false, new Error()), '500');
});
SocketIOParserSuite('It should return a 200 in color', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), true), style.green.apply('200'));
});
SocketIOParserSuite('It should return "WS" for the protocol', ({ parser }) => {
  is(parser.getProtocol(), 'WS');
});
SocketIOParserSuite.run();
