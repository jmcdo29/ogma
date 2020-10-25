import { Injectable, LoggerService, Optional } from '@nestjs/common';
import { Ogma } from '@ogma/logger';
import { InjectOgma, InjectOgmaContext } from './decorators';
import { OgmaServiceMeta } from './interfaces';
import { RequestContext } from './interfaces/request-context.interface';

@Injectable()
export class OgmaService implements LoggerService {
  private readonly context?: string;
  private readonly ogma: Ogma;

  /**
   * use Ogma to log at the FINE level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public fine = this.verbose;

  /**
   * use Ogma to log at the LOG level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public log = this.info;

  constructor(
    @InjectOgma() ogma?: Ogma,
    @Optional() @InjectOgmaContext() context?: string,
    @Optional() private readonly requestContext?: RequestContext,
  ) {
    this.context = context || '';
    this.ogma = ogma ?? new Ogma();
  }

  private getRequestId(requestContext: RequestContext | Record<string, any>): string | undefined {
    if (typeof requestContext.getContext !== 'undefined') {
      return requestContext.getContext().requestId;
    }
    return requestContext.requestId;
  }

  /**
   * use Ogma to log at the INFO level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */

  public info(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'info', meta);
  }

  /**
   * use Ogma to log at the ERROR level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public error(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'error', meta);
  }

  /**
   * use Ogma to log at the WARN level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public warn(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'warn', meta);
  }

  /**
   * use Ogma to log at the DBEUG level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public debug(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'debug', meta);
  }

  /**
   * use Ogma to log at the FATAL level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public fatal(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'fatal', meta);
  }

  /**
   * use Ogma to log at the SILLY level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public silly(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'silly', meta);
  }

  /**
   * use Ogma to log at the VERBOSE level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public verbose(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'verbose', meta);
  }

  /**
   * A predefined method for printing errors to the Ogma instance
   * @param error The error to print. Should be an Error or Exception object
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public printError(error: Error, meta: OgmaServiceMeta = {}): void {
    this.printMessage('', 'error', meta);
    if (!meta.correlationId && this.requestContext && this.context) {
      meta.correlationId = this.getRequestId(this.requestContext);
    }
    meta.context = meta.context ?? this.context;
    this.ogma.printError(error, meta);
  }

  private printMessage(
    message: any,
    levelString: Exclude<keyof Ogma, 'printMessage' | 'printError'>,
    meta: OgmaServiceMeta = {},
  ): void {
    meta.context = meta.context ?? this.context;
    if (!meta.correlationId && this.requestContext && this.context) {
      meta.correlationId = this.getRequestId(this.requestContext);
    }
    this.ogma[levelString](message, meta);
  }
}
