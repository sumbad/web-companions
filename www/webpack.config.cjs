const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const swcrc = fs.readFileSync(path.join(__dirname, '../.swcrc'), 'utf-8');

const isDevMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevMode ? 'development' : 'production',
  resolve: {
    modules: ['dist', 'node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.json', '.css'],
  },
  devServer: {
    historyApiFallback: true,
    port: 8080,
    host: '0.0.0.0',
  },
  devtool: 'eval-cheap-source-map',
  entry: {
    index: path.join(__dirname, 'src', 'main.tsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.m?js|ts(x?)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              ...JSON.parse(swcrc),
              // jsc: {
              //   parser: {
              //     syntax: 'typescript',
              //     tsx: false,
              //     decorators: false,
              //     dynamicImport: false,
              //     target: 'es2020',
              //   },
              // },
            },
          },
          {
            loader: 'babel-loader',
            options: require('./babel.config')
          },
        ],
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'www/index.html',
      scriptLoading: 'module',
      publicPath: '/',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'public'),
          to: path.join(__dirname, 'dist'),
          toType: 'dir',
        },
      ],
    }),
  ],
};
