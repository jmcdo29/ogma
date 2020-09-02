import { Injectable, LoggerService, Optional } from '@nestjs/common';
import { Ogma } from '@ogma/logger';
import { InjectOgma, InjectOgmaContext } from './decorators';
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

  private getRequestId(
    requestContext: RequestContext | Record<string, any>,
  ): string | undefined {
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
  public info(message: any, context?: string, requestId?: string): void {
    this.printMessage(message, 'info', context, requestId);
  }

  /**
   * use Ogma to log at the ERROR level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public error(message: any, context?: string): void {
    this.printMessage(message, 'error', context);
  }

  /**
   * use Ogma to log at the WARN level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public warn(message: any, context?: string, requestId?: string): void {
    this.printMessage(message, 'warn', context, requestId);
  }

  /**
   * use Ogma to log at the DBEUG level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public debug(message: any, context?: string, requestId?: string): void {
    this.printMessage(message, 'debug', context, requestId);
  }

  /**
   * use Ogma to log at the FATAL level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public fatal(message: any, context?: string, requestId?: string): void {
    this.printMessage(message, 'fatal', context, requestId);
  }

  /**
   * use Ogma to log at the SILLY level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public silly(message: any, context?: string, requestId?: string): void {
    this.printMessage(message, 'silly', context, requestId);
  }

  /**
   * use Ogma to log at the VERBOSE level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public verbose(message: any, context?: string, requestId?: string): void {
    this.printMessage(message, 'verbose', context, requestId);
  }

  /**
   * A predefined method for printing errors to the Ogma instance
   * @param error The error to print. Should be an Error or Exception object
   * @param context Optional context if you want to change what the original context was
   * @param requestId Optional id of an request
   */
  public printError(error: Error, context?: string, requestId?: string): void {
    this.printMessage('', 'error', context, requestId);
    if (!requestId && this.requestContext && this.context) {
      requestId = this.getRequestId(this.requestContext);
    }
    context = context ?? this.context;
    this.ogma.printError(error, context, undefined, requestId);
  }

  private printMessage(
    message: any,
    levelString: Exclude<keyof Ogma, 'printMessage' | 'printError'>,
    context?: string,
    requestId?: string,
  ): void {
    context = context ?? this.context;
    if (!requestId && this.requestContext && this.context) {
      requestId = this.getRequestId(this.requestContext);
    }
    this.ogma[levelString](message, context, undefined, requestId);
  }
}
