import { OgmaLog } from '@ogma/common';
import { createWriteStream, promises } from 'fs';
import { CommandTestFactory } from 'nest-commander-testing';
import { ExpectedOgmaOutput, jsonLogs, logKeys, OgmaLogSet, stringLogs } from './command.fixtures';
import { AppModule } from '../src/app.module';
import { OgmaCommand } from '../src/ogma.command';

const globalIsTTY = process.stdout.isTTY;

const dest = createWriteStream('/dev/null');

const levelShouldPass = () => 'Level %s should pass';

const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation((message: any) => {
  dest.write(message);
  return true;
});

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

const hydrateArgs = [someFile];

const ogmaHydrate = async (_args: string[]): Promise<void> => {
  const commandModule = await CommandTestFactory.createTestingCommand({
    imports: [AppModule],
  }).compile();
  const command = commandModule.get(OgmaCommand);
  await command.run([someFile], { color: process.stdout.isTTY });
};

const ogmaHydrateTest = async (readVal: OgmaLog, expectedVal: string): Promise<void> => {
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
  [false, stringLogs.noAppNoConString, stringLogs.hydratedNoAppNoConNoColorString],
  [false, stringLogs.noConString, stringLogs.hydratedNoConNoColorString],
  [false, stringLogs.noAppString, stringLogs.hydratedNoAppNoColorString],
  [false, stringLogs.fullString, stringLogs.hydratedFullNoColorString],
])('Hydrate TTY %s index %#', (tty: boolean, logSet: OgmaLogSet, output: ExpectedOgmaOutput) => {
  beforeEach(() => setTTY(tty));
  afterEach(() => resetWrite());
  it.each(logKeys)(levelShouldPass(), async (key: string) => {
    await ogmaHydrateTest(logSet[key], output[key]);
  });
});

describe.skip('command line flags', () => {
  afterEach(() => resetWrite());
  it('should set --color to true', async () => {
    await ogmaHydrateTestWithFlags(jsonLogs.fullJSON.info, jsonLogs.hydratedFull.info, '--color');
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
