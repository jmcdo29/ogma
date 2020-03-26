export function interceptorErrorMessage(
  packageName: string,
  requestType: string,
): string {
  return `${packageName} and an Ogma compatible parser must be installed for the OgmaInterceptor to log ${requestType} requests`;
}
