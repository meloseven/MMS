const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const clientConfig = require('./client')

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

const config = {
  mode: 'production',
  context: path.resolve(process.cwd(), './src'),
  target: 'node',
  entry: {
    app: './render/index.js'
  },
  output: {
    path: path.resolve(process.cwd(), './dist'),
    filename: 'serverEntry.js',
    libraryExport: 'default',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      /* {
        test: /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ]
      }, */
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              name: '/[name].[ext]'
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
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
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
            "@babel/plugin-syntax-dynamic-import",
            ["styled-jsx/babel", {"optimizeForSpeed":true, "sourceMaps": true}]]
        }
      }
    ]
  },
  optimization: {
    minimize: false
  }
}

webpack(config).run((err, stats)=>{
  console.log(stats.toString())
  if(err){
    console.log(chalk.red(err.message))
  }else{
    console.log(chalk.green('build success.\n'));
  }
})
webpack(clientConfig).run((err, stats)=>{
  console.log(stats.toString())
  if(err){
    console.log(chalk.red(err.message))
  }else{
    console.log(chalk.green('build success.\n'));
  }
});