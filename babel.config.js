module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "entry",
        corejs: {
          version: 3,
          proposals: false,
        },
      },
    ],
  ],
};
