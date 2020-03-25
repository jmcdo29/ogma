import { createMock } from '@golevelup/nestjs-testing';
import { createWriteStream } from 'fs';
import { LogLevel } from '../enums';
import { Ogma } from './ogma';

const dest = createWriteStream('/dev/null');

process.stdout.hasColors = () => true;

const circularObject: any = {};
circularObject.a = 'hello';
circularObject.b = {
  c: circularObject,
};
circularObject.d = () => 'function';

const logLevels = [
  'SILLY',
  'VERBOSE',
  'FINE',
  'DEBUG',
  'INFO',
  'LOG',
  'WARN',
  'ERROR',
  'FATAL',
];

const logOptions: Array<keyof typeof LogLevel> = [
  'OFF',
  'ALL',
  'SILLY',
  'VERBOSE',
  'FINE',
  'DEBUG',
  'INFO',
  'LOG',
  'WARN',
  'ERROR',
  'FATAL',
];

const mockStream = createMock<NodeJS.WriteStream>();

const streamOptions: Array<
  | (Partial<NodeJS.WriteStream> &
      Pick<NodeJS.WriteStream, 'write' | 'hasColors'>)
  | undefined
> = [mockStream, undefined];

const appOptions = ['TEST APP', ''];

const contextOption = ['TEST FUNC', ''];

const colorOptions = [true, false];

const jsonOptions = [true, false];

describe('Ogma class', () => {
  let ogma: Ogma;
  let stdoutSpy: jest.SpyInstance;
  // eslint-disable-next-line sonarjs/cognitive-complexity
  describe.each(appOptions)('application %s', (application: string) => {
    describe.each(contextOption)('context %s', (context: string) => {
      describe.each(colorOptions)('color %s', (color: boolean) => {
        describe.each(jsonOptions)('json %s', (json: boolean) => {
          describe.each(logOptions)(
            'log level %s',
            (logLevel: keyof typeof LogLevel) => {
              describe.each(streamOptions)(
                'stream %j',
                (
                  stream:
                    | (Partial<NodeJS.WriteStream> &
                        Pick<NodeJS.WriteStream, 'write' | 'hasColors'>)
                    | undefined,
                ) => {
                  beforeEach(() => {
                    ogma = new Ogma({
                      logLevel,
                      color,
                      stream,
                      json,
                      context,
                      application,
                    });
                  });
                  describe.each(appOptions)(
                    'method application %s',
                    (methodApplication: string | undefined) => {
                      describe.each(contextOption)(
                        'method context %s',
                        (methodContext: string | undefined) => {
                          describe.each([
                            'message',
                            42,
                            true,
                            circularObject,
                            () => 'func',
                          ])('calling log method with %j', (logMessage) => {
                            beforeEach(() => {
                              if (stream) {
                                stdoutSpy = jest
                                  .spyOn(mockStream, 'write')
                                  .mockImplementation((message) => {
                                    dest.write(message);
                                    return true;
                                  });
                              } else {
                                stdoutSpy = jest
                                  .spyOn(process.stdout, 'write')
                                  .mockImplementation((message) => {
                                    dest.write(message);
                                    return true;
                                  });
                              }
                            });

                            afterEach(() => {
                              stdoutSpy.mockReset();
                            });
                            it.each(logLevels as Array<keyof typeof LogLevel>)(
                              'should call %s and all above it',
                              (level) => {
                                if (
                                  LogLevel[level] >=
                                  LogLevel[logLevel || 'INFO']
                                ) {
                                  ogma[level.toLowerCase()](
                                    logMessage,
                                    methodContext,
                                    methodApplication,
                                  );
                                  if (typeof logMessage === 'object') {
                                    expect(
                                      stdoutSpy.mock.calls[0][0].includes(
                                        '[Circular]',
                                      ),
                                    ).toBeTruthy();
                                  }
                                  let levelContainString: string;
                                  let contextContainString = '';
                                  let applicationContainString = '';
                                  if (color && !json) {
                                    levelContainString = `m${(
                                      '[' +
                                      LogLevel[LogLevel[level]] +
                                      ']'
                                    ).padEnd(7)}\u001b[0m`;
                                    if (methodContext || context) {
                                      contextContainString =
                                        'm[' +
                                        (methodContext || context) +
                                        ']\u001b[0m';
                                    }
                                    if (methodApplication || application) {
                                      applicationContainString =
                                        'm[' +
                                        (methodApplication || application) +
                                        ']\u001b[0m';
                                    }
                                  } else if (!json) {
                                    levelContainString = `${(
                                      '[' +
                                      LogLevel[LogLevel[level]] +
                                      ']'
                                    ).padEnd(7)}`;
                                    if (methodContext || context) {
                                      contextContainString =
                                        '[' + (methodContext || context) + ']';
                                    }
                                    if (methodApplication || application) {
                                      applicationContainString =
                                        '[' +
                                        (methodApplication || application) +
                                        ']';
                                    }
                                  } else {
                                    levelContainString =
                                      '"level":"' +
                                      LogLevel[LogLevel[level]] +
                                      '"';
                                    if (methodContext || context) {
                                      contextContainString =
                                        '"context":"' +
                                        (methodContext || context) +
                                        '"';
                                    }
                                    if (methodApplication || application) {
                                      applicationContainString =
                                        '"application":"' +
                                        (methodApplication || application) +
                                        '"';
                                    }
                                  }
                                  expect(
                                    stdoutSpy.mock.calls[0][0].includes(
                                      levelContainString,
                                    ),
                                  ).toBeTruthy();
                                  if (applicationContainString) {
                                    expect(
                                      stdoutSpy.mock.calls[0][0].includes(
                                        applicationContainString,
                                      ),
                                    ).toBeTruthy();
                                  }
                                  if (contextContainString) {
                                    expect(
                                      stdoutSpy.mock.calls[0][0].includes(
                                        contextContainString,
                                      ),
                                    ).toBeTruthy();
                                  }
                                  expect(stdoutSpy).toBeCalledTimes(1);
                                } else {
                                  expect(stdoutSpy).toBeCalledTimes(0);
                                }
                              },
                            );
                          });
                        },
                      );
                    },
                  );
                },
              );
            },
          );
        });
      });
    });
  });
});
describe('small ogma tests', () => {
  let ogma: Ogma;
  let stdoutSpy: jest.SpyInstance;

  beforeEach(() => {
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation((message) => {
        dest.write(message);
        return true;
      });
  });
  afterEach(() => {
    stdoutSpy.mockReset();
  });
  describe('printError', () => {
    beforeEach(() => {
      ogma = new Ogma();
    });

    it('should make three prints', () => {
      ogma.printError(new Error('This is my error'));
      expect(stdoutSpy).toBeCalledTimes(2);
      expect(stdoutSpy.mock.calls[0][0].includes('Error')).toBeTruthy();
      expect(
        stdoutSpy.mock.calls[1][0].includes('This is my error'),
      ).toBeTruthy();
    });
  });

  describe('Bad log level', () => {
    it('should replace bad with "INFO"', () => {
      ogma = new Ogma({ logLevel: 'bad' as any });
      expect((ogma as any).options.logLevel).toBe('INFO');
      expect(stdoutSpy).toBeCalledTimes(1);
    });

    it('should run the if with options but no logLevel', () => {
      ogma = new Ogma({ color: false });
      expect(stdoutSpy).toBeCalledTimes(0);
    });
  });
});
