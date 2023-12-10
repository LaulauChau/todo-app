/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  extends: ["./base.js"],
  rules: {
    "@typescript-eslint/lines-between-class-members": "off",
    "class-methods-use-this": "off",
    "lines-between-class-members": "off",
  },
};
