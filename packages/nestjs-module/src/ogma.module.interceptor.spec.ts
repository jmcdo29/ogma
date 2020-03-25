import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { OgmaModule } from './ogma.module';

describe.each([
  {
    interceptor: {
      format: 'prod' as 'prod',
      skip: (req: Request, res: Response): boolean => false,
    },
  },
  {
    interceptor: {
      format: 'dev' as 'dev',
      skip: (req: Request, res: Response): boolean => true,
    },
  },
  { interceptor: false },
])('interceptor options %j', (options) => {
  let module: TestingModule;
  it(`${
    options.interceptor ? 'should' : 'should not'
  } interceptor bound`, async () => {
    module = await Test.createTestingModule({
      imports: [OgmaModule.forRoot(OgmaModule, options)],
    }).compile();
    const interceptors = (module as any).applicationConfig.globalInterceptors;
    expect(interceptors.length).toBe(1);
    expect(interceptors[0]).toHaveProperty(
      options.interceptor ? 'options' : 'intercept',
    );
  });
});
