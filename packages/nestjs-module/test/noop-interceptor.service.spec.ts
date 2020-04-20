import { Test, TestingModule } from '@nestjs/testing';
import { NoopInterceptorService } from '../src/interceptor/providers/noop-interceptor.service';

describe('NoopInterceptorService', () => {
  let service: NoopInterceptorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoopInterceptorService],
    }).compile();

    service = module.get<NoopInterceptorService>(NoopInterceptorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('success context', () => {
    it('should return a success log object', () => {
      Date.now = () => 133;
      expect(service.getSuccessContext(151, {} as any, 50, {} as any)).toEqual({
        callerAddress: 'caller ip',
        method: 'method',
        callPoint: 'call point',
        responseTime: 83,
        contentLength: 151,
        protocol: 'protocol',
        status: 'status',
      });
    });
  });
});
