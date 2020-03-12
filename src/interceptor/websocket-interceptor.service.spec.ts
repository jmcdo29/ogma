import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketInterceptorService } from './websocket-interceptor.service';

describe('WebsocketInterceptorService', () => {
  let service: WebsocketInterceptorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketInterceptorService],
    }).compile();

    service = module.get<WebsocketInterceptorService>(
      WebsocketInterceptorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
