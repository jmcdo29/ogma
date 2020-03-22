import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { OgmaInterceptor } from '../dist';
import { AppService } from './app.service';

@UseInterceptors(OgmaInterceptor)
@WebSocketGateway()
export class AppGateway {
  constructor(private readonly appService: AppService) {}

  @SubscribeMessage('message')
  handleMessage(): object {
    return this.appService.getSimpleMessage();
  }

  @SubscribeMessage('diff')
  handleOtherMessage(): object {
    return this.appService.getSimpleMessage();
  }

  @SubscribeMessage('thrown')
  throwAnError(): never {
    throw new BadRequestException('error');
  }
}
