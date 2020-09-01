import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { OgmaInterceptorServiceOptions } from '../src';
import { LogObject } from '../src/interceptor/interfaces/log.interface';
import {
  AbstractInterceptorService,
  DelegatorService,
  GqlInterceptorService,
  HttpInterceptorService,
  RpcInterceptorService,
  WebsocketInterceptorService,
} from '../src/interceptor/providers';

const logProperly = (type: 'http' | 'gql' | 'ws' | 'rpc') =>
  `should log properly for ${type}`;
const setRequestIdProperly = (type: 'http' | 'gql' | 'ws' | 'rpc') =>
  `should set request id properly for ${type}`;

const abstractInterceptorServiceMock = () =>
  createMock<AbstractInterceptorService>();

const spyFactory = (
  parser: AbstractInterceptorService,
  method: 'getSuccessContext' | 'getErrorContext' | 'setRequestId',
): jest.SpyInstance => jest.spyOn(parser, method);

const parserReturn: LogObject = {
  callPoint: '/',
  callerAddress: '127.0.0.1',
  method: 'GET',
  protocol: 'HTTP/1.1',
  status: '200',
  responseTime: 2,
  contentLength: 5,
};

const httpContext = {
  getType: () => 'http',
  getArgs: () => [1, 2, 3],
};

const parsedString = '127.0.0.1 - GET / HTTP/1.1 200 2ms - 5';

describe('DelegatorService', () => {
  let delegate: DelegatorService;
  let http: HttpInterceptorService;
  let gql: GqlInterceptorService;
  let ws: WebsocketInterceptorService;
  let rpc: RpcInterceptorService;
  const startTime = 0;
  const options: OgmaInterceptorServiceOptions = {
    color: false,
    json: false,
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        DelegatorService,
        {
          provide: HttpInterceptorService,
          useFactory: abstractInterceptorServiceMock,
        },
        {
          provide: GqlInterceptorService,
          useFactory: abstractInterceptorServiceMock,
        },
        {
          provide: WebsocketInterceptorService,
          useFactory: abstractInterceptorServiceMock,
        },
        {
          provide: RpcInterceptorService,
          useFactory: abstractInterceptorServiceMock,
        },
      ],
    }).compile();
    delegate = mod.get(DelegatorService);
    http = mod.get(HttpInterceptorService);
    gql = mod.get(GqlInterceptorService);
    ws = mod.get(WebsocketInterceptorService);
    rpc = mod.get(RpcInterceptorService);
  });
  describe('getContextSuccessString', () => {
    const data = 'someData';
    it(logProperly('http'), () => {
      const ctxMock = createMock<ExecutionContext>(
        httpContext as Partial<ExecutionContext>,
      );
      const spy = spyFactory(http, 'getSuccessContext').mockReturnValueOnce(
        parserReturn,
      );
      expect(
        delegate.getContextSuccessString(data, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(
        Buffer.from(JSON.stringify(data)).byteLength,
        ctxMock,
        startTime,
        options,
      );
    });
    it(logProperly('gql'), () => {
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'graphql',
      });
      const spy = spyFactory(gql, 'getSuccessContext').mockReturnValueOnce(
        parserReturn,
      );
      expect(
        delegate.getContextSuccessString(data, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(
        Buffer.from(JSON.stringify(data)).byteLength,
        ctxMock,
        startTime,
        options,
      );
    });
    it(logProperly('ws'), () => {
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'ws',
      });
      const spy = spyFactory(ws, 'getSuccessContext').mockReturnValueOnce(
        parserReturn,
      );
      expect(
        delegate.getContextSuccessString(data, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(
        Buffer.from(JSON.stringify(data)).byteLength,
        ctxMock,
        startTime,
        options,
      );
    });
    it(logProperly('rpc'), () => {
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'rpc',
      });
      const spy = spyFactory(rpc, 'getSuccessContext').mockReturnValueOnce(
        parserReturn,
      );
      expect(
        delegate.getContextSuccessString(data, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(
        Buffer.from(JSON.stringify(data)).byteLength,
        ctxMock,
        startTime,
        options,
      );
    });
  });
  describe('getContextErrorString', () => {
    const error = new Error('Big oof');
    it(logProperly('http'), () => {
      const spy = spyFactory(http, 'getErrorContext').mockReturnValueOnce(
        parserReturn,
      );
      const ctxMock = createMock<ExecutionContext>(
        httpContext as Partial<ExecutionContext>,
      );
      expect(
        delegate.getContextErrorString(error, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(error, ctxMock, startTime, options);
    });
    it(logProperly('gql'), () => {
      const spy = spyFactory(gql, 'getErrorContext').mockReturnValueOnce(
        parserReturn,
      );
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'graphql',
      });
      expect(
        delegate.getContextErrorString(error, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(error, ctxMock, startTime, options);
    });
    it(logProperly('ws'), () => {
      const spy = spyFactory(ws, 'getErrorContext').mockReturnValueOnce(
        parserReturn,
      );
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'ws',
      });
      expect(
        delegate.getContextErrorString(error, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(error, ctxMock, startTime, options);
    });
    it(logProperly('rpc'), () => {
      const spy = spyFactory(rpc, 'getErrorContext').mockReturnValueOnce(
        parserReturn,
      );
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'rpc',
      });
      expect(
        delegate.getContextErrorString(error, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(error, ctxMock, startTime, options);
    });
  });
  describe('setRequestId', () => {
    const requestId = '1598961763272766';
    it(setRequestIdProperly('rpc'), () => {
      const spy = spyFactory(rpc, 'setRequestId');
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'rpc',
      });
      delegate.setRequestId(ctxMock, requestId);
      expect(spy).toBeCalledWith(ctxMock, requestId);
    });
    it(setRequestIdProperly('http'), () => {
      const spy = spyFactory(http, 'setRequestId');
      const ctxMock = createMock<ExecutionContext>(
        httpContext as Partial<ExecutionContext>,
      );
      delegate.setRequestId(ctxMock, requestId);
      expect(spy).toBeCalledWith(ctxMock, requestId);
    });
    it(setRequestIdProperly('ws'), () => {
      const spy = spyFactory(ws, 'setRequestId');
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'ws',
      });
      delegate.setRequestId(ctxMock, requestId);
      expect(spy).toBeCalledWith(ctxMock, requestId);
    });
    it(setRequestIdProperly('gql'), () => {
      const spy = spyFactory(gql, 'setRequestId');
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'graphql',
      });
      delegate.setRequestId(ctxMock, requestId);
      expect(spy).toBeCalledWith(ctxMock, requestId);
    });
  });
  describe('useJsonFormat', () => {
    it('should return as JSON instead of string', () => {
      const spy = spyFactory(http, 'getSuccessContext').mockReturnValueOnce(
        parserReturn,
      );
      const ctxMock = createMock<ExecutionContext>(
        httpContext as Partial<ExecutionContext>,
      );
      expect(
        delegate.getContextSuccessString('data', ctxMock, startTime, {
          json: true,
          color: false,
        }),
      ).toEqual(parserReturn);
      expect(spy).toBeCalledWith(
        Buffer.from(JSON.stringify('data')).byteLength,
        ctxMock,
        startTime,
        {
          json: true,
          color: false,
        },
      );
    });
  });
  describe('no data', () => {
    it('should replace no data with an empty string', () => {
      const spy = spyFactory(http, 'getSuccessContext').mockReturnValueOnce({
        callerAddress: '127.0.0.1',
        callPoint: '/',
        contentLength: 0,
        responseTime: 2,
        method: 'GET',
        protocol: 'HTTP/1.1',
        status: '200',
      });
      const ctxMock = createMock<ExecutionContext>(
        httpContext as Partial<ExecutionContext>,
      );
      expect(
        delegate.getContextSuccessString(null, ctxMock, startTime, options),
      ).toBe('127.0.0.1 - GET / HTTP/1.1 200 2ms - 0');
      expect(spy).toBeCalledWith(0, ctxMock, startTime, options);
    });
  });
});
