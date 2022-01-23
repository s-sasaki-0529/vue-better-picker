const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    library: {
      type: "commonjs2",
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
      {
        test: /\.(js|ts)$/,
        loader: "babel-loader",
      },
      {
        test: /\.(css|scss|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
