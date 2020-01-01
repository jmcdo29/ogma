import { Test, TestingModule } from '@nestjs/testing';
import { OgmaModule } from './ogma.module';
import { OgmaService } from './ogma.service';

describe('create context then use new context', () => {
  let service: OgmaService;
  let module: TestingModule;
  it('should create multiple ogma instances', async () => {
    module = await Test.createTestingModule({
      imports: [
        OgmaModule.forRoot(OgmaModule, {
          service: {
            color: true,
            logLevel: 'ERROR',
            application: 'NEST APP',
          },
        }),
        OgmaModule.forFeature('NEW CONTEXT', {
          color: false,
          logLevel: 'ALL',
        }),
      ],
    }).compile();
    service = await module.resolve(OgmaService);
    expect(service).toHaveProperty('ogma.options.application', 'NEST APP');
    expect(service).toHaveProperty('ogma.options.logLevel', 'ALL');
    expect(service).toHaveProperty('ogma.options.color', false);
    expect(service).toHaveProperty('context', 'NEW CONTEXT');
  });
});
