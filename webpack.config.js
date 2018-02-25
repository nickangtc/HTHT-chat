var path = require('path');
var webpack = require('webpack');

module.exports = {
  watch: true,
  entry: './public/js/app.js',
  output: {
    path: path.resolve(__dirname, 'public', 'build'),
    filename: 'app.bundle.js'
  },
  resolve: {
    // Directory names to be searched for modules
    modules: ['public/js', 'node_modules'],
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        // match files based on pattern
        test:  /\.(js|jsx)$/,
        // ignore files matching pattern
        exclude: /node_modules/
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
