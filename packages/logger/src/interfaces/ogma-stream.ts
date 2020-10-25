export interface OgmaStream {
  write: (message: any) => unknown;
  hasColors?: () => boolean;
}
