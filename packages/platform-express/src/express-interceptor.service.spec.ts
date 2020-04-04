import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { color } from '@ogma/logger';
import { ExpressParser } from './express-interceptor.service';

const resMock = (status: number) => ({
  getResponse: () => ({
    statusCode: status,
  }),
});

describe('ExpressParser', () => {
  let parser: ExpressParser;
  let reflector: Reflector;
  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        ExpressParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => ''),
          },
        },
      ],
    }).compile();
    parser = mod.get(ExpressParser);
    reflector = mod.get(Reflector);
  });
  it('should be defined', () => {
    expect(parser).toBeDefined();
  });

  describe('getCallerIp', () => {
    it('should pull from ip', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            ip: '127.0.0.1',
            ips: [],
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('127.0.0.1');
    });
    it('should pull from ips', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            ip: '127.0.0.1',
            ips: ['127.0.0.1', '0.0.0.0'],
          }),
        }),
      });
      expect(parser.getCallerIp(ctxMock)).toBe('127.0.0.1 0.0.0.0');
    });
  });

  describe('getCallPoint', () => {
    it('should get the url', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            url: '/api/auth/callback?token=123abc',
          }),
        }),
      });
      expect(parser.getCallPoint(ctxMock)).toBe(
        '/api/auth/callback?token=123abc',
      );
    });
  });

  describe('getStatus', () => {
    it('should get regular status code (200)', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => resMock(200),
      });
      expect(parser.getStatus(ctxMock, false)).toBe('200');
    });
    it('should get the status from an exception (40x)', () => {
      const ctxMock = createMock<ExecutionContext>();
      expect(parser.getStatus(ctxMock, false, new BadRequestException())).toBe(
        '400',
      );
    });
    it('should get the status from an error(500)', () => {
      const ctxMock = createMock<ExecutionContext>();
      expect(parser.getStatus(ctxMock, false, new Error())).toBe('500');
    });
    it('should get the status from the reflector (201)', () => {
      const sampleObject = {
        func: () => '',
      };
      jest.spyOn(reflector, 'get').mockReturnValueOnce(201);
      const ctxMock = createMock<ExecutionContext>({
        getHandler: () => sampleObject.func(),
      });
      expect(parser.getStatus(ctxMock, false)).toBe('201');
      expect(reflector.get).toBeCalledWith(
        HTTP_CODE_METADATA,
        sampleObject.func(),
      );
    });
    it('should get the status in color', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => resMock(200),
      });
      expect(parser.getStatus(ctxMock, true)).toBe(color.green(200));
    });
  });

  describe('getMethod', () => {
    it('should get the method from the request', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            method: 'POST',
          }),
        }),
      });
      expect(parser.getMethod(ctxMock)).toBe('POST');
    });
    it('should return GET by default', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      });
      expect(parser.getMethod(ctxMock)).toBe('GET');
    });
  });

  describe('getProtocol', () => {
    it('should get the http protocol', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            httpVersionMajor: 1,
            httpVersionMinor: 1,
          }),
        }),
      });
      expect(parser.getProtocol(ctxMock)).toBe('HTTP/1.1');
    });
  });
});
