import { Injectable, LoggerService, Optional } from '@nestjs/common';
import { Ogma } from '@ogma/logger';
import { InjectOgma, InjectOgmaContext } from './decorators';
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
  ) {
    this.context = context || '';
    this.ogma = ogma ?? new Ogma();
  }

  /**
   * use Ogma to log at the INFO level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public info(message: any, context?: string): void {
    this.printMessage(message, 'info', context);
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
   */
  public warn(message: any, context?: string): void {
    this.printMessage(message, 'warn', context);
  }

  /**
   * use Ogma to log at the DBEUG level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public debug(message: any, context?: string): void {
    this.printMessage(message, 'debug', context);
  }

  /**
   * use Ogma to log at the FATAL level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public fatal(message: any, context?: string): void {
    this.printMessage(message, 'fatal', context);
  }

  /**
   * use Ogma to log at the SILLY level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public silly(message: any, context?: string): void {
    this.printMessage(message, 'silly', context);
  }

  /**
   * use Ogma to log at the VERBOSE level
   * @param message What to print to the Ogma instance
   * @param context Optional context if you want to change what the original context was
   */
  public verbose(message: any, context?: string): void {
    this.printMessage(message, 'verbose', context);
  }

  /**
   * A predefined method for printing errors to the Ogma instance
   * @param error The error to print. Should be an Error or Exception object
   * @param context Optional context if you want to change what the original context was
   */
  public printError(error: Error, context?: string): void {
    this.printMessage('', 'error', context);
    context = context ?? this.context;
    this.ogma.printError(error, context);
  }

  private printMessage(
    message: any,
    levelString: Exclude<keyof Ogma, 'printMessage' | 'printError'>,
    context?: string,
  ): void {
    context = context ?? this.context;
    this.ogma[levelString](message, context);
  }
}
