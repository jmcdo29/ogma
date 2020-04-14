module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './integration',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['integration/src/**/*.ts', '!**/*.module.ts'],
  testEnvironment: 'node',
};
