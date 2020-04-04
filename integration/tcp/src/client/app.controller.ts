import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage() {
    return this.appService.getHello();
  }

  @Get('error')
  getError() {
    return this.appService.getError();
  }

  @Get('skip')
  getSkip() {
    return this.appService.getSkip();
  }
}
