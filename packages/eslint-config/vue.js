/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
  },
  extends: ["./base.js"],
  parserOptions: {
    extraFileExtensions: [".vue"],
  },
};
