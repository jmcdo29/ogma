'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const logger_1 = require('@ogma/logger');
const fs_1 = require('fs');
const versionMap = {};
function readDirectory(dir) {
  return fs_1.readdirSync(dir);
}
function getPackageJSON(packageName) {
  const packageString = fs_1
    .readFileSync(`./packages/${packageName}/package.json`)
    .toString();
  return JSON.parse(packageString);
}
function populateVersionMap(packageObject) {
  versionMap[packageObject.name] = packageObject.version;
  return packageObject;
}
function hasOgmaPeerDep(packageObject) {
  return packageObject.peerDependencies
    ? Object.keys(packageObject.peerDependencies).some(
        (key) => !!versionMap[key],
      )
    : false;
}
function updatePeerDep(packageObject) {
  Object.keys(packageObject.peerDependencies)
    .filter((key) => !!versionMap[key])
    .forEach(
      (key) => (packageObject.peerDependencies[key] = '^' + versionMap[key]),
    );
  return packageObject;
}
function updatePackageJSON(packageObject) {
  fs_1.writeFileSync(
    `./packages/${packageObject.name.replace('@ogma/', '')}/package.json`,
    Buffer.from(JSON.stringify(packageObject, null, 2) + '\n'),
  );
  console.log(
    `Updated ${logger_1.color.blue('package.json')} for ${logger_1.color.green(
      packageObject.name,
    )}`,
  );
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
