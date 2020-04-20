import {
  InjectOgma,
  InjectOgmaContext,
  InjectOgmaInterceptorOptions,
} from '../src';

const func = expect.any(Function);

describe('InjectOgma', () => {
  it('should return Inject(OGMA_INSTANCE)', () => {
    expect(InjectOgma()).toEqual(func);
  });
});

describe('InjectOgmaContext', () => {
  it('should return Inject(OGMA_CONTEXT)', () => {
    expect(InjectOgmaContext()).toEqual(func);
  });
});

describe('InjectOgmaInterceptorOptions', () => {
  it('should return Inject(OGMA_INTERCEPTOR_OPTIONS', () => {
    expect(InjectOgmaInterceptorOptions()).toEqual(func);
  });
});
