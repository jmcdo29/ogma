export interface OgmaPrintOptions {
  /**
   * Extra context you can add to the log e.g. the calling method
   * @default ''
   */
  context?: string;
  /**
   * Extra information you can add to the log. Not sure why you'd want to override the application, but you can.
   * @default ''
   */
  application?: string;
  /**
   * A field you can add to allow for log tracing
   * @default ''
   */
  correlationId?: string;
  [key: string]: unknown;
}
