const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  resolve: {
    modules: ['dist', 'node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.json', '.css'],
    alias: {
      '@web-companions/gfc': path.resolve(__dirname, '../lib'),
    },
  },
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    port: 8081,
  },
  devtool: 'eval-cheap-source-map',
  entry: {
    'index': path.join(__dirname, 'src', 'index.tsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  module: {
    rules: [
      require('@insum/webpack.config/loaders/css'),
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'babel-loader',
            // options: require('./babel.config')
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: require('./babel.config'),
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'index.html'),
          to: path.join(__dirname, 'dist'),
        },
      ],
    }),
    new webpack.ProvidePlugin({
      html: 'lit-html',
    }),
  ],
};
