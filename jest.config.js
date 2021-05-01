const { join } = require('path');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.ts', '!**/{*.module,index,main}.ts'],
  testEnvironment: 'node',
  // maybe find a better  way to set this up
  globalSetup: join(process.cwd(), '..', '..', 'jest.setup.js'),
};
