import { OgmaOptions } from '../interfaces';
export declare class Ogma {
    private options;
    fine: (message: any, context?: string, application?: string) => void;
    log: (message: any, context?: string, application?: string) => void;
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
    constructor(options?: Partial<OgmaOptions>);
    private printMessage;
    private circularReplacer;
    private toColor;
    private wrapInBrackets;
    private formatJSON;
    private formatStream;
    private getTimestamp;
    /**
     * Silly log level. Prints SILLY in purple when color is enabled
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    silly(message: any, context?: string, application?: string): void;
    /**
     * Verbose log level. Prints FINE in green when color is enabled
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    verbose(message: any, context?: string, application?: string): void;
    /**
     * Debug log level. Prints DEBUG in blue when color is enabled
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    debug(message: any, context?: string, application?: string): void;
    /**
     * Info log level. Prints INFO in cyan when color is enabled.
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    info(message: any, context?: string, application?: string): void;
    /**
     * Warn log level. Prints WARN in yellow when color is enabled.
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    warn(message: any, context?: string, application?: string): void;
    /**
     * Error log level. Prints ERROR in red when color is enabled.
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    error(message: any, context?: string, application?: string): void;
    /**
     * Fatal log level. Prints FATAL in red when color is enabled.
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    fatal(message: any, context?: string, application?: string): void;
    /**
     * Error printing utility method. Made to make things easier
     *
     * @param error The error that is to be printed. The name, message, and stack trace will be printed
     * at the Error, Warn, and Verbose log level respectively
     */
    printError(error: Error, context?: string, application?: string): void;
}
