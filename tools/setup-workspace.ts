import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const projectExcludes = [
  'benchmark-interceptor',
  'benchmark-logger',
  'integration',
  'tools',
  'docs',
];
const mainOverrides = {
  cli: 'main.ts',
};

const workspaceFile = join(process.cwd(), 'workspace.json');

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
      outputPath: `dist/${projectName}`,
      main: `packages/${projectName}/src/${mainOverrides[projectName] ?? 'index.ts'}`,
      tsConfig: `packages/${projectName}/tsconfig.build.json`,
      deleteOutputPath: true,
      packageJson: `packages/${projectName}/package.json`,
      assets: [`packages/${projectName}/*.md`],
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

const _generateLint = (_projectName: string) => {
  /* no op for now */
};

const workspace = JSON.parse(readFileSync(workspaceFile).toString());

Object.keys(workspace.projects)
  .filter((key) => !projectExcludes.includes(key))
  .forEach((key) => {
    workspace.projects[key] = generateProject(key);
  });

writeFileSync(workspaceFile, JSON.stringify(workspace, null, 2));
