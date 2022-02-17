import { AppService } from './app.service';
import { Test } from '@nestjs/testing';
import { spy, Stub } from 'hanbi';
import { suite } from 'uvu';
import { equal, ok } from 'uvu/assert';

const AppServiceSuite = suite<{ service: AppService; logSpy: Stub<(message: string) => void> }>(
  'AppService',
  {
    service: undefined,
    logSpy: spy(),
  },
);
AppServiceSuite.before(async (context) => {
  try {
    const modRef = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'OGMA_SERVICE:AppService',
          useValue: {
            log: context.logSpy.handler,
          },
        },
      ],
    }).compile();
    context.service = modRef.get(AppService);
  } catch (err) {
    console.error(err);
  }
});
AppServiceSuite('it should create the service', ({ service }) => {
  ok(service);
});
AppServiceSuite('It should return { hello: world } and log "Say Hello"', ({ service, logSpy }) => {
  equal(service.getHello(), { hello: 'world' });
  ok(logSpy.calledWith('Say Hello'));
});

AppServiceSuite.run();
