import { LogLevel, OgmaStream } from '@ogma/common';

export interface OgmaOptions {
  logLevel: keyof typeof LogLevel;
  color: boolean;
  stream: OgmaStream;
  json: boolean;
  context: string;
  application: string;
  verbose?: boolean;
  [index: string]: any;
}

export const OgmaDefaults: OgmaOptions = {
  logLevel: 'INFO',
  color: true,
  stream: process
    ? process.stdout
    : { hasColors: () => false, getColorDepth: () => 1, write: console.log },
  json: false,
  context: '',
  application: '',
  verbose: false,
};
