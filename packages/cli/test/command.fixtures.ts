import { hostname } from 'os';
import { OgmaLog } from '../src/ogma-file.interface';
import { LogLevel } from '@ogma/common';
import { style } from '@ogma/styler';

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
  return `[${time}] ${level} ${style.magenta.apply('[' + host + ']')} ${pid} ${JSON.stringify(
    hello,
  )}\n`;
}

const hydratedNoAppNoCon: ExpectedOgmaOutput = {
  silly: hydrateNoAppNoConFactory(style.magenta.apply('[SILLY]')),
  fine: hydrateNoAppNoConFactory(style.green.apply('[FINE] ')),
  debug: hydrateNoAppNoConFactory(style.blue.apply('[DEBUG]')),
  info: hydrateNoAppNoConFactory(style.cyan.apply('[INFO] ')),
  warn: hydrateNoAppNoConFactory(style.yellow.apply('[WARN] ')),
  error: hydrateNoAppNoConFactory(style.red.apply('[ERROR]')),
  fatal: hydrateNoAppNoConFactory(style.red.apply('[FATAL]')),
};

function hydrateNoConFactory(level: string): string {
  return `[${time}] ${level} ${style.magenta.apply('[' + host + ']')} ${style.yellow.apply(
    '[' + application + ']',
  )} ${pid} ${JSON.stringify(hello)}\n`;
}

const hydratedNoCon: ExpectedOgmaOutput = {
  silly: hydrateNoConFactory(style.magenta.apply('[SILLY]')),
  fine: hydrateNoConFactory(style.green.apply('[FINE] ')),
  debug: hydrateNoConFactory(style.blue.apply('[DEBUG]')),
  info: hydrateNoConFactory(style.cyan.apply('[INFO] ')),
  warn: hydrateNoConFactory(style.yellow.apply('[WARN] ')),
  error: hydrateNoConFactory(style.red.apply('[ERROR]')),
  fatal: hydrateNoConFactory(style.red.apply('[FATAL]')),
};

function hydrateNoAppFactory(level: string): string {
  return `[${time}] ${level} ${style.magenta.apply('[' + host + ']')} ${pid} ${style.cyan.apply(
    '[' + context + ']',
  )} ${JSON.stringify(hello)}\n`;
}

const hydratedNoApp: ExpectedOgmaOutput = {
  silly: hydrateNoAppFactory(style.magenta.apply('[SILLY]')),
  fine: hydrateNoAppFactory(style.green.apply('[FINE] ')),
  debug: hydrateNoAppFactory(style.blue.apply('[DEBUG]')),
  info: hydrateNoAppFactory(style.cyan.apply('[INFO] ')),
  warn: hydrateNoAppFactory(style.yellow.apply('[WARN] ')),
  error: hydrateNoAppFactory(style.red.apply('[ERROR]')),
  fatal: hydrateNoAppFactory(style.red.apply('[FATAL]')),
};

function hydrateFullFactory(level: string): string {
  return `[${time}] ${level} ${style.magenta.apply('[' + host + ']')} ${style.yellow.apply(
    '[' + application + ']',
  )} ${pid} ${style.cyan.apply('[' + context + ']')} ${JSON.stringify(hello)}\n`;
}

const hydratedFull: ExpectedOgmaOutput = {
  silly: hydrateFullFactory(style.magenta.apply('[SILLY]')),
  fine: hydrateFullFactory(style.green.apply('[FINE] ')),
  debug: hydrateFullFactory(style.blue.apply('[DEBUG]')),
  info: hydrateFullFactory(style.cyan.apply('[INFO] ')),
  warn: hydrateFullFactory(style.yellow.apply('[WARN] ')),
  error: hydrateFullFactory(style.red.apply('[ERROR]')),
  fatal: hydrateFullFactory(style.red.apply('[FATAL]')),
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
  return `[${time}] ${level} ${style.magenta.apply('[' + host + ']')} ${pid} ${message}\n`;
}

const hydratedNoAppNoConString: ExpectedOgmaOutput = {
  silly: hydrateNoAppNoConStringFactory(style.magenta.apply('[SILLY]')),
  fine: hydrateNoAppNoConStringFactory(style.green.apply('[FINE] ')),
  debug: hydrateNoAppNoConStringFactory(style.blue.apply('[DEBUG]')),
  info: hydrateNoAppNoConStringFactory(style.cyan.apply('[INFO] ')),
  warn: hydrateNoAppNoConStringFactory(style.yellow.apply('[WARN] ')),
  error: hydrateNoAppNoConStringFactory(style.red.apply('[ERROR]')),
  fatal: hydrateNoAppNoConStringFactory(style.red.apply('[FATAL]')),
};

function hydrateNoConStringFactory(level: string): string {
  return `[${time}] ${level} ${style.magenta.apply('[' + host + ']')} ${style.yellow.apply(
    '[' + application + ']',
  )} ${pid} ${message}\n`;
}

const hydratedNoConString: ExpectedOgmaOutput = {
  silly: hydrateNoConStringFactory(style.magenta.apply('[SILLY]')),
  fine: hydrateNoConStringFactory(style.green.apply('[FINE] ')),
  debug: hydrateNoConStringFactory(style.blue.apply('[DEBUG]')),
  info: hydrateNoConStringFactory(style.cyan.apply('[INFO] ')),
  warn: hydrateNoConStringFactory(style.yellow.apply('[WARN] ')),
  error: hydrateNoConStringFactory(style.red.apply('[ERROR]')),
  fatal: hydrateNoConStringFactory(style.red.apply('[FATAL]')),
};

function hydrateNoAppStringFactory(level: string): string {
  return `[${time}] ${level} ${style.magenta.apply('[' + host + ']')} ${pid} ${style.cyan.apply(
    '[' + context + ']',
  )} ${message}\n`;
}

const hydratedNoAppString: ExpectedOgmaOutput = {
  silly: hydrateNoAppStringFactory(style.magenta.apply('[SILLY]')),
  fine: hydrateNoAppStringFactory(style.green.apply('[FINE] ')),
  debug: hydrateNoAppStringFactory(style.blue.apply('[DEBUG]')),
  info: hydrateNoAppStringFactory(style.cyan.apply('[INFO] ')),
  warn: hydrateNoAppStringFactory(style.yellow.apply('[WARN] ')),
  error: hydrateNoAppStringFactory(style.red.apply('[ERROR]')),
  fatal: hydrateNoAppStringFactory(style.red.apply('[FATAL]')),
};

function hydrateFullStringFactory(level: string): string {
  return `[${time}] ${level} ${style.magenta.apply('[' + host + ']')} ${style.yellow.apply(
    '[' + application + ']',
  )} ${pid} ${style.cyan.apply('[' + context + ']')} ${message}\n`;
}

const hydratedFullString: ExpectedOgmaOutput = {
  silly: hydrateFullStringFactory(style.magenta.apply('[SILLY]')),
  fine: hydrateFullStringFactory(style.green.apply('[FINE] ')),
  debug: hydrateFullStringFactory(style.blue.apply('[DEBUG]')),
  info: hydrateFullStringFactory(style.cyan.apply('[INFO] ')),
  warn: hydrateFullStringFactory(style.yellow.apply('[WARN] ')),
  error: hydrateFullStringFactory(style.red.apply('[ERROR]')),
  fatal: hydrateFullStringFactory(style.red.apply('[FATAL]')),
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
