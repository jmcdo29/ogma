module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '..',
  testMatch: ['<rootDir>/integration/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/packages/**/src/**/*.ts', '!**/index.ts'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/integration/coverage',
  moduleNameMapper: {
    '@ogma/(.*)': '<rootDir>/packages/$1/src',
  },
};
