module.exports = {
  framework: "@storybook/vue3",
  core: {
    builder: "webpack5",
  },
  stories: ["../src/vue-better-picker/stories/*.stories.@(js|ts)"],
  addons: ["@storybook/addon-controls"],
};
