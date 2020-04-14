module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './integration',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
};
