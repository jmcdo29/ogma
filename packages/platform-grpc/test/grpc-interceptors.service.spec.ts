import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy, Stub } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { GrpcParser } from '../src';

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

const GrpcParserSuite = suite<{ parser: GrpcParser; reflectGetStub: Stub<Reflector['get']> }>(
  'Grpc Parser Suite',
  {
    parser: undefined,
    reflectGetStub: spy(),
  },
);
GrpcParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [
      GrpcParser,
      {
        provide: Reflector,
        useValue: {
          get: context.reflectGetStub.handler,
        },
      },
    ],
  }).compile();
  context.parser = modRef.get(GrpcParser);
});
GrpcParserSuite.after.each(({ reflectGetStub }) => {
  reflectGetStub.reset();
});
GrpcParserSuite('it should return the reflected metadata pattern', ({ parser, reflectGetStub }) => {
  const funcMock = () => 'string';
  const ctxMock = createCtxMock({
    getHandler: () => funcMock,
  });
  reflectGetStub.returns([{ rpc: 'SayHello' }]);
  is(parser.getCallPoint(ctxMock), 'SayHello');
  is(reflectGetStub.callCount, 1);
  equal(reflectGetStub.firstCall.args, [PATTERN_METADATA, funcMock]);
});
GrpcParserSuite('It should get the ip from the data', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () => ({
      getData: () =>
        ({
          ip: '127.0.0.1',
        } as any),
      getContext: spy().handler,
    }),
  });
  is(parser.getCallerIp(ctxMock), '127.0.0.1');
});
GrpcParserSuite('It should return an empty string', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () => ({
      getData: () => ({} as any),
      getContext: spy().handler,
    }),
  });
  is(parser.getCallerIp(ctxMock), '');
});
GrpcParserSuite('It should return "gRPC"', ({ parser }) => {
  is(parser.getMethod(), 'gRPC');
});
GrpcParserSuite('It should return a 200', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false), '200');
});
GrpcParserSuite('It should return a 500', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false, new Error()), '500');
});
GrpcParserSuite('It should return a 200 in color', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), true), style.green.apply('200'));
});
GrpcParserSuite('It should return "grpc" for the protocol', ({ parser }) => {
  is(parser.getProtocol(), 'grpc');
});
GrpcParserSuite.run();
