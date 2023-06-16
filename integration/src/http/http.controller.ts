import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { OgmaSkip } from '@ogma/nestjs-module';

import { AppService } from '../app.service';
import { FailGuard } from '../shared/fail.guard';
import { SimpleObject } from '../simple-object.model';
import { ErrorLoggingFilter } from './error-logging.filter';

@Controller()
@UseFilters(ErrorLoggingFilter)
export class HttpController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): SimpleObject {
    return this.appService.getHello();
  }

  @Get('status')
  @HttpCode(202)
  getStatus(): SimpleObject {
    return this.appService.getHello();
  }

  @Get('error')
  getError(): SimpleObject {
    throw new BadRequestException();
  }

  @Get('skip')
  @OgmaSkip()
  getSkip(): SimpleObject {
    return this.appService.getHello();
  }

  @Get('fail-guard')
  @UseGuards(FailGuard)
  failGuard() {
    /* no op */
  }

  @Post()
  getPost(): SimpleObject {
    return this.appService.getHello();
  }

  @Patch()
  getPatch(): SimpleObject {
    return this.appService.getHello();
  }

  @Put()
  getPut(): SimpleObject {
    return this.appService.getHello();
  }

  @Delete()
  getDelete(): SimpleObject {
    return this.appService.getHello();
  }
}
