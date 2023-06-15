import { Color, LogLevel, OgmaLog, OgmaStream, OgmaWritableLevel } from '@ogma/common';
import { style, Styler } from '@ogma/styler';
import { hostname } from 'os';

import { OgmaDefaults, OgmaOptions } from '../interfaces';
import { OgmaPrintOptions } from '../interfaces/ogma-print-options';
import { colorize, isNil } from '../utils';

const checkIfHasSpaceRegex = /[^\n]$/;

/**
 * The main logger instance
 */
export class Ogma {
  private options: OgmaOptions;
  private pid: string;
  private hostname: string;
  private styler: Styler;
  private each: boolean;

  private cachedContextFormatted: Map<string, Map<Color, string>> = new Map();
  private sillyFormattedLevel: string;
  private verboseFormattedLevel: string;
  private debugFormattedLevel: string;
  private infoFormattedLevel: string;
  private warnFormattedLevel: string;
  private errorFormattedLevel: string;
  private fatalFormattedLevel: string;
  private hostnameFormatted: string;

  /**
   * An alias for `ogma.verbose`. `FINE` is what is printed as the log level
   */
  public fine = this.verbose;
  /**
   * An alias for `ogma.info`. `INFO` is what is printed as the log level
   */
  public log = this.info;

  constructor(options?: Partial<OgmaOptions>) {
    if (options?.logLevel) {
      options.logLevel = options.logLevel.toUpperCase() as keyof typeof LogLevel;
    }
    options &&
      Object.keys(options)
        .filter((key) => isNil(options[key]))
        .forEach((key) => delete options[key]);
    this.options = { ...OgmaDefaults, ...(options as OgmaOptions) };
    this.pid = process.pid.toString();
    this.hostname = hostname();
    if (options?.logLevel && LogLevel[options.logLevel] === undefined) {
      this.options.logLevel = OgmaDefaults.logLevel;
      this.warn(
        `Ogma logLevel was set to ${options.logLevel} which does not match a defined logLevel. Falling back to default instead.`,
      );
    }
    if (!this.options.stream.getColorDepth) {
      this.setStreamColorDepth();
    }
    this.styler = style.child(this.options.stream as Pick<OgmaStream, 'getColorDepth'>);
    this.each = this.options.each;
    this.sillyFormattedLevel = this.toColor(LogLevel.SILLY, Color.MAGENTA);
    this.verboseFormattedLevel = this.toColor(LogLevel.VERBOSE, Color.GREEN);
    this.debugFormattedLevel = this.toColor(LogLevel.DEBUG, Color.BLUE);
    this.infoFormattedLevel = this.toColor(LogLevel.INFO, Color.CYAN);
    this.warnFormattedLevel = this.toColor(LogLevel.WARN, Color.YELLOW);
    this.errorFormattedLevel = this.toColor(LogLevel.ERROR, Color.RED);
    this.hostnameFormatted = this.toStreamColor(this.hostname, Color.MAGENTA) + ' ';
    this.fatalFormattedLevel = this.styler
      .redBg()
      .white()
      .underline()
      .apply(this.wrapInBrackets(LogLevel[LogLevel.FATAL]));
  }

  private setStreamColorDepth(): void {
    let colorDepthVal: number;
    if (this.options.color) {
      colorDepthVal = 4;
    }
    if (this.options.color === false) {
      colorDepthVal = 1;
    }
    if (!colorDepthVal && this.options.stream !== process.stdout && process.stdout.getColorDepth) {
      colorDepthVal = process.stdout.getColorDepth();
    }
    this.options.stream.getColorDepth = () => colorDepthVal ?? 1;
  }

  private printMessage(
    message: any,
    logLevel: LogLevel,
    formattedLevel: string,
    options?: OgmaPrintOptions,
  ): void {
    const ogmaPrintOptions = options || {};

    if (logLevel < LogLevel[this.options.logLevel]) {
      return;
    }

    let logString = '';

    if (this.options.json) {
      logString = this.formatJSON(message, logLevel, ogmaPrintOptions);
    } else {
      logString = this.formatStream(message, formattedLevel, ogmaPrintOptions);
    }

    this.options.stream.write(`${logString}\n`);
    if (this.options.verbose && !this.options.json) {
      const {
        context: _context,
        application: _application,
        correlationId: _correlationId,
        ...meta
      } = options;
      const verboseLogString = this.formatStream(meta, formattedLevel, ogmaPrintOptions);

      this.options.stream.write(`${verboseLogString}\n`);
    }
  }

  private circularReplacer(): (key: string, value: any) => string {
    const seen = new WeakSet();
    return (key: string, value: any): string => {
      if (typeof value === 'symbol') {
        return this.wrapInBrackets(value.toString());
      }
      if (typeof value === 'function') {
        return this.wrapInBrackets(`Function: ${value.name || '(anonymous)'}`);
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return this.wrapInBrackets('Circular');
        }
        seen.add(value);
      }
      if (this.options.masks.includes(key)) {
        return '*'.repeat(value.toString().length);
      }
      return value;
    };
  }

  private toColor(level: LogLevel, color: Color): string {
    const levelString = this.wrapInBrackets(this.options.levelMap[LogLevel[level]]).padEnd(7);
    return colorize(levelString, color, this.styler, this.options.color);
  }

  private wrapInBrackets(valueToBeWrapper: string): string {
    return `[${valueToBeWrapper}]`;
  }

  private formatJSON(
    message: any,
    level: LogLevel,
    { application = '', correlationId = '', context = '', ...meta }: OgmaPrintOptions,
  ): string {
    let json: Partial<OgmaLog> = {
      time: this.getTimestamp(),
    };

    const mappedLevel = this.options.levelMap[LogLevel[level] as keyof typeof LogLevel];

    if (this.options.logHostname) {
      json.hostname = this.hostname;
    }

    if (this.options.logApplication) {
      json.application = application || this.options.application || undefined;
    }

    if (this.options.logPid) {
      json.pid = Number(this.pid);
    }

    json.correlationId = correlationId;
    json.context = context || this.options.context || undefined;
    json.level = mappedLevel;
    json.ool = LogLevel[level] as OgmaWritableLevel;
    if (this.options.levelKey) {
      json[this.options.levelKey] = mappedLevel;
    }
    if (typeof message === 'object') {
      json = { ...json, ...message };
      // delete json.message;
    } else {
      json.message = message;
    }
    if (meta && Object.keys(meta).length) {
      json.meta = meta;
    }
    return JSON.stringify(json, this.circularReplacer());
  }

  private stringifyObject(
    message: any,
    prependNewline = true,
    addSpace = false,
    skipRegex = false,
  ): any {
    let result: string = message;

    if (typeof message === 'object' && !(message instanceof Error)) {
      result = `${prependNewline ? '\n' : ''}${JSON.stringify(
        message,
        this.circularReplacer(),
        2,
      )}`;
    }

    if (skipRegex) return `${result}`;

    return `${result}${checkIfHasSpaceRegex.test(result) && addSpace ? ' ' : ''}`;
  }

  private formatStream(
    message: any,
    formattedLevel: string,
    { application = '', correlationId = '', context = '', each = this.each }: OgmaPrintOptions,
  ): string {
    if (Array.isArray(message) && each) {
      for (let i = 0; i < message.length; i++) {
        message[i] = this.stringifyObject(message[i], i === 0, i + 1 < message.length);
      }
      message = message.join('');
    } else {
      message = this.stringifyObject(message, true, false, true);
    }

    const { logHostname, logApplication, logPid } = this.options;

    const logContext = this.toStreamColor(context || this.options.context, Color.CYAN);
    const logCorrelationId = correlationId ? this.wrapInBrackets(correlationId) : '';

    const timestamp = this.wrapInBrackets(this.getTimestamp());
    const hostname = logHostname ? this.hostnameFormatted : '';

    const applicationName = logApplication
      ? this.toStreamColor(application || this.options.application, Color.YELLOW) + ' '
      : '';

    const pid = logPid ? this.wrapInBrackets(this.pid) + ' ' : '';

    return `${timestamp} ${formattedLevel} ${hostname}${applicationName}${pid}${logCorrelationId} ${logContext} ${message}`;
  }

  private toStreamColor(value: string, color: Color): string {
    if (!value) {
      return '';
    }

    if (this.cachedContextFormatted.has(value) && this.cachedContextFormatted.get(value).has(color))
      return this.cachedContextFormatted.get(value).get(color);

    if (!this.cachedContextFormatted.has(value)) this.cachedContextFormatted.set(value, new Map());

    const cachedValue = colorize(
      this.wrapInBrackets(value),
      color,
      this.styler,
      this.options.color,
    );

    this.cachedContextFormatted.get(value).set(color, cachedValue);

    return cachedValue;
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Make a log at the least important level possible. Could be fun for Easter Eggs if you like adding those in.
   * Prints the level in a magenta color
   * @param message what to log
   * @param meta any additional information you want to add
   */
  public silly(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, LogLevel.SILLY, this.sillyFormattedLevel, meta);
  }

  /**
   * Make a log at the `fine` or `verbose` level. Great for adding in some nitty gritty details.
   * Prints the level in a green color
   * @param message what to log
   * @param meta any additional information you want to add
   */
  public verbose(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, LogLevel.VERBOSE, this.verboseFormattedLevel, meta);
  }

  /**
   * Make a log at the `debug` level. Good for quick messages while debugging that shouldn't make it to production.
   * Prints the level in a blue color
   * @param message what to log
   * @param meta any additional information you want to add
   */
  public debug(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, LogLevel.DEBUG, this.debugFormattedLevel, meta);
  }

  /**
   * Makes a log at the `info` level. This is where most of the logging is done generally.
   * Prints the level in a cyan color
   * @param message what to log
   * @param meta any additional information you want to add
   */
  public info(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, LogLevel.INFO, this.infoFormattedLevel, meta);
  }

  /**
   * Makes a log at the `info` level. This is where most of the logging is done generally.
   * Prints the level in a cyan color
   * @param message what to log
   * @param meta any additional information you want to add
   */
  public warn(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, LogLevel.WARN, this.warnFormattedLevel, meta);
  }

  /**
   * Makes a log at the `info` level. This is where most of the logging is done generally.
   * Prints the level in a cyan color
   * @param message what to log
   * @param meta any additional information you want to add
   */
  public error(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, LogLevel.ERROR, this.errorFormattedLevel, meta);
  }

  /**
   * Makes a log at the `fatal` level. This is for mission critical problems. Usually if a `fatal` log is made, someone should be getting a call at 3AM.
   * Prints the level in a red background with white underline and lettering
   * Prints the level in a cyan color
   * @param message what to log
   * @param meta any additional information you want to add
   */
  public fatal(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, LogLevel.FATAL, this.fatalFormattedLevel, meta);
  }

  /**
   * Splits up the error between it's name, message, and stack.
   * The name is logged at the `error` level,
   * the message at the `warn` level,
   * and the stack trace at the `verbose` level.
   * @param error The error to print
   * @param meta any additional information you want to add
   */
  public printError(error: Error, meta?: OgmaPrintOptions): void {
    this.error(error.name, meta);
    this.warn(error.message, meta);
    this.verbose('\n' + error.stack, meta);
  }
}
