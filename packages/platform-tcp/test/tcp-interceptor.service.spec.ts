import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { TcpParser } from '../src';

describe('TcpParser', () => {
  let parser: TcpParser;
  let reflector: Reflector;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        TcpParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => 'message'),
          },
        },
      ],
    }).compile();
    parser = mod.get(TcpParser);
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
    it('should get the ip from handshake', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getContext: () => ({
            getSocketRef: () => ({
              socket: {
                remoteAddress: '127.0.0.1',
                remotePort: '3333',
              },
            }),
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('127.0.0.1:3333');
    });
  });
  describe('getProtocol', () => {
    it('should return IPv4', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToRpc: () => ({
          getContext: () => ({
            getSocketRef: () => ({
              socket: {
                remoteFamily: 'IPv4',
              },
            }),
          }),
        }),
      });
      expect(parser.getProtocol(ctxMock)).toBe('IPv4');
    });
  });
  describe('getMethod', () => {
    it('should return TCP', () => {
      expect(parser.getMethod()).toBe('TCP');
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
});
