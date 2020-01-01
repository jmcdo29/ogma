import { Test, TestingModule } from '@nestjs/testing';
import { OgmaModule } from './ogma.module';
import { OgmaService } from './ogma.service';

describe('create context with async config', () => {
  let service: OgmaService;
  let module: TestingModule;
  it('should create the async configuration', async () => {
    module = await Test.createTestingModule({
      imports: [
        OgmaModule.forRootAsync(OgmaModule, {
          useFactory: () => {
            return {
              service: {
                color: false,
                logLevel: 'DEBUG',
              },
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
    expect(service).toHaveProperty('ogma.options.logLevel', 'SILLY');
    expect(service).toHaveProperty('ogma.options.application', 'TEST APP');
    expect(service).toHaveProperty('ogma.options.color', false);
  });
});
