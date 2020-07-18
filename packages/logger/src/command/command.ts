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
  return standardKeys.every((key) =>
    Object.prototype.hasOwnProperty.call(log, key),
  );
}

function getLevel(level: keyof typeof LogLevel, useColor: boolean): string {
  let retString = wrapInParens(level).padEnd(7, ' ');
  if (useColor) {
    switch (level) {
      case 'SILLY':
        retString = colorizeCLI(retString, Color.MAGENTA);
        break;
      case 'FINE':
        retString = colorizeCLI(retString, Color.GREEN);
        break;
      case 'DEBUG':
        retString = colorizeCLI(retString, Color.BLUE);
        break;
      case 'INFO':
        retString = colorizeCLI(retString, Color.CYAN);
        break;
      case 'WARN':
        retString = colorizeCLI(retString, Color.YELLOW);
        break;
      case 'ERROR':
      case 'FATAL':
        retString = colorizeCLI(retString, Color.RED);
        break;
    }
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

async function rehydrate(
  fileName: string,
  useColor: boolean = process.stdout.isTTY,
) {
  let context;
  try {
    context = (await readFile(fileName)).toString();
  } catch (err) {
    process.stderr.write(messages.generalError);
    process.stderr.write(err);
    return process.exit(1);
  }
  const logs = context.split('\n').filter((log) => log);
  if (
    !logs.every((log) => {
      try {
        const parsedLog = JSON.parse(log);
        return isOgmaFormat(parsedLog);
      } catch (err) {
        return false;
      }
    })
  ) {
    process.stderr.write(messages.badFormat);
    return process.exit(1);
  }
  logs
    .map((log) => JSON.parse(log))
    .forEach((log: OgmaLog) => {
      const { time, application, context, pid, level, ...rest } = log;
      let message: string | Record<string, unknown>;
      if (rest.message) {
        message = getMessage(log);
      } else {
        message = getMessageFromJSON(rest);
      }
      let logMessage = wrapInParens(time) + ' ';
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
    });
}

export async function ogmaHydrate(args: string[]): Promise<void> {
  if (!args[2]) {
    process.stderr.write(messages.missingFile);
    return process.exit(1);
  }
  [, , ...args] = args;
  if (args.length === 1) {
    await rehydrate(args[0]);
  } else if (args.length > 2) {
    process.stderr.write(messages.tooManyArgs);
    process.exit(1);
  } else if (args.some((arg) => arg.includes('--'))) {
    const flag = args.find((arg) => arg.includes('--'));
    const file = args[args.length - args.indexOf(flag) - 1];
    try {
      const useColor = JSON.parse(flag.split('=')[1] || 'true');
      await rehydrate(file, useColor);
    } catch (err) {
      process.stderr.write(messages.usage);
      process.exit(1);
    }
  } else {
    process.stderr.write(messages.usage);
    return process.exit(1);
  }
}
