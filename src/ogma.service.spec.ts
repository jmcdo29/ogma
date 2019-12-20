import { Test } from '@nestjs/testing';
import { LogLevel, Ogma, OgmaOptions } from 'ogma';
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
        { logLevel: 'ALL' as keyof typeof LogLevel, color: true },
        { color: false, stream: mockStream },
      ])('should work with options %o', (options: Partial<OgmaOptions>) => {
        describe.each(['Custom_Context', undefined])(
          'calling with custom context %s',
          (customContext: string | undefined) => {
            describe.each([
              'info' as keyof OgmaService,
              'error' as keyof OgmaService,
              'warn' as keyof OgmaService,
              'debug' as keyof OgmaService,
              'verbose' as keyof OgmaService,
              'silly' as keyof OgmaService,
              'fatal' as keyof OgmaService,
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
                        ogmaSpy = jest.spyOn(ogma, level as any);
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
                ogmaSpy = jest.spyOn(Ogma.prototype, 'printError');
                service.printError(new Error('This is my error'));
                expect(ogmaSpy).toBeCalledTimes(1);
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
      const service = new OgmaService(instance as any);
      expect(service).toHaveProperty('ogma');
      expect(service).toBeDefined();
    });
  },
);
