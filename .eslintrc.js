module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "vue/attribute-hyphenation": "off",
    "vue/multi-word-component-names": "off",
  },
};
