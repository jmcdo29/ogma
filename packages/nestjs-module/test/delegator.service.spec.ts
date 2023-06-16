import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { spy, stubMethod } from 'hanbi';
import { suite } from 'uvu';
import { equal, ok } from 'uvu/assert';

import { LogObject } from '../src/interceptor/interfaces/log.interface';
import {
  AbstractInterceptorService,
  DelegatorService,
  GqlInterceptorService,
  HttpInterceptorService,
  RpcInterceptorService,
  WebsocketInterceptorService,
} from '../src/interceptor/providers';

const logProperly = (type: 'http' | 'gql' | 'ws' | 'rpc') => `should log properly for ${type}`;
const setRequestIdProperly = (type: 'http' | 'gql' | 'ws' | 'rpc') =>
  `should set request id properly for ${type}`;

const abstractInterceptorServiceMock = () => ({
  getSuccessContext: spy().handler,
  getErrorContext: spy().handler,
});

const parserReturn: LogObject = {
  callPoint: '/',
  callerAddress: '127.0.0.1',
  method: 'GET',
  protocol: 'HTTP/1.1',
  status: '200',
  responseTime: 2,
  contentLength: 5,
};

const typeAndContexts = [
  {
    type: 'http',
    ctxMock: {
      getType: () => 'http',
    },
  },
  {
    type: 'ws',
    ctxMock: {
      getType: () => 'ws',
    },
  },
  {
    type: 'gql',
    ctxMock: {
      getType: () => 'graphql',
    },
  },
  {
    type: 'rpc',
    ctxMock: {
      getType: () => 'rpc',
    },
  },
] as const;

const executionMockFactory = (getType: { getType: () => string }): ExecutionContext => ({
  switchToHttp: spy().handler,
  switchToRpc: spy().handler,
  switchToWs: spy().handler,
  getArgByIndex: spy().handler,
  getArgs: spy().handler,
  getClass: spy().handler,
  getHandler: spy().handler,
  getType: getType.getType as any,
});

const parsedString = { log: '127.0.0.1 - GET / HTTP/1.1 200 2ms - 5', meta: undefined };

const DelegatorServiceSuite = suite<{
  delegate: DelegatorService;
  parsers: Record<'http' | 'gql' | 'ws' | 'rpc', AbstractInterceptorService>;
}>('DelegatorService Suite', {
  delegate: undefined,
  parsers: {
    http: undefined,
    gql: undefined,
    ws: undefined,
    rpc: undefined,
  },
});
DelegatorServiceSuite.before(async (context) => {
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
  context.delegate = mod.get(DelegatorService);
  context.parsers.http = mod.get(HttpInterceptorService);
  context.parsers.gql = mod.get(GqlInterceptorService);
  context.parsers.ws = mod.get(WebsocketInterceptorService);
  context.parsers.rpc = mod.get(RpcInterceptorService);
});
for (const method of ['getSuccessContext', 'getErrorContext'] as const) {
  const data = method === 'getSuccessContext' ? 'some data' : new Error('Big oof');
  const startTime = 0;
  const options = {
    color: false,
    json: false,
  };
  for (const { type, ctxMock } of typeAndContexts) {
    DelegatorServiceSuite(`${method} ${logProperly(type)}`, ({ delegate, parsers }) => {
      const fullContextMock = executionMockFactory(ctxMock);
      const parserSpy = stubMethod(parsers[type], method);
      parserSpy.returns(parserReturn);
      const methodName =
        method === 'getSuccessContext' ? 'getContextSuccessString' : 'getContextErrorString';
      equal(delegate[methodName](data, fullContextMock, startTime, options), parsedString);
      ok(parserSpy.calledWith(data, fullContextMock, startTime, options));
    });
  }
}
for (const { type, ctxMock } of typeAndContexts) {
  const requestId = '1598961763272766';
  DelegatorServiceSuite(setRequestIdProperly(type), ({ delegate, parsers }) => {
    const fullContextMock = executionMockFactory(ctxMock);
    const setSpy = stubMethod(parsers[type], 'setRequestId');
    delegate.setRequestId(fullContextMock, requestId);
    ok(setSpy.calledWith(fullContextMock, requestId));
  });
}
DelegatorServiceSuite('It should use JSON format instead of string', ({ delegate, parsers }) => {
  const fullCtxMock = executionMockFactory({ getType: () => 'http' });
  const parseSpy = stubMethod(parsers.http, 'getSuccessContext');
  parseSpy.returns(parserReturn);
  const options = { json: true, color: false };
  equal(delegate.getContextSuccessString('data', fullCtxMock, 0, options), {
    log: parserReturn,
    meta: undefined,
  });
  ok(parseSpy.calledWith('data', fullCtxMock, 0, options));
});
DelegatorServiceSuite('It should replace no data with an empty string', ({ delegate, parsers }) => {
  const fullCtxMock = executionMockFactory({ getType: () => 'http' });
  const parseSpy = stubMethod(parsers.http, 'getSuccessContext');
  parseSpy.returns({ ...parserReturn, contentLength: 0 });
  const options = { json: false, color: false };
  equal(delegate.getContextSuccessString(null, fullCtxMock, 0, options), {
    log: '127.0.0.1 - GET / HTTP/1.1 200 2ms - 0',
    meta: undefined,
  });
  ok(parseSpy.calledWith(null, fullCtxMock, 0, options));
});

// DelegatorServiceSuite.run();
