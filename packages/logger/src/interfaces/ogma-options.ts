import { LogLevel } from '../enums';
import { OgmaStream } from './ogma-stream';

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
  stream: process.stdout,
  json: false,
  context: '',
  application: '',
  verbose: false,
};
