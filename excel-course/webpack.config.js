const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ProgressPlugin = require('progress-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { Console } = require('console')

const isProd = process.env.NODE_ENV === "production"
const isDev = !isProd

const devModeMessage = m => m === true
  ? console.log("Сборка в режиме ---> production")
  : console.log("Сборка в режиме ---> development")

devModeMessage(isProd);

const fileName = (n, e) => isProd === true ? `${n}.[contenthash:5].${e}` : `${n}.${e}`

function jsLoaders() {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

console.log(jsLoaders())

module.exports = {
    context: path.resolve(__dirname, 'src'), 
    mode: 'development',
    entry: './index.js',
    output: {
        filename: fileName('bundle','js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
          '@*': path.resolve(__dirname, 'src'),
          '@core*': path.resolve(__dirname, 'src/core'),
        },
      },
    devtool: isDev
      ? 'source-map'
      : false,
    devServer: {
      port: 4000,
      hot: isDev,
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: fileName('index', 'html'),
            template: path.resolve(__dirname, "src", "index.html"),
            minify: {
              collapseWhitespace: isProd,
              removeComments:isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new ProgressPlugin(true),
        new CopyPlugin({
            patterns: [
              { 
                from: path.resolve(__dirname, "src/favicon.ico"),
                to: path.resolve(__dirname, "dist")
             },
            ],
          }),
        new MiniCssExtractPlugin({
            filename: fileName('bundle', 'css'),
        })
    ],
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader",
            ],
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: jsLoaders()
          }
        ],
      },
}