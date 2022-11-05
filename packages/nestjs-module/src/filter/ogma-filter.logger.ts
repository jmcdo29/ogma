import { ArgumentsHost, Injectable } from '@nestjs/common';
import { OgmaOptions } from '@ogma/logger';

import { InjectOgmaInterceptorOptions } from '../decorators';
import { LogObject } from '../interceptor/interfaces/log.interface';
import { DelegatorService } from '../interceptor/providers';
import { OgmaInterceptorOptions } from '../interfaces';
import { OgmaService } from '../ogma.service';

@Injectable()
export class OgmaFilterLogger {
  private json: boolean;
  private color: boolean;

  constructor(
    private readonly service: OgmaService,
    private readonly delegator: DelegatorService,
    @InjectOgmaInterceptorOptions() private readonly options: OgmaInterceptorOptions,
  ) {
    const ogmaOptions: OgmaOptions = (this.service as any).ogma.options;
    this.json = ogmaOptions.json;
    this.color = ogmaOptions.color;
  }

  log(exception: Error, host: ArgumentsHost): void {
    if (this.hasAlreadyBeenLogged(host)) {
      return;
    }
    const valueToLog = this.delegator.getContextErrorString(
      exception,
      host,
      this.delegator.getStartTime(host),
      {
        ...this.options,
        json: this.json,
        color: this.color,
      },
    );
    this.doLog(valueToLog.log);
  }

  private doLog(valueToLog: string | LogObject): void {
    this.service.log(valueToLog, { context: 'ExceptionFilter' });
  }

  private hasAlreadyBeenLogged(host: ArgumentsHost): boolean {
    return !!this.delegator.getRequestId(host);
  }
}
