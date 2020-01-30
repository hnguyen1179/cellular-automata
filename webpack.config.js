var path = require("path");

module.exports = {
  entry: "./lib/ca-viz.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js"
  }
};
