import {
  Controller,
  Get,
  Inject,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ExceptionFilter } from './../../shared/exception.filter';

@Controller()
export class RpcClientController implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(@Inject('RPC-SERVICE') private readonly micro: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.micro.connect();
  }

  async onApplicationShutdown() {
    await this.micro.close();
  }

  @Get()
  getMessage() {
    return this.micro.send({ cmd: 'message' }, { ip: '127.0.0.1' });
  }

  @Get('error')
  @UseFilters(ExceptionFilter)
  getError() {
    return this.micro.send({ cmd: 'error' }, { ip: '127.0.0.1' });
  }

  @Get('skip')
  getSkip() {
    return this.micro.send({ cmd: 'skip' }, { ip: '127.0.0.1' });
  }
}
