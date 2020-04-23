import { createWriteStream } from 'fs';
import * as os from 'os';
import { join } from 'path';

type LoggerName = 'Ogma' | 'Bunyan' | 'Winston' | 'Pino';
type LogType = 'simple' | 'json' | 'deep' | 'long';
type LogResult = {
  [index in LoggerName]: {
    [index in LogType]?: number;
  };
};
function makeRow(
  name: string,
  rowResult: { [index in LogType]: number },
): string {
  return `| ${name} | ${rowResult.simple}ms | ${rowResult.long}ms | ${rowResult.json}ms | ${rowResult.deep}ms |\n`;
}

function makeTable(results: LogResult) {
  let table = `| Logger | Simple | Long | JSON | Deep |
| - | - | - | - | - |\n`;
  Object.keys(results).forEach((resultName) => {
    table += makeRow(resultName, results[resultName]);
  });
  return table;
}

export function writeBenchmarks(results: LogResult): void {
  const benchmarks = `# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of \`/dev/null\`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the \`globalThis\`. All timings were made by using the \`perf_hooks\` module.

## Results

${makeTable(results)}

## Information

Benchmarks generated on ${os.type()}/${os.platform()} ${os.arch()} ${os.release()} ~${
    os.cpus()[0].model
  } (cores/threads): ${os.cpus().length}
`;
  const ws = createWriteStream(join(__dirname, '..', 'README.md'));
  ws.write(Buffer.from(benchmarks));
  ws.close();
}
