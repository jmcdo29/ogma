import { LogLevel, OgmaStream, OgmaWritableLevel } from '@ogma/common';

export interface OgmaOptions {
  /**
   * The maximum level you want your logs to be printed at.
   * If `ogma` is called to print at a level higher than this value
   * the log is not printed in the end.
   *
   * e.g. Level is set to WARN but INFO is used, the log will be skipped
   * @default 'INFO'
   */
  logLevel: keyof typeof LogLevel;
  /**
   * If color should be used or not. If set to `true` and there's no `getColorDepth`
   * on the stream, `ogma` will set the property to a method that returns 4.
   * @default true
   */
  color: boolean;
  /**
   * The writing transport method Ogma uses.
   * @default `process.stdout` if in a Node environment
   * @default `{ write: console.log, getColorDepth: () => 1}` if in a browser environment
   */
  stream: OgmaStream;
  /**
   * If `ogma` should print in the JSON format instead of the string format
   * @default false
   */
  json: boolean;
  /**
   * A context value to add to all logs by default. This value can be overridden at log time
   * This value shows up in a cyan color when color is enabled
   * @default ''
   */
  context: string;
  /**
   * The application value to add to all logs by default. This value can be overridden at log time.
   * This value shows up in a yellow color when color is enabled
   * @default ''
   */
  application: string;
  /**
   * A value to say if you want to log pid or not
   */
  logPid?: boolean;
  /**
   * A value to say if you want to log application name or not
   */
  logApplication?: boolean;
  /**
   * A value to say if you want to log hostname or not
   */
  logHostname?: boolean;
  /**
   * A value to say if you want to log the extra meta values in string mode or not.
   * @default false
   * @link https://github.com/jmcdo29/ogma/issues/297
   */
  verbose?: boolean;
  /**
   * A map to set up custom mapping between Ogma's default write levels, and what is printed in the terminal
   * @default {
      WARN: 'WARN',
      SILLY: 'SILLY',
      DEBUG: 'DEBUG',
      FATAL: 'FATAL',
      ERROR: 'ERROR',
      INFO: 'INFO',
      FINE: 'FINE',
    }
   */
  levelMap?: Record<OgmaWritableLevel, string>;
  levelKey?: string;
  /**
   * an array of words that should be replaced while logging.  useful for sensitive information like passwords.
   *
   * **Note**: Ths will only affect objects that are being logged, not direct string
   *
   * e.g.
   * ```ts
   * ogma.log({
   *   username: 'user1',
   *   password: 'somepassword'
   * })
   * ```
   * Will log
   * ```
   * {
   *   username: 'user1',
   *   password: '************'
   * }
   * ```
   * While
   * ```ts
   * ogma.log('password=somepassword')
   * ```
   * will log
   * ```
   * password=somepassword
   * ```
   *
   * Use with caution as determining if properties should be restricted may take away from _some_ performance
   */
  masks?: string[];
  [index: string]: any;
}

export const OgmaDefaults: OgmaOptions = {
  logLevel: 'INFO',
  color: true,
  stream: process ? process.stdout : { getColorDepth: () => 1, write: console.log },
  json: false,
  context: '',
  application: '',
  verbose: false,
  levelMap: {
    WARN: 'WARN',
    SILLY: 'SILLY',
    DEBUG: 'DEBUG',
    FATAL: 'FATAL',
    ERROR: 'ERROR',
    INFO: 'INFO',
    FINE: 'FINE',
  },
  masks: [],
  logPid: true,
  logApplication: true,
  logHostname: true,
};
