import { LogLevel, OgmaStream, OgmaWritableLevel } from '@ogma/common';

export interface OgmaOptions {
  logLevel: keyof typeof LogLevel;
  color: boolean;
  stream: OgmaStream;
  json: boolean;
  context: string;
  application: string;
  verbose?: boolean;
  levelMap?: Record<OgmaWritableLevel, string>;
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
};
