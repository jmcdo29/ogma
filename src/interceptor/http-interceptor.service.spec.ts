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
});
