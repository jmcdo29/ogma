import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { spy, Stub, stubMethod } from 'hanbi';
import { of, throwError } from 'rxjs';
import { suite } from 'uvu';
import { equal, is, ok } from 'uvu/assert';

import { OgmaInterceptor, OgmaService, OgmaSkip } from '../src';
import { DelegatorService } from '../src/interceptor/providers';

const noop = () => {
  /* no-op */
};
const createCtxMock = (partial: Partial<ExecutionContext>): ExecutionContext => ({
  getArgByIndex: spy().handler,
  getArgs: spy().handler,
  getClass: () =>
    ({
      name: 'something',
    } as any),
  getHandler: () =>
    ({
      name: 'something',
    } as any),
  getType: spy().handler,
  switchToHttp: spy().handler,
  switchToRpc: spy().handler,
  switchToWs: spy().handler,
  ...partial,
});

const httpContext: Partial<ExecutionContext> = {
  getType: () => 'http',
  getArgs: () => [1, 2, 3],
  setRequestId: noop,
} as any;

const OgmaInterceptorSuite = suite<{
  interceptor: OgmaInterceptor;
  delegator: DelegatorService;
  logMock: Stub<OgmaService['info']>;
  reflectorGetSpy: Stub<Reflector['get']>;
}>('Ogma Interceptor Suite', {
  interceptor: undefined,
  delegator: undefined,
  logMock: spy(),
  reflectorGetSpy: spy(),
});
OgmaInterceptorSuite.before(async (context) => {
  const mod = await Test.createTestingModule({
    providers: [
      OgmaInterceptor,
      {
        provide: DelegatorService,
        useValue: {
          getContextSuccessString: () => ({
            log: 'success',
          }),
          getContextErrorString: () => ({
            log: 'error',
          }),
          setRequestId: noop,
        },
      },
      {
        provide: Reflector,
        useValue: {
          get: context.reflectorGetSpy.handler,
        },
      },
      {
        provide: OgmaService,
        useValue: {
          info: context.logMock.handler,
          ogma: {
            options: {
              color: false,
              json: false,
            },
          },
        },
      },
    ],
  }).compile();
  context.delegator = mod.get(DelegatorService);
  context.interceptor = mod.get(OgmaInterceptor);
});
OgmaInterceptorSuite.before.each(({ reflectorGetSpy }) => {
  Date.now = () => 0;
  reflectorGetSpy.returns(false);
});
OgmaInterceptorSuite.after.each(({ reflectorGetSpy, logMock }) => {
  reflectorGetSpy.reset();
  logMock.reset();
});
OgmaInterceptorSuite('It should be defined', ({ interceptor }) => {
  ok(interceptor);
});
const callHandler = { handle: () => of('something') };
OgmaInterceptorSuite(
  'should log data in intercept',
  async ({ interceptor, delegator, logMock }) => {
    return new Promise<void>((resolve, reject) => {
      const delegateSpy = stubMethod(delegator, 'getContextSuccessString');
      delegateSpy.returns({ log: 'success' });
      const ctxMock = createCtxMock(httpContext);
      interceptor.intercept(ctxMock, callHandler).subscribe({
        error: reject,
        complete: () => {
          is(delegateSpy.callCount, 1);
          equal(delegateSpy.firstCall.args, [
            'something',
            ctxMock,
            0,
            {
              color: false,
              json: false,
            },
          ]);
          is(logMock.callCount, 1);
          resolve();
        },
      });
    });
  },
);
OgmaInterceptorSuite(
  'Should not log the data',
  async ({ reflectorGetSpy, interceptor, logMock, delegator }) => {
    return new Promise<void>((resolve, reject) => {
      reflectorGetSpy.returns(true);
      const delegateSpy = stubMethod(delegator, 'getContextSuccessString');
      const ctxMock = createCtxMock(httpContext);
      interceptor.intercept(ctxMock, callHandler).subscribe({
        error: reject,
        complete: () => {
          is(delegateSpy.callCount, 0);
          is(logMock.callCount, 0);
          resolve();
        },
      });
    });
  },
);
OgmaInterceptorSuite(
  'should log the data and meta',
  async ({ delegator, interceptor, logMock }) => {
    return new Promise<void>((resolve, reject) => {
      const delegateSpy = stubMethod(delegator, 'getContextSuccessString');
      delegateSpy.returns({
        log: 'success',
        meta: { key: 'value' },
      });
      const ctxMock = createCtxMock(httpContext);
      interceptor.intercept(ctxMock, callHandler).subscribe({
        error: reject,
        complete: () => {
          equal(delegateSpy.firstCall.args, [
            'something',
            ctxMock,
            0,
            {
              color: false,
              json: false,
            },
          ]);
          is(logMock.callCount, 2);
          resolve();
        },
      });
    });
  },
);
const errorCallHandler = { handle: () => throwError(() => new Error('Big oof')) };
OgmaInterceptorSuite('should log the error', async ({ interceptor, logMock, delegator }) => {
  return new Promise<void>((resolve, reject) => {
    const ctxMock = createCtxMock(httpContext);
    const delegateSpy = stubMethod(delegator, 'getContextErrorString');
    delegateSpy.returns({
      log: 'error',
    });
    interceptor.intercept(ctxMock, errorCallHandler).subscribe({
      next: reject,
      error: () => {
        is(delegateSpy.callCount, 1);
        equal(delegateSpy.firstCall.args, [
          new Error('Big oof'),
          ctxMock,
          0,
          {
            json: false,
            color: false,
          },
        ]);
        is(logMock.callCount, 1);
        resolve();
      },
    });
  });
});
OgmaInterceptorSuite(
  'should not log the error',
  async ({ interceptor, logMock, delegator, reflectorGetSpy }) => {
    return new Promise<void>((resolve, reject) => {
      reflectorGetSpy.returns(true);
      const ctxMock = createCtxMock(httpContext);
      const delegateSpy = stubMethod(delegator, 'getContextErrorString');
      delegateSpy.returns({
        log: 'error',
      });
      interceptor.intercept(ctxMock, errorCallHandler).subscribe({
        next: reject,
        error: () => {
          is(delegateSpy.callCount, 0);
          is(logMock.callCount, 0);
          resolve();
        },
      });
    });
  },
);
OgmaInterceptorSuite(
  'should log the error and the meta',
  async ({ interceptor, logMock, delegator }) => {
    return new Promise<void>((resolve, reject) => {
      const ctxMock = createCtxMock(httpContext);
      const delegateSpy = stubMethod(delegator, 'getContextErrorString');
      delegateSpy.returns({
        log: 'error',
        meta: { key: 'value' },
      });
      interceptor.intercept(ctxMock, errorCallHandler).subscribe({
        next: reject,
        error: () => {
          is(delegateSpy.callCount, 1);
          equal(delegateSpy.firstCall.args, [
            new Error('Big oof'),
            ctxMock,
            0,
            {
              json: false,
              color: false,
            },
          ]);
          is(logMock.callCount, 2);
          resolve();
        },
      });
    });
  },
);
OgmaInterceptorSuite('should skip for class decorator', ({ reflectorGetSpy, interceptor }) => {
  @OgmaSkip()
  class TestClass {}
  reflectorGetSpy.returns(true);
  const ctxMock = createCtxMock({
    getClass: () => TestClass as any,
  });
  ok(interceptor.shouldSkip(ctxMock));
});
OgmaInterceptorSuite('should skip for method decorator', ({ reflectorGetSpy, interceptor }) => {
  class TestClass {
    @OgmaSkip()
    shouldSkip() {
      console.log('skip this');
    }
  }
  const test = new TestClass();
  reflectorGetSpy.returns(true);
  const ctxMock = createCtxMock({
    getHandler: () => test.shouldSkip.name as any,
  });
  ok(interceptor.shouldSkip(ctxMock));
});
OgmaInterceptorSuite('log should log a val', ({ logMock, interceptor }) => {
  const ctxMock = createCtxMock({
    getClass: () => ({ name: 'className' }),
    getHandler: () => ({ name: 'methodName' }),
  } as any);
  interceptor.log('logValue', ctxMock, '1598961763272766');
  equal(logMock.firstCall.args, [
    'logValue',
    { context: 'className#methodName', correlationId: '1598961763272766' },
  ]);
});
OgmaInterceptorSuite.run();
