const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const merge = require('webpack-merge');
const entryGlob = require('webpack-glob-entry');
const fs = require('fs');

module.exports = (env, argv) => {
  !env || console.log("environment variables: ", env);
  console.log("webpack variables: ", argv);

  let sbfaFiles = {};

  // loop over modules/pages to dynamically create entries
  let items = fs.readdirSync(path.join(__dirname, "src"));

  for (var i = 0; i < items.length; i++) {
    const filename = items[i];
    let fileprefix = filename.substr(0, items[i].indexOf("."));
    if (items[i].includes(".js")) {
      sbfaFiles[fileprefix] = path.join(__dirname, "src", filename)
    }
  }

  console.log("sbfaFiles=", sbfaFiles);

  let entry, outputDir;
  if (env && env.NODE_ENV === 'test') {
    entry = entryGlob(path.join(__dirname, "src") + "/*.test.js");
    output = {
      filename: '[name].test.js',
      path: path.resolve(__dirname, 'test-dist'),
    };
  } else {
    entry = {
      options: path.join(__dirname, "src", "options.js"),
      popup: path.join(__dirname, "src", "popup.js"),
      tabIndicator: path.join(__dirname, "src", "tabIndicator.js"),
      contentscript: path.join(__dirname, "src", "index.js"),
    }
    output = {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    };
  }

  console.log("entry=", entry);

  return merge({}, {
    entry: entry,
    output: output,
    module: {
      rules: [
        //   {
        //   test: /utils\/extension\.js$/,
        //   use: ['file-loader'],
        // },
        {
          test: /\.test\.jsx?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
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
        template: path.join(__dirname, "src", "options.html"),
        filename: "options.html",
        chunks: ["options"]
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "popup.html"),
        filename: "popup.html",
        chunks: ["popup"]
      }),
      new CopyWebpackPlugin([{
        from: "src/icons",
        to: "./icons"
      }, {
        from: "src",
        test: /.*\.png$/,
      }, {
        from: "src",
        test: /.*\b((?!options|popup)(?:.{1,}?)\.js).*/,
      }, {
        from: "src/_locales",
        to: "./_locales",
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