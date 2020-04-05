import { OGMA_INTERCEPTOR_SKIP } from '../ogma.constants';

export function OgmaSkip() {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(OGMA_INTERCEPTOR_SKIP, true, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(OGMA_INTERCEPTOR_SKIP, true, target);
    return target;
  };
}
