const { VueLoaderPlugin } = require("vue-loader");

const customConfig = ({ config }) => {
  const cssRuleIndex = config.module.rules.findIndex(
    (rule) => rule.test.toString() === /\.css$/.toString()
  );
  config.module.rules[cssRuleIndex] = {
    test: /\.(css|scss|scss)$/,
    use: ["style-loader", "css-loader", "sass-loader"],
  };
  return config;
};

module.exports = customConfig;
