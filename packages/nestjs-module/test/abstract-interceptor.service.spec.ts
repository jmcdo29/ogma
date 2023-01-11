import { ExecutionContext, HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { style } from '@ogma/styler';
import { spy } from 'hanbi';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

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

const AbstractInterceptorServiceSuite = suite<{ service: TestParser }>(
  'Abstract Interceptor Service Tests',
  {
    service: undefined,
  },
);
AbstractInterceptorServiceSuite.before(async (context) => {
  const mod = await Test.createTestingModule({
    providers: [TestParser],
  }).compile();
  context.service = mod.get(TestParser);
  process.stdout.getColorDepth = () => 8;
});
for (const { color, status } of [
  { color: 'green', status: 200 },
  { color: 'cyan', status: 300 },
  { color: 'yellow', status: 400 },
  { color: 'red', status: 500 },
  { color: 'white', status: 600 },
]) {
  AbstractInterceptorServiceSuite(colorStatus(color, status), ({ service }) => {
    is(service.getColoredStatus(status), style[color]().apply(status));
  });
}

AbstractInterceptorServiceSuite('It should get an error context object', ({ service }) => {
  Date.now = () => 1;

  const ctxMock: ExecutionContext = {
    getClass: spy().handler,
    getHandler: spy().handler,
    getArgByIndex: spy().handler,
    getArgs: spy().handler,
    getType: spy().handler,
    switchToHttp: spy().handler,
    switchToRpc: spy().handler,
    switchToWs: spy().handler,
  };
  equal(service.getErrorContext(new Error(), ctxMock, 0, { json: false, color: false }), {
    callerAddress: 'ip',
    callPoint: 'point',
    status: '500',
    contentLength: 2,
    responseTime: 1,
    protocol: 'protocol',
    method: 'method',
    meta: undefined,
  });
});

AbstractInterceptorServiceSuite.run();
