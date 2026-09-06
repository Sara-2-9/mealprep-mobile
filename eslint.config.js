const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/**", "coverage/**", "blackboard-mobile-engineer-take-home/**", "src/data/product-catalog.json"],
    rules: { "import/order": ["warn", { "newlines-between": "always" }] }
  }
]);
