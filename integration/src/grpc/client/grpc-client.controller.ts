import { Controller, Get, Inject, OnModuleInit, UseFilters } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ExceptionFilter } from './../../shared/exception.filter';
import { HelloService } from './hello-service.interface';

@Controller()
export class GrpcClientController implements OnModuleInit {
  private helloService: HelloService;

  constructor(@Inject('GRPC_SERVICE') private readonly grpc: ClientGrpc) {}

  async onModuleInit() {
    this.helloService = this.grpc.getService<HelloService>('HelloService');
  }
  @Get()
  sayHello() {
    return this.helloService.sayHello({ ip: '127.0.0.1' });
  }

  @Get('error')
  @UseFilters(ExceptionFilter)
  sayError() {
    return this.helloService.sayError({ ip: '127.0.0.1' });
  }

  @Get('skip')
  saySkip() {
    return this.helloService.saySkip({ ip: '127.0.0.1' });
  }
}
