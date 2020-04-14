import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { OgmaInterceptor, OgmaSkip } from '@ogma/nestjs-module';
import { AppService } from '../app.service';
import { SimpleObject } from '../simple-object.model';

@UseInterceptors(OgmaInterceptor)
@WebSocketGateway()
export class AppGateway {
  constructor(private readonly appService: AppService) {}

  @SubscribeMessage('message')
  getMessage(): SimpleObject {
    return this.appService.getHello();
  }

  @SubscribeMessage('throw')
  getThrow(): never {
    throw new BadRequestException('Borked');
  }

  @SubscribeMessage('skip')
  @OgmaSkip()
  getSkip(): SimpleObject {
    return this.appService.getHello();
  }
}
