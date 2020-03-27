import { Test, TestingModule } from '@nestjs/testing';
import { NoopInterceptorService } from './noop-interceptor.service';

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
      expect(service.getSuccessContext(151, {} as any, 50, {} as any)).toEqual({
        callerAddress: '127.0.0.1',
        method: 'GET',
        callPoint: '/',
        responseTime: 83,
        contentLength: 42,
        protocol: 'HTTP/1.1',
        status: '200',
      });
    });
  });
});
