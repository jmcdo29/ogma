import { Color, LogLevel, OgmaStream } from '@ogma/common';
import { style, Styler } from '@ogma/styler';
import stringify from 'fast-safe-stringify';
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
  private readonly pid: string;
  private readonly hostname: string;
  private styler: Styler;
  private each: boolean;
  private readonly application: string;

  private cachedContextFormatted: Map<string, Map<Color, string>> = new Map();
  private sillyFormattedLevel: string;
  private verboseFormattedLevel: string;
  private debugFormattedLevel: string;
  private infoFormattedLevel: string;
  private warnFormattedLevel: string;
  private errorFormattedLevel: string;
  private fatalFormattedLevel: string;
  private hostnameFormatted: string;

  private cachedMasks?: Map<string, boolean>;
  private skipableTypeofValues = new Map<string, boolean>([
    ['number', true],
    ['string', true],
    ['boolean', true],
    ['undefined', true],
  ]);

  private wrappedValues: Record<string, string> = {};

  /**
   * An alias for `ogma.verbose`. `FINE` is what is printed as the log level
   */
  public fine = this.verbose;
  /**
   * An alias for `ogma.info`. `INFO` is what is printed as the log level
   */
  public log = this.info;

  /**
   * The [`@ogma/styler`](https://ogma.jaymcdoniel.dev/en/styler)
   * instance that the logger uses for custom coloring without needing
   * to manage a new styler instance
   */
  public get style() {
    return this.styler;
  }

  constructor(options?: Partial<OgmaOptions>) {
    if (options?.logLevel) {
      options.logLevel = options.logLevel.toUpperCase() as keyof typeof LogLevel;
    }
    options &&
      Object.keys(options)
        .filter((key) => isNil(options[key]))
        .forEach((key) => delete options[key]);
    this.options = { ...OgmaDefaults, ...(options as OgmaOptions) };
    this.pid = this.wrapInBrackets(process.pid.toString()) + ' ';
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
    this.application = this.options.application;
    if (!this.options.logApplication) {
      this.application = undefined;
    }
    if (!this.options.logHostname) {
      this.hostname = undefined;
    }
    if (!this.options.logPid) {
      this.pid = '';
    }
    if (this.options.json) {
      this.hostname &&= `"hostname":${this.asString(this.hostname)},`;
      this.pid &&= `"pid":${process.pid},`;
      this.options.stream.getColorDepth = () => 1;
    }
    this.cachedMasks = this.options?.masks
      ? new Map(this.options.masks.map((mask) => [mask, true]))
      : undefined;
    this.styler = style.child(this.options.stream as Pick<OgmaStream, 'getColorDepth'>);
    this.each = this.options.each;
    this.sillyFormattedLevel = this.toColor(LogLevel.SILLY, Color.MAGENTA);
    this.verboseFormattedLevel = this.toColor(LogLevel.VERBOSE, Color.GREEN);
    this.debugFormattedLevel = this.toColor(LogLevel.DEBUG, Color.BLUE);
    this.infoFormattedLevel = this.toColor(LogLevel.INFO, Color.CYAN);
    this.warnFormattedLevel = this.toColor(LogLevel.WARN, Color.YELLOW);
    this.errorFormattedLevel = this.toColor(LogLevel.ERROR, Color.RED);
    this.hostnameFormatted = this.options.logHostname
      ? this.toStreamColor(this.hostname, Color.MAGENTA) + ' '
      : '';
    this.fatalFormattedLevel = this.styler.redBg.white.underline.apply(
      this.wrapInBrackets(LogLevel[LogLevel.FATAL]),
    );
  }

  private setStreamColorDepth(): void {
    let colorDepthVal: number;
    if (this.options.color) {
      colorDepthVal = 4;
    }
    if (this.options.color === false || this.options.json) {
      colorDepthVal = 1;
    }
    if (!colorDepthVal && this.options.stream !== process.stdout && process.stdout.getColorDepth) {
      colorDepthVal = process.stdout.getColorDepth();
    }
    this.options.stream.getColorDepth = () => colorDepthVal ?? 1;
  }

  private printMessage(
    message: unknown,
    logLevel: LogLevel,
    formattedLevel: string,
    options?: OgmaPrintOptions,
  ): void {
    const ogmaPrintOptions = options ?? {};
    let mixin: Record<string, unknown>;
    if (logLevel < LogLevel[this.options.logLevel]) {
      return;
    }

    if (this.options.mixin) {
      mixin = this.options.mixin(logLevel, this);
    }

    let logString = '';

    if (this.options.json) {
      logString = this.formatJSON(message, logLevel, { ...ogmaPrintOptions, ...(mixin ?? {}) });
    } else {
      if (mixin) {
        if (typeof message === 'object') {
          message = { ...message, ...mixin };
        } else {
          message = { message, ...mixin };
        }
      }
      logString = this.formatStream(message, formattedLevel, ogmaPrintOptions);
    }

    this.options.stream.write(`${logString}\n`);
    if (this.options.verbose && !this.options.json) {
      const {
        context: _context,
        application: _application,
        correlationId: _correlationId,
        ...meta
      } = ogmaPrintOptions;
      const verboseLogString = this.formatStream(meta, formattedLevel, ogmaPrintOptions);

      this.options.stream.write(`${verboseLogString}\n`);
    }
  }

  private circularReplacer(): (key: string, value: any) => string | number | boolean {
    const seen = new WeakSet();
    return (key: string, value: any): string | number | boolean => {
      if (this.cachedMasks?.has(key)) {
        return '*'.repeat(value?.toString().length ?? 9);
      }

      if (value === null) return value;

      const typeofValue = typeof value;

      if (this.skipableTypeofValues.has(typeofValue)) return value;

      if (typeofValue === 'bigint') {
        return this.wrapInBrackets(`BigInt: ${value.toString()}`);
      }

      if (typeofValue === 'symbol') {
        return this.wrapInBrackets(`Symbol: ${value.description}`);
      }

      if (typeofValue === 'function') {
        return this.wrapInBrackets(`Function: ${value.name || '(anonymous)'}`);
      }

      if (typeofValue === 'object') {
        if (seen.has(value)) {
          return this.wrapInBrackets('Circular');
        }
        seen.add(value);
      }

      return value;
    };
  }

  private toColor(level: LogLevel, color: Color): string {
    const levelString = this.wrapInBrackets(this.options.levelMap[LogLevel[level]]).padEnd(7);
    return colorize(levelString, color, this.styler, this.options.color);
  }

  private wrapInBrackets(valueToBeWrapped: string): string {
    let retVal = this.wrappedValues[valueToBeWrapped];
    if (retVal) {
      return retVal;
    }
    retVal = `[${valueToBeWrapped}]`;
    this.wrappedValues[valueToBeWrapped] = retVal;
    return retVal;
  }

  private formatJSON(
    message: unknown,
    level: LogLevel,
    {
      application = this.application,
      correlationId,
      context = this.options.context,
      ...meta
    }: OgmaPrintOptions,
  ): string {
    const mappedLevel = this.asString(
      this.options.levelMap[LogLevel[level] as keyof typeof LogLevel],
    );

    let fastJson = `{"time":${Date.now()},`;

    fastJson += this.hostname ?? '';
    fastJson += this.pid ?? '';
    fastJson += `"ool":${this.asString(LogLevel[level])},`;
    fastJson += `"level":${mappedLevel},`;

    if (application) {
      fastJson += `"application":${this.asString(application)},`;
    }
    if (correlationId) {
      fastJson += `"correlationId":${this.asString(correlationId)},`;
    }
    if (context) {
      fastJson += `"context":${this.asString(context)},`;
    }
    if (meta && Object.keys(meta).length > 0) {
      fastJson += `"meta":${stringify(meta)},`;
    }
    if (this.options.levelKey) {
      fastJson += `"${this.options.levelKey}":${mappedLevel},`;
    }
    if (typeof message === 'object')
      fastJson += `"message":${stringify(message, this.circularReplacer())}`;
    else if (message !== undefined) {
      fastJson += `"message":${this.asString(message.toString())}`;
    }
    fastJson += '}';

    return fastJson;
  }

  // thanks pinojs, ref: https://github.com/pinojs/pino/blob/master/lib/tools.js#L67
  // magically escape strings for json
  // relying on their charCodeAt
  // everything below 32 needs JSON.stringify()
  // 34 and 92 happens all the time, so we
  // have a fast case for them
  private asString(str: string): string {
    let result = '';
    let last = 0;
    let found = false;
    let point = 255;
    const l = str.length;
    if (l > 100) {
      return JSON.stringify(str);
    }
    for (let i = 0; i < l && point >= 32; i++) {
      point = str.charCodeAt(i);
      if (point === 34 || point === 92) {
        result += str.slice(last, i) + '\\';
        last = i;
        found = true;
      }
    }
    if (!found) {
      result = str;
    } else {
      result += str.slice(last);
    }
    return point < 32 ? JSON.stringify(str) : '"' + result + '"';
  }

  private stringifyObject(
    message: any,
    prependNewline = true,
    addSpace = false,
    skipRegex = false,
  ): any {
    let result: string = message;

    if (typeof message === 'object' && !(message instanceof Error)) {
      result = `${prependNewline ? '\n' : ''}${stringify(message, this.circularReplacer(), 2)}`;
    }

    if (skipRegex) return `${result}`;

    return `${result}${checkIfHasSpaceRegex.test(result) && addSpace ? ' ' : ''}`;
  }

  private formatStream(
    message: unknown,
    formattedLevel: string,
    { application = '', correlationId = '', context = '', each = this.each }: OgmaPrintOptions,
  ): string {
    if (Array.isArray(message) && each) {
      const messages = message;
      message = '';
      for (let i = 0; i < messages.length; i++) {
        message += this.stringifyObject(messages[i], i === 0, i + 1 < messages.length);
      }
    } else {
      message = this.stringifyObject(message, true, false, true);
    }

    const logContext = this.toStreamColor(context || this.options.context, Color.CYAN);
    const logCorrelationId = correlationId ? this.wrapInBrackets(correlationId) : '';

    const timestamp = this.wrapInBrackets(this.getTimestamp());

    const applicationName = this.application
      ? this.toStreamColor(application || this.application, Color.YELLOW) + ' '
      : '';
    return `${timestamp} ${formattedLevel} ${this.hostnameFormatted}${applicationName}${this.pid}${logCorrelationId} ${logContext} ${message}`;
  }

  private toStreamColor(value: string, color: Color): string {
    if (!value) {
      return '';
    }

    if (
      this.cachedContextFormatted.has(value) &&
      this.cachedContextFormatted.get(value).has(color)
    ) {
      return this.cachedContextFormatted.get(value).get(color);
    }

    if (!this.cachedContextFormatted.has(value)) {
      this.cachedContextFormatted.set(value, new Map());
    }

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
   * Create a new instance of ogma using pre-existing options while being able to pass in new options to override specific values. Useful for when there's a default configuration you'd like to make use of with slightly different modifications elsewhere
   * @param newOptions overriding options for the new logger instance
   * @returns a new ogma instance using the original logger's options, merged with the new options passed
   */
  child(newOptions: Partial<OgmaOptions>): Ogma {
    return new Ogma({ ...this.options, ...newOptions });
  }

  /**
   * Change the set log level for the Ogma logger
   * @param the new log level
   */
  public setLogLevel(level: keyof typeof LogLevel) {
    this.options.logLevel = level;
    return this;
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
