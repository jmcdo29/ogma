import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { OgmaInterceptor, OgmaService, OgmaSkip } from '../src';
import { DelegatorService } from '../src/interceptor/providers';
import { OGMA_INTERCEPTOR_OPTIONS } from '../src/ogma.constants';

const shouldSkipFor = (type: 'http' | 'ws' | 'gql' | 'rpc'): string =>
  `should skip for no ${type} parser`;

const nullifyOption = (
  type: 'http' | 'ws' | 'gql' | 'rpc',
  interceptor: OgmaInterceptor,
): void => {
  (interceptor as any).options[type] = false;
};

const logMock = jest.fn();

const httpContext = {
  getType: () => 'http',
  getArgs: () => [1, 2, 3],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setRequestId: () => {},
};

describe('OgmaInterceptor', () => {
  let interceptor: OgmaInterceptor;
  let delegator: DelegatorService;
  let ogmaService: OgmaService;
  let reflector: Reflector;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        OgmaInterceptor,
        {
          provide: DelegatorService,
          useValue: {
            getContextSuccessString: () => 'success',
            getContextErrorString: () => 'error',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setRequestId: () => {},
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => false),
          },
        },
        {
          provide: OgmaService,
          useValue: {
            info: logMock,
            ogma: {
              options: {
                color: false,
                json: false,
              },
            },
          },
        },
        {
          provide: OGMA_INTERCEPTOR_OPTIONS,
          useValue: {
            http: true,
          },
        },
      ],
    }).compile();
    delegator = mod.get(DelegatorService);
    interceptor = mod.get(OgmaInterceptor);
    ogmaService = mod.get(OgmaService);
    reflector = mod.get(Reflector);
  });
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
  describe('intercept', () => {
    Date.now = () => 0;
    describe('log data', () => {
      let delegateSpy: jest.SpyInstance;
      const callHandler = { handle: () => of('something') };
      beforeEach(() => {
        delegateSpy = jest.spyOn(delegator, 'getContextSuccessString');
      });
      afterEach(() => {
        delegateSpy.mockClear();
      });
      it('should log data', (done) => {
        const ctxMock = createMock<ExecutionContext>(
          httpContext as Partial<ExecutionContext>,
        );
        interceptor.intercept(ctxMock, callHandler).subscribe({
          next: () => {
            return;
          },
          error: () => {
            throw new Error('Logging Error in data');
          },
          complete: () => {
            expect(delegateSpy).toBeCalledWith('something', ctxMock, 0, {
              color: false,
              json: false,
              http: true,
            });
            done();
          },
        });
      });
      it('should not log data', (done) => {
        jest.spyOn(reflector, 'get').mockReturnValueOnce(true);

        interceptor
          .intercept(createMock<ExecutionContext>(), callHandler)
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              throw new Error('Logging Error in data');
            },
            complete: () => {
              expect(delegateSpy).toBeCalledTimes(0);
              done();
            },
          });
      });
    });
    describe('log error', () => {
      let delegateSpy: jest.SpyInstance;
      const callHandler = { handle: () => throwError(new Error('Big oof')) };
      beforeEach(() => {
        delegateSpy = jest.spyOn(delegator, 'getContextErrorString');
      });
      afterEach(() => {
        delegateSpy.mockClear();
      });
      it('should log error', (done) => {
        const ctxMock = createMock<ExecutionContext>(
          httpContext as Partial<ExecutionContext>,
        );
        interceptor.intercept(ctxMock, callHandler).subscribe({
          next: () => {
            throw new Error('Logging data in error');
          },
          error: () => {
            expect(delegateSpy).toBeCalledWith(
              new Error('Big oof'),
              ctxMock,
              0,
              { json: false, color: false, http: true },
            );
            done();
          },
        });
      });
      it('should not log error', (done) => {
        jest.spyOn(reflector, 'get').mockReturnValueOnce(true);
        interceptor
          .intercept(createMock<ExecutionContext>(), callHandler)
          .subscribe({
            next: () => {
              throw new Error('Logging data in error');
            },
            error: () => {
              expect(delegateSpy).toBeCalledTimes(0);
              done();
            },
          });
      });
    });
  });
  describe('should skip', () => {
    it('should skip for class decoration', () => {
      @OgmaSkip()
      class TestClass {}
      jest.spyOn(reflector, 'get').mockReturnValueOnce(true);
      const ctxMock = createMock<ExecutionContext>({
        getClass: () => TestClass,
      });
      expect(interceptor.shouldSkip(ctxMock)).toBe(true);
    });
    it('should skip for method decoration', () => {
      class TestClass {
        @OgmaSkip()
        shouldSkip() {
          console.log('skip this');
        }
      }
      const test = new TestClass();
      jest.spyOn(reflector, 'get').mockReturnValueOnce(true);
      const ctxMock = createMock<ExecutionContext>({
        getHandler: () => test.shouldSkip.name,
      });
      expect(interceptor.shouldSkip(ctxMock)).toBe(true);
    });
    it(shouldSkipFor('http'), () => {
      nullifyOption('http', interceptor);
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'http',
      });
      expect(interceptor.shouldSkip(ctxMock)).toBe(true);
    });
    it(shouldSkipFor('gql'), () => {
      nullifyOption('gql', interceptor);
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'graphql',
      });
      expect(interceptor.shouldSkip(ctxMock)).toBe(true);
    });
    it(shouldSkipFor('ws'), () => {
      nullifyOption('ws', interceptor);
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'ws',
      });
      expect(interceptor.shouldSkip(ctxMock)).toBe(true);
    });
    it(shouldSkipFor('rpc'), () => {
      nullifyOption('rpc', interceptor);
      const ctxMock = createMock<ExecutionContext>({
        getType: () => 'rpc',
      });
      expect(interceptor.shouldSkip(ctxMock)).toBe(true);
    });
  });
  describe('log', () => {
    it('should log a value', () => {
      const logSpy = jest.spyOn(ogmaService, 'info');
      const ctxMock = createMock<ExecutionContext>({
        getClass: () => ({
          name: 'className',
        }),
        getHandler: () => ({
          name: 'methodName',
        }),
      });
      interceptor.log('logValue', ctxMock);
      expect(logSpy).toBeCalledWith(
        'logValue',
        'className#methodName',
        undefined,
      );
    });
  });
});
