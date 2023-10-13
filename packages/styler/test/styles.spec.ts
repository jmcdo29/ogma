import { ok } from 'assert';
import { suite } from 'uvu';
import { is } from 'uvu/assert';

import { style } from '../src';

const hello = 'Hello World!';

const hasStyles = (received: string, ...styles: string[]) => {
  const pass = styles.every((style) => received.includes(style)) && received.endsWith('\x1B[0m');
  const expectedStyles = styles.map((style) => style.replace(/\x1B/g, '\\x1B')).join(',');
  const escapedReceived = received.replace(/\x1B/g, '\\x1B');
  ok(pass, `expected ${escapedReceived} to contain ${expectedStyles}`);
};

const StylerSuite = suite('Styler Suite');
StylerSuite('underline should add \\x1B[4m', () => {
  hasStyles(style.underline.apply(hello), '\x1B[4m');
});
StylerSuite('blink should add \\x1B[5m', () => {
  hasStyles(style.blink.apply(hello), '\x1B[5m');
});
StylerSuite('bgColor should add a general background color', () => {
  hasStyles(style.bgColor(138).apply(hello), '\x1B[48;5;138m');
});
StylerSuite('fgColor should add a general foreground color', () => {
  hasStyles(style.color(93).apply(hello), '\x1B[38;5;93m');
});
StylerSuite('color and bgColor should be usable together', () => {
  hasStyles(style.color(45).bgColor(193).apply(hello), '\x1B[38;5;45m', '\x1B[48;5;193m');
});
for (const { depth, prefixCreator, testMethod } of [
  {
    depth: 1,
    prefixCreator: () => hello,
    testMethod: is,
  },
  {
    depth: 4,
    prefixCreator: (val: string) => `\x1B[3${val}m`,
    testMethod: hasStyles,
  },
]) {
  for (const { color, code } of [
    { color: 'black', code: '0' },
    {
      color: 'red',
      code: '1',
    },
    {
      color: 'green',
      code: '2',
    },
    {
      color: 'yellow',
      code: '3',
    },
    {
      color: 'blue',
      code: '4',
    },
    { color: 'magenta', code: '5' },
    {
      color: 'cyan',
      code: '6',
    },
    { color: 'white', code: '7' },
  ]) {
    StylerSuite(`depth: ${depth} color: ${color}`, () => {
      const forceColor = process.env.FORCE_COLOR;
      process.env.FORCE_COLOR = undefined;
      const styler = style.child({ getColorDepth: () => depth });
      testMethod(styler[color].apply(hello), prefixCreator(code));
      process.env.FORCE_COLOR = forceColor;
    });
  }
}
StylerSuite('lots of mixed decorators', () => {
  hasStyles(style.underline.blink.blue.apply(hello), '\x1B[4m', '\x1B[5m', '\x1B[34m');
});
StylerSuite('it should log styles but not color', () => {
  const ogNO_COLOR = process.env.NO_COLOR;
  process.env.NO_COLOR = 'true';
  const ncStyle = style.child();
  hasStyles(ncStyle.underline.apply(hello), '\x1B[4m');
  is(ncStyle.blue.apply(hello), hello);
  process.env.NO_COLOR = ogNO_COLOR;
});
StylerSuite('it should apply absolutely no styles', () => {
  const ogNO_STYLE = process.env.NO_STYLE;
  process.env.NO_STYLE = 'true';
  const nsStyle = style.child();
  is(nsStyle.blue.underline.blink.apply(hello), hello);
  process.env.NO_STYLE = ogNO_STYLE;
  if (process.env.NO_STYLE === 'undefined') {
    process.env.NO_STYLE = '';
  }
});
StylerSuite('Composition, usage inside a styler should still apply outer style', () => {
  const output = style.blue.apply(`hello ${style.child().underline.apply('blue')} world`);
  const expectedString = '\x1B[34mhello \x1B[4mblue\x1B[0m\x1B[34m world\x1B[0m';
  is(
    output,
    expectedString,
    `Expected ${expectedString.replaceAll(/\x1B/g, '\\x1B')}, but received ${output.replaceAll(
      /\x1B/g,
      '\\x1B',
    )}`,
  );
});
StylerSuite.run();
