import { INestApplication } from '@nestjs/common';

// just trust me... I hate this...
export function getInterceptor(app: INestApplication): string {
  return Array.from((app as any).container.getModules().values())
    .filter((module: any) => module.metatype.name === 'OgmaCoreModule')
    .map((module: any) => {
      return Array.from<string>(
        module.providers.keys(),
      ).filter((prov: string) => prov.includes('APP_INTERCEPTOR'))[0];
    })[0];
}
