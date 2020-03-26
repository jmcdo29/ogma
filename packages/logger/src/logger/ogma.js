"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const interfaces_1 = require("../interfaces");
const colorize_1 = require("../utils/colorize");
class Ogma {
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
    constructor(options) {
        this.fine = this.verbose;
        this.log = this.info;
        if (options === null || options === void 0 ? void 0 : options.logLevel) {
            options.logLevel = options.logLevel.toUpperCase();
        }
        this.options = Object.assign(Object.assign({}, interfaces_1.OgmaDefaults), options);
        for (const key of Object.keys(this.options)) {
            this.options[key] =
                this.options[key] === undefined || this.options[key] === null
                    ? interfaces_1.OgmaDefaults[key]
                    : this.options[key];
        }
        if ((options === null || options === void 0 ? void 0 : options.logLevel) && enums_1.LogLevel[options.logLevel] === undefined) {
            this.options.logLevel = interfaces_1.OgmaDefaults.logLevel;
            this.warn(`Ogma logLevel was set to ${options.logLevel} which does not match a defined logLevel. Falling back to default instead.`);
        }
    }
    printMessage(level, formattedLevel, message, application, context) {
        if (level < enums_1.LogLevel[this.options.logLevel]) {
            return;
        }
        let logString = '';
        if (this.options.json) {
            logString = this.formatJSON(level, message, application, context);
        }
        else {
            logString = this.formatStream(formattedLevel, message, application, context);
        }
        this.options.stream.write(`${logString}\n`);
    }
    circularReplacer() {
        const seen = new WeakSet();
        return (key, value) => {
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
    toColor(level, color) {
        const levelString = this.wrapInBrackets(enums_1.LogLevel[level]).padEnd(7);
        return colorize_1.colorize(levelString, color, this.options.color, this.options.stream);
    }
    wrapInBrackets(valueToBeWrapper) {
        return '[' + valueToBeWrapper + ']';
    }
    formatJSON(level, message, application, context) {
        let json = {
            time: this.getTimestamp(),
        };
        if (application || this.options.application) {
            json.application = application || this.options.application;
        }
        json.pid = process.pid;
        if (context || this.options.context) {
            json.context = context || this.options.context;
        }
        json.level = enums_1.LogLevel[level];
        if (typeof message === 'object') {
            json = Object.assign(Object.assign({}, json), message);
            delete json.message;
        }
        else {
            json.message = message;
        }
        return JSON.stringify(json, this.circularReplacer());
    }
    formatStream(formattedLevel, message, application, context) {
        if (typeof message === 'object') {
            message = '\n' + JSON.stringify(message, this.circularReplacer(), 2);
        }
        const arrayString = [
            this.wrapInBrackets(this.getTimestamp()),
        ];
        if (application || this.options.application) {
            arrayString.push(colorize_1.colorize(this.wrapInBrackets(application || this.options.application), enums_1.Color.YELLOW, this.options.color, this.options.stream));
        }
        arrayString.push(process.pid);
        if (context || this.options.context) {
            arrayString.push(colorize_1.colorize(this.wrapInBrackets(context || this.options.context), enums_1.Color.CYAN, this.options.color, this.options.stream));
        }
        arrayString.push(formattedLevel + '|', message);
        return arrayString.join(' ');
    }
    getTimestamp() {
        return new Date().toISOString();
    }
    /**
     * Silly log level. Prints SILLY in purple when color is enabled
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    silly(message, context, application) {
        this.printMessage(enums_1.LogLevel.SILLY, this.toColor(enums_1.LogLevel.SILLY, enums_1.Color.MAGENTA), message, application, context);
    }
    /**
     * Verbose log level. Prints FINE in green when color is enabled
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    verbose(message, context, application) {
        this.printMessage(enums_1.LogLevel.VERBOSE, this.toColor(enums_1.LogLevel.VERBOSE, enums_1.Color.GREEN), message, application, context);
    }
    /**
     * Debug log level. Prints DEBUG in blue when color is enabled
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    debug(message, context, application) {
        this.printMessage(enums_1.LogLevel.DEBUG, this.toColor(enums_1.LogLevel.DEBUG, enums_1.Color.BLUE), message, application, context);
    }
    /**
     * Info log level. Prints INFO in cyan when color is enabled.
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    info(message, context, application) {
        this.printMessage(enums_1.LogLevel.INFO, this.toColor(enums_1.LogLevel.INFO, enums_1.Color.CYAN), message, application, context);
    }
    /**
     * Warn log level. Prints WARN in yellow when color is enabled.
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    warn(message, context, application) {
        this.printMessage(enums_1.LogLevel.WARN, this.toColor(enums_1.LogLevel.WARN, enums_1.Color.YELLOW), message, application, context);
    }
    /**
     * Error log level. Prints ERROR in red when color is enabled.
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    error(message, context, application) {
        this.printMessage(enums_1.LogLevel.ERROR, this.toColor(enums_1.LogLevel.ERROR, enums_1.Color.RED), message, application, context);
    }
    /**
     * Fatal log level. Prints FATAL in red when color is enabled.
     *
     * @param message the message to print out. Can also be a JSON object
     * @param context the context to add the the log. Can be used to override class setting
     * @param application the application name to add to the log. Can be used to override class setting
     */
    fatal(message, context, application) {
        this.printMessage(enums_1.LogLevel.FATAL, this.toColor(enums_1.LogLevel.FATAL, enums_1.Color.RED), message, application, context);
    }
    /**
     * Error printing utility method. Made to make things easier
     *
     * @param error The error that is to be printed. The name, message, and stack trace will be printed
     * at the Error, Warn, and Verbose log level respectively
     */
    printError(error, context, application) {
        this.error(error.name, context, application);
        this.warn(error.message, context, application);
        this.verbose('\n' + error.stack, context, application);
    }
}
exports.Ogma = Ogma;
//# sourceMappingURL=ogma.js.map