import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MqttParser } from '../src';
import { Reflector } from '@nestjs/core';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { color } from '@ogma/logger';

describe('MQTTParser', () => {
  let parser: MqttParser;
  let reflector: Reflector;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        MqttParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => 'message'),
          },
        },
      ],
    }).compile();
    parser = modRef.get(MqttParser);
    reflector = modRef.get(Reflector);
  });
  describe('getCallPoint', () => {
    it('should get the reflected message', () => {
      const funcMock = () => 'string';
      const ctxMock = createMock<ExecutionContext>({
        getHandler: funcMock,
      });
      expect(parser.getCallPoint(ctxMock)).toBe(JSON.stringify('message'));
      expect(reflector.get).toBeCalledWith(PATTERN_METADATA, funcMock());
    });
  });
  describe('getCallerIp', () => {
    it('should return an ip from the payload', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getContext: () => ({
            getPacket: () => ({
              payload: Buffer.from(JSON.stringify({ data: { hello: 'world', ip: '127.0.0.1' } })),
            }),
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('127.0.0.1');
    });
    it('should return an empty string from the payload without ip as a prop', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getContext: () => ({
            getPacket: () => ({
              payload: Buffer.from(JSON.stringify({ data: { hello: 'world' } })),
            }),
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('');
    });
    it('should return an empty string', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getContext: () => ({
            getPacket: () => ({
              payload: Buffer.from(JSON.stringify({})),
            }),
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('');
    });
  });
  describe('getMethod', () => {
    it('should return "MQTT"', () => {
      expect(parser.getMethod()).toBe('MQTT');
    });
  });
  describe('getStatus', () => {
    it('should return a 200', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), false)).toBe('200');
    });
    it('should return a 500', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), false, new Error())).toBe('500');
    });
    it('should return a 200 in color', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), true)).toBe(color.green(200));
    });
  });
  describe('getProtocol', () => {
    it('should return "mqtt"', () => {
      expect(parser.getProtocol()).toBe('mqtt');
    });
  });
});
