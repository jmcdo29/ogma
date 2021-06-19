import { readFileSync, writeFileSync } from 'fs';

const projectExcludes = ['benchmark-interceptor', 'benchmark-logger', 'integration'];
const mainOverrides = {
  cli: 'main.ts',
};

const generateBuild = (projectName: string) => {
  return {
    executor: '@nrwl/node:build',
    options: {
      externalDependencies: 'all',
      outputPath: `dist/${projectName}`,
      main: `packages/${projectName}/src/${mainOverrides[projectName] ?? 'index.ts'}`,
      tsConfig: `packages/${projectName}/tsconfig.build.json`,
      generatePackageJson: true,
    },
  };
};

const generateTest = (projectName: string) => {
  return {
    executor: '@nrwl/jest:jest',
    options: {
      jestConfig: `packages/${projectName}/jest.config.js`,
      codeCoverage: true,
    },
  };
};

const generatePackage = (projectName: string) => {
  return {
    executor: '@nrwl/node:package',
    options: {
      outputPath: `dist/apps/${projectName}`,
      main: `packages/${projectName}/src/${mainOverrides[projectName] ?? 'index.ts'}`,
      tsConfig: `packages/${projectName}/tsconfig.build.json`,
      deleteOutputPath: true,
      packageJson: `packages/${projectName}/package.json`,
    },
  };
};

const generateProject = (projectName: string) => {
  return {
    root: `packages/${projectName}`,
    type: 'library',
    sourceRoot: `packages/${projectName}/src`,
    targets: {
      build: generatePackage(projectName),
      test: generateTest(projectName),
    },
  };
};

const generateLint = (projectName: string) => {
  /* no op for now */
};

const workspace = JSON.parse(readFileSync('./workspace.json').toString());

Object.keys(workspace.projects)
  .filter((key) => !projectExcludes.includes(key))
  .forEach((key) => {
    workspace.projects[key] = generateProject(key);
  });

writeFileSync('./workspace.json', JSON.stringify(workspace, null, 2));
