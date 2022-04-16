import { Injectable, LoggerService, Optional } from '@nestjs/common';
import { OgmaWritableLevel } from '@ogma/common';
import { Ogma } from '@ogma/logger';

import { InjectOgma, InjectOgmaContext, InjectTraceMethod } from './decorators';
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
    @InjectTraceMethod() private readonly traceMethod: Lowercase<OgmaWritableLevel> = 'fine',
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
   * @param meta extra metadata for the log
   */

  public info(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'info', meta);
  }

  /**
   * use Ogma to log at the ERROR level. You can provide a stack trace as well.
   * @param message What to print to the Ogma instance
   * @param meta additional information you can print about the log OR the stack trace to print
   * @param context a string for the context in which the error log was called. This can be provided as a part of the meta, or as a third paramter to stay in line with Nest's LoggerService
   */
  public error(
    message: any,
    trace: OgmaServiceMeta | string = '',
    context: OgmaServiceMeta | string = {},
  ): void {
    let meta: OgmaServiceMeta = {};
    if (typeof trace === 'object') {
      meta = trace;
      trace = '';
    }
    if (context && typeof context === 'string') {
      meta.context = context;
    } else if (context && typeof context === 'object' && Object.keys(context).length) {
      meta = context;
    }
    this.printMessage(message, 'error', meta);
    if (trace) {
      this.printMessage(trace, 'error', meta);
    }
  }

  /**
   * use Ogma to log at the WARN level
   * @param message What to print to the Ogma instance
   * @param meta extra metadata for the log
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
   * @param meta extra metadata for the log
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
   * @param meta extra metadata for the log
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
   * @param meta extra metadata for the log
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
   * @param meta extra metadata for the log
   */
  public verbose(message: any, meta?: OgmaServiceMeta | string): void {
    if (typeof meta === 'string') {
      meta = { context: meta };
    }
    this.printMessage(message, 'verbose', meta);
  }

  /**
   * A configurable method that will print at a different level depending on the configuration
   * Normally this method will only be called via the `@Log()` decorator, but there's nothing
   * stopping anyone else from using it too
   * @param message the message to print
   * @param meta extra metadata for the logs
   */
  public trace(message: any, meta?: OgmaServiceMeta): void {
    this.printMessage(message, this.traceMethod, meta);
  }

  /**
   * A predefined method for printing errors to the Ogma instance
   * @param error The error to print. Should be an Error or Exception object
   * @param meta extra metadata for the log
   */
  public printError(error: Error, meta: OgmaServiceMeta = {}): void {
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
