import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { Test } from '@nestjs/testing';
import { color } from '@ogma/logger';
import { RedisParser } from '../src';

describe('RedisParser', () => {
  let parser: RedisParser;
  let reflector: Reflector;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        RedisParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => 'message'),
          },
        },
      ],
    }).compile();
    parser = mod.get(RedisParser);
    reflector = mod.get(Reflector);
  });

  describe('getCallPoint', () => {
    it('should get the reflected message', () => {
      const funcMock = () => 'string';
      const ctxMock = createMock<ExecutionContext>({
        getHandler: () => funcMock(),
      });
      expect(parser.getCallPoint(ctxMock)).toBe(JSON.stringify('message'));
      expect(reflector.get).toBeCalledWith(PATTERN_METADATA, funcMock());
    });
  });
  describe('getCallerIp', () => {
    it('should return an empty string', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getData: () => ({}),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('');
    });
    it('should return the ip', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getData: () => ({
            ip: '127.0.0.1',
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('127.0.0.1');
    });
  });
  describe('getProtocol', () => {
    it('should return "redis"', () => {
      expect(parser.getProtocol()).toBe('redis');
    });
  });
  describe('getMethod', () => {
    it('should return REDIS', () => {
      expect(parser.getMethod()).toBe('REDIS');
    });
  });
  describe('getStatus', () => {
    it('should return a 200', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), false)).toBe(
        '200',
      );
    });
    it('should return a 500', () => {
      expect(
        parser.getStatus(createMock<ExecutionContext>(), false, new Error()),
      ).toBe('500');
    });
    it('should return a 200 in color', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), true)).toBe(
        color.green(200),
      );
    });
  });
});
