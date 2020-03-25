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
}

export class Ogma {
  private options: OgmaOptions;

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
    this.options = { ...OgmaDefaults, ...options };
    for (const key of Object.keys(this.options)) {
      this.options[key] =
        this.options[key] === undefined || this.options[key] === null
          ? OgmaDefaults[key]
          : this.options[key];
    }
    if (options?.logLevel && LogLevel[options.logLevel] === undefined) {
      this.options.logLevel = OgmaDefaults.logLevel;
      this.warn(
        `Ogma logLevel was set to ${options.logLevel} which does not match a defined logLevel. Falling back to default instead.`,
      );
    }
  }

  private printMessage(
    level: LogLevel,
    formattedLevel: string,
    message: any,
    application?: string,
    context?: string,
  ): void {
    if (level < LogLevel[this.options.logLevel]) {
      return;
    }
    let logString = '';
    if (this.options.json) {
      logString = this.formatJSON(level, message, application, context);
    } else {
      logString = this.formatStream(
        formattedLevel,
        message,
        application,
        context,
      );
    }
    this.options.stream.write(`${logString}\n`);
  }

  private circularReplacer(): (key: string, value: any) => string {
    const seen = new WeakSet();
    return (key: string, value: any): string => {
      if (typeof value === 'function') {
        return '[Function]';
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
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
    return '[' + valueToBeWrapper + ']';
  }

  private formatJSON(
    level: LogLevel,
    message: any,
    application?: string,
    context?: string,
  ): string {
    let json: Partial<JSONLog> = {
      time: this.getTimestamp(),
    };
    if (application || this.options.application) {
      json.application = application || this.options.application;
    }
    json.pid = process.pid;
    if (context || this.options.context) {
      json.context = context || this.options.context;
    }
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
    formattedLevel: string,
    message: any,
    application?: string,
    context?: string,
  ): string {
    if (typeof message === 'object') {
      message = '\n' + JSON.stringify(message, this.circularReplacer(), 2);
    }
    const arrayString: Array<string | number> = [
      this.wrapInBrackets(this.getTimestamp()),
    ];
    if (application || this.options.application) {
      arrayString.push(
        colorize(
          this.wrapInBrackets(application || this.options.application),
          Color.YELLOW,
          this.options.color,
          this.options.stream,
        ),
      );
    }
    arrayString.push(process.pid);
    if (context || this.options.context) {
      arrayString.push(
        colorize(
          this.wrapInBrackets(context || this.options.context),
          Color.CYAN,
          this.options.color,
          this.options.stream,
        ),
      );
    }
    arrayString.push(formattedLevel + '|', message);
    return arrayString.join(' ');
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
   */
  public silly(message: any, context?: string, application?: string): void {
    this.printMessage(
      LogLevel.SILLY,
      this.toColor(LogLevel.SILLY, Color.MAGENTA),
      message,
      application,
      context,
    );
  }

  /**
   * Verbose log level. Prints FINE in green when color is enabled
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   */
  public verbose(message: any, context?: string, application?: string): void {
    this.printMessage(
      LogLevel.VERBOSE,
      this.toColor(LogLevel.VERBOSE, Color.GREEN),
      message,
      application,
      context,
    );
  }

  /**
   * Debug log level. Prints DEBUG in blue when color is enabled
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   */
  public debug(message: any, context?: string, application?: string): void {
    this.printMessage(
      LogLevel.DEBUG,
      this.toColor(LogLevel.DEBUG, Color.BLUE),
      message,
      application,
      context,
    );
  }

  /**
   * Info log level. Prints INFO in cyan when color is enabled.
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   */
  public info(message: any, context?: string, application?: string): void {
    this.printMessage(
      LogLevel.INFO,
      this.toColor(LogLevel.INFO, Color.CYAN),
      message,
      application,
      context,
    );
  }

  /**
   * Warn log level. Prints WARN in yellow when color is enabled.
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   */
  public warn(message: any, context?: string, application?: string): void {
    this.printMessage(
      LogLevel.WARN,
      this.toColor(LogLevel.WARN, Color.YELLOW),
      message,
      application,
      context,
    );
  }

  /**
   * Error log level. Prints ERROR in red when color is enabled.
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   */
  public error(message: any, context?: string, application?: string): void {
    this.printMessage(
      LogLevel.ERROR,
      this.toColor(LogLevel.ERROR, Color.RED),
      message,
      application,
      context,
    );
  }

  /**
   * Fatal log level. Prints FATAL in red when color is enabled.
   *
   * @param message the message to print out. Can also be a JSON object
   * @param context the context to add the the log. Can be used to override class setting
   * @param application the application name to add to the log. Can be used to override class setting
   */
  public fatal(message: any, context?: string, application?: string): void {
    this.printMessage(
      LogLevel.FATAL,
      this.toColor(LogLevel.FATAL, Color.RED),
      message,
      application,
      context,
    );
  }

  /**
   * Error printing utility method. Made to make things easier
   *
   * @param error The error that is to be printed. The name, message, and stack trace will be printed
   * at the Error, Warn, and Verbose log level respectively
   */
  public printError(
    error: Error,
    context?: string,
    application?: string,
  ): void {
    this.error(error.name, context, application);
    this.warn(error.message, context, application);
    this.verbose('\n' + error.stack, context, application);
  }
}
