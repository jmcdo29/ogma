import { Test, TestingModule } from '@nestjs/testing';
import { OgmaModule } from './ogma.module';
import { OgmaService } from './ogma.service';

describe('OgmaModule', () => {
  let module: TestingModule;
  describe.each(['TEST_CONTEXT', '', undefined])(
    'create context %j then use that context',
    (options: string | undefined) => {
      let service: OgmaService;
      it('should have OgmaService defined with options', async () => {
        module = await Test.createTestingModule({
          imports: [
            OgmaModule.forRoot(OgmaModule, { service: { color: false } }),
            OgmaModule.forFeature(options),
          ],
        }).compile();
        service = await module.resolve(OgmaService);
        expect(service).toBeDefined();
        expect(service).toHaveProperty('context', options ?? '');
        expect(service).toHaveProperty('ogma.options.color', false);
      });
    },
  );
});
