module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: ["vue"],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "eslint-config-prettier",
  ],
};
