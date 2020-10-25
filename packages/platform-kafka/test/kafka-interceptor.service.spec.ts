import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KafkaParser } from '../src';
import { Reflector } from '@nestjs/core';
import { color } from '@ogma/logger';

describe('KafkaParser', () => {
  let parser: KafkaParser;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        KafkaParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => 'message'),
          },
        },
      ],
    }).compile();
    parser = modRef.get(KafkaParser);
  });
  describe('getCallPoint', () => {
    it('should get the reflected message', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getContext: () => ({
            getTopic: () => 'say.hello',
          }),
        }),
      });
      expect(parser.getCallPoint(ctxMock)).toBe('say.hello');
    });
  });
  describe('getCallerIp', () => {
    it('should return an ip from the payload', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getData: () => ({
            value: { hello: 'world', ip: '127.0.0.1' },
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('127.0.0.1');
    });
    it('should return an empty string from the payload without ip as a prop', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getData: () => ({
            value: { hello: 'world' },
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('');
    });
    it('should return an empty string', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getData: () => ({
            value: {},
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('');
    });
  });
  describe('getMethod', () => {
    it('should return "Kafka"', () => {
      expect(parser.getMethod()).toBe('Kafka');
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
    it('should return "kafka"', () => {
      expect(parser.getProtocol()).toBe('kafka');
    });
  });
});
