import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  createProviderToken,
  Log,
  LogAll,
  OgmaLogger,
  OgmaModule,
  OgmaService,
} from '@ogma/nestjs-module';
import { Stub, stubMethod } from 'hanbi';
import { delay, of } from 'rxjs';
import { suite } from 'uvu';
import { is, match } from 'uvu/assert';

@Injectable()
class TestService {
  constructor(@OgmaLogger('TestService') private readonly logger: OgmaService) {}

  @Log()
  testMethodSync() {
    return 'hello';
  }

  @Log()
  async testMethodPromiseThreeSecs() {
    return new Promise((resolve) => setTimeout(() => resolve('hello'), 300));
  }

  @Log()
  testMethodRxJs() {
    return of('hello').pipe(delay(200));
  }
}

@Injectable()
@LogAll('ogma')
class TestLogAllService {
  constructor(@OgmaLogger('TestLogAllService') private readonly ogma: OgmaService) {}

  method1() {
    return 'hello';
  }

  method2() {
    return 'hello';
  }
}

const LogDecoratorSuite = suite<{
  testServiceLogSpy: Stub<OgmaService['fine']>;
  testLogAllLogSpy: Stub<OgmaService['fine']>;
  testService: TestService;
  testLogAllService: TestLogAllService;
}>('Log Decorator Suite', {
  testLogAllLogSpy: undefined,
  testServiceLogSpy: undefined,
  testService: undefined,
  testLogAllService: undefined,
});
LogDecoratorSuite.before(async (context) => {
  const mod = await Test.createTestingModule({
    imports: [
      OgmaModule.forRoot({
        service: {
          application: 'LogDecorator',
          logLevel: 'ALL',
        },
      }),
      OgmaModule.forFeatures(['TestService', 'TestLogAllService']),
    ],
    providers: [TestService, TestLogAllService],
  }).compile();
  const serviceLogger = mod.get(createProviderToken('TestService'));
  const logAllLogger = mod.get(createProviderToken('TestLogAllService'));
  context.testService = mod.get(TestService);
  context.testLogAllService = mod.get(TestLogAllService);
  context.testServiceLogSpy = stubMethod(serviceLogger, 'trace');
  context.testLogAllLogSpy = stubMethod(logAllLogger, 'trace');
  // context.testServiceLogSpy.passThrough();
  // context.testLogAllLogSpy.passThrough()
});
LogDecoratorSuite.after.each(({ testLogAllLogSpy, testServiceLogSpy }) => {
  testLogAllLogSpy.reset();
  testServiceLogSpy.reset();
});

LogDecoratorSuite('sync log call', ({ testServiceLogSpy, testService }) => {
  testService.testMethodSync();
  is(testServiceLogSpy.callCount, 2);
  is(testServiceLogSpy.firstCall.args[0], 'Start testMethodSync');
  match(testServiceLogSpy.lastCall.args[0], /End testMethodSync - \d+ms/);
});
LogDecoratorSuite('async log call', async ({ testServiceLogSpy, testService }) => {
  const res = await testService.testMethodPromiseThreeSecs();
  is(res, 'hello');
  is(testServiceLogSpy.callCount, 2);
  is(testServiceLogSpy.firstCall.args[0], 'Start testMethodPromiseThreeSecs');
  match(testServiceLogSpy.lastCall.args[0], /End testMethodPromiseThreeSecs - 3\d{2}ms/);
});
LogDecoratorSuite('rxjs log call', async ({ testServiceLogSpy, testService }) => {
  return new Promise((resolve, reject) => {
    testService.testMethodRxJs().subscribe({
      error: reject,
      complete: () => {
        is(testServiceLogSpy.callCount, 2);
        is(testServiceLogSpy.firstCall.args[0], 'Start testMethodRxJs');
        match(testServiceLogSpy.lastCall.args[0], /End testMethodRxJs - 2\d{2}ms/);
        resolve();
      },
    });
  });
});

LogDecoratorSuite('LogAll method1', ({ testLogAllLogSpy, testLogAllService }) => {
  is(testLogAllService.method1(), 'hello');
  is(testLogAllLogSpy.callCount, 2);
  is(testLogAllLogSpy.firstCall.args[0], 'Start method1');
  match(testLogAllLogSpy.lastCall.args[0], /End method1 - \d+ms/);
});
LogDecoratorSuite('LogAll method2', ({ testLogAllLogSpy, testLogAllService }) => {
  is(testLogAllService.method2(), 'hello');
  is(testLogAllLogSpy.callCount, 2);
  is(testLogAllLogSpy.firstCall.args[0], 'Start method2');
  match(testLogAllLogSpy.lastCall.args[0], /End method2 - \d+ms/);
});

LogDecoratorSuite.run();
