const path = require("path")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MinifyPlugin = require("babel-minify-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")

module.exports = env => {
  return {
    entry: {
      main: ["./src/main.js"]
    },
    output: {
      filename: "[name]-bundle.js",
      path: path.resolve(__dirname, "../dist"),
      publicPath: "/"
    },
    devServer: {
      contentBase: "dist",
      overlay: true,
      stats: {
        colors: true
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader"
            }
          ]
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: {
              loader: "css-loader",
              options: {
                minimize: true
              }
            }
          })
        },
        {
          test: /\.jpg$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "images/[name].[ext]"
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin("[name].css"),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(env.NODE_ENV)
        }
      }),
      new webpack.NamedModulesPlugin(),
      new HTMLWebpackPlugin({
        template: "./src/index.ejs",
        inject: true,
        title: "Link's Journal"
      }),
      // new MinifyPlugin()
      new UglifyJSPlugin()
    ]
  }
}