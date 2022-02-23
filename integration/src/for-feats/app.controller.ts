import { Controller, Get } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly service: AppService,
    @OgmaLogger('AppController') private readonly logger: OgmaService,
  ) {}

  @Get()
  sayHello() {
    this.logger.log('Hello');
    return this.service.hello();
  }
}
