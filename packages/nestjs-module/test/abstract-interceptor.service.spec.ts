import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { AbstractInterceptorService } from '../src/interceptor/providers/abstract-interceptor.service';

class TestParser extends AbstractInterceptorService {
  getStatus(context: ExecutionContext, inColor: boolean, error?: Error | HttpException): string {
    const status = error ? 500 : 200;
    return inColor ? this.wrapInColor(status) : status.toString();
  }

  getCallPoint() {
    return 'point';
  }

  getCallerIp() {
    return 'ip';
  }

  getMethod() {
    return 'method';
  }

  getProtocol() {
    return 'protocol';
  }

  getColoredStatus(status: number) {
    return this.wrapInColor(status);
  }

  setRequestId(): void {
    return;
  }
}

const colorStatus = (colorString: string, status: number) =>
  `should return ${colorString} for status ${status}`;

describe('AbstractInterceptorService', () => {
  let service: TestParser;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [TestParser],
    }).compile();
    service = mod.get(TestParser);
    process.stdout.getColorDepth = () => 8;
  });
  describe('get colored status', () => {
    it(colorStatus('green', 200), () => {
      expect(service.getColoredStatus(200)).toBe(style.green.apply(200));
    });
    it(colorStatus('cyan', 300), () => {
      expect(service.getColoredStatus(300)).toBe(style.cyan.apply(300));
    });
    it(colorStatus('yellow', 400), () => {
      expect(service.getColoredStatus(400)).toBe(style.yellow.apply(400));
    });
    it(colorStatus('red', 500), () => {
      expect(service.getColoredStatus(500)).toBe(style.red.apply(500));
    });
    it(colorStatus('white', 600), () => {
      expect(service.getColoredStatus(600)).toBe(style.white.apply(600));
    });
  });
  describe('getErrorContext', () => {
    it('should get an error context object', () => {
      Date.now = () => 1;
      const ctxMock = createMock<ExecutionContext>();
      expect(
        service.getErrorContext(new Error(), ctxMock, 0, {
          json: false,
          color: false,
        }),
      ).toEqual({
        callerAddress: 'ip',
        callPoint: 'point',
        status: '500',
        contentLength: 2,
        responseTime: 1,
        protocol: 'protocol',
        method: 'method',
      });
    });
  });
});
