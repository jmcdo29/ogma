export interface OgmaStream {
  write: (message: unknown) => unknown;
  getColorDepth?: () => number;
}
