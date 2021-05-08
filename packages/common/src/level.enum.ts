export enum LogLevel {
  ALL,
  VERBOSE,
  DEBUG,
  LOG,
  WARN,
  ERROR,
  FATAL,
  OFF,
  INFO = LogLevel.LOG,
  FINE = LogLevel.VERBOSE,
  SILLY = LogLevel.ALL,
}

export type OgmaWritableLevel = Exclude<keyof typeof LogLevel, 'OFF' | 'ALL' | 'LOG' | 'VERBOSE'>;
