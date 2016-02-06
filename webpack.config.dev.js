require('dotenv').config();
var path = require('path');
var StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = {
  entry: path.join(process.cwd(), 'app.js'),
  output: {
    path: './public/',
    filename: 'webpack-build.js'
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
            replacement: function() { return "'" + process.env.CLOUDANT_KEY + "'" }
          }, {
            pattern: /__CLOUDANT_PASS__/g,
            replacement: function() { return "'" + process.env.CLOUDANT_PASS + "'" }
          }]
        })
      }
    ]
  },
  plugins: [
    new StringReplacePlugin()
  ]
};
