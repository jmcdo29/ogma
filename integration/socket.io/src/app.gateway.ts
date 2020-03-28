import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AppService } from './app.service';
import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { OgmaInterceptor, OgmaSkip } from '@ogma/nestjs-module';

@UseInterceptors(OgmaInterceptor)
@WebSocketGateway()
export class AppGateway {
  constructor(private readonly appService: AppService) {}

  @SubscribeMessage('message')
  getMessage(): string {
    return this.appService.getHello();
  }

  @SubscribeMessage('throw')
  getThrow(): never {
    throw new BadRequestException('Borked');
  }

  @SubscribeMessage('skip')
  @OgmaSkip()
  getSkip(): string {
    return this.appService.getHello();
  }
}
