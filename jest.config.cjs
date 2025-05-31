module.exports = {
  testMatch: ["**/tests/**/*.test.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
};
