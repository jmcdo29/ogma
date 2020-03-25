export enum LogLevel {
  OFF,
  ALL,
  VERBOSE,
  DEBUG,
  LOG,
  WARN,
  ERROR,
  FATAL,
  INFO = LogLevel.LOG,
  FINE = LogLevel.VERBOSE,
  SILLY = LogLevel.ALL,
}
