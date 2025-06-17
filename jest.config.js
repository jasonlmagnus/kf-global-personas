const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: [
    "<rootDir>/brand_setup_design/",
    "<rootDir>/persona_upload_design/",
  ],
};

module.exports = createJestConfig(customJestConfig);
