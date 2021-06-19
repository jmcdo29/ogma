import { readdirSync, readFileSync, writeFileSync } from 'fs';

const mainJson = JSON.parse(readFileSync('./package.json').toString());
const mainDeps = mainJson.devDependencies;

const dirs = readdirSync('packages');
dirs.forEach((dir) => {
  const tsConfig = {
    extends: './tsconfig.json',
    compilerOptions: {
      sourceMap: true,
    },
  };
  writeFileSync(`packages/${dir}/tsconfig.spec.json`, JSON.stringify(tsConfig, null, 2));
  const packageJson = JSON.parse(readFileSync(`./packages/${dir}/package.json`).toString());
  delete packageJson.main;
  delete packageJson.types;
  delete packageJson.files;
  delete packageJson.scripts;
  Object.keys(packageJson.dependencies ?? {})
    .filter((dep) => !Object.keys(mainDeps).includes(dep))
    .filter((dep) => !dep.includes('@ogma'))
    .forEach((dep) => (mainDeps[dep] = packageJson.dependencies[dep]));
  writeFileSync(`packages/${dir}/package.json`, JSON.stringify(packageJson, null, 2));
});
mainJson.devDependencies = mainDeps;
writeFileSync('./package.json', JSON.stringify(mainJson, null, 2));
