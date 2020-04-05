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

const abstractInterceptorServiceMock = () =>
  createMock<AbstractInterceptorService>();

const spyFactory = (
  parser: AbstractInterceptorService,
  method: 'getSuccessContext' | 'getErrorContext',
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

const gqlContext = {
  getType: () => 'http',
  getArgs: () => [1, 2, 3, 4],
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
      const ctxMock = createMock<ExecutionContext>(httpContext);
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
      const ctxMock = createMock<ExecutionContext>(gqlContext);
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
      const ctxMock = createMock<ExecutionContext>(httpContext);
      expect(
        delegate.getContextErrorString(error, ctxMock, startTime, options),
      ).toBe(parsedString);
      expect(spy).toBeCalledWith(error, ctxMock, startTime, options);
    });
    it(logProperly('gql'), () => {
      const spy = spyFactory(gql, 'getErrorContext').mockReturnValueOnce(
        parserReturn,
      );
      const ctxMock = createMock<ExecutionContext>(gqlContext);
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
  describe('useJsonFormat', () => {
    it('should return as JSON instead of string', () => {
      const spy = spyFactory(http, 'getSuccessContext').mockReturnValueOnce(
        parserReturn,
      );
      const ctxMock = createMock<ExecutionContext>(httpContext);
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
      const ctxMock = createMock<ExecutionContext>(httpContext);
      expect(
        delegate.getContextSuccessString(null, ctxMock, startTime, options),
      ).toBe('127.0.0.1 - GET / HTTP/1.1 200 2ms - 0');
      expect(spy).toBeCalledWith(0, ctxMock, startTime, options);
    });
  });
});
