import { Test, TestingModule } from '@nestjs/testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';

import { NoopInterceptorService } from '../src/interceptor/providers/noop-interceptor.service';

const NoopInterceptorServiceSuite = suite<{ service: NoopInterceptorService }>(
  'NoopInterceptorService',
  { service: undefined },
);
NoopInterceptorServiceSuite.before(async (context) => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [NoopInterceptorService],
  }).compile();

  context.service = module.get<NoopInterceptorService>(NoopInterceptorService);
});
NoopInterceptorServiceSuite('It should return a success log object', ({ service }) => {
  Date.now = () => 133;
  equal(service.getSuccessContext(Array(149).fill('o').join(''), {} as any, 50, {} as any), {
    callerAddress: 'caller ip',
    method: 'method',
    callPoint: 'call point',
    responseTime: 83,
    contentLength: 151,
    protocol: 'protocol',
    status: 'status',
    meta: undefined,
  });
});

NoopInterceptorServiceSuite.run();
