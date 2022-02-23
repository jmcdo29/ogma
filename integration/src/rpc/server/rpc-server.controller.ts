import { BadRequestException, Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OgmaSkip } from '@ogma/nestjs-module';

import { AppService } from '../../app.service';
import { ExceptionFilter } from './../../shared/server-exception.filter';

@Controller()
export class RpcServerController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'message' })
  getMessage() {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'error' })
  @UseFilters(ExceptionFilter)
  getError() {
    throw new BadRequestException('Borked');
  }

  @OgmaSkip()
  @MessagePattern({ cmd: 'skip' })
  getSkip() {
    return this.appService.getHello();
  }
}
