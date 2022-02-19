import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy, stubMethod } from 'hanbi';
import { suite } from 'uvu';
import { equal, is, ok } from 'uvu/assert';
import { ExpressParser } from '../src';

const resMock = (status: number) => ({
  getResponse: () => ({
    statusCode: status,
  }),
});

const defaultResNext = {
  getNext: spy().handler,
  getResponse: spy().handler,
};

const ctxMockFactory = (partial: Partial<ExecutionContext>): ExecutionContext => ({
  getArgByIndex: spy().handler,
  getArgs: spy().handler,
  getClass: spy().handler,
  getHandler: spy().handler,
  getType: () => 'http' as any,
  switchToWs: spy().handler,
  switchToRpc: spy().handler,
  switchToHttp: spy().handler,
  ...partial,
});

const ExpressParserSuite =
  suite<{ parser: ExpressParser; reflector: Reflector }>('Express Parser Suite');
ExpressParserSuite.before(async (context) => {
  const mod = await Test.createTestingModule({
    providers: [
      ExpressParser,
      {
        provide: Reflector,
        useValue: {
          get: spy().handler,
        },
      },
    ],
  }).compile();
  context.parser = mod.get(ExpressParser);
  context.reflector = mod.get(Reflector);
});
ExpressParserSuite('Should create the instance', ({ parser }) => {
  ok(parser);
});
ExpressParserSuite('Should get the ip from the req.ip', ({ parser }) => {
  const ctx = ctxMockFactory({
    switchToHttp: () => ({
      ...defaultResNext,
      getRequest: () =>
        ({
          ip: '127.0.0.1',
          ips: [],
        } as any),
    }),
  });
  is(parser.getCallerIp(ctx), '127.0.0.1');
});
ExpressParserSuite('Should get the ips from the req.ips', ({ parser }) => {
  const ctx = ctxMockFactory({
    switchToHttp: () => ({
      ...defaultResNext,
      getRequest: () =>
        ({
          ip: '127.0.0.1',
          ips: ['127.0.0.1', '0.0.0.0'],
        } as any),
    }),
  });
  is(parser.getCallerIp(ctx), '127.0.0.1 0.0.0.0');
});
ExpressParserSuite('Should get the url from req.originalUrl', ({ parser }) => {
  const ctx = ctxMockFactory({
    switchToHttp: () => ({
      ...defaultResNext,
      getRequest: () =>
        ({
          originalUrl: '/api/auth/callback?token=123abc',
        } as any),
    }),
  });
  is(parser.getCallPoint(ctx), '/api/auth/callback?token=123abc');
});
for (const { status, ctxMockVal, exception } of [
  {
    status: 200,
    ctxMockVal: {
      switchToHttp: () => resMock(200),
    },
    exception: null,
  },
  {
    status: 400,
    ctxMockVal: {},
    exception: new BadRequestException(),
  },
  {
    status: 500,
    ctxMockVal: {},
    exception: new Error(),
  },
]) {
  ExpressParserSuite(`Should get the status for ${status}`, ({ parser }) => {
    const ctxMock = ctxMockFactory({
      switchToHttp: () => ({
        getResponse: () => ({}),
      }),
      ...ctxMockVal,
    } as any);
    is(parser.getStatus(ctxMock, false, exception), status.toString());
  });
}
ExpressParserSuite('should get the status from the reflector', ({ reflector, parser }) => {
  const reflectorSpy = stubMethod(reflector, 'get');
  reflectorSpy.returns(201);
  const sampleObj = {
    func: () => '',
  };
  const ctxMock = ctxMockFactory({
    switchToHttp: () => ({
      getResponse: () => ({}),
    }),
    getHandler: () => sampleObj.func,
  } as any);
  is(parser.getStatus(ctxMock, false), '201');
  equal(reflectorSpy.firstCall.args, [HTTP_CODE_METADATA, sampleObj.func]);
  reflectorSpy.restore();
});
ExpressParserSuite('it should get the status in color', ({ parser }) => {
  const ctxMock = ctxMockFactory({
    switchToHttp: () => resMock(200) as any,
  });
  is(parser.getStatus(ctxMock, true), style.green.apply(200));
});
ExpressParserSuite('Should get the status from req.method', ({ parser }) => {
  const ctxMock = ctxMockFactory({
    switchToHttp: () => ({
      ...defaultResNext,
      getRequest: () =>
        ({
          method: 'POST',
        } as any),
    }),
  });
  is(parser.getMethod(ctxMock), 'POST');
});
ExpressParserSuite('Should use the default method if one does not exist', ({ parser }) => {
  const ctxMock = ctxMockFactory({
    switchToHttp: () =>
      ({
        getRequest: () => ({}),
      } as any),
  });
  is(parser.getMethod(ctxMock), 'GET');
});
ExpressParserSuite('should get the protocol', ({ parser }) => {
  const ctxMock = ctxMockFactory({
    switchToHttp: () =>
      ({
        ...defaultResNext,
        getRequest: () => ({
          httpVersionMajor: 1,
          httpVersionMinor: 1,
        }),
      } as any),
  });
  is(parser.getProtocol(ctxMock), 'HTTP/1.1');
});
ExpressParserSuite.run();
