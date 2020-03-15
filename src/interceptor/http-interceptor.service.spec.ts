import { Test, TestingModule } from '@nestjs/testing';
import { HttpInterceptorService } from './http-interceptor.service';

describe('HttpInterceptorService', () => {
  let service: HttpInterceptorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpInterceptorService],
    }).compile();

    service = module.get<HttpInterceptorService>(HttpInterceptorService);
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
    it('should return a log object with multiple caller addresses', () => {});
  });

  describe('error context', () => {
    it('should return an error log object', () => {});
  });
});
