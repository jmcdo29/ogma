import { Test } from '@nestjs/testing';
import { OgmaModule } from './ogma.module';
import { OgmaService } from './ogma.service';
describe('OgmaModule', () => {
  beforeEach(() => {
    (OgmaModule as any).ogmaInstance = undefined;
  });
  describe.each(['TEST_CONTEXT', '', undefined])(
    'create context %j then use that context',
    (options: string | undefined) => {
      let service: OgmaService;
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
    let service: OgmaService;
    it('should create multiple ogma instances', async () => {
      const module = await Test.createTestingModule({
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
      expect((service as any).ogma.options.logLevel).toBeDefined();
      expect((service as any).ogma.options.color).toBeDefined();
    });
  });
  /*************************************************************************/
  describe.only('create context with async config', () => {
    let service: OgmaService;
    it('should create the async configuration', async () => {
      const module = await Test.createTestingModule({
        imports: [
          // set the general options for the OgmaModule
          OgmaModule.forRootAsync({
            useFactory: () => {
              return {
                color: false,
                logLevel: 'DEBUG',
              };
            },
          }),
          // Create a new instance of Ogma for the OgmaService with application options as 'TEST APP'
          OgmaModule.forFeature('TEST CONTEXT', {
            logLevel: 'SILLY',
            application: 'TEST APP',
          }),
        ],
      }).compile();
      service = await module.resolve(OgmaService);
      // based on new Ogma options from forFeature
      // seems `await module.resolve(OgmaService)` is not resolving the correct value. Can't tell why.
      expect((service as any).ogma.options.logLevel).toBe('SILLY');
      expect((service as any).ogma.options.application).toBe('TEST APP');
    });
  });
  /*************************************************************************/
  describe('multiple forFeatures', () => {
    let service: OgmaService;
    it('should create a new ogma instance', async () => {
      const module = await Test.createTestingModule({
        imports: [
          OgmaModule.forRoot({ context: 'TEST FUNC' }),
          OgmaModule.forFeature('No Root', { application: 'TEST APP' }),
          OgmaModule.forFeature('Second feature'),
          OgmaModule.forFeature('Third feature'),
        ],
      }).compile();
      service = await module.resolve(OgmaService);
      expect((service as any).ogma.options.logLevel).toBe('INFO');
    });
  });
});
