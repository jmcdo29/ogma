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

/* describe('OgmaService', () => {
  let service: OgmaServiceoptions;

  describe.each(['Test_context', '', null])(
    'should work with context %s',
    (context: string | null) => {
      describe.each([
        { logLevel: 'ALL' as const, color: true },
        { color: false, stream: mockStream },
      ])('should work with options %o', (options: Partial<OgmaServiceOptions>) => {
        describe.each(['Custom_Context', undefined])(
          'calling with custom context %s',
          (customContext: string | undefined) => {
            describe.each([
              'info' as const,
              'error' as const,
              'warn' as const,
              'debug' as const,
              'verbose' as const,
              'silly' as const,
              'fatal' as const,
            ])('should call %s method', (level: keyof OgmaService) => {
              let ogmaSpy: jest.SpyInstance;
              beforeEach(async () => {
                const module = await Test.createTestingModule({
                  providers: [
                    OgmaService,
                    {
                      provide: OGMA_INSTANCE,
                      useFactory: () => {
                        const ogma = new Ogma(options);
                        (ogma as any).options = {
                          ...(ogma as any).options,
                          ...options,
                        };
                        ogmaSpy = jest.spyOn(ogma, level);
                        return ogma;
                      },
                    },
                    {
                      provide: OGMA_CONTEXT,
                      useValue: context,
                    },
                  ],
                }).compile();
                service = await module.resolve(OgmaService);
              });
              afterEach(() => {
                ogmaSpy.mockReset();
              });
              it.each(['hello', 42, { key: 'value' }])(
                'should call with value %o',
                (value: any) => {
                  service[level](value, { context: customContext });
                  expect(ogmaSpy).toBeCalledTimes(1);
                },
              );
              it('should be able to call "callError"', () => {
                const error = new Error('This is my error');
                ogmaSpy = jest.spyOn(Ogma.prototype, 'printError');
                service.printError(error, { context: customContext });
                const foundContext = customContext ?? context ?? '';
                expect(ogmaSpy).toBeCalledTimes(1);
                expect(ogmaSpy).toBeCalledWith(error, { context: foundContext });
              });
            });
          },
        );
      });
    },
  );
}); */

/* describe.each([new Ogma(), undefined])(
  'OgmaService with difference instances',
  (instance: Ogma | undefined) => {
    it(`should still be defined with instance ${instance ? 'new' : 'undefined'}`, () => {
      const service = new OgmaService(instance);
      expect(service).toHaveProperty('ogma');
      expect(service).toBeDefined();
    });
  },
);
 */
