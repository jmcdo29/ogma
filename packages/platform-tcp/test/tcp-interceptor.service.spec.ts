import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy, Stub } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { TcpParser } from '../src';

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

const TcpParserSuite = suite<{ parser: TcpParser; reflectorGetSpy: Stub<Reflector['get']> }>(
  'Tcp Parser Suite',
  {
    parser: undefined,
    reflectorGetSpy: spy(),
  },
);
TcpParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [
      TcpParser,
      {
        provide: Reflector,
        useValue: {
          get: context.reflectorGetSpy.handler,
        },
      },
    ],
  }).compile();
  context.parser = modRef.get(TcpParser);
});
TcpParserSuite('it should return the reflected metadata pattern', ({ parser, reflectorGetSpy }) => {
  const funcMock = () => 'string';
  reflectorGetSpy.returns('message');
  const ctxMock = createCtxMock({
    getHandler: () => funcMock,
  });
  is(parser.getCallPoint(ctxMock), JSON.stringify('message'));
  equal(reflectorGetSpy.firstCall.args, [PATTERN_METADATA, funcMock]);
});
TcpParserSuite('It should get the ip from the data', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getContext: () => ({
          getSocketRef: () => ({
            socket: {
              remoteAddress: '127.0.0.1',
              remotePort: '3333',
            },
          }),
        }),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '127.0.0.1:3333');
});
TcpParserSuite('It should return "TCP"', ({ parser }) => {
  is(parser.getMethod(), 'TCP');
});
TcpParserSuite('It should return a 200', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false), '200');
});
TcpParserSuite('It should return a 500', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false, new Error()), '500');
});
TcpParserSuite('It should return a 200 in color', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), true), style.green.apply('200'));
});
TcpParserSuite('It should return "redis" for the protocol', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getContext: () => ({
          getSocketRef: () => ({
            socket: {
              remoteFamily: 'IPv4',
            },
          }),
        }),
      } as any),
  });
  is(parser.getProtocol(ctxMock), 'IPv4');
});
TcpParserSuite.run();
