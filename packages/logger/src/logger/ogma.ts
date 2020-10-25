import { hostname } from 'os';
import { Color, LogLevel } from '../enums';
import { OgmaDefaults, OgmaLog, OgmaOptions, PrintMessageOptions } from '../interfaces';
import { OgmaPrintOptions } from '../interfaces/ogma-print-options';
import { colorize, isNil } from '../utils';

export class Ogma {
  private options: OgmaOptions;
  private pid: number;
  private hostname: string;

  public fine = this.verbose;
  public log = this.info;

  [index: string]: any;

  constructor(options?: Partial<OgmaOptions>) {
    if (options?.logLevel) {
      options.logLevel = options.logLevel.toUpperCase() as keyof typeof LogLevel;
    }
    options &&
      Object.keys(options)
        .filter((key) => isNil(options[key]))
        .forEach((key) => delete options[key]);
    this.options = { ...OgmaDefaults, ...options };
    if (options?.logLevel && LogLevel[options.logLevel] === undefined) {
      this.options.logLevel = OgmaDefaults.logLevel;
      this.warn(
        `Ogma logLevel was set to ${options.logLevel} which does not match a defined logLevel. Falling back to default instead.`,
      );
    }
    this.pid = process.pid;
    this.hostname = hostname();
  }

  private printMessage(message: any, options: PrintMessageOptions): void {
    if (options.level < LogLevel[this.options.logLevel]) {
      return;
    }
    let logString = '';
    if (this.options.json) {
      logString = this.formatJSON(message, options);
    } else {
      logString = this.formatStream(message, options);
    }
    this.options.stream.write(`${logString}\n`);
    if (this.options.verbose && !this.options.json) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { context, application, correlationId, level, formattedLevel, ...meta } = options;
      this.options.stream.write(this.formatStream(meta, options));
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
      return value;
    };
  }

  private toColor(level: LogLevel, color: Color): string {
    const levelString = this.wrapInBrackets(LogLevel[level]).padEnd(7);
    return colorize(levelString, color, this.options.color, this.options.stream);
  }

  private wrapInBrackets(valueToBeWrapper: string): string {
    return `[${valueToBeWrapper}]`;
  }

  private formatJSON(
    message: any,
    { application = '', correlationId = '', context = '', level, ...meta }: PrintMessageOptions,
  ): string {
    let json: Partial<OgmaLog> = {
      time: this.getTimestamp(),
    };
    delete meta.formattedLevel;
    json.application = application || this.options.application || undefined;
    json.pid = this.pid;
    json.hostname = this.hostname;
    json.correlationId = correlationId;
    json.context = context || this.options.context || undefined;
    json.level = LogLevel[level] as keyof typeof LogLevel;
    if (typeof message === 'object') {
      json = { ...json, ...message };
      delete json.message;
    } else {
      json.message = message;
    }
    if (meta && Object.keys(meta).length) {
      json.meta = meta;
    }
    return JSON.stringify(json, this.circularReplacer());
  }

  private formatStream(
    message: any,
    { application = '', correlationId = '', formattedLevel, context = '' }: PrintMessageOptions,
  ): string {
    if (typeof message === 'object') {
      message = '\n' + JSON.stringify(message, this.circularReplacer(), 2);
    }
    application = this.toStreamColor(application || this.options.application, Color.YELLOW);
    context = this.toStreamColor(context || this.options.context, Color.CYAN);

    const hostname = this.toStreamColor(this.hostname, Color.MAGENTA);
    const timestamp = this.wrapInBrackets(this.getTimestamp());
    return `${timestamp} ${hostname} ${application} ${this.pid} ${correlationId}${context}${formattedLevel}| ${message}`;
  }

  private toStreamColor(value: string, color: Color): string {
    if (!value) {
      return '';
    }
    return colorize(this.wrapInBrackets(value), color, this.options.color, this.options.stream);
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  public silly(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, {
      level: LogLevel.SILLY,
      formattedLevel: this.toColor(LogLevel.SILLY, Color.MAGENTA),
      ...meta,
    });
  }

  public verbose(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, {
      level: LogLevel.VERBOSE,
      formattedLevel: this.toColor(LogLevel.VERBOSE, Color.GREEN),
      ...meta,
    });
  }

  public debug(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, {
      level: LogLevel.DEBUG,
      formattedLevel: this.toColor(LogLevel.DEBUG, Color.BLUE),
      ...meta,
    });
  }

  public info(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, {
      level: LogLevel.INFO,
      formattedLevel: this.toColor(LogLevel.INFO, Color.CYAN),
      ...meta,
    });
  }

  public warn(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, {
      level: LogLevel.WARN,
      formattedLevel: this.toColor(LogLevel.WARN, Color.YELLOW),
      ...meta,
    });
  }

  public error(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, {
      level: LogLevel.ERROR,
      formattedLevel: this.toColor(LogLevel.ERROR, Color.RED),
      ...meta,
    });
  }

  public fatal(message: any, meta?: OgmaPrintOptions): void {
    this.printMessage(message, {
      level: LogLevel.FATAL,
      formattedLevel: this.toColor(LogLevel.FATAL, Color.RED),
      ...meta,
    });
  }

  public printError(error: Error, meta?: OgmaPrintOptions): void {
    this.error(error.name, meta);
    this.warn(error.message, meta);
    this.verbose('\n' + error.stack, meta);
  }
}
