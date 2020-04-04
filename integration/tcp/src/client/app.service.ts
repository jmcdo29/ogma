import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(@Inject('CLIENT_SERVICE') private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  getHello(): Observable<string> {
    return this.client.send<string>({ cmd: 'message' }, '');
  }

  getError(): Observable<any> {
    return this.client.send({ cmd: 'error' }, '');
  }

  getSkip(): Observable<string> {
    return this.client.send({ cmd: 'skip' }, '');
  }
}
