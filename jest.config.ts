import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.spec.ts"],

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/server.ts",
    "!src/types/**",
  ],

  coverageDirectory: "coverage",

  globalSetup: "<rootDir>/jest.global-setup.js",

  setupFilesAfterEnv: ["<rootDir>/jest.setup-after-env.ts"],

  maxWorkers: 1,
}

export default config
