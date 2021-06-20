import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class ExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    if (client._isServer) {
      return client.send('exception');
    } else {
      return client.emit('exception', exception.message);
    }
  }
}
