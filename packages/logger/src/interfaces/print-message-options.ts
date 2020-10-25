import { LogLevel } from '../enums';

export interface PrintMessageOptions {
  level: LogLevel;
  formattedLevel: string;
  application?: string;
  context?: string;
  correlationId?: string;
  [key: string]: unknown;
}
