export function optionalRequire(packageName: string): any {
  try {
    return require(packageName);
  } catch (e) {
    return {};
  }
}
