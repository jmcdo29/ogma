import { LogLevel } from '@ogma/common';
import { style } from '@ogma/styler';
import { spy, Stub } from 'hanbi';
import { Socket } from 'net';
import { suite } from 'uvu';
import { is, match, not, ok } from 'uvu/assert';

import { Ogma, OgmaOptions } from '../src';

const circularObject: any = {};
circularObject.a = 'hello';
circularObject.b = {
  c: circularObject,
};
circularObject.d = () => 'function';
circularObject.e = Symbol('hello');

const logLevels = ['SILLY', 'VERBOSE', 'FINE', 'DEBUG', 'INFO', 'LOG', 'WARN', 'ERROR', 'FATAL'];

const OgmaSuite = suite<{
  writeSpy: Stub<Socket['write']>;
  ogmaFactory: (options?: Partial<Exclude<OgmaOptions, 'stream'>>) => Ogma;
  getFirstCallString: (spy: Stub<Socket['write']>) => string;
  getSpyArg: (spy: Stub<any>, prop: 'firstCall' | 'lastCall') => string;
  tty: boolean;
  colorDepth: number;
}>('Ogma Tests', {
  writeSpy: undefined,
  ogmaFactory: undefined,
  getFirstCallString: (spy) => spy.firstCall.args[0].toString(),
  getSpyArg: (spy, prop) => spy[prop].args[0].toString(),
  tty: undefined,
  colorDepth: undefined,
});
OgmaSuite.before((context) => {
  context.tty = process.stdout.isTTY;
  process.stdout.isTTY = true;
  context.colorDepth = (process.stdout.getColorDepth && process.stdout.getColorDepth()) ?? 1;
  process.stdout.getColorDepth = () => 4;
});
OgmaSuite.before.each((context) => {
  context.writeSpy = spy();
  context.ogmaFactory = (options = {}) =>
    new Ogma({ stream: { write: context.writeSpy.handler, getColorDepth: () => 4 }, ...options });
});
OgmaSuite.after(({ tty, colorDepth }) => {
  process.stdout.isTTY = tty;
  process.stdout.getColorDepth = () => colorDepth;
});
for (const color of [true, false]) {
  OgmaSuite(
    `It should${color ? '' : ' not'} log in color`,
    ({ ogmaFactory, writeSpy, getFirstCallString }) => {
      const ogma = ogmaFactory({ color });
      ogma.log('Hello');
      const matcher = color ? match : not.match;
      matcher(getFirstCallString(writeSpy), style.cyan().apply('[INFO] '));
    },
  );
}
for (const json of [true, false]) {
  OgmaSuite(
    `It should write in ${json ? 'json' : 'a string'}`,
    ({ ogmaFactory, writeSpy, getFirstCallString }) => {
      const ogma = ogmaFactory({ json });
      ogma.log('Hello');
      const loggedVal = getFirstCallString(writeSpy);
      if (json) {
        const loggedJSON = JSON.parse(loggedVal);
        match(loggedJSON.time, /\d{10}/);
        match(loggedJSON.pid, /\d{1,5}/);
        is(loggedJSON.level, 'INFO');
        is(loggedJSON.message, 'Hello');
      } else {
        not.match(loggedVal, /[{}]/);
      }
    },
  );
}
for (const correlationId of ['1598961763272766', '']) {
  OgmaSuite(
    `It should log with correlationId ${correlationId}`,
    ({ ogmaFactory, writeSpy, getFirstCallString }) => {
      const ogma = ogmaFactory();
      ogma.log('Hello!', { correlationId });
      match(getFirstCallString(writeSpy), correlationId);
    },
  );
}
for (const context of ['test context', '']) {
  OgmaSuite(
    `It should log with context ${context}`,
    ({ ogmaFactory, writeSpy, getFirstCallString }) => {
      const ogma = ogmaFactory({ context });
      ogma.log('Hello!');
      match(getFirstCallString(writeSpy), context ? style.cyan().apply(`[${context}]`) : '');
    },
  );
}
for (const application of ['test app', '']) {
  OgmaSuite(
    `It should log with application ${application}`,
    ({ ogmaFactory, writeSpy, getFirstCallString }) => {
      const ogma = ogmaFactory({ application });
      ogma.log('Hello!');
      match(
        getFirstCallString(writeSpy),
        application ? style.yellow().apply(`[${application}]`) : '',
      );
    },
  );
}
for (const logLevel of [
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
] as const) {
  OgmaSuite(`Call each log method: Log level set to ${logLevel}`, ({ writeSpy, ogmaFactory }) => {
    let numberOfCalls = 0;
    const ogma = ogmaFactory({ logLevel });
    for (const method of logLevels) {
      ogma[method.toLowerCase()]('Hello!');
      if (LogLevel[method] >= LogLevel[logLevel]) {
        numberOfCalls++;
      }
    }
    is(writeSpy.callCount, numberOfCalls);
  });
}
OgmaSuite(
  'it should manage circular, function, and symbols in objects',
  ({ ogmaFactory, writeSpy, getFirstCallString }) => {
    const ogma = ogmaFactory();
    ogma.log(circularObject);
    const loggedVal = getFirstCallString(writeSpy);
    match(loggedVal, /\[Circular\]/);
    match(loggedVal, /\[Function:/);
    match(loggedVal, /\[Symbol: hello\]/);
  },
);
OgmaSuite(
  'it should add the base context and application to a json message',
  ({ ogmaFactory, writeSpy, getFirstCallString }) => {
    const ogma = ogmaFactory({
      json: true,
      context: 'json context',
      application: 'json test',
    });
    ogma.log({ hello: 'world!' });
    const loggedVal = JSON.parse(getFirstCallString(writeSpy));
    is(loggedVal.context, 'json context');
    is(loggedVal.application, 'json test');
    is(loggedVal.message.hello, 'world!');
  },
);
OgmaSuite(
  'it should log the error name and message on the same line',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory();
    const err = new Error('This is an error');
    ogma.log(err);
    const loggedVal = getFirstCallString(writeSpy);
    match(loggedVal, new RegExp(`${err.name}: ${err.message}`));
    is(
      loggedVal.split('\n').length,
      2,
      'It should be two to take into account the built in newline character',
    );
  },
);
OgmaSuite(
  'It should print two lines for an Error object',
  ({ writeSpy, ogmaFactory, getFirstCallString, getSpyArg }) => {
    const ogma = ogmaFactory();
    ogma.printError(new Error('This is my error'));
    is(writeSpy.callCount, 2);
    const loggedVal = getFirstCallString(writeSpy);
    match(loggedVal, /Error/);
    match(getSpyArg(writeSpy, 'lastCall'), /This is my error\n$/);
  },
);
OgmaSuite(
  'It should replace an invalid log level',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory({
      logLevel: 'This level does not exist' as any,
    });
    is((ogma as any).options.logLevel, 'INFO', 'The log level should have been replaced');
    is(writeSpy.callCount, 1);
    match(
      getFirstCallString(writeSpy),
      /Ogma logLevel was set to THIS LEVEL DOES NOT EXIST which does not match a defined logLevel\. Falling back to default instead\.\n/,
    );
  },
);
OgmaSuite(
  'Should check the log level if options are passed but does not include the log level',
  ({ writeSpy, ogmaFactory }) => {
    ogmaFactory({ color: false });
    is(writeSpy.callCount, 0);
  },
);
const levelMap = {
  SILLY: 'NSILLY',
  WARN: 'NWARN',
  ERROR: 'NERROR',
  FATAL: 'NFATAL',
  DEBUG: 'NDEBUG',
  FINE: 'NFINE',
  INFO: 'NINFO',
};
OgmaSuite(
  'It should log to json using a special level key',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory({
      levelKey: 'severity',
      levelMap,
      json: true,
    });
    ogma.info('Hello World!');
    const loggedVal = JSON.parse(getFirstCallString(writeSpy));
    is(loggedVal.severity, loggedVal.level);
  },
);
OgmaSuite(
  'It should log out the custom level from the level map',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory({
      levelMap,
      json: true,
    });
    ogma.info('Hello World!');
    const loggedVal = JSON.parse(getFirstCallString(writeSpy));
    is(loggedVal.level, 'NINFO');
  },
);
OgmaSuite(
  'It should use the level map with streams',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory({
      levelMap,
    });
    ogma.info('Hello World!');
    match(getFirstCallString(writeSpy), /\[NINFO\]/);
  },
);
OgmaSuite(
  'It should use the default map if none given',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory();
    ogma.info('Hello World');
    match(getFirstCallString(writeSpy), /\[INFO\]/);
  },
);
OgmaSuite(
  'It should still have the "message" prop in JSON mode',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory({ json: true });
    ogma.log({ message: 'Hello World!' });
    const loggedVal = JSON.parse(getFirstCallString(writeSpy));
    ok(Object.keys(loggedVal).includes('message'));
    is(loggedVal.message.message, 'Hello World!');
  },
);
for (const json of [true, false]) {
  OgmaSuite(
    `it should make the value for the password. JSON: ${json}`,
    ({ writeSpy, ogmaFactory, getFirstCallString }) => {
      const ogma = ogmaFactory({ json, masks: ['password'] });
      ogma.log({ username: 'something', password: 'mask this' });
      const loggedVal = getFirstCallString(writeSpy);
      match(loggedVal, /"username":\s?"something",/);
      match(loggedVal, /"password":\s?"\*{9}"/);
    },
  );
}
OgmaSuite(
  'it should print each array value if the option "each" is true',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory();
    const messages = ['hello', 42, { key: 'value' }, true];
    ogma.log(messages, { each: true });
    is(writeSpy.calls.size, 1, 'Expected there to be one calls to the write stream');
    const expected = `hello 42 {
  "key": "value"
} true`;
    match(getFirstCallString(writeSpy), expected);
  },
);
OgmaSuite(
  'it should print each array value if the global option "each" is true',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory({ each: true });
    const messages = ['hello', 42, { key: 'value' }, true];
    ogma.log(messages);
    is(writeSpy.calls.size, 1, 'Expected there to be one calls to the write stream');
    const expected = `hello 42 {
  "key": "value"
} true`;
    match(getFirstCallString(writeSpy), expected);
  },
);
OgmaSuite(
  'it should respect array values that have newline characters',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory();
    const messages = [{ hello: 'world' }, { key: 'value' }, 'some string\n', 'goodbye\n world'];
    ogma.log(messages, { each: true });
    const expected = `{
  "hello": "world"
} {
  "key": "value"
} some string
goodbye
 world`;
    match(getFirstCallString(writeSpy), expected);
  },
);
OgmaSuite(
  'A tab character \\t should not be replaced',
  ({ writeSpy, ogmaFactory, getFirstCallString }) => {
    const ogma = ogmaFactory();
    const messages = ['asdf\n\tasdf'];
    ogma.log(messages, { each: true });
    const expected = 'asdf\n\tasdf';
    match(getFirstCallString(writeSpy), expected);
  },
);
// https://github.com/jmcdo29/ogma/discussions/1381#discussioncomment-3820617
for (const { message, expected } of [
  {
    message: ['asdf\n', 'sdfg', 'werr'],
    expected: `asdf
sdfg werr`,
  },
  {
    message: ['some string:\n', { a: 1, b: 2 }],
    expected: `some string:
{
  "a": 1,
  "b": 2
}`,
  },
  {
    message: ['some string:', { a: 1, b: 2 }],
    expected: `some string: {
  "a": 1,
  "b": 2
}`,
  },
  {
    message: [1, 2, 3],
    expected: `1 2 3`,
  },
  {
    message: ['hello', 42, { key: 'value' }, true],
    expected: `hello 42 {
  "key": "value"
} true`,
  },
  {
    message: [
      'Hello',
      'world',
      {
        deep: { nest: { key: 'value' }, nest2: { key: 'value' } },
        deep2: { nest: { value: 'key' }, nest2: { key: 'value' } },
      },
      true,
      42,
    ],
    expected: `Hello world {
  "deep": {
    "nest": {
      "key": "value"
    },
    "nest2": {
      "key": "value"
    }
  },
  "deep2": {
    "nest": {
      "value": "key"
    },
    "nest2": {
      "key": "value"
    }
  }
} true 42`,
  },
  {
    message: [
      'Hello',
      'world',
      { deep: { nest: { key: 'value' } }, deep2: { nest: { value: 'key' } } },
      true,
      42,
    ],
    expected: `Hello world {
  "deep": {
    "nest": {
      "key": "value"
    }
  },
  "deep2": {
    "nest": {
      "value": "key"
    }
  }
} true 42`,
  },
  {
    message: ['asdf\n\tasdf', 'asdf\n{\n a: 1\n}'],
    expected: `asdf
\tasdf asdf
{
 a: 1
}`,
  },
]) {
  OgmaSuite(
    `message: ${message.toString().replace(/\n/g, '\\n').replace(/\t/g, '\\t')}`,
    ({ writeSpy, ogmaFactory, getFirstCallString }) => {
      const ogma = ogmaFactory();
      ogma.log(message, { each: true });
      match(getFirstCallString(writeSpy), expected);
    },
  );
}
OgmaSuite('It should not explosively print array values', ({ writeSpy, ogmaFactory }) => {
  const ogma = ogmaFactory();
  const messages = [
    ['Hello', 'World!'],
    ['How', 'are', 'you?'],
  ];
  ogma.log(messages, { each: true });
  is(writeSpy.calls.size, 1, 'There should only be one calls');
});

OgmaSuite.run();
