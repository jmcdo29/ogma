import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  postHello() {
    return this.appService.getHello();
  }

  @Patch()
  patchHello() {
    return this.appService.getHello();
  }

  @Put()
  putHello() {
    return this.appService.getHello();
  }

  @Delete()
  deleteHello() {
    return this.appService.getHello();
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
