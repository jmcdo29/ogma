import { promises } from 'fs';
import * as hanbi from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { Socket } from 'net';
import { suite } from 'uvu';
import { equal, is, ok } from 'uvu/assert';
import { jsonLogs, logKeys, stringLogs } from './command.fixtures';
import { AppModule } from '../src/app.module';
import { OgmaCommand } from '../src/ogma.command';

const someFile = 'someFile';

const hydrateArgs = [someFile];

const ogmaHydrate = async (_args: string[]): Promise<void> => {
  const commandModule = await CommandTestFactory.createTestingCommand({
    imports: [AppModule],
  }).compile();
  const command = commandModule.get(OgmaCommand);
  await command.run([someFile], { color: process.stdout.isTTY });
};

for (const useTty of [true, false]) {
  for (const logSet of [jsonLogs, stringLogs]) {
    for (const keySet of ['noAppNoCon', 'noApp', 'noCon', 'full']) {
      const logVal = logSet[`${keySet}`];
      const expected = logSet[`${keySet}${useTty ? '' : 'NoColor'}Hydrated`];
      const LogSuite = suite<{ writeSpy: hanbi.Stub<Socket['write']>; tty: boolean }>(
        `Hydrate TTY ${useTty} ${keySet}`,
        {
          writeSpy: undefined,
          tty: process.stdout.isTTY,
        },
      );
      LogSuite.before(() => {
        process.stdout.isTTY = useTty;
      });
      LogSuite.before.each((context) => {
        context.writeSpy = hanbi.stubMethod(process.stdout, 'write');
        // context.writeSpy.passThrough();
      });
      LogSuite.after.each(({ writeSpy }) => {
        writeSpy.reset();
        writeSpy.restore();
      });
      LogSuite.after(({ tty }) => {
        process.stdout.isTTY = tty;
      });
      for (const level of logKeys) {
        LogSuite(`${level}`, async ({ writeSpy }) => {
          const readSpy = hanbi.stubMethod(promises, 'readFile');
          readSpy.returns(Promise.resolve(Buffer.from(JSON.stringify(logVal[level]))));
          await ogmaHydrate(hydrateArgs);
          ok(readSpy.calledWith('someFile'));
          is(writeSpy.callCount, 1);
          equal(writeSpy.firstCall.args[0], Buffer.from(expected[level]));
        });
      }

      LogSuite.run();
    }
  }
}

const BlankLineSuite = suite<{ writeSpy: hanbi.Stub<any> }>('Blank Lines in JSON file', {
  writeSpy: undefined,
});
BlankLineSuite.before.each((context) => {
  context.writeSpy = hanbi.stubMethod(process.stdout, 'write');
});
BlankLineSuite.after.each(({ writeSpy }) => {
  writeSpy.reset();
  writeSpy.restore();
});
BlankLineSuite('No errors', async ({ writeSpy }) => {
  const readFileStub = hanbi.stubMethod(promises, 'readFile');
  readFileStub.returns(
    Promise.resolve(
      Buffer.from(
        JSON.stringify({ hostname: 'test', level: 'INFO', ool: 'INFO', pid: 1, time: '1' }) +
          '\n' +
          JSON.stringify({ hostname: 'test', level: 'INFO', ool: 'INFO', pid: 1, time: '1' }) +
          '\n' +
          JSON.stringify({ hostname: 'test', level: 'INFO', ool: 'INFO', pid: 1, time: '1' }) +
          '\n',
      ),
    ),
  );
  await ogmaHydrate(hydrateArgs);
  is(readFileStub.callCount, 1);
  is(writeSpy.callCount, 3);
});

BlankLineSuite.run();
