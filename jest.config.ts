module.exports = {
    displayName: "IvoryPay Test",
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/__tests__/*.test.ts"],
    testTimeout: 20000,
    testEnvironmentOptions: {
        NODE_ENV: "test",
    },
    restoreMocks: true,
    moduleFileExtensions: ["ts", "js", "json"],
    coverageReporters: ["text", "lcov", "clover", "html"],
    setupFilesAfterEnv: ["<rootDir>/__tests__/utils/setUpDB.ts"],
};
