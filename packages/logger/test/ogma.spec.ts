import { createMock } from '@golevelup/ts-jest';
import { createWriteStream } from 'fs';
import { LogLevel } from '@ogma/common';
import { style } from '@ogma/styler';
import { Ogma, OgmaOptions } from '../src';

const dest = createWriteStream('/dev/null');

const circularObject: any = {};
circularObject.a = 'hello';
circularObject.b = {
  c: circularObject,
};
circularObject.d = () => 'function';
circularObject.e = Symbol('hello');

const logLevels = ['SILLY', 'VERBOSE', 'FINE', 'DEBUG', 'INFO', 'LOG', 'WARN', 'ERROR', 'FATAL'];

const mockStream = createMock<NodeJS.WriteStream>();

describe('Ogma Class', () => {
  let ogma: Ogma;
  function createOgmaInstance(options: Partial<OgmaOptions>): Ogma {
    return new Ogma(options);
  }
  function mockCallExpectation(
    ogma: Ogma,
    expectation: string,
    options: {
      context?: string;
      application?: string;
      correlationId?: string;
    } = {},
  ) {
    ogma.log('Hello', options);
    expect(mockStream.write.mock.calls[0][0].toString().replace(/\x1B/g, '\\x1B')).toEqual(
      expect.stringContaining(expectation.replace(/\x1B/g, '\\x1B')),
    );
  }
  afterEach(() => {
    mockStream.write.mockReset();
  });

  describe.each`
    color    | expectation
    ${true}  | ${style.cyan.apply('[INFO] ')}
    ${false} | ${'[INFO] '}
  `('color: $color', ({ color, expectation }: { color: boolean; expectation: string }) => {
    beforeEach(() => {
      ogma = createOgmaInstance({
        color,
        stream: mockStream,
      });
    });
    it(color ? 'should write in color' : 'should not write in color', () =>
      mockCallExpectation(ogma, expectation),
    );
  });
  describe.each`
    json     | expectation
    ${true}  | ${{ time: expect.any(String), pid: expect.any(Number), level: 'INFO', message: 'Hello' }}
    ${false} | ${null}
  `('json $json', ({ json, expectation }: { json: boolean; expectation: any }) => {
    beforeEach(() => {
      ogma = createOgmaInstance({ json, stream: mockStream });
    });
    it(json ? 'should print in JSON' : 'should not print in JSON', () => {
      ogma.log('Hello');
      if (json) {
        expect(JSON.parse(mockStream.write.mock.calls[0][0] as string)).toEqual(
          expect.objectContaining(expectation),
        );
      } else {
        expect(mockStream.write.mock.calls[0][0]).toEqual(expect.any(String));
      }
    });
  });
  describe.each`
    context           | expectation
    ${'test context'} | ${style.cyan.apply('[test context]')}
    ${null}           | ${''}
  `('context: $context', ({ context, expectation }: { context?: string; expectation: string }) => {
    beforeEach(() => {
      ogma = createOgmaInstance({ context, stream: mockStream });
    });
    it('should add the context to the log', () => mockCallExpectation(ogma, expectation));
  });
  describe.each`
    correlationId         | expectation
    ${'1598961763272766'} | ${'1598961763272766'}
    ${null}               | ${''}
  `(
    'requestId: $requestId',
    ({ correlationId, expectation }: { correlationId?: string; expectation: string }) => {
      beforeEach(() => {
        ogma = createOgmaInstance({ stream: mockStream });
      });
      it('should add the requestId to the log', () =>
        mockCallExpectation(ogma, expectation, { correlationId }));
    },
  );
  describe.each`
    application   | expectation
    ${'test app'} | ${style.yellow.apply('[test app]')}
    ${null}       | ${''}
  `(
    'application: $application',
    ({ application, expectation }: { application: string; expectation: string }) => {
      beforeEach(() => {
        ogma = createOgmaInstance({ application, stream: mockStream });
      });
      it('should add the context to the log', () => mockCallExpectation(ogma, expectation));
    },
  );
  describe.each`
    logLevel
    ${'OFF'}
    ${'ALL'}
    ${'SILLY'}
    ${'VERBOSE'}
    ${'FINE'}
    ${'DEBUG'}
    ${'INFO'}
    ${'LOG'}
    ${'WARN'}
    ${'ERROR'}
    ${'FATAL'}
  `('logLevel: $logLevel', ({ logLevel }: { logLevel: keyof typeof LogLevel }) => {
    beforeEach(() => {
      ogma = createOgmaInstance({ logLevel, stream: mockStream });
    });
    it('should call according to log level', () => {
      let ogmaCalls = 0;
      for (const method of logLevels) {
        ogma[method.toLowerCase()]('Hello');
        if (LogLevel[method] >= LogLevel[logLevel]) {
          ogmaCalls++;
        }
      }
      expect(mockStream.write).toBeCalledTimes(ogmaCalls);
    });
  });
  it('should manage circular, function, and symbols in objects', () => {
    ogma = new Ogma({ stream: mockStream });
    ogma.log(circularObject);
    expect(mockStream.write).toBeCalledTimes(1);
    const writeString = mockStream.write.mock.calls[0][0];
    expect(writeString).toEqual(expect.stringContaining('[Circular]'));
    expect(writeString).toEqual(expect.stringContaining('[Function:'));
    expect(writeString).toEqual(expect.stringContaining('[Symbol(hello)]'));
  });
  it('should follow the context, application, and message of a json', () => {
    ogma = new Ogma({
      json: true,
      context: 'json context',
      application: 'json test',
      stream: mockStream,
    });
    ogma.log({ hello: 'world' });
    expect(mockStream.write.mock.calls[0][0]).toEqual(expect.stringContaining('json context'));
    expect(mockStream.write.mock.calls[0][0]).toEqual(expect.stringContaining('json test'));
    expect(JSON.parse(mockStream.write.mock.calls[0][0] as string)).toEqual(
      expect.objectContaining({ hello: 'world' }),
    );
  });
  it('should log the error name and message on the same line', () => {
    ogma = new Ogma({ stream: mockStream });
    const err = new Error('This is an error');
    ogma.log(err);
    const mockCall: string = mockStream.write.mock.calls[0][0].toString();
    expect(mockCall).toEqual(expect.stringContaining(`${err.name}: ${err.message}`));
    expect(mockCall).not.toEqual(expect.stringContaining(err.stack));
    const newLines = mockCall.split('\n;');
    expect(newLines.length).toBe(1);
  });
});

describe('small ogma tests', () => {
  let ogma: Ogma;
  let stdoutSpy: jest.SpyInstance;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation((message) => {
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
      expect(stdoutSpy.mock.calls[1][0].includes('This is my error')).toBeTruthy();
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
  describe('Custom Log Level Map', () => {
    it.only('Should use the map for JSON', () => {
      const mockStream = {
        write: jest.fn(),
      };
      const ogma = new Ogma({
        levelMap: {
          SILLY: 'NSILLY',
          WARN: 'NWARN',
          ERROR: 'NERROR',
          FATAL: 'NFATAL',
          DEBUG: 'NDEBUG',
          FINE: 'NFINE',
          INFO: 'NINFO',
        },
        stream: mockStream,
        json: true,
      });
      ogma.info('Hello World!');
      const loggedValue = JSON.parse(mockStream.write.mock.calls[0][0]);
      expect(loggedValue.ool).toBe('INFO');
      expect(loggedValue.level).toBe('NINFO');
    });
    it('Should use the map for stream', () => {
      const mockStream = {
        write: jest.fn(),
      };
      const ogma = new Ogma({
        levelMap: {
          SILLY: 'NSILLY',
          WARN: 'NWARN',
          ERROR: 'NERROR',
          FATAL: 'NFATAL',
          DEBUG: 'NDEBUG',
          FINE: 'NFINE',
          INFO: 'NINFO',
        },
        stream: mockStream,
      });
      ogma.info('Hello World!');
      expect(mockStream.write.mock.calls[0][0]).toEqual(expect.stringContaining('[NINFO]'));
    });
    it('Should use the default map if none given', () => {
      const mockStream = {
        write: jest.fn(),
      };
      const ogma = new Ogma({ stream: mockStream });
      ogma.info('Hello World');
      expect(mockStream.write.mock.calls[0][0]).toEqual(expect.stringContaining('[INFO]'));
    });
  });
  describe('JSON with message prop', () => {
    it('should still have the message property', () => {
      ogma = new Ogma({ json: true });
      ogma.log({ message: 'Hello World!' });
      expect(stdoutSpy.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          time: expect.any(String),
          level: 'INFO',
          ool: 'INFO',
          message: 'Hello World!',
        }),
      );
    });
  });
});
