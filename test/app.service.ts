import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getSimpleMessage(): object {
    return { message: 'Hello World!' };
  }
}
