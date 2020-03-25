import { OgmaLog } from '../interfaces/ogma-log';

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

export const logKeys = [
  'silly',
  'fine',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
];

const time = '2020-01-14T05:47:48.091Z';
const pid = 13940;
const hello = 'world';
const application = 'TestClass';
const context = 'TestMethod';

const sillyJSON = {
  time,
  pid,
  level: 'SILLY' as const,
  hello,
};
const fineJSON = {
  time,
  pid,
  level: 'FINE' as const,
  hello,
};
const debugJSON = {
  time,
  pid,
  level: 'DEBUG' as const,
  hello,
};
const infoJSON = {
  time,
  pid,
  level: 'INFO' as const,
  hello,
};
const warnJSON = {
  time,
  pid,
  level: 'WARN' as const,
  hello,
};
const errorJSON = {
  time,
  pid,
  level: 'ERROR' as const,
  hello,
};
const fatalJSON = {
  time,
  pid,
  level: 'FATAL' as const,
  hello,
};

const noAppNoConJSON: OgmaLogSet = {
  silly: sillyJSON,
  fine: fineJSON,
  debug: debugJSON,
  info: infoJSON,
  warn: warnJSON,
  error: errorJSON,
  fatal: fatalJSON,
};

const noAppJSON: OgmaLogSet = {
  silly: { ...sillyJSON, context },
  fine: { ...fineJSON, context },
  debug: { ...debugJSON, context },
  info: { ...infoJSON, context },
  warn: { ...warnJSON, context },
  error: { ...errorJSON, context },
  fatal: { ...fatalJSON, context },
};

const noConJSON: OgmaLogSet = {
  silly: { ...sillyJSON, application },
  fine: { ...fineJSON, application },
  debug: { ...debugJSON, application },
  info: { ...infoJSON, application },
  warn: { ...warnJSON, application },
  error: { ...errorJSON, application },
  fatal: { ...fatalJSON, application },
};

export const fullJSON: OgmaLogSet = {
  silly: { ...sillyJSON, context, application },
  fine: { ...fineJSON, context, application },
  debug: { ...debugJSON, context, application },
  info: { ...infoJSON, context, application },
  warn: { ...warnJSON, context, application },
  error: { ...errorJSON, context, application },
  fatal: { ...fatalJSON, context, application },
};

const hydratedNoAppNoCon: ExpectedOgmaOutput = {
  silly: `[${time}] ${pid} \u001b[35m[SILLY]\u001b[0m| {"hello":"world"}\n`,
  fine: `[${time}] ${pid} \u001b[32m[FINE] \u001b[0m| {"hello":"world"}\n`,
  debug: `[${time}] ${pid} \u001b[34m[DEBUG]\u001b[0m| {"hello":"world"}\n`,
  info: `[${time}] ${pid} \u001b[36m[INFO] \u001b[0m| {"hello":"world"}\n`,
  warn: `[${time}] ${pid} \u001b[33m[WARN] \u001b[0m| {"hello":"world"}\n`,
  error: `[${time}] ${pid} \u001b[31m[ERROR]\u001b[0m| {"hello":"world"}\n`,
  fatal: `[${time}] ${pid} \u001b[31m[FATAL]\u001b[0m| {"hello":"world"}\n`,
};

const hydratedNoCon: ExpectedOgmaOutput = {
  silly: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[35m[SILLY]\u001b[0m| {"hello":"world"}\n`,
  fine: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[32m[FINE] \u001b[0m| {"hello":"world"}\n`,
  debug: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[34m[DEBUG]\u001b[0m| {"hello":"world"}\n`,
  info: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[INFO] \u001b[0m| {"hello":"world"}\n`,
  warn: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[33m[WARN] \u001b[0m| {"hello":"world"}\n`,
  error: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[31m[ERROR]\u001b[0m| {"hello":"world"}\n`,
  fatal: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[31m[FATAL]\u001b[0m| {"hello":"world"}\n`,
};

const hydratedNoApp: ExpectedOgmaOutput = {
  silly: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[35m[SILLY]\u001b[0m| {"hello":"world"}\n`,
  fine: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[32m[FINE] \u001b[0m| {"hello":"world"}\n`,
  debug: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[34m[DEBUG]\u001b[0m| {"hello":"world"}\n`,
  info: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[36m[INFO] \u001b[0m| {"hello":"world"}\n`,
  warn: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[33m[WARN] \u001b[0m| {"hello":"world"}\n`,
  error: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[31m[ERROR]\u001b[0m| {"hello":"world"}\n`,
  fatal: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[31m[FATAL]\u001b[0m| {"hello":"world"}\n`,
};

const hydratedFull: ExpectedOgmaOutput = {
  silly: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[35m[SILLY]\u001b[0m| {"hello":"world"}\n`,
  fine: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[32m[FINE] \u001b[0m| {"hello":"world"}\n`,
  debug: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[34m[DEBUG]\u001b[0m| {"hello":"world"}\n`,
  info: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[36m[INFO] \u001b[0m| {"hello":"world"}\n`,
  warn: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[33m[WARN] \u001b[0m| {"hello":"world"}\n`,
  error: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[31m[ERROR]\u001b[0m| {"hello":"world"}\n`,
  fatal: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[31m[FATAL]\u001b[0m| {"hello":"world"}\n`,
};

const hydratedNoAppNoConNoColor: ExpectedOgmaOutput = {
  silly: `[${time}] ${pid} [SILLY]| {"hello":"world"}\n`,
  fine: `[${time}] ${pid} [FINE] | {"hello":"world"}\n`,
  debug: `[${time}] ${pid} [DEBUG]| {"hello":"world"}\n`,
  info: `[${time}] ${pid} [INFO] | {"hello":"world"}\n`,
  warn: `[${time}] ${pid} [WARN] | {"hello":"world"}\n`,
  error: `[${time}] ${pid} [ERROR]| {"hello":"world"}\n`,
  fatal: `[${time}] ${pid} [FATAL]| {"hello":"world"}\n`,
};

const hydratedNoConNoColor: ExpectedOgmaOutput = {
  silly: `[${time}] [${application}] ${pid} [SILLY]| {"hello":"world"}\n`,
  fine: `[${time}] [${application}] ${pid} [FINE] | {"hello":"world"}\n`,
  debug: `[${time}] [${application}] ${pid} [DEBUG]| {"hello":"world"}\n`,
  info: `[${time}] [${application}] ${pid} [INFO] | {"hello":"world"}\n`,
  warn: `[${time}] [${application}] ${pid} [WARN] | {"hello":"world"}\n`,
  error: `[${time}] [${application}] ${pid} [ERROR]| {"hello":"world"}\n`,
  fatal: `[${time}] [${application}] ${pid} [FATAL]| {"hello":"world"}\n`,
};

const hydratedNoAppNoColor: ExpectedOgmaOutput = {
  silly: `[${time}] ${pid} [${context}] [SILLY]| {"hello":"world"}\n`,
  fine: `[${time}] ${pid} [${context}] [FINE] | {"hello":"world"}\n`,
  debug: `[${time}] ${pid} [${context}] [DEBUG]| {"hello":"world"}\n`,
  info: `[${time}] ${pid} [${context}] [INFO] | {"hello":"world"}\n`,
  warn: `[${time}] ${pid} [${context}] [WARN] | {"hello":"world"}\n`,
  error: `[${time}] ${pid} [${context}] [ERROR]| {"hello":"world"}\n`,
  fatal: `[${time}] ${pid} [${context}] [FATAL]| {"hello":"world"}\n`,
};

const hydratedFullNoColor: ExpectedOgmaOutput = {
  silly: `[${time}] [${application}] ${pid} [${context}] [SILLY]| {"hello":"world"}\n`,
  fine: `[${time}] [${application}] ${pid} [${context}] [FINE] | {"hello":"world"}\n`,
  debug: `[${time}] [${application}] ${pid} [${context}] [DEBUG]| {"hello":"world"}\n`,
  info: `[${time}] [${application}] ${pid} [${context}] [INFO] | {"hello":"world"}\n`,
  warn: `[${time}] [${application}] ${pid} [${context}] [WARN] | {"hello":"world"}\n`,
  error: `[${time}] [${application}] ${pid} [${context}] [ERROR]| {"hello":"world"}\n`,
  fatal: `[${time}] [${application}] ${pid} [${context}] [FATAL]| {"hello":"world"}\n`,
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

const sillyString = {
  time,
  pid,
  level: 'SILLY' as const,
  message,
};
const fineString = {
  time,
  pid,
  level: 'FINE' as const,
  message,
};
const debugString = {
  time,
  pid,
  level: 'DEBUG' as const,
  message,
};
const infoString = {
  time,
  pid,
  level: 'INFO' as const,
  message,
};
const warnString = {
  time,
  pid,
  level: 'WARN' as const,
  message,
};
const errorString = {
  time,
  pid,
  level: 'ERROR' as const,
  message,
};
const fatalString = {
  time,
  pid,
  level: 'FATAL' as const,
  message,
};

const noAppNoConString: OgmaLogSet = {
  silly: sillyString,
  fine: fineString,
  debug: debugString,
  info: infoString,
  warn: warnString,
  error: errorString,
  fatal: fatalString,
};

const noAppString: OgmaLogSet = {
  silly: { ...sillyString, context },
  fine: { ...fineString, context },
  debug: { ...debugString, context },
  info: { ...infoString, context },
  warn: { ...warnString, context },
  error: { ...errorString, context },
  fatal: { ...fatalString, context },
};

const noConString: OgmaLogSet = {
  silly: { ...sillyString, application },
  fine: { ...fineString, application },
  debug: { ...debugString, application },
  info: { ...infoString, application },
  warn: { ...warnString, application },
  error: { ...errorString, application },
  fatal: { ...fatalString, application },
};

const fullString: OgmaLogSet = {
  silly: { ...sillyString, context, application },
  fine: { ...fineString, context, application },
  debug: { ...debugString, context, application },
  info: { ...infoString, context, application },
  warn: { ...warnString, context, application },
  error: { ...errorString, context, application },
  fatal: { ...fatalString, context, application },
};

const hydratedNoAppNoConString: ExpectedOgmaOutput = {
  silly: `[${time}] ${pid} \u001b[35m[SILLY]\u001b[0m| hello\n`,
  fine: `[${time}] ${pid} \u001b[32m[FINE] \u001b[0m| hello\n`,
  debug: `[${time}] ${pid} \u001b[34m[DEBUG]\u001b[0m| hello\n`,
  info: `[${time}] ${pid} \u001b[36m[INFO] \u001b[0m| hello\n`,
  warn: `[${time}] ${pid} \u001b[33m[WARN] \u001b[0m| hello\n`,
  error: `[${time}] ${pid} \u001b[31m[ERROR]\u001b[0m| hello\n`,
  fatal: `[${time}] ${pid} \u001b[31m[FATAL]\u001b[0m| hello\n`,
};

const hydratedNoConString: ExpectedOgmaOutput = {
  silly: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[35m[SILLY]\u001b[0m| hello\n`,
  fine: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[32m[FINE] \u001b[0m| hello\n`,
  debug: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[34m[DEBUG]\u001b[0m| hello\n`,
  info: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[INFO] \u001b[0m| hello\n`,
  warn: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[33m[WARN] \u001b[0m| hello\n`,
  error: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[31m[ERROR]\u001b[0m| hello\n`,
  fatal: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[31m[FATAL]\u001b[0m| hello\n`,
};

const hydratedNoAppString: ExpectedOgmaOutput = {
  silly: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[35m[SILLY]\u001b[0m| hello\n`,
  fine: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[32m[FINE] \u001b[0m| hello\n`,
  debug: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[34m[DEBUG]\u001b[0m| hello\n`,
  info: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[36m[INFO] \u001b[0m| hello\n`,
  warn: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[33m[WARN] \u001b[0m| hello\n`,
  error: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[31m[ERROR]\u001b[0m| hello\n`,
  fatal: `[${time}] ${pid} \u001b[36m[${context}]\u001b[0m \u001b[31m[FATAL]\u001b[0m| hello\n`,
};

const hydratedFullString: ExpectedOgmaOutput = {
  silly: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[35m[SILLY]\u001b[0m| hello\n`,
  fine: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[32m[FINE] \u001b[0m| hello\n`,
  debug: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[34m[DEBUG]\u001b[0m| hello\n`,
  info: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[36m[INFO] \u001b[0m| hello\n`,
  warn: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[33m[WARN] \u001b[0m| hello\n`,
  error: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[31m[ERROR]\u001b[0m| hello\n`,
  fatal: `[${time}] \u001b[33m[${application}]\u001b[0m ${pid} \u001b[36m[${context}]\u001b[0m \u001b[31m[FATAL]\u001b[0m| hello\n`,
};

const hydratedNoAppNoConNoColorString: ExpectedOgmaOutput = {
  silly: `[${time}] ${pid} [SILLY]| hello\n`,
  fine: `[${time}] ${pid} [FINE] | hello\n`,
  debug: `[${time}] ${pid} [DEBUG]| hello\n`,
  info: `[${time}] ${pid} [INFO] | hello\n`,
  warn: `[${time}] ${pid} [WARN] | hello\n`,
  error: `[${time}] ${pid} [ERROR]| hello\n`,
  fatal: `[${time}] ${pid} [FATAL]| hello\n`,
};

const hydratedNoConNoColorString: ExpectedOgmaOutput = {
  silly: `[${time}] [${application}] ${pid} [SILLY]| hello\n`,
  fine: `[${time}] [${application}] ${pid} [FINE] | hello\n`,
  debug: `[${time}] [${application}] ${pid} [DEBUG]| hello\n`,
  info: `[${time}] [${application}] ${pid} [INFO] | hello\n`,
  warn: `[${time}] [${application}] ${pid} [WARN] | hello\n`,
  error: `[${time}] [${application}] ${pid} [ERROR]| hello\n`,
  fatal: `[${time}] [${application}] ${pid} [FATAL]| hello\n`,
};

const hydratedNoAppNoColorString: ExpectedOgmaOutput = {
  silly: `[${time}] ${pid} [${context}] [SILLY]| hello\n`,
  fine: `[${time}] ${pid} [${context}] [FINE] | hello\n`,
  debug: `[${time}] ${pid} [${context}] [DEBUG]| hello\n`,
  info: `[${time}] ${pid} [${context}] [INFO] | hello\n`,
  warn: `[${time}] ${pid} [${context}] [WARN] | hello\n`,
  error: `[${time}] ${pid} [${context}] [ERROR]| hello\n`,
  fatal: `[${time}] ${pid} [${context}] [FATAL]| hello\n`,
};

const hydratedFullNoColorString: ExpectedOgmaOutput = {
  silly: `[${time}] [${application}] ${pid} [${context}] [SILLY]| hello\n`,
  fine: `[${time}] [${application}] ${pid} [${context}] [FINE] | hello\n`,
  debug: `[${time}] [${application}] ${pid} [${context}] [DEBUG]| hello\n`,
  info: `[${time}] [${application}] ${pid} [${context}] [INFO] | hello\n`,
  warn: `[${time}] [${application}] ${pid} [${context}] [WARN] | hello\n`,
  error: `[${time}] [${application}] ${pid} [${context}] [ERROR]| hello\n`,
  fatal: `[${time}] [${application}] ${pid} [${context}] [FATAL]| hello\n`,
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
