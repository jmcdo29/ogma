export interface OgmaStream {
  hasColors: () => boolean;
  write: (message: unknown) => unknown;
  getColorDepth: () => number;
}
