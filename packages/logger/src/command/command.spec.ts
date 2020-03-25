import { createWriteStream, promises } from 'fs';
import { OgmaLog } from '../interfaces/ogma-log';
import { ogmaHydrate } from './command';
import {
  logKeys,
  jsonLogs,
  OgmaLogSet,
  ExpectedOgmaOutput,
  stringLogs,
} from './command.fixtures';
import * as messages from './messages';

const globalIsTTY = process.stdout.isTTY;

jest.mock('fs', () => ({
  createWriteStream: () => ({
    write: jest.fn(),
  }),
  promises: {
    readFile: jest.fn(),
  },
}));

const dest = createWriteStream('/dev/null');

const levelShouldPass = () => 'Level %s should pass';

const writeSpy = jest
  .spyOn(process.stdout, 'write')
  .mockImplementation((message: any) => {
    dest.write(message);
    return true;
  });

const errorSpy = jest
  .spyOn(process.stderr, 'write')
  .mockImplementation((message: any) => {
    dest.write(message);
    return true;
  });

const exitSpy = jest
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);

const spyOnRead = (fileContents: OgmaLog): jest.SpyInstance => {
  return jest
    .spyOn(promises, 'readFile')
    .mockResolvedValueOnce(Buffer.from(JSON.stringify(fileContents)));
};

const setTTY = (isTTY: boolean) => {
  process.stdout.isTTY = isTTY;
};

const resetWrite = () => {
  writeSpy.mockClear();
  process.stdout.isTTY = globalIsTTY;
};

const someFile = 'someFile';

const hydrateArgs = ['node', '/dev/null', someFile];

const ogmaHydrateTest = async (
  readVal: OgmaLog,
  expectedVal: string,
): Promise<void> => {
  expect.assertions(4);
  const readSpy = spyOnRead(readVal);
  await expect(ogmaHydrate(hydrateArgs)).resolves.not.toThrow();
  expect(readSpy).toBeCalledWith(someFile);
  expect(writeSpy).toBeCalledTimes(1);
  expect(writeSpy).toBeCalledWith(Buffer.from(expectedVal));
  readSpy.mockClear();
};

const ogmaHydrateTestWithFlags = async (
  readVal: OgmaLog,
  expectedVal: string,
  flag: string,
): Promise<void> => {
  expect.assertions(4);
  const readSpy = spyOnRead(readVal);
  await expect(ogmaHydrate([...hydrateArgs, flag])).resolves.not.toThrow();
  expect(readSpy).toBeCalledWith(someFile);
  expect(writeSpy).toBeCalledTimes(1);
  expect(writeSpy).toBeCalledWith(Buffer.from(expectedVal));
  readSpy.mockRestore();
};

describe.each([
  [true, jsonLogs.noAppNoConJSON, jsonLogs.hydratedNoAppNoCon],
  [true, jsonLogs.noConJSON, jsonLogs.hydratedNoCon],
  [true, jsonLogs.noAppJSON, jsonLogs.hydratedNoApp],
  [true, jsonLogs.fullJSON, jsonLogs.hydratedFull],
  [false, jsonLogs.noAppNoConJSON, jsonLogs.hydratedNoAppNoConNoColor],
  [false, jsonLogs.noConJSON, jsonLogs.hydratedNoConNoColor],
  [false, jsonLogs.noAppJSON, jsonLogs.hydratedNoAppNoColor],
  [false, jsonLogs.fullJSON, jsonLogs.hydratedFullNoColor],
  [true, stringLogs.noAppNoConString, stringLogs.hydratedNoAppNoConString],
  [true, stringLogs.noConString, stringLogs.hydratedNoConString],
  [true, stringLogs.noAppString, stringLogs.hydratedNoAppString],
  [true, stringLogs.fullString, stringLogs.hydratedFullString],
  [
    false,
    stringLogs.noAppNoConString,
    stringLogs.hydratedNoAppNoConNoColorString,
  ],
  [false, stringLogs.noConString, stringLogs.hydratedNoConNoColorString],
  [false, stringLogs.noAppString, stringLogs.hydratedNoAppNoColorString],
  [false, stringLogs.fullString, stringLogs.hydratedFullNoColorString],
])(
  'Hydrate TTY %s index %#',
  (tty: boolean, logSet: OgmaLogSet, output: ExpectedOgmaOutput) => {
    beforeEach(() => setTTY(tty));
    afterEach(() => resetWrite());
    it.each(logKeys)(levelShouldPass(), async (key: string) => {
      await ogmaHydrateTest(logSet[key], output[key]);
    });
  },
);

describe('command line flags', () => {
  afterEach(() => resetWrite());
  it('should set --color to true', async () => {
    await ogmaHydrateTestWithFlags(
      jsonLogs.fullJSON.info,
      jsonLogs.hydratedFull.info,
      '--color',
    );
  });
  it('should set --color=true to true', async () => {
    await ogmaHydrateTestWithFlags(
      jsonLogs.fullJSON.info,
      jsonLogs.hydratedFull.info,
      '--color=true',
    );
  });
  it('should set --color=false to false', async () => {
    await ogmaHydrateTestWithFlags(
      jsonLogs.fullJSON.info,
      jsonLogs.hydratedFullNoColor.info,
      '--color=false',
    );
  });
});

describe('Errors', () => {
  afterEach(() => {
    errorSpy.mockClear();
    exitSpy.mockClear();
  });
  it('should error with too many arguments', async () => {
    expect.assertions(2);
    await ogmaHydrate([...hydrateArgs, '1', '2', '3']);
    expect(errorSpy).toBeCalledWith(messages.tooManyArgs);
    expect(exitSpy).toBeCalledWith(1);
  });
  it('should error with a bad file', async () => {
    expect.assertions(2);
    const readSpy = jest
      .spyOn(promises, 'readFile')
      .mockRejectedValueOnce(new Error('File Read Error'));
    await ogmaHydrate(hydrateArgs);
    expect(errorSpy).toBeCalledWith(messages.generalError);
    expect(exitSpy).toBeCalledWith(1);
    readSpy.mockRestore();
  });
  it('should error with missing file', async () => {
    expect.assertions(2);
    await ogmaHydrate(['node', '/dev/null']);
    expect(errorSpy).toBeCalledWith(messages.missingFile);
    expect(exitSpy).toBeCalledWith(1);
  });
  it('should error with an incorrectly formatted JSON', async () => {
    expect.assertions(2);
    const readSpy = jest
      .spyOn(promises, 'readFile')
      .mockResolvedValueOnce(Buffer.from(JSON.stringify({ hello: 'world' })));
    await ogmaHydrate(hydrateArgs);
    expect(errorSpy).toBeCalledWith(messages.badFormat);
    expect(exitSpy).toBeCalledWith(1);
    readSpy.mockRestore();
  });
  it('should fail from a non-JSON format', async () => {
    expect.assertions(2);
    const readSpy = jest
      .spyOn(promises, 'readFile')
      .mockResolvedValueOnce(Buffer.from('[hello: world]'));
    await ogmaHydrate(hydrateArgs);
    expect(errorSpy).toBeCalledWith(messages.badFormat);
    expect(exitSpy).toBeCalledWith(1);
    readSpy.mockRestore();
  });
  it('should error with incorrect args (bad flag)', async () => {
    expect.assertions(2);
    await ogmaHydrate([...hydrateArgs, 'color=true']);
    expect(errorSpy).toBeCalledWith(messages.usage);
    expect(exitSpy).toBeCalledWith(1);
  });
  it('should error with incorrect args (bad flag)', async () => {
    expect.assertions(2);
    await ogmaHydrate([...hydrateArgs, '--color=hello']);
    expect(errorSpy).toBeCalledWith(messages.usage);
    expect(exitSpy).toBeCalledWith(1);
  });
});
