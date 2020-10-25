import { promises } from 'fs';
import { Color, LogLevel } from '../enums';
import { OgmaLog } from '../interfaces/ogma-log';
import { colorizeCLI } from '../utils/colorize';
import * as messages from '../command/messages';

const readFile = promises.readFile;

const standardKeys = ['time', 'pid', 'level'];

function getMessage(log: OgmaLog): string {
  return log.message;
}

function getMessageFromJSON(log: { [key: string]: any }): string {
  return JSON.stringify(log);
}

function wrapInParens(message: string): string {
  return '[' + message + ']';
}

function isOgmaFormat(log: Record<string, unknown>): log is OgmaLog {
  return standardKeys.every((key) => Object.prototype.hasOwnProperty.call(log, key));
}

function getColor(level: keyof typeof LogLevel): Color {
  let color: Color;
  switch (level) {
    case 'SILLY':
      color = Color.MAGENTA;
      break;
    case 'FINE':
      color = Color.GREEN;
      break;
    case 'DEBUG':
      color = Color.BLUE;
      break;
    case 'INFO':
      color = Color.CYAN;
      break;
    case 'WARN':
      color = Color.YELLOW;
      break;
    case 'ERROR':
    case 'FATAL':
      color = Color.RED;
  }
  return color;
}

function getLevel(level: keyof typeof LogLevel, useColor: boolean): string {
  let retString = wrapInParens(level).padEnd(7, ' ');
  if (useColor) {
    retString = colorizeCLI(retString, getColor(level));
  }
  return retString;
}

function getApplication(application: string, useColor: boolean): string {
  application = wrapInParens(application);
  if (useColor) {
    application = colorizeCLI(application, Color.YELLOW);
  }
  return application;
}

function getContext(context: string, useColor: boolean): string {
  context = wrapInParens(context);
  if (useColor) {
    context = colorizeCLI(context, Color.CYAN);
  }
  return context;
}

function getHostname(hostname: string, useColor: boolean): string {
  hostname = wrapInParens(hostname);
  if (useColor) {
    hostname = colorizeCLI(hostname, Color.MAGENTA);
  }
  return hostname;
}

async function readPassedFile(fileName: string): Promise<string> {
  try {
    const file = await readFile(fileName);
    return file.toString();
  } catch (err) {
    process.stderr.write(messages.generalError);
    process.stderr.write(err);
    return process.exit(1);
  }
}

function ogmaFormatCheck(log: string): boolean {
  try {
    return isOgmaFormat(JSON.parse(log));
  } catch {
    return false;
  }
}

function writeLog(log: OgmaLog, useColor: boolean): void {
  const { time, hostname, application, context, pid, level, ...rest } = log;
  let message: string | Record<string, unknown>;
  if (rest.message) {
    message = getMessage(log);
  } else {
    message = getMessageFromJSON(rest);
  }
  let logMessage = wrapInParens(time) + ' ';
  logMessage += getHostname(hostname, useColor) + ' ';
  if (application) {
    logMessage += getApplication(application, useColor) + ' ';
  }
  logMessage += pid + ' ';
  if (context) {
    logMessage += getContext(context, useColor) + ' ';
  }
  logMessage += getLevel(level, useColor);
  logMessage += '| ';
  logMessage += message + '\n';
  process.stdout.write(Buffer.from(logMessage));
}

async function rehydrate(fileName: string, useColor: boolean = process.stdout.isTTY) {
  const context = await readPassedFile(fileName);
  const logs = context.split('\n').filter((log) => log);
  if (!logs.every(ogmaFormatCheck)) {
    process.stderr.write(messages.badFormat);
    return process.exit(1);
  }
  logs.map((log) => JSON.parse(log)).forEach((log: OgmaLog) => writeLog(log, useColor));
}

function missingFile() {
  process.stderr.write(messages.missingFile);
  process.exit(1);
}

function tooManyArgs() {
  process.stderr.write(messages.tooManyArgs);
  process.exit(1);
}

function badUsage() {
  process.stderr.write(messages.usage);
  process.exit(1);
}

export async function ogmaHydrate(args: string[]): Promise<void> {
  if (!args[2]) {
    missingFile();
  }
  [, , ...args] = args;
  if (args.length === 1) {
    await rehydrate(args[0]);
  } else if (args.length > 2) {
    tooManyArgs();
  } else if (args.some((arg) => arg.includes('--'))) {
    const flag = args.find((arg) => arg.includes('--'));
    const file = args[args.length - args.indexOf(flag) - 1];
    try {
      const useColor = JSON.parse(flag.split('=')[1] || 'true');
      await rehydrate(file, useColor);
    } catch (err) {
      badUsage();
    }
  } else {
    badUsage();
  }
}
