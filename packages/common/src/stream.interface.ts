/**
 * A simple type to allow for easy use of the `ogma` library on front and backend
 * abstracted away from the NodeJS `WritableStream`, though inspiration was drawn from it
 */
export interface OgmaStream {
  /**
   * The method for actually writing the log. This is made to be as open ended as possible for great extensibility.
   */
  write: (message: unknown) => unknown;
  /**
   * A utility method to determine if color can be used. This should usually return a 1, 4, 8, or 24.
   * @see https://nodejs.org/dist/latest-v14.x/docs/api/tty.html#tty_writestream_getcolordepth_env
   */
  getColorDepth?: () => number;
}
