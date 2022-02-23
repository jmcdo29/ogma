import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy, Stub } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { MqttParser } from '../src';

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

const MqttParserSuite = suite<{ parser: MqttParser; reflectorGetSpy: Stub<Reflector['get']> }>(
  'Mqtt Parser Suite',
  {
    parser: undefined,
    reflectorGetSpy: spy(),
  },
);
MqttParserSuite.before(async (context) => {
  const modRef = await Test.createTestingModule({
    providers: [
      MqttParser,
      {
        provide: Reflector,
        useValue: {
          get: context.reflectorGetSpy.handler,
        },
      },
    ],
  }).compile();
  context.parser = modRef.get(MqttParser);
});
MqttParserSuite(
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
MqttParserSuite('It should get the ip from the data', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getContext: () => ({
          getPacket: () => ({
            payload: Buffer.from(JSON.stringify({ data: { hello: 'world', ip: '127.0.0.1' } })),
          }),
        }),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '127.0.0.1');
});
MqttParserSuite('It should return an empty string', ({ parser }) => {
  const ctxMock = createCtxMock({
    switchToRpc: () =>
      ({
        getContext: () => ({
          getPacket: () => ({
            payload: Buffer.from(JSON.stringify({ data: { hello: 'world' } })),
          }),
        }),
      } as any),
  });
  is(parser.getCallerIp(ctxMock), '');
});
MqttParserSuite('It should return "MQTT"', ({ parser }) => {
  is(parser.getMethod(), 'MQTT');
});
MqttParserSuite('It should return a 200', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false), '200');
});
MqttParserSuite('It should return a 500', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), false, new Error()), '500');
});
MqttParserSuite('It should return a 200 in color', ({ parser }) => {
  is(parser.getStatus(createCtxMock(), true), style.green.apply('200'));
});
MqttParserSuite('It should return "mqtt" for the protocol', ({ parser }) => {
  is(parser.getProtocol(), 'mqtt');
});
MqttParserSuite.run();
