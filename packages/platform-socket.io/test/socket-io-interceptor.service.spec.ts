import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { MESSAGE_METADATA } from '@nestjs/websockets/constants';
import { color } from '@ogma/logger';
import { SocketIOParser } from '../src';

describe('SocketIOParser', () => {
  let parser: SocketIOParser;
  let reflector: Reflector;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        SocketIOParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => 'message'),
          },
        },
      ],
    }).compile();
    parser = mod.get(SocketIOParser);
    reflector = mod.get(Reflector);
  });

  describe('getCallPoint', () => {
    it('should get the reflected message', () => {
      const funcMock = () => 'string';
      const ctxMock = createMock<ExecutionContext>({
        getHandler: () => funcMock(),
      });
      expect(parser.getCallPoint(ctxMock)).toBe('message');
      expect(reflector.get).toBeCalledWith(MESSAGE_METADATA, funcMock());
    });
  });
  describe('getCallerIp', () => {
    it('should get the ip from handshake', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToWs: () => ({
          getClient: () => ({
            handshake: {
              address: '::1',
            },
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('::1');
    });
  });
  describe('getProtocol', () => {
    it('should return ws', () => {
      expect(parser.getProtocol()).toBe('WS');
    });
  });
  describe('getMethod', () => {
    it('should return socket.io', () => {
      expect(parser.getMethod()).toBe('socket.io');
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
});
