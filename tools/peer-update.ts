import { color } from '@ogma/logger';
import { readdirSync, readFileSync, writeFileSync } from 'fs';

const versionMap: Record<string, string> = {};

interface packageJSON {
  version: string;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  name: string;
}

function readDirectory(dir: string): string[] {
  return readdirSync(dir);
}

function getPackageJSON(packageName: string): packageJSON {
  const packageString = readFileSync(`./packages/${packageName}/package.json`).toString();
  return JSON.parse(packageString);
}

function populateVersionMap(packageObject: packageJSON): packageJSON {
  versionMap[packageObject.name] = packageObject.version;
  return packageObject;
}

function hasOgmaPeerDep(packageObject: packageJSON): boolean {
  return packageObject.peerDependencies
    ? Object.keys(packageObject.peerDependencies).some((key) => !!versionMap[key])
    : false;
}

function updatePeerDep(packageObject: packageJSON): packageJSON {
  Object.keys(packageObject.peerDependencies)
    .filter((key) => !!versionMap[key])
    .forEach((key) => (packageObject.peerDependencies[key] = '^' + versionMap[key]));
  return packageObject;
}

function updatePackageJSON(packageObject: packageJSON): void {
  writeFileSync(
    `./packages/${packageObject.name.replace('@ogma/', '')}/package.json`,
    Buffer.from(JSON.stringify(packageObject, null, 2) + '\n'),
  );
  console.log(`Updated ${color.blue('package.json')} for ${color.green(packageObject.name)}`);
}

function bootstrap() {
  readDirectory('./packages')
    .map(getPackageJSON)
    .map(populateVersionMap)
    .filter(hasOgmaPeerDep)
    .map(updatePeerDep)
    .forEach(updatePackageJSON);
}

bootstrap();
