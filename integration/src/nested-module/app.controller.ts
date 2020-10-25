import { Controller, Get } from '@nestjs/common';
import { AppService } from '../../../benchmarks/interceptor/dist/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sayHello() {
    return this.appService.getHello();
  }
}
