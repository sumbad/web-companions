const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const swcrc = fs.readFileSync(path.join(__dirname, "../.swcrc"), "utf-8");

const isDevMode = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevMode ? "development" : "production",
  resolve: {
    modules: ["dist", "node_modules"],
    extensions: [".tsx", ".ts", ".js", ".json", ".css"],
  },
  devServer: {
    historyApiFallback: true,
    port: 8080,
    host: "0.0.0.0",
  },
  devtool: "eval-cheap-source-map",
  entry: {
    index: path.join(__dirname, "src", "main.tsx"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: isDevMode ? "/" : "",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.m?js(x?)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "babel-loader",
            // options: require("./babel.config"),
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.join(__dirname, "tsconfig.json"),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-nesting",
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "www/index.html",
      scriptLoading: "module",
      publicPath: isDevMode ? "/" : "",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "public"),
          to: path.join(__dirname, "dist"),
          toType: "dir",
        },
      ],
    }),
  ],
};
