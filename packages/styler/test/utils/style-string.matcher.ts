/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeStringStyledWith(...styles: string[]): R;
    }
  }
}

expect.extend({
  toBeStringStyledWith(received: string, ...styles: string[]) {
    const pass = styles.every((style) => received.includes(style)) && received.endsWith('\x1B[0m');
    const expectedStyles = styles.map((style) => style.replace(/\x1B/g, '\\x1B')).join(',');
    const escapedReceived = received.replace(/\x1B/g, '\\x1B');
    if (pass) {
      return {
        message: () => `expected "${escapedReceived}" to not contain ${expectedStyles}`,
        pass,
      };
    } else {
      return {
        message: () => `expected "${escapedReceived}" to contain ${expectedStyles}`,
        pass,
      };
    }
  },
});

export {};
