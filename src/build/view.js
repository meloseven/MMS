const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const conf = require('../../config')

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: './'
      }
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: false,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: true,
      },
    });
  }
  return loaders;
};

/**
 * @param _comps 已选择组件
 * @param _sessKey session key
 * @param tempPath 路径
 * @param mode 发布或预览模式 0 预览 1 发布
 * @param title 页面标题
 */
module.exports = function(_comps, _sessKey, tempPath, mode, title = ''){
  const wpMode = mode?'production':'development';
  const publicPath = mode?`/fms/${tempPath}`: `/${tempPath}`
  return {
    mode: wpMode,
    context: path.resolve(process.cwd(), './src'),
    entry: {
      views: './views/index.js'
    },
    output: {
      path: path.resolve(process.cwd(), './dist', tempPath),
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
      publicPath: publicPath
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "static/[name].css",
        chunkFilename: "static/[id].css"
      }),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            title,
            inject: true,
            template: './views/index.html'
          },
          {  
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        )
      ),
      new webpack.DefinePlugin({
        'process.env._comps': JSON.stringify(_comps),
        'process.env._sessKey': JSON.stringify(_sessKey),
        'process.env._mode': mode,
        'process.env._isTest': JSON.stringify(process.env.NODE_ENV==='development')
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                name: '/static/[name].[ext]'
              },
            },
          ],
        },
        {
          test: /\.css$/,
          loaders: getStyleLoaders({
            importLoaders: 1,
            sourceMap: false,
          })
        },
        {
          test: /\.(scss|sass)$/,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              sourceMap: false,
            },
            'sass-loader'
          ),
          sideEffects: true,
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: require.resolve('babel-loader'),
          options: {
            "presets": ["@babel/env", "@babel/preset-react"],
            "plugins": [
              "@babel/plugin-transform-runtime", 
              "@babel/plugin-proposal-class-properties", 
              ["styled-jsx/babel", {"optimizeForSpeed":true, "sourceMaps": true}]]
          }
        }
      ]
    },
    /* devtool:'source-map', */
    optimization: {
      minimize: true
    }
  }
}
