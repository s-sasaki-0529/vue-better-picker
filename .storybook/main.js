module.exports = {
  framework: "@storybook/vue",
  core: {
    builder: "webpack5",
  },
  stories: ["../src/vue-better-picker/components/*.stories.@(js|ts)"],
  addons: ["@storybook/addon-controls"],
};
