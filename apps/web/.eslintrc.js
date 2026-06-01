/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@john-doe/eslint-config"],
  env: {
    browser: true,
  },
  rules: {
    "react/prop-types": "off",
  },
};
