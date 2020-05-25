import { BadRequestException, Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OgmaSkip } from '@ogma/nestjs-module';
import { AppService } from '../../app.service';
import { ExceptionFilter } from './exception.filter';

@Controller()
export class GrpcServerController {
  constructor(private readonly service: AppService) {}

  @GrpcMethod('HelloService', 'SayHello')
  sayHello() {
    return this.service.getHello();
  }

  @GrpcMethod('HelloService', 'SayError')
  @UseFilters(ExceptionFilter)
  sayError() {
    throw new BadRequestException('Borked');
  }

  @OgmaSkip()
  @GrpcMethod('HelloService', 'SaySkip')
  saySkip() {
    return this.service.getHello();
  }
}
