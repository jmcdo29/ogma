import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common';
import { OgmaSkip } from '@ogma/nestjs-module';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('status')
  @HttpCode(202)
  getStatus(): string {
    return this.appService.getHello();
  }

  @Get('error')
  getError(): string {
    throw new BadRequestException();
  }

  @Get('skip')
  @OgmaSkip()
  getSkip(): string {
    return this.appService.getHello();
  }
}
