import { Test, TestingModule } from '@nestjs/testing';
import { OgmaModule } from './ogma.module';
import { OgmaService } from './ogma.service';

describe('OgmaModule', () => {
  let module: TestingModule;
  afterEach(async () => {
    (OgmaModule as any).ogmaInstance = undefined;
    await module.close();
  });
  describe.each(['TEST_CONTEXT', '', undefined])(
    'create context %j then use that context',
    (options: string | undefined) => {
      let service: OgmaService;
      beforeEach(async () => {
        module = await Test.createTestingModule({
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
        expect((service as any).ogma.options.color).toBe(false);
      });
    },
  );

  describe('create context then use new context', () => {
    let service: OgmaService;
    it('should create multiple ogma instances', async () => {
      module = await Test.createTestingModule({
        imports: [
          OgmaModule.forRoot({
            color: true,
            logLevel: 'ERROR',
            application: 'NEST APP',
          }),
          OgmaModule.forFeature('NEW CONTEXT', {
            color: false,
            logLevel: 'ALL',
          }),
        ],
      }).compile();
      service = await module.resolve(OgmaService);
      expect((service as any).ogma.options.logLevel).toBe('ALL');
      expect((service as any).ogma.options.color).toBe(false);
      expect((service as any).context).toBe('NEW CONTEXT');
    });
  });
  describe('create context with async config', () => {
    let service: OgmaService;
    it('should create the async configuration', async () => {
      module = await Test.createTestingModule({
        imports: [
          OgmaModule.forRootAsync({
            useFactory: () => {
              return {
                color: false,
                logLevel: 'DEBUG',
              };
            },
          }),
          OgmaModule.forFeature('TEST CONTEXT', {
            logLevel: 'SILLY',
            application: 'TEST APP',
          }),
        ],
      }).compile();

      service = await module.resolve(OgmaService);
      expect((service as any).ogma.options.logLevel).toBe('SILLY');
      expect((service as any).ogma.options.application).toBe('TEST APP');
      expect((service as any).ogma.options.color).toBe(false);
    });
  });
  describe('multiple forFeatures', () => {
    let service: OgmaService;
    it('should create a new ogma instance', async () => {
      module = await Test.createTestingModule({
        imports: [
          OgmaModule.forRoot({ context: 'TEST FUNC' }),
          OgmaModule.forFeature('No Root', { application: 'TEST APP' }),
          OgmaModule.forFeature('Second feature'),
          OgmaModule.forFeature('Third feature'),
        ],
      }).compile();
      service = await module.resolve(OgmaService);
      expect((service as any).ogma.options.logLevel).toBe('INFO');
      expect((service as any).context).toBe('Third feature');
    });
  });
});
