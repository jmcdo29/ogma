import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { GrpcParser } from '../src';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';

describe('GrpcParser', () => {
  let parser: GrpcParser;
  let reflector: Reflector;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        GrpcParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();
    parser = modRef.get(GrpcParser);
    reflector = modRef.get(Reflector);
  });

  describe('getCallPoint', () => {
    it('should return the reflected metadata pattern', () => {
      const funcMock = () => 'string';
      const reflectSpy = jest.spyOn(reflector, 'get').mockReturnValueOnce({ rpc: 'SayHello' });
      const ctxMock = createMock<ExecutionContext>({
        getHandler: funcMock,
      });
      expect(parser.getCallPoint(ctxMock)).toBe('SayHello');
      expect(reflectSpy).toBeCalledTimes(1);
      expect(reflectSpy).toBeCalledWith(PATTERN_METADATA, funcMock());
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
  describe('getMethod', () => {
    it('should return "gRPC"', () => {
      expect(parser.getMethod()).toBe('gRPC');
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
    it('should return "grpc"', () => {
      expect(parser.getProtocol()).toBe('grpc');
    });
  });
});
