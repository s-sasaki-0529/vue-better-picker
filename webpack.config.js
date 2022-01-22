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
        test: /\.(css|scss|stylus)$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
