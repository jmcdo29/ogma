import { LogLevel } from 'ogma';

export interface OgmaModuleOptions {
  logLevel?: keyof typeof LogLevel;
  color?: boolean;
  stream?: {
    write: (message: any) => void;
  };
  json?: boolean;
  context?: string;
  application?: string;
}
