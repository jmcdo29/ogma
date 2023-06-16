import { BadRequestException, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { OgmaInterceptor, OgmaSkip } from '@ogma/nestjs-module';

import { AppService } from '../app.service';
import { FailGuard } from '../shared/fail.guard';
import { SimpleObject } from '../simple-object.model';
import { ExceptionFilter } from './ws.filter';

@UseInterceptors(OgmaInterceptor)
@WebSocketGateway()
export class WsGateway {
  constructor(private readonly appService: AppService) {}

  @SubscribeMessage('message')
  getMessage(): { event: string; data: SimpleObject } {
    return { event: 'message', data: this.appService.getHello() };
  }

  @SubscribeMessage('throw')
  @UseFilters(ExceptionFilter)
  getThrow(): never {
    throw new BadRequestException('Borked');
  }

  @SubscribeMessage('skip')
  @OgmaSkip()
  getSkip(): { event: string; data: SimpleObject } {
    return { event: 'message', data: this.appService.getHello() };
  }

  @SubscribeMessage('fail-guard')
  @UseGuards(FailGuard)
  @UseFilters(ExceptionFilter)
  failGuard(): void {
    /* no op */
  }
}
