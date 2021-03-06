import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { NatsParser } from '../src';

describe('NatsParser', () => {
  let parser: NatsParser;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [NatsParser],
    }).compile();
    parser = modRef.get(NatsParser);
  });
  describe('getCallPoint', () => {
    it('should get the subject from the client', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getContext: () => ({
            getSubject: () => JSON.stringify({ cmd: 'message' }),
          }),
        }),
      });
      expect(parser.getCallPoint(ctxMock)).toBe(JSON.stringify({ cmd: 'message' }));
    });
  });
  describe('getCallerIp', () => {
    it('should return an ip from data', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getData: () => ({
            ip: '127.0.0.1',
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('127.0.0.1');
    });
    it('should return a blank string', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getData: () => ({}),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('');
    });
  });
  describe('getMethod', () => {
    it('should return "NATS"', () => {
      expect(parser.getMethod()).toBe('NATS');
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
      expect(parser.getStatus(createMock<ExecutionContext>(), true)).toBe(style.green.apply(200));
    });
  });
  describe('getProtocol', () => {
    it('should return "nats"', () => {
      expect(parser.getProtocol()).toBe('nats');
    });
  });
});
