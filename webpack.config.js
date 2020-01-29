const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const merge = require('webpack-merge');
//const entryGlob = require('webpack-glob-entry');
//const fs = require('fs');

module.exports = (env, argv) => {
  !env || console.log("environment variables: ", env);
  console.log("webpack variables: ", argv);

  // loop over modules/pages to dynamically create entries
  // fs.readdir(path.join(__dirname, "src", "pages"), function(err, items) {
  //     console.log(items);

  //     for (var i=0; i<items.length; i++) {
  //         console.log(items[i]);
  //     }
  // });
  let entry, outputDir;

  // if (env && env.NODE_ENV == 'test') {
  //   entry = entryGlob(path.join(__dirname, "src", "test") + "/*.js");
  //   outputDir = 'test-dist';
  // } else {
    entry = {
      contentscript: path.join(__dirname, "src", "index.js"),
      options: path.join(__dirname, "src", "options", "index.js"),
      help: path.join(__dirname, "src", "help", "index.js"),
      popup: path.join(__dirname, "src", "popup", "index.js"),
      background: path.join(__dirname, "src", "background.js"),
      tabIndicator: path.join(__dirname, "src", "tabIndicator.js"),
      jquery: path.join(__dirname, "src", "jquery.js"),
      inject: path.join(__dirname, "src", "inject.js"),
      preview: path.join(__dirname, "src", "preview.js"),
      eventlisteners: path.join(__dirname, "src", "eventlisteners.js")
    }
    outputDir = 'dist';
  // }

  return merge({}, {
    entry: entry,
    devtool: 'inline-source-map',
    output: {
      filename: 'scripts/[name].js',
      path: path.resolve(__dirname, outputDir),
    },
    module: {
      // loaders: [
      //   {exclude: ['node_modules'], loader: 'babel', test: /\.jsx?$/},
      //   {loader: 'style-loader!css-loader', test: /\.css$/},
      //   {loader: 'url-loader', test: /\.gif$/},
      //   {loader: 'file-loader', test: /\.(ttf|eot|svg)$/},
      // ],
      rules: [
        //   {
        //   test: /utils\/extension\.js$/,
        //   use: ['file-loader'],
        // },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader'],
        },
        {
          test: /\.scss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /test\.js$/,
          use: 'mocha-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
      }),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "popup", "index.html"),
        filename: "popup.html",
        chunks: ["popup"]
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "options", "index.html"),
        filename: "options.html",
        chunks: ["options"]
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "help", "index.html"),
        filename: "help.html",
        chunks: ["help"]
      }),
      new CopyWebpackPlugin([{
        from: "src/icons",
        to: "./icons"
      }, {
        from: "src/_locales",
        to: "./_locales",
      }, {
        from: "src/listeners.js",
        to: "./listeners.js",
      }]),
      new MergeJsonWebpackPlugin({
        "files": [
          path.join("src", "manifest.json"),
          //path.join("src", "manifest." + (process.env.NODE_ENV || "development")  + ".json")
          path.join("src", "manifest.development.json")
        ],
        "output": {
          "fileName": "manifest.json"
        },
        "debug": true
      }),
      new ZipPlugin({
        filename: 'scoutbook-buddy.zip',
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      })
    ],
    node: {
      fs: 'empty'
    }
  });
};