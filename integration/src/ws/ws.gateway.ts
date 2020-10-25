import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BadRequestException, UseFilters, UseInterceptors } from '@nestjs/common';
import { OgmaInterceptor, OgmaSkip } from '@ogma/nestjs-module';
import { AppService } from '../app.service';
import { SimpleObject } from '../simple-object.model';
import { ExceptionFilter } from './ws.filter';

@UseInterceptors(OgmaInterceptor)
@WebSocketGateway()
export class WsGateway {
  constructor(private readonly appService: AppService) {}

  @SubscribeMessage('message')
  getMessage(): SimpleObject {
    return this.appService.getHello();
  }

  @SubscribeMessage('throw')
  @UseFilters(ExceptionFilter)
  getThrow(): never {
    throw new BadRequestException('Borked');
  }

  @SubscribeMessage('skip')
  @OgmaSkip()
  getSkip(): SimpleObject {
    return this.appService.getHello();
  }
}
