import { randomBytes } from 'crypto';
import { createWriteStream } from 'fs';
import { performance, PerformanceObserver } from 'perf_hooks';
import { writeBenchmarks } from './benchmark-writer';
import { createBunyanLogger } from './bunyan.logger';
import { createOgmaLogger } from './ogma.logger';
import { createPinoLogger } from './pino.logger';
import { createWinstonLogger } from './winston.logger';

const deepJSON = {
  a: () => 'string',
  b: Math.round(Math.random() * Math.random() * 1000),
  // using "this" makes a really complex JSON to log, including circulars
  c: this,
  d: 'regular string',
  e: true,
};

type LoggerName = 'Ogma' | 'Bunyan' | 'Winston' | 'Pino';
type LogType = 'simple' | 'json' | 'deep' | 'long';
type LogResult = {
  [index in LoggerName]: {
    [index in LogType]?: number;
  };
};

const stream = createWriteStream('/dev/null');

const loggers: Array<{
  name: LoggerName;
  logger: { info: (message: any) => void };
}> = [
  { name: 'Ogma', logger: createOgmaLogger(stream as any) },
  { name: 'Bunyan', logger: createBunyanLogger(stream as any) },
  { name: 'Winston', logger: createWinstonLogger(stream as any) },
  { name: 'Pino', logger: createPinoLogger(stream as any) },
];

function writeLogs(logger: { info: (message: any) => void }, message: any) {
  for (let i = 0; i < 100000; i++) {
    logger.info(message);
  }
}

function benchmark(type: LogType, message: any) {
  loggers.forEach((logger) => {
    performance.mark(`${logger.name}${type}start`);
    writeLogs(logger.logger, message);
    performance.mark(`${logger.name}${type}end`);
    performance.measure(
      `${logger.name} ${type}`,
      `${logger.name}${type}start`,
      `${logger.name}${type}end`,
    );
  });
}

function benchAll() {
  benchmark('simple', 'Hello, World!');
  benchmark('long', randomBytes(2000).toString());
  benchmark('json', { hello: 'World' });
  benchmark('deep', deepJSON);
}

const obs = new PerformanceObserver((items) => {
  const results: LogResult = {
    Bunyan: {},
    Ogma: {},
    Pino: {},
    Winston: {},
  };
  items.getEntries().forEach((logRes) => {
    const [logName, logType] = logRes.name.split(' ');
    results[logName][logType] = logRes.duration;
  });
  writeBenchmarks(results);
  performance.clearMarks();
});

obs.observe({ entryTypes: ['measure'], buffered: true });

benchAll();
