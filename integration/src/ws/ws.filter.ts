import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as NestExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { OgmaFilterService } from '@ogma/nestjs-module';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  constructor(private readonly service: OgmaFilterService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    this.service.log(exception, host);
    const client = host.switchToWs().getClient();
    if (client._isServer) {
      return client.send('exception');
    } else {
      return client.emit('exception', exception.message);
    }
  }
}
