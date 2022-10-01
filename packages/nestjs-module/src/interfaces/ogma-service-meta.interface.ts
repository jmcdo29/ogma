export interface OgmaServiceMeta {
  application?: string;
  context?: string;
  correlationId?: string;
  each?: boolean;
  [key: string]: unknown;
}
