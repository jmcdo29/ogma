import { OgmaWritableLevel } from './level.enum';

export interface OgmaLog {
  time: string | number;
  hostname?: string;
  application?: string;
  context?: string;
  message?: string;
  level: string;
  pid?: string | number;
  ool: OgmaWritableLevel;
  [key: string]: any;
}
