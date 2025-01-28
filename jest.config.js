module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx}",
  ],
  testMatch: ["<rootDir>/__tests__/**/*.test.{js,jsx}"],
};
