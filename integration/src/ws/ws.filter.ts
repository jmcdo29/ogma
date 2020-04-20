import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import WebSocket = require('ws');

@Catch()
export class ExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    if (client instanceof WebSocket) {
      return client.send('exception');
    } else {
      return client.emit('exception', exception.message);
    }
  }
}
