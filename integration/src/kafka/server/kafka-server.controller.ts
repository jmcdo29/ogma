import { BadRequestException, Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OgmaSkip } from '@ogma/nestjs-module';
import { AppService } from '../../app.service';
import { ExceptionFilter } from './../../shared/server-exception.filter';

@Controller()
export class KafkaServerController {
  constructor(private readonly service: AppService) {}

  @MessagePattern('say.hello')
  sayHello() {
    return this.service.getHello();
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('say.error')
  sayError() {
    throw new BadRequestException('Borked');
  }

  @OgmaSkip()
  @MessagePattern('say.skip')
  saySkip() {
    return this.service.getHello();
  }
}
