import { color } from './color';

process.stdout.hasColors = () => true;

describe.each([
  ['red', '1'],
  ['green', '2'],
  ['yellow', '3'],
  ['blue', '4'],
  ['magenta', '5'],
  ['cyan', '6'],
  ['white', '7'],
])('built in color function', (colorString: string, num: string) => {
  it('should print in ' + colorString, () => {
    const regex = new RegExp('\\u001b\\[3' + num + 'mhello\\u001b\\[0m');
    expect(regex.test((color as any)[colorString]('hello'))).toBe(true);
  });
});
