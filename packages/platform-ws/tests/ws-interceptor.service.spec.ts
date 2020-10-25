import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { MESSAGE_METADATA } from '@nestjs/websockets/constants';
import { color } from '@ogma/logger';
import { WsParser } from '../src';

describe('WsParser', () => {
  let parser: WsParser;
  let reflector: Reflector;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        WsParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => 'message'),
          },
        },
      ],
    }).compile();
    parser = modRef.get(WsParser);
    reflector = modRef.get(Reflector);
  });

  describe('getCallPoint', () => {
    it('should return "message"', () => {
      const funcMock = () => 'string';
      const ctxMock = createMock<ExecutionContext>({
        getHandler: () => funcMock(),
      });
      expect(parser.getCallPoint(ctxMock)).toBe('message');
      expect(reflector.get).toBeCalledWith(MESSAGE_METADATA, funcMock());
    });
  });
  describe('getCallerIp', () => {
    it('should return the IP', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToWs: () => ({
          getClient: () => ({
            _socket: {
              remoteAddress: '127.0.0.1',
            },
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('127.0.0.1');
    });
  });
  describe('getProtocol', () => {
    it('should return "WS"', () => {
      expect(parser.getProtocol()).toBe('WS');
    });
  });
  describe('getMethod', () => {
    it('should return "websocket"', () => {
      expect(parser.getMethod()).toBe('websocket');
    });
  });
  describe('getStatus', () => {
    it('should return a 200', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), false)).toBe('200');
    });
    it('should return a 500', () => {
      expect(
        parser.getStatus(createMock<ExecutionContext>(), false, new BadRequestException()),
      ).toBe('500');
    });
    it('should return a 200 in green', () => {
      expect(parser.getStatus(createMock<ExecutionContext>(), true)).toBe(color.green(200));
    });
  });
});
