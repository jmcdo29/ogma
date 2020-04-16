import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { OgmaSkip } from '@ogma/nestjs-module';
import { AppService } from '../app.service';
import { SimpleObject } from '../simple-object.model';

@Controller()
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
