import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OgmaSkip } from '@ogma/nestjs-module';
import { AppService } from '../app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'message' })
  getMessage() {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'error' })
  getError() {
    throw new BadRequestException('Borked');
  }

  @OgmaSkip()
  @MessagePattern({ cmd: 'skip' })
  getSkip() {
    return this.appService.getHello();
  }
}
