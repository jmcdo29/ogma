export function interceptorErrorMessage(
  packageName: string,
  requestType: string,
): string {
  return `${packageName} must be installed for the OgmaInterceptor to log ${requestType} requests`;
}
