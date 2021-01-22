import { hostname } from 'os';
import { OgmaLog } from '../src/ogma-file.interface';
import { color, LogLevel } from '@ogma/logger';

process.stdout.hasColors = () => true;

export interface OgmaLogSet {
  silly: OgmaLog;
  fine: OgmaLog;
  debug: OgmaLog;
  info: OgmaLog;
  warn: OgmaLog;
  error: OgmaLog;
  fatal: OgmaLog;
  [key: string]: OgmaLog;
}

export interface ExpectedOgmaOutput {
  silly: string;
  fine: string;
  debug: string;
  info: string;
  warn: string;
  error: string;
  fatal: string;
  [key: string]: string;
}

export const logKeys = ['silly', 'fine', 'debug', 'info', 'warn', 'error', 'fatal'];

const time = '2020-01-14T05:47:48.091Z';
const pid = 13940;
const hello = { hello: 'world' };
const application = 'TestClass';
const context = 'TestMethod';
const host = hostname();

function ogmaObjectJSON(level: keyof typeof LogLevel): OgmaLog {
  return {
    time,
    pid,
    level,
    ...hello,
    hostname: host,
  };
}

const noAppNoConJSON: OgmaLogSet = {
  silly: ogmaObjectJSON('SILLY'),
  fine: ogmaObjectJSON('FINE'),
  debug: ogmaObjectJSON('DEBUG'),
  info: ogmaObjectJSON('INFO'),
  warn: ogmaObjectJSON('WARN'),
  error: ogmaObjectJSON('ERROR'),
  fatal: ogmaObjectJSON('FATAL'),
};

const noAppJSON: OgmaLogSet = {
  silly: { ...ogmaObjectJSON('SILLY'), context },
  fine: { ...ogmaObjectJSON('FINE'), context },
  debug: { ...ogmaObjectJSON('DEBUG'), context },
  info: { ...ogmaObjectJSON('INFO'), context },
  warn: { ...ogmaObjectJSON('WARN'), context },
  error: { ...ogmaObjectJSON('ERROR'), context },
  fatal: { ...ogmaObjectJSON('FATAL'), context },
};

const noConJSON: OgmaLogSet = {
  silly: { ...ogmaObjectJSON('SILLY'), application },
  fine: { ...ogmaObjectJSON('FINE'), application },
  debug: { ...ogmaObjectJSON('DEBUG'), application },
  info: { ...ogmaObjectJSON('INFO'), application },
  warn: { ...ogmaObjectJSON('WARN'), application },
  error: { ...ogmaObjectJSON('ERROR'), application },
  fatal: { ...ogmaObjectJSON('FATAL'), application },
};

export const fullJSON: OgmaLogSet = {
  silly: { ...ogmaObjectJSON('SILLY'), context, application },
  fine: { ...ogmaObjectJSON('FINE'), context, application },
  debug: { ...ogmaObjectJSON('DEBUG'), context, application },
  info: { ...ogmaObjectJSON('INFO'), context, application },
  warn: { ...ogmaObjectJSON('WARN'), context, application },
  error: { ...ogmaObjectJSON('ERROR'), context, application },
  fatal: { ...ogmaObjectJSON('FATAL'), context, application },
};

function hydrateNoAppNoConFactory(level: string): string {
  return `[${time}] ${level} ${color.magenta('[' + host + ']')} ${pid} ${JSON.stringify(hello)}\n`;
}

const hydratedNoAppNoCon: ExpectedOgmaOutput = {
  silly: hydrateNoAppNoConFactory(color.magenta('[SILLY]')),
  fine: hydrateNoAppNoConFactory(color.green('[FINE] ')),
  debug: hydrateNoAppNoConFactory(color.blue('[DEBUG]')),
  info: hydrateNoAppNoConFactory(color.cyan('[INFO] ')),
  warn: hydrateNoAppNoConFactory(color.yellow('[WARN] ')),
  error: hydrateNoAppNoConFactory(color.red('[ERROR]')),
  fatal: hydrateNoAppNoConFactory(color.red('[FATAL]')),
};

function hydrateNoConFactory(level: string): string {
  return `[${time}] ${level} ${color.magenta('[' + host + ']')} ${color.yellow(
    '[' + application + ']',
  )} ${pid} ${JSON.stringify(hello)}\n`;
}

const hydratedNoCon: ExpectedOgmaOutput = {
  silly: hydrateNoConFactory(color.magenta('[SILLY]')),
  fine: hydrateNoConFactory(color.green('[FINE] ')),
  debug: hydrateNoConFactory(color.blue('[DEBUG]')),
  info: hydrateNoConFactory(color.cyan('[INFO] ')),
  warn: hydrateNoConFactory(color.yellow('[WARN] ')),
  error: hydrateNoConFactory(color.red('[ERROR]')),
  fatal: hydrateNoConFactory(color.red('[FATAL]')),
};

function hydrateNoAppFactory(level: string): string {
  return `[${time}] ${level} ${color.magenta('[' + host + ']')} ${pid} ${color.cyan(
    '[' + context + ']',
  )} ${JSON.stringify(hello)}\n`;
}

const hydratedNoApp: ExpectedOgmaOutput = {
  silly: hydrateNoAppFactory(color.magenta('[SILLY]')),
  fine: hydrateNoAppFactory(color.green('[FINE] ')),
  debug: hydrateNoAppFactory(color.blue('[DEBUG]')),
  info: hydrateNoAppFactory(color.cyan('[INFO] ')),
  warn: hydrateNoAppFactory(color.yellow('[WARN] ')),
  error: hydrateNoAppFactory(color.red('[ERROR]')),
  fatal: hydrateNoAppFactory(color.red('[FATAL]')),
};

function hydrateFullFactory(level: string): string {
  return `[${time}] ${level} ${color.magenta('[' + host + ']')} ${color.yellow(
    '[' + application + ']',
  )} ${pid} ${color.cyan('[' + context + ']')} ${JSON.stringify(hello)}\n`;
}

const hydratedFull: ExpectedOgmaOutput = {
  silly: hydrateFullFactory(color.magenta('[SILLY]')),
  fine: hydrateFullFactory(color.green('[FINE] ')),
  debug: hydrateFullFactory(color.blue('[DEBUG]')),
  info: hydrateFullFactory(color.cyan('[INFO] ')),
  warn: hydrateFullFactory(color.yellow('[WARN] ')),
  error: hydrateFullFactory(color.red('[ERROR]')),
  fatal: hydrateFullFactory(color.red('[FATAL]')),
};

function hydrateNoAppNoConNoColorFactory(level: string): string {
  return `[${time}] ${level} [${host}] ${pid} ${JSON.stringify(hello)}\n`;
}

const hydratedNoAppNoConNoColor: ExpectedOgmaOutput = {
  silly: hydrateNoAppNoConNoColorFactory('[SILLY]'),
  fine: hydrateNoAppNoConNoColorFactory('[FINE] '),
  debug: hydrateNoAppNoConNoColorFactory('[DEBUG]'),
  info: hydrateNoAppNoConNoColorFactory('[INFO] '),
  warn: hydrateNoAppNoConNoColorFactory('[WARN] '),
  error: hydrateNoAppNoConNoColorFactory('[ERROR]'),
  fatal: hydrateNoAppNoConNoColorFactory('[FATAL]'),
};

function hydrateNoConNoColorFactory(level: string): string {
  return `[${time}] ${level} [${host}] [${application}] ${pid} ${JSON.stringify(hello)}\n`;
}

const hydratedNoConNoColor: ExpectedOgmaOutput = {
  silly: hydrateNoConNoColorFactory('[SILLY]'),
  fine: hydrateNoConNoColorFactory('[FINE] '),
  debug: hydrateNoConNoColorFactory('[DEBUG]'),
  info: hydrateNoConNoColorFactory('[INFO] '),
  warn: hydrateNoConNoColorFactory('[WARN] '),
  error: hydrateNoConNoColorFactory('[ERROR]'),
  fatal: hydrateNoConNoColorFactory('[FATAL]'),
};

function hydrateNoAppNoColorFactory(level: string): string {
  return `[${time}] ${level} [${host}] ${pid} [${context}] ${JSON.stringify(hello)}\n`;
}

const hydratedNoAppNoColor: ExpectedOgmaOutput = {
  silly: hydrateNoAppNoColorFactory('[SILLY]'),
  fine: hydrateNoAppNoColorFactory('[FINE] '),
  debug: hydrateNoAppNoColorFactory('[DEBUG]'),
  info: hydrateNoAppNoColorFactory('[INFO] '),
  warn: hydrateNoAppNoColorFactory('[WARN] '),
  error: hydrateNoAppNoColorFactory('[ERROR]'),
  fatal: hydrateNoAppNoColorFactory('[FATAL]'),
};

function hydrateFullNoColorFactory(level: string): string {
  return `[${time}] ${level} [${host}] [${application}] ${pid} [${context}] ${JSON.stringify(
    hello,
  )}\n`;
}

const hydratedFullNoColor: ExpectedOgmaOutput = {
  silly: hydrateFullNoColorFactory('[SILLY]'),
  fine: hydrateFullNoColorFactory('[FINE] '),
  debug: hydrateFullNoColorFactory('[DEBUG]'),
  info: hydrateFullNoColorFactory('[INFO] '),
  warn: hydrateFullNoColorFactory('[WARN] '),
  error: hydrateFullNoColorFactory('[ERROR]'),
  fatal: hydrateFullNoColorFactory('[FATAL]'),
};

export const jsonLogs = {
  noAppNoConJSON,
  noAppJSON,
  noConJSON,
  fullJSON,
  hydratedNoAppNoCon,
  hydratedNoApp,
  hydratedNoCon,
  hydratedFull,
  hydratedNoAppNoConNoColor,
  hydratedNoAppNoColor,
  hydratedNoConNoColor,
  hydratedFullNoColor,
};

const message = 'hello';

function ogmaStringJSON(level: keyof typeof LogLevel): OgmaLog {
  return {
    time,
    pid,
    level,
    message,
    hostname: host,
  };
}

const noAppNoConString: OgmaLogSet = {
  silly: ogmaStringJSON('SILLY'),
  fine: ogmaStringJSON('FINE'),
  debug: ogmaStringJSON('DEBUG'),
  info: ogmaStringJSON('INFO'),
  warn: ogmaStringJSON('WARN'),
  error: ogmaStringJSON('ERROR'),
  fatal: ogmaStringJSON('FATAL'),
};

const noAppString: OgmaLogSet = {
  silly: { ...ogmaStringJSON('SILLY'), context },
  fine: { ...ogmaStringJSON('FINE'), context },
  debug: { ...ogmaStringJSON('DEBUG'), context },
  info: { ...ogmaStringJSON('INFO'), context },
  warn: { ...ogmaStringJSON('WARN'), context },
  error: { ...ogmaStringJSON('ERROR'), context },
  fatal: { ...ogmaStringJSON('FATAL'), context },
};

const noConString: OgmaLogSet = {
  silly: { ...ogmaStringJSON('SILLY'), application },
  fine: { ...ogmaStringJSON('FINE'), application },
  debug: { ...ogmaStringJSON('DEBUG'), application },
  info: { ...ogmaStringJSON('INFO'), application },
  warn: { ...ogmaStringJSON('WARN'), application },
  error: { ...ogmaStringJSON('ERROR'), application },
  fatal: { ...ogmaStringJSON('FATAL'), application },
};

const fullString: OgmaLogSet = {
  silly: { ...ogmaStringJSON('SILLY'), context, application },
  fine: { ...ogmaStringJSON('FINE'), context, application },
  debug: { ...ogmaStringJSON('DEBUG'), context, application },
  info: { ...ogmaStringJSON('INFO'), context, application },
  warn: { ...ogmaStringJSON('WARN'), context, application },
  error: { ...ogmaStringJSON('ERROR'), context, application },
  fatal: { ...ogmaStringJSON('FATAL'), context, application },
};

function hydrateNoAppNoConStringFactory(level: string): string {
  return `[${time}] ${level} ${color.magenta('[' + host + ']')} ${pid} ${message}\n`;
}

const hydratedNoAppNoConString: ExpectedOgmaOutput = {
  silly: hydrateNoAppNoConStringFactory(color.magenta('[SILLY]')),
  fine: hydrateNoAppNoConStringFactory(color.green('[FINE] ')),
  debug: hydrateNoAppNoConStringFactory(color.blue('[DEBUG]')),
  info: hydrateNoAppNoConStringFactory(color.cyan('[INFO] ')),
  warn: hydrateNoAppNoConStringFactory(color.yellow('[WARN] ')),
  error: hydrateNoAppNoConStringFactory(color.red('[ERROR]')),
  fatal: hydrateNoAppNoConStringFactory(color.red('[FATAL]')),
};

function hydrateNoConStringFactory(level: string): string {
  return `[${time}] ${level} ${color.magenta('[' + host + ']')} ${color.yellow(
    '[' + application + ']',
  )} ${pid} ${message}\n`;
}

const hydratedNoConString: ExpectedOgmaOutput = {
  silly: hydrateNoConStringFactory(color.magenta('[SILLY]')),
  fine: hydrateNoConStringFactory(color.green('[FINE] ')),
  debug: hydrateNoConStringFactory(color.blue('[DEBUG]')),
  info: hydrateNoConStringFactory(color.cyan('[INFO] ')),
  warn: hydrateNoConStringFactory(color.yellow('[WARN] ')),
  error: hydrateNoConStringFactory(color.red('[ERROR]')),
  fatal: hydrateNoConStringFactory(color.red('[FATAL]')),
};

function hydrateNoAppStringFactory(level: string): string {
  return `[${time}] ${level} ${color.magenta('[' + host + ']')} ${pid} ${color.cyan(
    '[' + context + ']',
  )} ${message}\n`;
}

const hydratedNoAppString: ExpectedOgmaOutput = {
  silly: hydrateNoAppStringFactory(color.magenta('[SILLY]')),
  fine: hydrateNoAppStringFactory(color.green('[FINE] ')),
  debug: hydrateNoAppStringFactory(color.blue('[DEBUG]')),
  info: hydrateNoAppStringFactory(color.cyan('[INFO] ')),
  warn: hydrateNoAppStringFactory(color.yellow('[WARN] ')),
  error: hydrateNoAppStringFactory(color.red('[ERROR]')),
  fatal: hydrateNoAppStringFactory(color.red('[FATAL]')),
};

function hydrateFullStringFactory(level: string): string {
  return `[${time}] ${level} ${color.magenta('[' + host + ']')} ${color.yellow(
    '[' + application + ']',
  )} ${pid} ${color.cyan('[' + context + ']')} ${message}\n`;
}

const hydratedFullString: ExpectedOgmaOutput = {
  silly: hydrateFullStringFactory(color.magenta('[SILLY]')),
  fine: hydrateFullStringFactory(color.green('[FINE] ')),
  debug: hydrateFullStringFactory(color.blue('[DEBUG]')),
  info: hydrateFullStringFactory(color.cyan('[INFO] ')),
  warn: hydrateFullStringFactory(color.yellow('[WARN] ')),
  error: hydrateFullStringFactory(color.red('[ERROR]')),
  fatal: hydrateFullStringFactory(color.red('[FATAL]')),
};

function hydrateNoAppNoConNoColorStringFactory(level: string): string {
  return `[${time}] ${level} [${host}] ${pid} ${message}\n`;
}

const hydratedNoAppNoConNoColorString: ExpectedOgmaOutput = {
  silly: hydrateNoAppNoConNoColorStringFactory('[SILLY]'),
  fine: hydrateNoAppNoConNoColorStringFactory('[FINE] '),
  debug: hydrateNoAppNoConNoColorStringFactory('[DEBUG]'),
  info: hydrateNoAppNoConNoColorStringFactory('[INFO] '),
  warn: hydrateNoAppNoConNoColorStringFactory('[WARN] '),
  error: hydrateNoAppNoConNoColorStringFactory('[ERROR]'),
  fatal: hydrateNoAppNoConNoColorStringFactory('[FATAL]'),
};

function hydrateNoConNoColorStringFactory(level: string): string {
  return `[${time}] ${level} [${host}] [${application}] ${pid} ${message}\n`;
}

const hydratedNoConNoColorString: ExpectedOgmaOutput = {
  silly: hydrateNoConNoColorStringFactory('[SILLY]'),
  fine: hydrateNoConNoColorStringFactory('[FINE] '),
  debug: hydrateNoConNoColorStringFactory('[DEBUG]'),
  info: hydrateNoConNoColorStringFactory('[INFO] '),
  warn: hydrateNoConNoColorStringFactory('[WARN] '),
  error: hydrateNoConNoColorStringFactory('[ERROR]'),
  fatal: hydrateNoConNoColorStringFactory('[FATAL]'),
};

function hydrateNoAppNoColorStringFactory(level: string): string {
  return `[${time}] ${level} [${host}] ${pid} [${context}] ${message}\n`;
}

const hydratedNoAppNoColorString: ExpectedOgmaOutput = {
  silly: hydrateNoAppNoColorStringFactory('[SILLY]'),
  fine: hydrateNoAppNoColorStringFactory('[FINE] '),
  debug: hydrateNoAppNoColorStringFactory('[DEBUG]'),
  info: hydrateNoAppNoColorStringFactory('[INFO] '),
  warn: hydrateNoAppNoColorStringFactory('[WARN] '),
  error: hydrateNoAppNoColorStringFactory('[ERROR]'),
  fatal: hydrateNoAppNoColorStringFactory('[FATAL]'),
};

function hydrateFullNoColorStringFactory(level: string): string {
  return `[${time}] ${level} [${host}] [${application}] ${pid} [${context}] ${message}\n`;
}

const hydratedFullNoColorString: ExpectedOgmaOutput = {
  silly: hydrateFullNoColorStringFactory('[SILLY]'),
  fine: hydrateFullNoColorStringFactory('[FINE] '),
  debug: hydrateFullNoColorStringFactory('[DEBUG]'),
  info: hydrateFullNoColorStringFactory('[INFO] '),
  warn: hydrateFullNoColorStringFactory('[WARN] '),
  error: hydrateFullNoColorStringFactory('[ERROR]'),
  fatal: hydrateFullNoColorStringFactory('[FATAL]'),
};

export const stringLogs = {
  noAppNoConString,
  noAppString,
  noConString,
  fullString,
  hydratedNoAppNoConString,
  hydratedNoAppString,
  hydratedNoConString,
  hydratedFullString,
  hydratedNoAppNoConNoColorString,
  hydratedNoAppNoColorString,
  hydratedNoConNoColorString,
  hydratedFullNoColorString,
};
