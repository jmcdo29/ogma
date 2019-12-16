export interface OgmaModuleOptions {
  logLevel?: string;
  color?: boolean;
  stream?: {
    write: (message: any) => void;
  };
}
