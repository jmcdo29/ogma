import { Test } from '@nestjs/testing';
import { Ogma } from '@ogma/logger';
import { spy, Stub, stubMethod } from 'hanbi';
import { suite } from 'uvu';
import { equal, instance, is, ok } from 'uvu/assert';

import { OgmaService } from '../src';
import { OGMA_CONTEXT, OGMA_INSTANCE } from '../src/ogma.constants';

for (const context of ['Test_context', '', null]) {
  for (const option of [{ logLevel: 'ALL' as const, color: true }]) {
    for (const customContext of ['Custom_Context', undefined]) {
      for (const level of [
        'info',
        'error',
        'warn',
        'debug',
        'silly',
        'verbose',
        'fatal',
      ] as const) {
        const OgmaSuite = suite<{ service: OgmaService; spy: Stub<Ogma['info']> }>(
          `Ogma Suite ${context} ${JSON.stringify(option)} ${customContext} ${level}`,
          {
            service: undefined,
            spy: undefined,
          },
        );
        OgmaSuite.before(async (ctx) => {
          try {
            const mod = await Test.createTestingModule({
              providers: [
                OgmaService,
                {
                  provide: OGMA_INSTANCE,
                  useFactory: () => {
                    const ogma = new Ogma({
                      stream: { write: spy().handler },
                      ...option,
                    });
                    ctx.spy = stubMethod(ogma, level);
                    return ogma;
                  },
                },
                {
                  provide: OGMA_CONTEXT,
                  useValue: context,
                },
              ],
            }).compile();
            ctx.service = mod.get(OgmaService);
          } catch (err) {
            console.error(err);
            throw err;
          }
        });
        OgmaSuite.after.each((context) => {
          context.spy.reset();
        });
        for (const value of ['hello', 42, { key: 'value' }]) {
          OgmaSuite(`should log ${value}`, ({ service, spy }) => {
            service[level](value, { context: customContext });
            is(spy.callCount, 1);
            equal(spy.firstCall.args, [value, { context: customContext ?? context ?? '' }]);
          });
        }
        OgmaSuite('should be able to call "printError"', ({ service, spy }) => {
          const error = new Error('This is my error');
          spy = stubMethod((service as any).ogma, 'printError');
          service.printError(error, { context: customContext });
          const foundContext = customContext ?? context ?? '';
          is(spy.callCount, 1);
          equal(spy.firstCall.args, [error, { context: foundContext }]);
        });
        OgmaSuite.run();
      }
    }
  }
}
const OgmaServiceSuite = suite('Ogma Service');
for (const inst of [new Ogma(), undefined]) {
  OgmaServiceSuite(
    `should create the service ${inst ? 'with' : 'without'} an existing ogma instance`,
    () => {
      const service = new OgmaService(inst);
      ok(service);
      instance((service as any).ogma, Ogma);
    },
  );
}
OgmaServiceSuite.run();
