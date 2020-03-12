import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AppService } from './app.service';

@WebSocketGateway()
export class AppGateway {
  constructor(private readonly appService: AppService) {}

  @SubscribeMessage('message')
  handleMessage(): object {
    return this.appService.getSimpleMessage();
  }
}
