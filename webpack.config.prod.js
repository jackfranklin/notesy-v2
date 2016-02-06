require('dotenv').config();
var webpack = require('webpack');
var path = require('path');
var StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = {
  entry: path.join(process.cwd(), 'app.js'),
  output: {
    path: './public/',
    filename: 'production-build.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      },
      {
        test: /\.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [{
            pattern: /__CLOUDANT_KEY__/g,
            replacement: function() { return "'" + process.env.CLOUDANT_PROD_KEY + "'" }
          }, {
            pattern: /__CLOUDANT_PASS__/g,
            replacement: function() { return "'" + process.env.CLOUDANT_PROD_PASS + "'" }
          }, {
            pattern: /__CLOUDANT_DB__/g,
            replacement: function() { return "'" + process.env.CLOUDANT_PROD_DB + "'" }
          }]
        })
      }
    ]
  },
  plugins: [
    new StringReplacePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
