const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
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

  return merge({}, {
    entry: {
      contentscript: path.join(__dirname, "src", "index.js"),
      options: path.join(__dirname, "src", "options", "index.js"),
      help: path.join(__dirname, "src", "help", "index.js"),
      popup: path.join(__dirname, "src", "popup", "index.js"),
      background: path.join(__dirname, "src", "background.js"),
      tabIndicator: path.join(__dirname, "src", "tabIndicator.js"),
      inject: path.join(__dirname, "src", "inject.js")
    },
    // devtool: 'inline-source-map',
    output: {
      filename: 'scripts/[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [{
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
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
      }]),
      new MergeJsonWebpackPlugin({
        "files": [
          path.join("src", "manifest.json"),
          path.join("src", "manifest." + (process.env.NODE_ENV || "development")  + ".json")
        ],
        "output": {
          "fileName": "manifest.json"
        },
        "debug": true
      })
    ],
    node: {
      fs: 'empty'
    }
  });
};
