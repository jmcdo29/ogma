import { hostname } from 'os';
import { Color, LogLevel } from '../enums';
import { OgmaDefaults, OgmaOptions } from '../interfaces';
import { colorize } from '../utils/colorize';

interface JSONLog {
  level: keyof typeof LogLevel;
  time: string;
  message?: any;
  context?: string;
  pid: number;
  application?: string;
  hostname: string;
  requestId?: string;
}

interface PrintMessageOptions {
  level: LogLevel;
  formattedLevel: string;
  application?: string;
  context?: string;
  requestId?: string;
}

function isNil(val: any): boolean {
  return val === undefined || val === null || val === '';
}

export class Ogma {
  private options: OgmaOptions;
  private pid: number;
  private hostname: string;

  public fine = this.verbose;
  public log = this.info;

  [index: string]: any;

  /**
   * Ogma constructor. Creates a new instance of Ogma
   *
   * @param options Partial of OgmaOptions which you want to use for your Ogma instance.
   * Options include:
   *
   * * logLevel: The level of logs you want to show. Passed as a string
   * * color: `true` if you want color, `false` if you don't. If your terminal does not allow color, this option will be ignored
   * * stream: an object with a `write(message: any) => void` property. Useful if you want to log to a file instead of the console
   */
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
  }

  private circularReplacer(): (key: string, value: any) => string {
    const seen = new WeakSet();
    return (key: string, value: any): string => {
      if (typeof value === 'symbol') {
        return this.wrapInBrackets(value.toString());
      }
      if (typeof value === 'function') {
        console.log(value);
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
    return colorize(
      levelString,
      color,
      this.options.color,
      this.options.stream,
    );
  }

  private wrapInBrackets(valueToBeWrapper: string): string {
    return `[${valueToBeWrapper}]`;
  }

  private formatJSON(
    message: any,
    { application, requestId, context, level }: PrintMessageOptions,
  ): string {
    let json: Partial<JSONLog> = {
      time: this.getTimestamp(),
    };
    json.application = application || this.options.application || undefined;
    json.pid = this.pid;
    json.hostname = this.hostname;
    json.requestId = requestId;
    json.context = context || this.options.context || undefined;
    json.level = LogLevel[level] as keyof typeof LogLevel;
    if (typeof message === 'object') {
      json = { ...json, ...message };
      delete json.message;
    } else {
      json.message = message;
    }
    return JSON.stringify(json, this.circularReplacer());
  }

  private formatStream(
    message: any,
    { application, requestId, formattedLevel, context }: PrintMessageOptions,
  ): string {
    if (typeof message === 'object') {
      message = '\n' + JSON.stringify(message, this.circularReplacer(), 2);
    }
    application = this.toStreamColor(
      application || this.options.application,
      Color.YELLOW,
    );
    context = this.toStreamColor(context || this.options.context, Color.CYAN);

    const hostname = this.toStreamColor(this.hostname, Color.MAGENTA);
    const timestamp = this.wrapInBrackets(this.getTimestamp());
    return `${timestamp} ${hostname} ${application}${this.pid} ${requestId}${context}${formattedLevel}| ${message}`;
  }

  private toStreamColor(value: string, color: Color): string {
    if (!value) {
      return '';
    }
    return colorize(
      this.wrapInBrackets(value),
      color,
      this.options.color,
      this.options.stream,
    );
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Silly log level. Prints SILLY in purple when color is enabled
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   * @param requestId id of request
   */
  public silly(
    message: any,
    context?: string,
    application?: string,
    requestId?: string,
  ): void {
    this.printMessage(message, {
      level: LogLevel.SILLY,
      formattedLevel: this.toColor(LogLevel.SILLY, Color.MAGENTA),
      application,
      context,
      requestId,
    });
  }

  /**
   * Verbose log level. Prints FINE in green when color is enabled
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   * @param requestId id of request
   */
  public verbose(
    message: any,
    context?: string,
    application?: string,
    requestId?: string,
  ): void {
    this.printMessage(message, {
      level: LogLevel.VERBOSE,
      formattedLevel: this.toColor(LogLevel.VERBOSE, Color.GREEN),
      application,
      context,
      requestId,
    });
  }

  /**
   * Debug log level. Prints DEBUG in blue when color is enabled
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   * @param requestId id of request
   */
  public debug(
    message: any,
    context?: string,
    application?: string,
    requestId?: string,
  ): void {
    this.printMessage(message, {
      level: LogLevel.DEBUG,
      formattedLevel: this.toColor(LogLevel.DEBUG, Color.BLUE),
      application,
      context,
      requestId,
    });
  }

  /**
   * Info log level. Prints INFO in cyan when color is enabled.
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   * @param requestId id of request
   */
  public info(
    message: any,
    context?: string,
    application?: string,
    requestId?: string,
  ): void {
    this.printMessage(message, {
      level: LogLevel.INFO,
      formattedLevel: this.toColor(LogLevel.INFO, Color.CYAN),
      application,
      context,
      requestId,
    });
  }

  /**
   * Warn log level. Prints WARN in yellow when color is enabled.
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   * @param requestId id of request
   */
  public warn(
    message: any,
    context?: string,
    application?: string,
    requestId?: string,
  ): void {
    this.printMessage(message, {
      level: LogLevel.WARN,
      formattedLevel: this.toColor(LogLevel.WARN, Color.YELLOW),
      application,
      context,
      requestId,
    });
  }

  /**
   * Error log level. Prints ERROR in red when color is enabled.
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   * @param requestId id of request
   */
  public error(
    message: any,
    context?: string,
    application?: string,
    requestId?: string,
  ): void {
    this.printMessage(message, {
      level: LogLevel.ERROR,
      formattedLevel: this.toColor(LogLevel.ERROR, Color.RED),
      application,
      context,
      requestId,
    });
  }

  /**
   * Fatal log level. Prints FATAL in red when color is enabled.
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   * @param requestId id of request
   */
  public fatal(
    message: any,
    context?: string,
    application?: string,
    requestId?: string,
  ): void {
    this.printMessage(message, {
      level: LogLevel.FATAL,
      formattedLevel: this.toColor(LogLevel.FATAL, Color.RED),
      application,
      context,
      requestId,
    });
  }

  /**
   * Error printing utility method. Made to make things easier
   *
   * @param error The error that is to be printed. The name, message, and stack trace will be printed
   * at the Error, Warn, and Verbose log level respectively
   * @param context string context of log
   * @param application string name of appliction
   * @param requestId string id of an request
   */
  public printError(
    error: Error,
    context?: string,
    application?: string,
    requestId?: string,
  ): void {
    this.error(error.name, context, application, requestId);
    this.warn(error.message, context, application, requestId);
    this.verbose('\n' + error.stack, context, application, requestId);
  }
}
