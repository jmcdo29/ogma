import { Test } from '@nestjs/testing';
import { OgmaModule } from './ogma.module';
import { OgmaService } from './ogma.service';

describe('OgmaModule', () => {
  let service: OgmaService;

  describe.each(['TEST_CONTEXT', '', undefined])(
    'create context %j then use that context',
    (options: string | undefined) => {
      beforeEach(async () => {
        const module = await Test.createTestingModule({
          imports: [
            OgmaModule.forRoot({ color: false }),
            OgmaModule.forFeature(options),
          ],
        }).compile();
        service = await module.resolve(OgmaService);
      });

      it('should have OgmaService defined with options', () => {
        expect(service).toBeDefined();
        expect(service).toHaveProperty('context');
        expect((service as any).context).toBe(options ?? '');
      });
    },
  );
  describe('create context then use new context', () => {
    it('should create multiple ogma instances', async () => {
      const module = await Test.createTestingModule({
        imports: [
          OgmaModule.forRoot({ color: true, logLevel: 'ERROR' }),
          OgmaModule.forFeature('NEW CONTEXT', {
            color: false,
            logLevel: 'ALL',
          }),
        ],
      }).compile();
      service = await module.resolve(OgmaService);
      expect((service as any).ogma.options.logLevel).toBeDefined();
      expect((service as any).ogma.options.color).toBeDefined();
    });
  });
  describe('create context with async config', () => {
    it('should create the async configuration', async () => {
      const module = await Test.createTestingModule({
        imports: [
          OgmaModule.forRootAsync({
            useFactory: () => {
              return {
                color: false,
                logLevel: 'DEBUG',
              };
            },
          }),
          OgmaModule.forFeature('TEST CONTEXT'),
        ],
      }).compile();
      service = await module.resolve(OgmaService);
      expect((service as any).ogma.options.logLevel).toBeDefined();
    });
  });

  describe('forFeature without using forRoot', () => {
    it('should create a new ogma instance', async () => {
      const module = await Test.createTestingModule({
        imports: [
          OgmaModule.forRoot({ application: 'TEST APP' }),
          OgmaModule.forFeature('No Root'),
        ],
      }).compile();
      service = await module.resolve(OgmaService);
      expect((service as any).ogma.options.logLevel).toBe('INFO');
    });
  });
});
