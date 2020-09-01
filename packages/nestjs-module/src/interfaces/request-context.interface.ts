export interface RequestContext {
  getContext?: () => any;
  requestId: string;
}
