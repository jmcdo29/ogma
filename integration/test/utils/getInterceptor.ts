import { INestApplication, INestMicroservice } from '@nestjs/common';
import { OgmaInterceptor } from '@ogma/nestjs-module';

// just trust me... I hate this...
export function getInterceptor(
  app: INestApplication | INestMicroservice,
): OgmaInterceptor {
  return app.get<OgmaInterceptor>(
    Array.from((app as any).container.getModules().values())
      .filter((module: any) => module.metatype.name === 'RootTestModule')
      .map((module: any) => {
        return Array.from<string>(
          module.providers.keys(),
        ).filter((prov: string) => prov.includes('APP_INTERCEPTOR'))[0];
      })[0],
  );
}
