import {
  Inject,
  Injectable,
  LoggerService,
  Optional,
  Scope,
} from '@nestjs/common';
import { color, Ogma } from 'ogma';
import { OGMA_CONTEXT, OGMA_INSTANCE } from './ogma.constants';

@Injectable({ scope: Scope.TRANSIENT })
export class OgmaService implements LoggerService {
  private context?: string;

  public fine = this.verbose;

  public log = this.info;

  constructor(
    @Optional() @Inject(OGMA_INSTANCE) private readonly ogma: Ogma,
    @Optional() @Inject(OGMA_CONTEXT) context?: string,
  ) {
    this.context = context || '';
    this.ogma = ogma ?? new Ogma();
  }

  public info(message: any, context?: string): void {
    this.printMessage(message, 'info', context);
  }

  public error(message: any, context?: string): void {
    this.printMessage(message, 'error', context);
  }

  public warn(message: any, context?: string): void {
    this.printMessage(message, 'warn', context);
  }

  public debug(message: any, context?: string): void {
    this.printMessage(message, 'debug', context);
  }

  public fatal(message: any, context?: string): void {
    this.printMessage(message, 'fatal', context);
  }

  public silly(message: any, context?: string): void {
    this.printMessage(message, 'silly', context);
  }

  public verbose(message: any, context?: string): void {
    this.printMessage(message, 'verbose', context);
  }

  public printError(error: Error, context?: string): void {
    this.printMessage('', 'error', context);
    this.ogma.printError(error);
  }

  private printMessage(
    message: any,
    levelString: Exclude<keyof Ogma, 'printMessage' | 'printError'>,
    context?: string,
  ): void {
    context = context ?? this.context;
    context = context ? color.cyan('[' + context + ']') : '';
    const nest = color.yellow('[Nest]');
    if (typeof message === 'object' && message !== null) {
      this.ogma[levelString](nest + ' ' + process.pid + ' ' + context + ' |');
      this.ogma[levelString](message);
    } else {
      this.ogma[levelString](
        nest + ' ' + process.pid + ' ' + context + ' | ' + message,
      );
    }
  }
}
