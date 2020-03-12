import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppMicroserviceController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'message' })
  getMessage(): object {
    return this.appService.getSimpleMessage();
  }
}
