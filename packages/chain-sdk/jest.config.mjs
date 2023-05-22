import { pathsToModuleNameMapper } from 'ts-jest';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/src/config.spec.ts'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper({ '@/*': ['./src/*'] }, { prefix: '<rootDir>/' }),
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // transformIgnorePatterns: ['node_modules/(?!(@bnb-chain/greenfield-cosmos-types)/)'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        // tsconfig: './config/tsconfig-cjs.json',
        useESM: true,
      },
    ],
  },
};
