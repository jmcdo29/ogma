import { Test, TestingModule } from '@nestjs/testing';
import { OgmaModule } from './ogma.module';
import { OgmaService } from './ogma.service';
describe('multiple forFeatures', () => {
  let service: OgmaService;
  let module: TestingModule;
  it('should create a new ogma instance', async () => {
    module = await Test.createTestingModule({
      imports: [
        OgmaModule.forRoot(OgmaModule, { service: { context: 'TEST FUNC' } }),
        OgmaModule.forFeature('No Root', { application: 'TEST APP' }),
        OgmaModule.forFeature('Second feature'),
        OgmaModule.forFeature('Third feature'),
      ],
    }).compile();
    service = await module.resolve(OgmaService);
    expect(service).toHaveProperty('ogma.options.logLevel', 'INFO');
    expect(service).toHaveProperty('context', 'Third feature');
  });
});
