import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, Observer } from 'rxjs';
import { OgmaInterceptorOptions } from '../interfaces/ogma-options.interface';
import { OgmaInterceptor } from './ogma.interceptor';

process.stdout.hasColors = () => true;

const data = 'some sort of data';
const ip = '127.0.0.1';
const method = 'GET';
const url = '/';
const time = '50 ms';

function mockExecContext(code: number, type: string = 'http') {
  return createMock<ExecutionContext>({
    switchToHttp: () => ({
      getRequest: jest.fn(),
      getResponse: () => ({
        statusCode: code,
      }),
    }),
    getType: () => type,
  });
}

describe.each([
  {
    format: 'dev' as 'dev',
  },
  {
    format: 'prod' as 'prod',
  },
])(
  'OgmaInterceptor interceptor options %j',
  (interceptorOptions: OgmaInterceptorOptions) => {
    describe.each([[true], [false]])(
      'json and color %s',
      (ogmaOption: boolean) => {
        let interceptor: OgmaInterceptor;
        let ogmaMock: {
          info: jest.Mock;
          ogma: {
            options: object;
          };
        };

        beforeEach(() => {
          ogmaMock = {
            info: jest.fn(),
            ogma: {
              options: {
                json: ogmaOption,
                color: !ogmaOption,
              },
            },
          };
          interceptor = new OgmaInterceptor(
            interceptorOptions,
            ogmaMock as any,
          );
          Date.now = jest.fn().mockReturnValue(50).mockReturnValueOnce(0);
        });

        afterEach(() => {
          ogmaMock.info.mockReset();
        });

        describe.each([
          // express req
          {
            ips: ip,
            method,
            httpVersionMajor: 1,
            httpVersionMinor: 1,
            url,
          },
          // fastify req
          {
            ip,
            raw: {
              method,
              httpVersionMajor: 1,
              httpVersionMinor: 1,
              url,
            },
          },
        ])('req options %j', (reqOptions) => {
          describe.each([200, 300, 400, 500, 100])(
            'res options %j',
            (resOptions: number) => {
              it(
                'should log for the ' +
                  interceptorOptions.format +
                  ' format ' +
                  (reqOptions.raw ? 'Fastify' : 'Express'),
                () => {
                  interceptor.log(
                    data,
                    createMock<ExecutionContext>({
                      switchToHttp: () => ({
                        getRequest: () => reqOptions,
                        getResponse: () =>
                          reqOptions.raw
                            ? { res: { statusCode: resOptions } }
                            : { statusCode: resOptions },
                      }),
                      getClass: () => ({ name: 'TestClass' }),
                      getHandler: () => ({ name: 'TestHandler' }),
                    }),
                    Date.now(),
                  );
                  expect(ogmaMock.info).toBeCalledTimes(1);
                  let logFormat: string | object = '';
                  if (interceptorOptions.format === 'dev') {
                    // json format
                    if (ogmaOption) {
                      logFormat = {
                        method,
                        url,
                        status: resOptions,
                        'Content-Length': Buffer.byteLength(
                          JSON.stringify(data),
                        ),
                        'Response-Time': time,
                      };
                    } else {
                      logFormat = `${method} ${url} ${(interceptor as any).statusCodeColor(
                        resOptions,
                      )} ${time} - ${Buffer.byteLength(JSON.stringify(data))}`;
                    }
                  } else {
                    // json format
                    if (ogmaOption) {
                      logFormat = {
                        'Remote-Address': ip,
                        method,
                        url,
                        httpVersion: '1.1',
                        status: resOptions,
                        'Response-Time': time,
                        'Content-Length': Buffer.byteLength(
                          JSON.stringify(data),
                        ),
                      };
                    } else {
                      logFormat = `${ip} - ${method} ${url} HTTP/1.1 ${(interceptor as any).statusCodeColor(
                        resOptions,
                      )} ${time} - ${Buffer.byteLength(JSON.stringify(data))}`;
                    }
                  }
                  expect(ogmaMock.info).toBeCalledWith(
                    logFormat,
                    'TestClass-TestHandler',
                  );
                },
              );
            },
          );
        });
      },
    );
  },
);
describe('OgmaInterceptor with no color', () => {
  it('should be able to log without color', () => {
    Date.now = jest.fn().mockReturnValue(50).mockReturnValueOnce(0);
    const infoMock = jest.fn();
    const interceptor = new OgmaInterceptor({ format: 'dev' }, {
      info: infoMock,
      ogma: { options: { color: false } },
    } as any);
    interceptor.log(
      data,
      createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            ip,
            method,
            url,
          }),
          getResponse: () => ({
            statusCode: 200,
          }),
        }),
        getClass: () => ({ name: 'TestClass' }),
        getHandler: () => ({ name: 'TestHandler' }),
      }),
      Date.now(),
    );
    expect(infoMock).toBeCalledTimes(1);
    expect(infoMock).toBeCalledWith(
      `${method} ${url} 200 ${time} - ${Buffer.byteLength(
        JSON.stringify(data),
      )}`,
      'TestClass-TestHandler',
    );
  });
});
describe('OgmaInterceptor with getRequest and getResponse options', () => {
  it('should run the getRequest and getResponse functions', () => {
    Date.now = jest.fn().mockReturnValue(50).mockReturnValueOnce(0);
    const ogmaOptions = {
      format: 'dev' as const,
      getRequest: jest
        .fn()
        .mockImplementation((context: ExecutionContext) =>
          context.switchToHttp().getRequest(),
        ),
      getResponse: jest
        .fn()
        .mockImplementation((context: ExecutionContext) =>
          context.switchToHttp().getResponse(),
        ),
    };
    const interceptor = new OgmaInterceptor(ogmaOptions, {
      info: jest.fn(),
      ogma: { options: { color: true, json: false } },
    } as any);
    interceptor.log(data, createMock<ExecutionContext>(), Date.now());
    expect(ogmaOptions.getRequest).toBeCalledTimes(1);
    expect(ogmaOptions.getResponse).toBeCalledTimes(1);
  });
});
describe('OgmaInterceptor shouldLog', () => {
  const ogmaOptions = { ogma: { options: { color: true, json: false } } };
  it.each([
    {
      skip: jest.fn((req: any, res: any) => res.statusCode === 200),
      context: mockExecContext(200),
      log: false,
    },
    {
      skip: jest.fn((req: any, res: any) => res.statusCode === 300),
      context: mockExecContext(200),
      log: true,
    },
    {
      context: mockExecContext(200, 'ws'),
      log: false,
    },
    {
      context: mockExecContext(200),
      log: true,
    },
  ])('should try to log based on options %j', (options) => {
    const interceptorOptions = {
      skip: options.skip,
    };
    const interceptor = new OgmaInterceptor(interceptorOptions, {
      info: jest.fn(),
      ...ogmaOptions,
    } as any);
    expect(interceptor.shouldLog(options.context)).toBe(options.log);
    if (options.skip) {
      expect(options.skip).toBeCalledTimes(1);
    }
  });
});
describe('OgmaInterceptor testing intercept', () => {
  const context = createMock<ExecutionContext>({
    switchToHttp: () => ({
      getRequest: () => createMock<Request>(),
      getResponse: () =>
        createMock<Response>({
          statusCode: 400,
        }),
    }),
    getType: () => 'http',
  });
  const ogmaOptions = {
    info: jest.fn(),
    ogma: { options: { color: true, json: false } },
  };
  describe.each([
    {
      skip: (request: Request, res: Response) => res.statusCode === 400,
    },
    {},
  ])('with option %j', (skipOption) => {
    let interceptorOptions: OgmaInterceptorOptions;
    let interceptor: OgmaInterceptor;
    beforeEach(() => {
      interceptorOptions = { ...skipOption };
      interceptor = new OgmaInterceptor(interceptorOptions, {
        ...ogmaOptions,
      } as any);
    });
    afterEach(() => {
      ogmaOptions.info.mockReset();
    });
    it(
      'should intercept the error and ' +
        (skipOption.skip ? 'not ' : '') +
        'log it',
      (done) => {
        const observer = Observable.create((obs: Observer<any>) => {
          return obs.error(new Error('observer error'));
        });
        interceptor.intercept(context, { handle: () => observer }).subscribe({
          error: (err) => {
            expect(err.message).toBe('observer error');
            if (!skipOption.skip) {
              expect(ogmaOptions.info).toBeCalledTimes(1);
            }
            done();
          },
        });
      },
    );
    it.each([undefined, data])(
      'should intercept the response and log it',
      (value: string | undefined, done: any) => {
        const observer = Observable.create((obs: Observer<any>) => {
          obs.next(value);
          obs.complete();
          return;
        });
        interceptor.intercept(context, { handle: () => observer }).subscribe({
          next: (val) => {
            expect(val).toEqual(value);
          },
          complete: () => {
            if (!skipOption.skip) {
              expect(ogmaOptions.info).toBeCalledTimes(1);
            }
            done();
          },
        });
      },
    );
  });
});
