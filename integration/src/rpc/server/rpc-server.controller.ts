import { BadRequestException, Controller, UseFilters, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OgmaSkip } from '@ogma/nestjs-module';

import { AppService } from '../../app.service';
import { FailGuard } from '../../shared/fail.guard';
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

  @MessagePattern({ cmd: 'fail-guard' })
  @UseFilters(ExceptionFilter)
  @UseGuards(FailGuard)
  failGuard() {
    /* no op */
  }
}
