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
import { delay, of, switchMap, take, throwError, timer } from 'rxjs';
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

  @Log()
  testMethodError() {
    throw new Error('Boom!');
  }

  @Log()
  testAsyncMethodError() {
    return new Promise((_resolve, reject) => setTimeout(() => reject(new Error('Boom!')), 300));
  }

  @Log()
  testMethodErrorRxJs() {
    return timer(200).pipe(
      take(1),
      switchMap(() => throwError(() => new Error('Boom!'))),
    );
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
        application: 'LogDecorator',
        logLevel: 'ALL',
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

LogDecoratorSuite('sync error method log call', ({ testServiceLogSpy, testService }) => {
  try {
    testService.testMethodError();
  } catch {
    is(testServiceLogSpy.callCount, 2);
    is(testServiceLogSpy.firstCall.args[0], 'Start testMethodError');
    match(testServiceLogSpy.lastCall.args[0], /End testMethodError - \d+ms/);
  }
});

LogDecoratorSuite('async error method log call', async ({ testServiceLogSpy, testService }) => {
  await testService.testAsyncMethodError().catch(() => {
    is(testServiceLogSpy.callCount, 2);
    is(testServiceLogSpy.firstCall.args[0], 'Start testAsyncMethodError');
    match(testServiceLogSpy.lastCall.args[0], /End testAsyncMethodError - \d+ms/);
  });
});

LogDecoratorSuite('rxjs error log call', async ({ testServiceLogSpy, testService }) => {
  let wasAsserted = false;
  return new Promise((resolve, reject) => {
    testService.testMethodErrorRxJs().subscribe({
      error: () => {
        is(testServiceLogSpy.callCount, 2);
        is(testServiceLogSpy.firstCall.args[0], 'Start testMethodErrorRxJs');
        match(testServiceLogSpy.lastCall.args[0], /End testMethodErrorRxJs - 2\d{2}ms/);
        wasAsserted = true;
        resolve();
      },
      complete: () => {
        is(wasAsserted, true, 'The error hook should have ran for the observable');
        if (wasAsserted) {
          resolve();
        } else {
          reject();
        }
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
