module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverageFrom: ['packages/**/src/**/*.ts', '!**/index.ts'],
  collectCoverage: true,
  moduleNameMapper: {
    '@ogma/(.*)': '<rootDir>/packages/$1/src',
  },
};
