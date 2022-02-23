import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy, stubMethod } from 'hanbi';
import { suite } from 'uvu';
import { equal, is, ok } from 'uvu/assert';

import { FastifyParser } from '../src';

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

const FastifyParserSuite =
  suite<{ parser: FastifyParser; reflector: Reflector }>('Fastify Parser Suite');
FastifyParserSuite.before(async (context) => {
  const mod = await Test.createTestingModule({
    providers: [
      FastifyParser,
      {
        provide: Reflector,
        useValue: {
          get: spy().handler,
        },
      },
    ],
  }).compile();
  context.parser = mod.get(FastifyParser);
  context.reflector = mod.get(Reflector);
});
FastifyParserSuite('Should create the instance', ({ parser }) => {
  ok(parser);
});
FastifyParserSuite('Should get the ip from the req.ip', ({ parser }) => {
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
FastifyParserSuite('Should get the ips from the req.ips', ({ parser }) => {
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
FastifyParserSuite('Should get the url from req.originalUrl', ({ parser }) => {
  const ctx = ctxMockFactory({
    switchToHttp: () => ({
      ...defaultResNext,
      getRequest: () =>
        ({
          raw: {
            url: '/api/auth/callback?token=123abc',
          },
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
  FastifyParserSuite(`Should get the status for ${status}`, ({ parser }) => {
    const ctxMock = ctxMockFactory({
      switchToHttp: () => ({
        getResponse: () => ({}),
      }),
      ...ctxMockVal,
    } as any);
    is(parser.getStatus(ctxMock, false, exception), status.toString());
  });
}
FastifyParserSuite('should get the status from the reflector', ({ reflector, parser }) => {
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
FastifyParserSuite('it should get the status in color', ({ parser }) => {
  const ctxMock = ctxMockFactory({
    switchToHttp: () => resMock(200) as any,
  });
  is(parser.getStatus(ctxMock, true), style.green.apply(200));
});
FastifyParserSuite('Should get the status from req.method', ({ parser }) => {
  const ctxMock = ctxMockFactory({
    switchToHttp: () => ({
      ...defaultResNext,
      getRequest: () =>
        ({
          raw: {
            method: 'POST',
          },
        } as any),
    }),
  });
  is(parser.getMethod(ctxMock), 'POST');
});
FastifyParserSuite('Should use the default method if one does not exist', ({ parser }) => {
  const ctxMock = ctxMockFactory({
    switchToHttp: () =>
      ({
        getRequest: () => ({ raw: {} }),
      } as any),
  });
  is(parser.getMethod(ctxMock), 'GET');
});
FastifyParserSuite('should get the protocol', ({ parser }) => {
  const ctxMock = ctxMockFactory({
    switchToHttp: () =>
      ({
        ...defaultResNext,
        getRequest: () => ({
          raw: {
            httpVersionMajor: 1,
            httpVersionMinor: 1,
          },
        }),
      } as any),
  });
  is(parser.getProtocol(ctxMock), 'HTTP/1.1');
});
FastifyParserSuite.run();

/* describe('FastifyParser', () => {
  let parser: FastifyParser;
  let reflector: Reflector;
  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        FastifyParser,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => ''),
          },
        },
      ],
    }).compile();
    parser = mod.get(FastifyParser);
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
            raw: {
              url: '/api/auth/callback?token=123abc',
            },
          }),
        }),
      });
      expect(parser.getCallPoint(ctxMock)).toBe('/api/auth/callback?token=123abc');
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
      expect(parser.getStatus(ctxMock, false, new BadRequestException())).toBe('400');
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
      expect(reflector.get).toBeCalledWith(HTTP_CODE_METADATA, sampleObject.func());
    });
    it('should get the status in color', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => resMock(200),
      });
      expect(parser.getStatus(ctxMock, true)).toBe(style.green.apply(200));
    });
  });

  describe('getMethod', () => {
    it('should get the method from the request', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            raw: {
              method: 'POST',
            },
          }),
        }),
      });
      expect(parser.getMethod(ctxMock)).toBe('POST');
    });
    it('should return GET by default', () => {
      const ctxMock = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            raw: {},
          }),
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
            raw: {
              httpVersionMajor: 1,
              httpVersionMinor: 1,
            },
          }),
        }),
      });
      expect(parser.getProtocol(ctxMock)).toBe('HTTP/1.1');
    });
  });
}); */
