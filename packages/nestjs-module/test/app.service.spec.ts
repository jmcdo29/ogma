import { AppService } from './app.service';
import { Test } from '@nestjs/testing';

describe('AppService', () => {
  let service: AppService;
  let logger: { log: jest.Mock };

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'OGMA_SERVICE:AppService',
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();
    service = modRef.get(AppService);
    logger = modRef.get<{ log: jest.Mock }>('OGMA_SERVICE:AppService');
  });

  it('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  it('should return { hello: world }', () => {
    expect(service.getHello()).toEqual({ hello: 'world' });
    expect(logger.log).toHaveBeenCalledWith('Say Hello');
  });
});

process.on('unhandledRejection', (err) => {
  throw new Error(err as any);
});
