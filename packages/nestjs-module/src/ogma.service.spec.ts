import { Test } from '@nestjs/testing';
import { Ogma, OgmaOptions } from '@ogma/logger';
import { OGMA_CONTEXT, OGMA_INSTANCE } from './ogma.constants';
import { OgmaService } from './ogma.service';

jest.mock('ogma');

const mockStream = {
  write: (message: any) => message,
};

describe('OgmaService', () => {
  let service: OgmaService;

  describe.each(['Test_context', '', null])(
    'should work with context %s',
    (context: string | null) => {
      describe.each([
        { logLevel: 'ALL' as const, color: true },
        { color: false, stream: mockStream },
      ])('should work with options %o', (options: Partial<OgmaOptions>) => {
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
                  service[level](value, customContext);
                  expect(ogmaSpy).toBeCalledTimes(1);
                },
              );
              it('should be able to call "callError"', () => {
                const error = new Error('This is my error');
                ogmaSpy = jest.spyOn(Ogma.prototype, 'printError');
                service.printError(error, customContext);
                expect(ogmaSpy).toBeCalledTimes(1);
                expect(ogmaSpy).toBeCalledWith(
                  error,
                  customContext ?? context ?? '',
                );
              });
            });
          },
        );
      });
    },
  );
});

describe.each([new Ogma(), undefined])(
  'OgmaService with difference instances',
  (instance: Ogma | undefined) => {
    it(`should still be defined with instance ${
      instance ? 'new' : 'undefined'
    }`, () => {
      const service = new OgmaService(instance);
      expect(service).toHaveProperty('ogma');
      expect(service).toBeDefined();
    });
  },
);
