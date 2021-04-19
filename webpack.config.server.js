const path = require("path");
const webpack = require("webpack");
const CURRENT_WORKING_DIR = process.cwd();
const nodeExternals = require("webpack-node-externals");

const config = {
  // Name of the configuration. Used when loading multiple configurations.
  name: "server",
  // The point or points where to start the application bundling process.
  entry: [path.join(CURRENT_WORKING_DIR, "./server/server.js")],
  //Instructs webpack to target a specific environment.
  target: "node",
  output: {
    // The output directory as an absolute path.
    path: path.join(CURRENT_WORKING_DIR, "/dist/"),
    filename: "server.generated.js",
    publicPath: "/dist/",
    library: {
      type: "commonjs2",
    },
  },
  //Prevent bundling of certain imported packages and instead retrieve these external dependencies at runtime.
  externals: [nodeExternals()],
  module: {
    // An array of Rules which are matched to requests when modules are created.
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};

module.exports = config;

// output will be assigned to module.exports

// serverside code will be in server.generated.js in 'dist' folder

